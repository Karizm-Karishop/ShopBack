
// @ts-nocheck
import { Order } from "../database/models/Order";
import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import dbConnection from "../database"; 
import { CartItem } from "../database/models/CartItem";
import { OrderItem } from "../database/models/OrderItem";
import UserModel from "../database/models/UserModel";
import Stripe from "stripe";
type ExpressHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  import errorHandler from "../middlewares/errorHandler";
import { DeepPartial } from "typeorm";

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16'
  });

class OrderController {
  static createOrder: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      await body("shipping_address")
        .notEmpty()
        .withMessage("Shipping address is required")
        .run(req);
      await body("payment_method")
        .notEmpty()
        .withMessage("Payment method is required")
        .run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { shipping_address, billing_address, payment_method } = req.body;
      const user_id = req.user.id;

      const cartItemRepository = dbConnection.getRepository(CartItem);
      const orderRepository = dbConnection.getRepository(Order);
      const orderItemRepository = dbConnection.getRepository(OrderItem);
      const userRepository = dbConnection.getRepository(UserModel);

      const cartItems = await cartItemRepository.find({
        where: { user: { id: user_id } },
        relations: ['product']
      });

      if (cartItems.length === 0) {
        res.status(400).json({ message: "Cart is empty" });
        return;
      }      

      const total_amount = cartItems.reduce((sum, item) => 
        sum + (item.product.sales_price * item.quantity), 0);

      const user = await userRepository.findOne({
        where: { id: user_id },
      });
      
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      
      const order = orderRepository.create({
        user,
        total_amount,
        shipping_address,
        billing_address,
        payment_method,
        status: 'pending',
        tracking_number: `TRK${Date.now()}${user_id}`,
      } as DeepPartial<Order>); 
      

      await orderRepository.save(order);

      const orderItems = cartItems.map(cartItem => {
        return orderItemRepository.create({
          order,
          product: cartItem.product,
          quantity: cartItem.quantity,
          price: cartItem.product.sales_price
        });
      });

      await orderItemRepository.save(orderItems);

      await cartItemRepository.delete({ user: { id: user_id } });

