import express, { Router } from "express";
import CartController from "../controller/CartController";

const router: Router = express.Router();

router.post("/cart/add", CartController.addToCart);
router.get("/cart", CartController.getCart);
router.put("/cart/:id", CartController.updateCartItem);
router.delete("/cart/:id", CartController.removeFromCart);
router.delete("/cart", CartController.clearCart);

export default router;
