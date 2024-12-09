import { Router } from 'express';
import ShopController from '../controller/ShopController';
import upload from '../helpers/multer';
import authorize from '../middlewares/Authorization';
import { UserRole } from '../database/models/UserModel';
const router = Router();

router.post('/shops', upload.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
]), ShopController.createShop);
router.put('/shops/:id',authorize([UserRole.ADMIN, UserRole.ARTIST]),
    upload.fields([
        { name: 'icon', maxCount: 1 },
        { name: 'banner', maxCount: 1 }
    ]),
     ShopController.updateShop);
router.get('/shops', ShopController.getAllShops);
router.delete('/delete/shops', authorize([UserRole.ADMIN]), ShopController.deleteAllShops);
router.delete('/shops/:id', authorize([UserRole.ARTIST, UserRole.ADMIN]), ShopController.deleteShop);
router.get('/shops/:id', ShopController.getShopById);
router.get('/shops/artist/:artist_id', ShopController.getShopsByArtistId);

router.put(
    '/approve/:id', 
    ShopController.approveShop
  );
  
  router.put(
    '/reject/:id', 
    ShopController.rejectShop
  );
  
  router.get('/shops/status/approved', 
    ShopController.getApprovedShops
);

router.get('/shops/status/rejected', 
    ShopController.getRejectedShops
);

router.get('/shops/status/pending', 
    ShopController.getPendingShops
);
export default router;