      res.status(201).json({
        message: "Order created successfully",
        data: { order, items: orderItems }
      });
    }
  );

  

  static confirmCheckout = errorHandler(
    async (req: Request, res: Response) => {
      const { sessionId } = req.body;
      const orderRepository = dbConnection.getRepository(Order);

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === 'paid') {
        const order = await orderRepository.findOne({
          where: { stripe_checkout_session_id: sessionId }
        });

        if (order) {
          order.status = 'processing';
          order.payment_status = 'paid';
          await orderRepository.save(order);

          return res.status(200).json({
            message: 'Checkout successful',
            orderId: order.id
          });
        }
      }

      res.status(400).json({ message: 'Checkout failed' });
    }
  );

  static createCheckout: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      await body("shipping_address")
        .notEmpty()
        .withMessage("Shipping address is required")
        .run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user_id = req.user.id;
      const { shipping_address } = req.body;

      const cartItemRepository = dbConnection.getRepository(CartItem);
      const orderRepository = dbConnection.getRepository(Order);

      const cartItems = await cartItemRepository.find({
        where: { user: { id: user_id } },
        relations: ["product"],
      });

      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      const total_amount = cartItems.reduce(
        (sum, item) => sum + item.product.sales_price * item.quantity,
        0
      );

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: cartItems.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: { name: item.product.name },
            unit_amount: Math.round(item.product.sales_price * 100),
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${process.env.APP_URL}/checkout/success`,
        cancel_url: `${process.env.APP_URL}/checkout/cancel`,
        metadata: { user_id: user_id.toString() },
      });

      const order = orderRepository.create({
        user: { id: user_id },
        total_amount,
        shipping_address,
        status: "pending",
        stripe_checkout_session_id: session.id,
      });

      await orderRepository.save(order);
      await cartItemRepository.delete({ user: { id: user_id } });

      res.status(201).json({
        message: "Checkout initiated",
        checkoutUrl: session.url,
        orderId: order.id,
      });
    }
  );


  static confirmOrder: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      const { sessionId } = req.body;
      const orderRepository = dbConnection.getRepository(Order);

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === "paid") {
        const order = await orderRepository.findOne({
          where: { stripe_checkout_session_id: sessionId },
        });

        if (order) {
          order.status = "processing";
          order.payment_status = "paid";
          await orderRepository.save(order);

          return res.status(200).json({
            message: "Order completed successfully",
            order,
          });
        }
      }

      res.status(400).json({ message: "Payment confirmation failed" });
    }
  );

  /**
   * Cancel an order by updating Stripe and database
   */
  static cancelOrder: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      const { orderId } = req.params;
      const orderRepository = dbConnection.getRepository(Order);

      const order = await orderRepository.findOne({
        where: { id: orderId, status: "pending" },
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found or already processed" });
      }

      if (order.stripe_checkout_session_id) {
        await stripe.checkout.sessions.expire(order.stripe_checkout_session_id);
      }

      order.status = "cancelled";
      await orderRepository.save(order);

      res.status(200).json({ message: "Order cancelled successfully", order });
    }
  );

  static getOrders: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      const user_id = req.user.id;
      const { status, page = 1, limit = 10 } = req.query;
      
      const orderRepository = dbConnection.getRepository(Order);
      
      const queryBuilder = orderRepository
        .createQueryBuilder("order")
        .leftJoinAndSelect("order.orderItems", "orderItems")
        .leftJoinAndSelect("orderItems.product", "product")
        .where("order.user.id = :userId", { userId: user_id });

      if (status) {
        queryBuilder.andWhere("order.status = :status", { status });
      }

      const skip = (Number(page) - 1) * Number(limit);
      queryBuilder
        .skip(skip)
        .take(Number(limit))
        .orderBy("order.created_at", "DESC");

      const [orders, total] = await queryBuilder.getManyAndCount();

      res.status(200).json({
        message: "Orders retrieved successfully",
        data: {
          orders,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    }
  );

  static getOrderById: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      await param("id").isInt().withMessage("Invalid order ID").run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const orderId = parseInt(req.params.id);
      const user_id = req.user.id;

      const orderRepository = dbConnection.getRepository(Order);
      const order = await orderRepository.findOne({
        where: { 
          id: orderId,
          user: { id: user_id }
        },
        relations: [
          "orderItems",
          "orderItems.product",
          "orderItems.product.shop"
        ]
      });

      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      res.status(200).json({
        message: "Order retrieved successfully",
        data: order
      });
    }
  );

  static updateOrderStatus: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      await param("id").isInt().withMessage("Invalid order ID").run(req);
      await body("status")
        .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
        .withMessage("Invalid status")
        .run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      const user_id = req.user.id;

      const orderRepository = dbConnection.getRepository(Order);
      const order = await orderRepository.findOne({
        where: { 
          id: orderId,
          user: { id: user_id }
        }
      });

      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      if (order.status === 'cancelled' || order.status === 'delivered') {
        res.status(400).json({ 
          message: "Cannot update status of cancelled or delivered orders" 
        });
        return;
      }

      const statusFlow = ['pending', 'processing', 'shipped', 'delivered'];
      const currentIndex = statusFlow.indexOf(order.status);
      const newIndex = statusFlow.indexOf(status);
      
      if (status !== 'cancelled' && newIndex - currentIndex > 1) {
        res.status(400).json({ 
          message: "Invalid status transition" 
        });
        return;
      }

      order.status = status;
      
      if (status === 'cancelled') {
        const orderItemRepository = dbConnection.getRepository(OrderItem);
        const orderItems = await orderItemRepository.find({
          where: { order: { id: orderId } },
          relations: ['product']
        });

        for (const item of orderItems) {
          item.product.quantity += item.quantity;
          await dbConnection.manager.save(item.product);
        }
      }

      await orderRepository.save(order);

      res.status(200).json({
        message: "Order status updated successfully",
        data: order
      });
    }
  );

  static cancelOrder: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      await param("id").isInt().withMessage("Invalid order ID").run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const orderId = parseInt(req.params.id);
      const user_id = req.user.id;

      const orderRepository = dbConnection.getRepository(Order);
      const order = await orderRepository.findOne({
        where: { 
          id: orderId,
          user: { id: user_id }
        }
      });

      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      if (!['pending', 'processing'].includes(order.status)) {
        res.status(400).json({ 
          message: "Can only cancel pending or processing orders" 
        });
        return;
      }

      order.status = 'cancelled';
      
      const orderItemRepository = dbConnection.getRepository(OrderItem);
      const orderItems = await orderItemRepository.find({
        where: { order: { id: orderId } },
        relations: ['product']
      });

      for (const item of orderItems) {
        item.product.quantity += item.quantity;
        await dbConnection.manager.save(item.product);
      }

      await orderRepository.save(order);

      res.status(200).json({
        message: "Order cancelled successfully",
        data: order
      });
    }
  );

  static getOrdersByDateRange: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      await body("startDate").isISO8601().withMessage("Invalid start date").run(req);
      await body("endDate").isISO8601().withMessage("Invalid end date").run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { startDate, endDate } = req.body;
      const user_id = req.user.id;

      const orderRepository = dbConnection.getRepository(Order);
      const orders = await orderRepository
        .createQueryBuilder("order")
        .leftJoinAndSelect("order.orderItems", "orderItems")
        .leftJoinAndSelect("orderItems.product", "product")
        .where("order.user.id = :userId", { userId: user_id })
        .andWhere("order.created_at BETWEEN :startDate AND :endDate", {
          startDate,
          endDate
        })
        .orderBy("order.created_at", "DESC")
        .getMany();

      const totalAmount = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);

      res.status(200).json({
        message: "Orders retrieved successfully",
        data: {
          orders,
          totalAmount,
          count: orders.length
        }
      });
    }
  );
}

export default OrderController
