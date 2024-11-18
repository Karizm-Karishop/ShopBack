import { Request, Response, NextFunction } from "express";
import { ProductModel } from "../database/models/ProductModel";
import CategoryModel from "../database/models/CategoryModel";
import ShopModel from "../database/models/ShopModel";
import { body, validationResult } from "express-validator";
import dbConnection from "../database"; 
import errorHandler from "../middlewares/errorHandler";
type ExpressHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;
class ProductController {
  static createProduct: ExpressHandler = errorHandler(
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
        res.status(400).json({
          success: false,
          error: "Validation failed",
          data: errors.array(),
        });
        return;
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
        res.status(404).json({
          success: false,
          error: "Not found",
          message: "Category not found",
        });
        return;
      }

      const shop = await shopRepository.findOne({ where: { shop_id } });
      if (!shop) {
        res.status(404).json({
          success: false,
          error: "Not found",
          message: "Shop not found",
        });
        return;
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
      });

      await productRepository.save(product);

      res.status(201).json({
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

      Object.assign(product, req.body);
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
