import { Router } from "express";
import WishlistController from "../controller/WishlistController";
const router= Router();

router.get('/:id', WishlistController.getWishlist);

router.post('/add', WishlistController.addToWishlist);

router.delete('/remove/:id', WishlistController.removeFromWishlist);

router.delete('/', WishlistController.clearWishlist);

export default router;