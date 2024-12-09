//@ts-nocheck
import { Request, Response, NextFunction } from "express";
import { CartItem } from "../database/models/CartItem";
import { ProductModel } from "../database/models/ProductModel";
import UserModel from "../database/models/UserModel";
import { body, validationResult } from "express-validator";
import dbConnection from "../database";
import errorHandler from "../middlewares/errorHandler";
import { DeepPartial } from "typeorm";
type ExpressHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;
const cartItemRepository = dbConnection.getRepository(CartItem);
const productRepository = dbConnection.getRepository(ProductModel);
const userRepository = dbConnection.getRepository(UserModel);

class CartController {
  static addToCart: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      await body("product_id")
        .isInt()
        .withMessage("Product ID must be an integer")
        .run(req);
      await body("quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1")
        .run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { product_id, quantity, user_id } = req.body;
      if (!user_id) {
        res.status(401).json({ message: "User not authenticated" });
        return;
      }

      const product = await productRepository.findOne({
        where: { product_id }
      });

      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      if (product.quantity < quantity) {
        res.status(400).json({ message: "Insufficient product quantity" });
        return;
      }

      const user = await userRepository.findOne({
        where: { user_id }
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      let cartItem = await cartItemRepository.findOne({
        where: {
          user_id,
          product_id
        }
      });

      if (cartItem) {
        cartItem.quantity += quantity;
      } else {
        const newCartItem: DeepPartial<CartItem> = {
          user_id: user.user_id,
          product_id: product.product_id,
          quantity
        };
        cartItem = cartItemRepository.create(newCartItem);
      }

      await cartItemRepository.save(cartItem);

      res.status(200).json({
        message: "Item added to cart successfully",
        data: cartItem
      });
    }
  );

  static getCart: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      const user_id = req.params.id;
      console.log(user_id)
      const cartItemRepository = dbConnection.getRepository(CartItem);
      const cartItems = await cartItemRepository.find({
        where: { user: { user_id: user_id } } as any,
        relations: ['product']
      });

      const total = cartItems.reduce((sum, item) => 
        sum + (item.product.sales_price * item.quantity), 0);

      res.status(200).json({
        message: "Cart retrieved successfully",
        data: { items: cartItems, total }
      });
    }
  );

  static updateCartItem: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      await body("quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1")
        .run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { quantity,user_id } = req.body;
      const cartItemId = parseInt(req.params.id);

      const cartItemRepository = dbConnection.getRepository(CartItem);
      const cartItem = await cartItemRepository.findOne({
        where: { 
          id: cartItemId,
          user: { user_id: user_id }
        } as any,
        relations: ['product']
      });

      if (!cartItem) {
        res.status(404).json({ message: "Cart item not found" });
        return;
      }

      if (cartItem.product.quantity < quantity) {
        res.status(400).json({ message: "Insufficient product quantity" });
        return;
      }

      cartItem.quantity = quantity;
      await cartItemRepository.save(cartItem);

      res.status(200).json({
        message: "Cart item updated successfully",
        data: cartItem
      });
    }
  );

  static removeFromCart: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      const cartItemId = parseInt(req.params.id);
      const cartItemRepository = dbConnection.getRepository(CartItem);
      const cartItem = await cartItemRepository.findOne({
        where: { 
          id: cartItemId
        } as any
      });

      if (!cartItem) {
        res.status(404).json({ message: "Cart item not found" });
        return;
      }

      await cartItemRepository.remove(cartItem);

      res.status(200).json({
        message: "Item removed from cart successfully"
      });
    }
  );

  static clearCart: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      const user_id = req.user.id;

      const cartItemRepository = dbConnection.getRepository(CartItem);
      await cartItemRepository.delete({ user: { id: user_id } as any });

      res.status(200).json({
        message: "Cart cleared successfully"
      });
    }
  );
}

export default CartController