
import express, { Router } from "express";
import OrderController from "../controller/OrderController";

const router: Router = express.Router();


router.post("/orders", OrderController.createOrder);
router.get("/orders", OrderController.getOrders);
router.get("/orders/:id", OrderController.getOrderById);
router.put("/orders/:id/status", OrderController.updateOrderStatus);
router.post("/orders/:id/cancel", OrderController.cancelOrder);
router.post("/orders/date-range", OrderController.getOrdersByDateRange);

export default router;