import { Router } from 'express';
import CategoryController from '../controller/CategoryController';
const router = Router();
router.post('/categories', CategoryController.createCategory);
router.put('/categories/:id', CategoryController.updateCategory);
router.get('/categories', CategoryController.getAllCategories);
router.delete('/categories/:id', CategoryController.deleteCategoryById);

export default router;