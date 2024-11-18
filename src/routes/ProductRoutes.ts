import express, { Router } from "express";
import  ProductController  from "../controller/ProductController";

const router: Router = express.Router();
router.post("/products", ProductController.createProduct);

router.put("/products/:id", ProductController.updateProduct);

router.get("/products", ProductController.getAllProducts);

router.get("/products/:id", ProductController.getProductById);

router.delete("/products/:id", ProductController.deleteProduct);

export default router;
