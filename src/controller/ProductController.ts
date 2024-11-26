import { Request, Response, NextFunction } from "express";
import { ProductModel } from "../database/models/ProductModel";
import CategoryModel from "../database/models/CategoryModel";
import ShopModel from "../database/models/ShopModel";
import { body, validationResult } from "express-validator";
import dbConnection from "../database";
import errorHandler from "../middlewares/errorHandler";
import { UploadToCloud } from "../helpers/cloud";
type ExpressHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;
class ProductController {
  static createProduct: ExpressHandler = errorHandler(
    // @ts-ignore
    async (req: Request, res: Response) => {
      await body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required")
        .run(req);
      await body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .run(req);
      await body("sales_price")
        .isFloat({ min: 0 })
        .withMessage("Sales price must be a positive number")
        .run(req);
      await body("regular_price")
        .isFloat({ min: 0 })
        .withMessage("Regular price must be a positive number")
        .run(req);
      await body("quantity")
        .isInt({ min: 0 })
        .withMessage("Quantity must be a positive integer")
        .run(req);
      await body("category_id")
        .isInt()
        .withMessage("Category ID must be an integer")
        .run(req);
      await body("shop_id")
        .isInt()
        .withMessage("Shop ID must be an integer")
        .run(req);
      await body("tags")
        .isArray()
        .withMessage("Tags must be an array")
        .run(req);
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          data: errors.array(),
        });
      }
  
      const {
        name,
        description,
        sales_price,
        regular_price,
        quantity,
        category_id,
        shop_id,
        tags,
      } = req.body;
  
      const productRepository = dbConnection.getRepository(ProductModel);
      const categoryRepository = dbConnection.getRepository(CategoryModel);
      const shopRepository = dbConnection.getRepository(ShopModel);
      const category = await categoryRepository.findOne({
        where: { category_id },
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          error: "Not found",
          message: "Category not found",
        });
      }
  
      const shop = await shopRepository.findOne({ where: { shop_id } });
      if (!shop) {
        return res.status(404).json({
          success: false,
          error: "Not found",
          message: "Shop not found",
        });
      }
  
      let product_image: string | null = null;
      let gallery: string[] = [];
  
      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  
        if (files.product_image) {
          const uploadResponse = await UploadToCloud(files.product_image[0], res);
          product_image = (uploadResponse as any).secure_url;
        }
  
        if (files.gallery) {
          const galleryUploads = await Promise.all(
            files.gallery.map((file) => UploadToCloud(file, res))
          );
          gallery = galleryUploads.map((upload) => (upload as any).secure_url);
        }
      }
  
      const product = productRepository.create({
        name,
        description,
        sales_price,
        regular_price,
        quantity,
        category,
        shop,
        tags,
        product_image,  
        gallery,      
      });
  
      await productRepository.save(product);
        return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    }
  );

  static updateProduct: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
  
      const productRepository = dbConnection.getRepository(ProductModel);
      const product = await productRepository.findOne({
        where: { product_id: parseInt(req.params.id) },
      });
  
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
  
      if (req.body.category_id) {
        const categoryRepository = dbConnection.getRepository(CategoryModel);
        const category = await categoryRepository.findOne({
          where: { category_id: req.body.category_id },
        });
        if (!category) {
          res.status(404).json({ message: "Category not found" });
          return;
        }
        product.category = category;
      }
  
      if (req.body.shop_id) {
        const shopRepository = dbConnection.getRepository(ShopModel);
        const shop = await shopRepository.findOne({
          where: { shop_id: req.body.shop_id },
        });
        if (!shop) {
          res.status(404).json({ message: "Shop not found" });
          return;
        }
        product.shop = shop;
      }
  
      let product_image: string | null = product.product_image;
      let gallery: string[] = product.gallery;
  
      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  
        if (files.product_image) {
          const uploadResponse = await UploadToCloud(files.product_image[0], res);
          product_image = (uploadResponse as any).secure_url;
        }
  
        if (files.gallery) {
          const galleryUploads = await Promise.all(
            files.gallery.map((file) => UploadToCloud(file, res))
          );
          gallery = galleryUploads.map((upload) => (upload as any).secure_url);
        }
      }
  
      Object.assign(product, req.body);
      product.product_image = product_image;
      product.gallery = gallery;
  
      await productRepository.save(product);
  
      res.status(200).json({
        message: "Product updated successfully",
        data: product,
      });
    }
  );
  

  static getAllProducts: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      const productRepository = dbConnection.getRepository(ProductModel);
      const products = await productRepository.find({
        relations: {
          category: true,
          shop: true,
        },
      });

      res.status(200).json({
        message: "Products retrieved successfully",
        data: products,
      });
    }
  );

  static getProductById: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      const productRepository = dbConnection.getRepository(ProductModel);
      const product = await productRepository.findOne({
        where: { product_id: parseInt(req.params.id) },
        relations: {
          category: true,
          shop: true,
          orderItems: true,
          cartItems: true,
          wishlistItems: true,
        },
      });

      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      res.status(200).json({
        message: "Product retrieved successfully",
        data: product,
      });
    }
  );

  static deleteProduct: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      const productRepository = dbConnection.getRepository(ProductModel);
      const product = await productRepository.findOne({
        where: { product_id: parseInt(req.params.id) },
      });

      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      await productRepository.remove(product);

      res.status(200).json({
        message: "Product deleted successfully",
      });
    }
  );
}
export default ProductController;
