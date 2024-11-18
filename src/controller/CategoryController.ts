
import { Request, Response, NextFunction } from 'express';
import CategoryModel from '../database/models/CategoryModel';
import dbConnection from '../database';
import { body, validationResult } from 'express-validator';
import errorHandler from '../middlewares/errorHandler';
const categoryRepository = dbConnection.getRepository(CategoryModel);
type ExpressHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  
class CategoryController {
  static createCategory: ExpressHandler = errorHandler(async (req: Request, res: Response, next: NextFunction) => {
    await body('category_name').trim().notEmpty().run(req);
    await body('description').trim().notEmpty().run(req);


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array()
      });
      return;
    }

    const { category_name,description } = req.body;

    const category = categoryRepository.create({
      category_name,
      description
    });

    await categoryRepository.save(category);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  });

  static updateCategory: ExpressHandler = errorHandler(async (req: Request, res: Response, next: NextFunction) => {
    await body('category_name').optional().trim().notEmpty().run(req);
    await body('description').optional().trim().notEmpty().run(req);


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array()
      });
      return;
    }

    const { category_name,description } = req.body;
    const categoryId = parseInt(req.params.id, 10);

    if (isNaN(categoryId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'Invalid category ID format'
      });
      return;
    }

    let category = await categoryRepository.findOne({ where: { category_id: categoryId } });
    if (!category) {
      res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'Category not found'
      });
      return;
    }

    category.category_name = category_name || category.category_name;
    category.description = description || category.description;
    category.updated_at = new Date();

    await categoryRepository.save(category);

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  });

  static getAllCategories: ExpressHandler = errorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
  
    const [categories, total] = await categoryRepository.findAndCount({
      skip,
      take: limit,
      order: { category_id: 'DESC' }
    });
  
    res.status(200).json({
      success: true,
      data: {
        categories,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: limit
        }
      }
    });
  });
  
  static deleteCategoryById: ExpressHandler = async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = parseInt(req.params.id, 10);
    
    if (isNaN(categoryId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'Invalid category ID format'
      });
      return;
    }

    const deleteResult = await categoryRepository.delete({ category_id: categoryId });
    if (deleteResult.affected === 0) {
      res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'Category not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: {
        deletedCount: deleteResult.affected
      }
    });
  };
}

export default CategoryController;



