import express, { Router } from "express";
import  ProductController  from "../controller/ProductController";
import upload from '../helpers/multer';  
import authorize from "../middlewares/Authorization";
import { UserRole } from "../database/models/UserModel";
const router: Router = express.Router();
router.post(
    "/products", authorize([UserRole.ADMIN, UserRole.ARTIST]),
    upload.fields([
      { name: "product_image", maxCount: 1 },
      { name: "gallery", maxCount: 10 },
    ]),
    ProductController.createProduct
  );

router.put("/products/:id", authorize([UserRole.ADMIN, UserRole.ARTIST]),
    upload.fields([
        { name: "product_image", maxCount: 1 },
        { name: "gallery", maxCount: 10 },
      ]),
    ProductController.updateProduct);

router.get("/products", ProductController.getAllProducts);

router.get("/products/:id", ProductController.getProductById);

router.delete("/products/:id", authorize([UserRole.ADMIN, UserRole.ARTIST]), ProductController.deleteProduct);

export default router;
