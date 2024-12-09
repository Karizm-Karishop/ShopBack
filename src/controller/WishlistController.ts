//@ts-nocheck
import { Request, Response, NextFunction } from "express";
import { WishlistItem } from "../database/models/WishlistItem";
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
const wishlistItemRepository = dbConnection.getRepository(WishlistItem);
const productRepository = dbConnection.getRepository(ProductModel);
const userRepository = dbConnection.getRepository(UserModel);

class WishlistController {
    static addToWishlist: ExpressHandler = errorHandler(
        async (req: Request, res: Response) => {
            await body("product_id")
                .isInt()
                .withMessage("Product ID must be an integer")
                .run(req);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { product_id, user_id } = req.body;
            const product = await productRepository.findOne({
                where: { product_id }
            });

            if (!product) {
                res.status(404).json({ message: "Product not found" });
                return;
            }

            const user = await userRepository.findOne({
                where: { user_id }
            });

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            console.log(req.body);
           const wishlistItem = await wishlistItemRepository.create({
                user_id,
                product_id
            });

            await wishlistItemRepository.save(wishlistItem);
            res.status(201).json({
                message: "Item added to Wishlist successfully",
                data: { item: wishlistItem }
            });
        }
    );

    static getWishlist: ExpressHandler = errorHandler(
        async (req: Request, res: Response) => {
            const user_id = req.params.id;

            const wishlistItemRepository = dbConnection.getRepository(WishlistItem);
            const WishlistItems = await wishlistItemRepository.find({
                where: { user: { user_id: user_id } } as any,
                relations: ['product']
            });

            res.status(200).json({
                message: "Wishlist retrieved successfully",
                data: { items: WishlistItems }
            });
        }
    );

    static removeFromWishlist: ExpressHandler = errorHandler(
        async (req: Request, res: Response) => {
            const WishlistItemId = parseInt(req.params.id);
            const wishlistItemRepository = dbConnection.getRepository(WishlistItem);
            const wishlistItem = await wishlistItemRepository.findOne({
                where: {
                    id: WishlistItemId
                } as any
            });

            if (!wishlistItem) {
                res.status(404).json({ message: "Wishlist item not found" });
                return;
            }

            const result= await wishlistItemRepository.remove(wishlistItem);
            if(result){
                res.status(200).json({
                    message: "Item removed from Wishlist successfully"
                });
                return;
            }
            else{
                res.status(400).json({message: "Failed to delete wishlist"});
                return;
            }
           
        }
    );

    static clearWishlist: ExpressHandler = errorHandler(
        async (req: Request, res: Response) => {
            const user_id = req.user.id;

            const wishlistItemRepository = dbConnection.getRepository(WishlistItem);
            await wishlistItemRepository.delete({ user: { user_id: user_id } as any });

            res.status(200).json({
                message: "Wishlist cleared successfully"
            });
        }
    );
}

export default WishlistController