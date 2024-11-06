import { Router } from 'express';
import ShopController from '../controller/ShopController';
import upload from '../helpers/multer';  
import authorize from '../middlewares/Authorization';
import { UserRole } from '../database/models/UserModel';
const router = Router();

router.post('/shops', upload.single('icon'), ShopController.createShop);
router.put('/shops/:id', upload.single('icon'), ShopController.updateShop);
router.get('/shops',authorize([UserRole.CLIENT]), ShopController.getAllShops);
router.delete('/delete/shops', authorize([UserRole.ADMIN]), ShopController.deleteAllShops);
router.get('/shops/:id',  authorize([UserRole.ADMIN, UserRole.ARTIST]),ShopController.getShopById);
router.get('/shops/artist/:artist_id', ShopController.getShopsByArtistId);
export default router;
