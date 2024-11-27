import { Request, Response, NextFunction } from "express";
import ShopModel from "../database/models/ShopModel";
import CategoryModel from "../database/models/CategoryModel";
import dbConnection from "../database";
import { body, validationResult } from "express-validator";
import errorHandler from "../middlewares/errorHandler";
import { UploadToCloud } from "../helpers/cloud";
import UserModel from "../database/models/UserModel";

const shopRepository = dbConnection.getRepository(ShopModel);
const categoryRepository = dbConnection.getRepository(CategoryModel);
type ExpressHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

class ShopController {
  static createShop: ExpressHandler = async (req: Request, res: Response) => {
    await body("shop_name").trim().notEmpty().run(req);
    await body("description").optional().trim().run(req);
    await body("category_id").isInt().run(req);
    await body("artist_id").isInt().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        data: errors.array(),
      });
      return;
    }

    const { shop_name, description, category_id, artist_id } = req.body;
    const { icon, banner } = req.files as any;
    const category = await categoryRepository.findOne({
      where: { category_id },
    });
    if (!category) {
      res.status(404).json({
        success: false,
        error: "Category not found",
      });
      return;
    }

    const artist = await dbConnection.getRepository(UserModel).findOne({
      where: { user_id: artist_id },
    });
    if (!artist) {
      res.status(404).json({
        success: false,
        error: "Artist not found",
      });
      return;
    }

    const { password, ...artistWithoutPassword } = artist;

    let iconUrl = "";
    let bannerUrl = "";
    if (icon) {
      const uploadedIcon = await UploadToCloud(icon[0], res);
      iconUrl = (uploadedIcon as any).secure_url;
      console.log(iconUrl);
    }
    if (banner) {
      const uploadedBanner = await UploadToCloud(banner[0], res) as any;
      bannerUrl = uploadedBanner?.secure_url;
      console.log(bannerUrl);
    }

    const shop = shopRepository.create({
      ...req.body,
      shop_name,
      banner: bannerUrl,
      icon: iconUrl,
      description,
      category,
      artist: artistWithoutPassword,
    });

    await shopRepository.save(shop);

    res.status(201).json({
      success: true,
      message: "Shop created successfully",
      data: shop,
    });
  };

  static updateShop: ExpressHandler = errorHandler(
    async (req: Request, res: Response):Promise<any> => {
    // Validate specific fields in the request body
    await Promise.all([
      body("shop_name").optional().trim().notEmpty().run(req),
      body("description").optional().trim().run(req),
      body("category_id").optional().isInt().run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        data: errors.array(),
      });
    }

    const shop_id = Number(req.params.id);
    const { category_id } = req.body;
    const { icon, banner } = req.files as any;
    const shop = await shopRepository.findOne({ where: { shop_id }, relations: ["category"] });
    if (!shop) {
      return res.status(404).json({ success: false, error: "Shop not found" });
    }

    Object.assign(shop, req.body);

    if (category_id) {
      const category = await categoryRepository.findOne({ where: { category_id } });
      if (!category) {
        return res.status(404).json({ success: false, error: "Category not found" });
      }
      shop.category = category;
    }
    if (icon) {
      const uploadedIcon = await UploadToCloud(icon[0], res);
      shop.icon = (uploadedIcon as any).secure_url;
    }
    if (banner) {
      const uploadedBanner = await UploadToCloud(banner[0], res) as any;
      shop.banner = uploadedBanner?.secure_url;
    }

    await shopRepository.save(shop);

    res.status(200).json({
      success: true,
      message: "Shop updated successfully",
      data: shop,
    });
  });


  static getAllShops: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [shops, total] = await shopRepository.findAndCount({
        relations: ["category"],
        skip,
        take: limit,
        order: { created_at: "DESC" },
      });

      res.status(200).json({
        success: true,
        data: {
          shops,
          pagination: {
            current_page: page,
            total_pages: Math.ceil(total / limit),
            total_items: total,
            items_per_page: limit,
          },
        },
      });
    }
  );

  static deleteAllShops: ExpressHandler = errorHandler(
    async (_req: Request, res: Response) => {
      const deleteResult = await shopRepository.delete({});
      res.status(200).json({
        success: true,
        message: "Shops deleted successfully",
        data: {
          deletedCount: deleteResult.affected,
        },
      });
    }
  );
  static deleteShop: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      const shopId = parseInt(req.params.id, 10);

      if (isNaN(shopId)) {
        res.status(400).json({
          success: false,
          error: "Invalid shop ID format",
        })
      }
      else {
        res.status(200).json({
          success: true,
          message: "Shop deleted successfully",
        })
      }
    });

  static getShopById: ExpressHandler = errorHandler(
    async (req: Request, res: Response) => {
      const shopId = parseInt(req.params.id, 10);

      if (isNaN(shopId)) {
        res.status(400).json({
          success: false,
          error: "Invalid input",
          message: "Invalid shop ID format",
        });
        return;
      }

      const shop = await shopRepository.findOne({
        where: { shop_id: shopId },
        relations: ["category"],
      });

      if (!shop) {
        res.status(404).json({
          success: false,
          error: "Not found",
          message: "Shop not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { shop },
      });
    }
  );
  static getShopsByArtistId: ExpressHandler = errorHandler(
    // @ts-ignore
    async (req: Request, res: Response) => {
      const { artist_id } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const artistId = parseInt(artist_id, 10);

      const [shops, total] = await shopRepository.findAndCount({
        where: { artist: { user_id: artistId } },
        relations: ["category", "artist"],
        skip,
        take: limit,
        order: { created_at: "DESC" },
      });

      if (!shops.length) {
        return res.status(404).json({
          success: false,
          error: "No shops found for this artist",
        });
      }

      res.status(200).json({
        success: true,
        data: {
          shops,
          pagination: {
            current_page: page,
            total_pages: Math.ceil(total / limit),
            total_items: total,
            items_per_page: limit,
          },
        },
      });
    }
  );
}

export default ShopController;
