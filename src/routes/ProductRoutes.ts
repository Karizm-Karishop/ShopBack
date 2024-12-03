import express, { Router } from "express";
import  ProductController  from "../controller/ProductController";
import authorize from "../middlewares/Authorization";
import { UserRole } from "../database/models/UserModel";
const router: Router = express.Router();
router.post(
  "/products",
  // authorize([UserRole.ADMIN, UserRole.ARTIST]),
  ProductController.createProduct
);

router.put(
  "/products/:id",
  // authorize([UserRole.ADMIN, UserRole.ARTIST]),
  ProductController.updateProduct
);

router.get("/products", ProductController.getAllProducts);

router.get("/products/:id", ProductController.getProductById);
router.get("/products/artist/:artistId", ProductController.getAllProductArtistId);


router.delete("/products/:id", authorize([UserRole.ADMIN, UserRole.ARTIST]), ProductController.deleteProduct);

export default router;
