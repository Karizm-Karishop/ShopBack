import { Router } from 'express';
import CategoryController from '../controller/CategoryController';
import upload from '../helpers/multer';
const router = Router();
router.post('/categories', 
  upload.single('category_icon'), 
    CategoryController.createCategory);
router.put('/categories/:id',
    upload.single('category_icon'), 
    CategoryController.updateCategory);
router.get('/categories', CategoryController.getAllCategories);
router.get('/categories/:artistId', CategoryController.getAllAllCategoriesArtistId);
router.delete('/categories/:id', CategoryController.deleteCategoryById);

export default router;