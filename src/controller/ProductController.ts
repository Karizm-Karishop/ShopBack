
// @ts-nocheck
import { Request, Response, NextFunction } from "express";
import { ProductModel } from "../database/models/ProductModel";
import CategoryModel from "../database/models/CategoryModel";
import ShopModel from "../database/models/ShopModel";
import { body, validationResult } from "express-validator";
import dbConnection from "../database";
import errorHandler from "../middlewares/errorHandler";
import UserModel from "../database/models/UserModel";

const productRepository = dbConnection.getRepository(ProductModel);
const categoryRepository = dbConnection.getRepository(CategoryModel);
const shopRepository = dbConnection.getRepository(ShopModel);
const userRepository =dbConnection.getRepository(UserModel)

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
      await body("longDesc")
        .trim()
        .notEmpty()
        .withMessage("long Description is required")
        .run(req);

    await body("shortDesc")
        .trim()
        .notEmpty()
        .withMessage("short Description is required")
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
      await body("artist_id")
        .exists().withMessage("artist_id is required")
        .isInt({ min: 1 }).withMessage("artist_id must be a positive integer")
        .toInt()
        .run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          data: errors.array(),
        });
      }

      const artist_id = req.body.artist_id;
      const artist = await userRepository.findOne({
        where: { user_id: artist_id },
      });
      
      if (!artist) {
        return res.status(404).json({
          success: false,
          error: "Artist not found",
        });
      }
  
      const { password, ...artistWithoutPassword } = artist;
  
      const {
        name,
        shortDesc,
        longDesc,
        sales_price,
        regular_price,
        quantity,
        category_id,
        shop_id,
        tags,
        product_image,
        gallery,
        isAvailable,
      } = req.body;


      const category = await categoryRepository.findOne({ where: { category_id } });
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

      const product = productRepository.create({
        name,
        shortDesc,
        longDesc,
        sales_price,
        regular_price,
        quantity,
        category,
        shop,
        tags,
        product_image, 
        gallery: gallery || [], 
        isAvailable,
        artist: artist 
      });

      await productRepository.save(product);

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: {
          ...product,
          artist: artistWithoutPassword
        } 
      });
    }
  );

  static updateProduct: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          data: errors.array(),
        });
      }
      const productRepository = dbConnection.getRepository(ProductModel);
      const product = await productRepository.findOne({
        where: { product_id: parseInt(req.params.id) },
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (req.body.category_id) {
        const categoryRepository = dbConnection.getRepository(CategoryModel);
        const category = await categoryRepository.findOne({
          where: { category_id: req.body.category_id },
        });
        if (!category) {
          return res.status(404).json({ message: "Category not found" });
        }
        product.category = category;
      }

      if (req.body.shop_id) {
        const shopRepository = dbConnection.getRepository(ShopModel);
        const shop = await shopRepository.findOne({
          where: { shop_id: req.body.shop_id },
        });
        if (!shop) {
          return res.status(404).json({ message: "Shop not found" });
        }
        product.shop = shop;
      }

      Object.assign(product, req.body);

      await productRepository.save(product);

      return res.status(200).json({
        success: true,
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

  static getAllProductArtistId: ExpressHandler = async (req, res) => {
    const { artistId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const artistIdNum = parseInt(artistId, 10);

    try {
      const artist = await userRepository.findOne({
        where: { user_id: artistIdNum }
      });

      if (!artist) {
        return res.status(404).json({
          success: false,
          error: "Artist not found",
        });
      }

      const [products, total] = await productRepository.findAndCount({
        where: { artist: { user_id: artistIdNum } },
        relations: ["artist"],
        skip,
        take: limit,
        order: { created_at: "DESC" },
      });

      if (!products.length) {
        return res.status(404).json({
          success: false,
          error: "No products found for this artist",
        });
      }

      const sanitizedAlproducts = products.map(product => {
        const { password, ...artistWithoutPassword } = product.artist;
        return {
          ...product,
          artist: artistWithoutPassword
        };
      });

      res.status(200).json({
        success: true,
        data: {
          products: sanitizedAlproducts,
          pagination: {
            current_page: page,
            total_pages: Math.ceil(total / limit),
            total_items: total,
            items_per_page: limit,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };


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
