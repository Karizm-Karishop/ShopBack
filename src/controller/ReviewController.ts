import dbConnection from "../database";
import { Request, Response } from "express";
import Review from "../database/models/ReviewModel";

const reviewRepo = dbConnection.getRepository(Review);

export class ReviewController {
    static async createReview(req: Request, res: Response): Promise<any> {
        try {
            const { product_id, user_id, rating, comment } = req.body;
            const review = reviewRepo.create(
                { product_id, user_id, rating, comment }
            );
            await reviewRepo.save(review);
            return res.status(201).json(review);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getAllReviews(req: Request, res: Response): Promise<any> {
        try {
            const reviews = await reviewRepo.find();
            if (reviews.length > 0) {
                return res.status(200).json(reviews);
            }
            return res.status(404).json({ message: "No reviews found" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getReviewsByProductId(req: Request, res: Response): Promise<any> {
        try {
            const { product_id } = req.params;
            const reviews = await reviewRepo.find(
                // { where: { product_id: product_id as any } }
            );
            if (reviews.length > 0) {
                return res.status(200).json(reviews);
            }
            return res.status(404).json({ message: "No reviews found for this product" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async deleteReview(req: Request, res: Response): Promise<any> {
        try {
            const { review_id } = req.params;
            const review = await reviewRepo.findOne({ where: { review_id: review_id as any } });
            if (review) {
                await reviewRepo.delete(review);
                return res.status(204).json({ success: "Review deleted successfully" });
            }
            return res.status(404).json({ message: "Review not found" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
