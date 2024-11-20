import { Router } from "express";
import { ReviewController } from "../controller/ReviewController";

const router = Router();

router.post('/create', ReviewController.createReview);

router.get('/get-all', ReviewController.getAllReviews);

router.get('/product/:product_id', ReviewController.getReviewsByProductId);

router.delete('/delete/:review_id', ReviewController.deleteReview);

export default router;
