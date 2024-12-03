// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import CategoryModel from '../database/models/CategoryModel';
import dbConnection from '../database';
import { UploadToCloud } from '../helpers/cloud';
import { body, validationResult } from 'express-validator';
import errorHandler from '../middlewares/errorHandler';
import UserModel from '../database/models/UserModel';
const categoryRepository = dbConnection.getRepository(CategoryModel);
const userRepository = dbConnection.getRepository(UserModel);

type ExpressHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  
class CategoryController {
  static createCategory: ExpressHandler = errorHandler(async (req: Request, res: Response, next: NextFunction) => {
    await body('category_name').trim().notEmpty().withMessage('Category name is required').run(req);
    await body('description').trim().notEmpty().withMessage('Description is required').run(req);
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation Errors:', errors.array());
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array(),
      });
      return;
    }
  
    const artist_id = req.body.artist_id;
    const artist = await userRepository.findOne({
      where: { user_id: artist_id },
    });
  
    if (!artist) {
      res.status(404).json({
        success: false,
        error: 'Artist not found',
      });
      return;
    }
  
    const { category_name, description } = req.body;
    const categoryIcon = req.file;
  
    try {
      let categoryIconUrl = null;
      if (categoryIcon) {
        const uploadResult = await UploadToCloud(categoryIcon, res);
        categoryIconUrl = (uploadResult as any).secure_url;
      }
  
      const category = categoryRepository.create({
        category_name,
        description,
        category_icon: categoryIconUrl,
        artist: artist,
      });
  
      await categoryRepository.save(category);
  
      const { password, ...artistWithoutPassword } = artist;
  
      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: {
          ...category,
          artist: artistWithoutPassword,
        },
      });
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  });
  
  static updateCategory: ExpressHandler = errorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = parseInt(req.params.id, 10);
  
    await body('category_name').optional().trim().notEmpty().withMessage('Category name cannot be empty').run(req);
    await body('description').optional().trim().notEmpty().withMessage('Description cannot be empty').run(req);
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array(),
      });
    }
  
    try {
      const existingCategory = await categoryRepository.findOne({
        where: { category_id: categoryId },
        relations: ['artist']
      });
  
      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          error: 'Category not found',
        });
      }
  
      const { category_name, description } = req.body;
      const categoryIcon = req.file;
  
      const updateData: Partial<CategoryModel> = {};
  
      if (category_name) {
        updateData.category_name = category_name;
      }
  
      if (description) {
        updateData.description = description;
      }
  
      if (categoryIcon) {
        const uploadResult = await UploadToCloud(categoryIcon, res);
        updateData.category_icon = (uploadResult as any).secure_url;
      }
  
      const updatedCategory = categoryRepository.merge(existingCategory, updateData);
      await categoryRepository.save(updatedCategory);
  
      const { password, ...artistWithoutPassword } = existingCategory.artist;
  
      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: {
          ...updatedCategory,
          artist: artistWithoutPassword,
        },
      });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
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


 static getAllAllCategoriesArtistId: ExpressHandler = async (req, res) => {
    const { artistId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const artistIdNum = parseInt(artistId, 10);

    try {
      const artist = await userRepository.findOne({
        where: { user_id: artistIdNum }
      });

      if (!artist) {
        return res.status(404).json({
          success: false,
          error: "Artist not found",
        });
      }

      const [categories, total] = await categoryRepository.findAndCount({
        where: { artist: { user_id: artistIdNum } },
        relations: ["artist"],
        skip,
        take: limit,
        order: { created_at: "DESC" },
      });

      if (!categories.length) {
        return res.status(404).json({
          success: false,
          error: "No categories found for this artist",
        });
      }

      const sanitizedCategories = categories.map(category => {
        const { password, ...artistWithoutPassword } = category.artist;
        return {
          ...category,
          artist: artistWithoutPassword
        };
      });

      res.status(200).json({
        success: true,
        data: {
          categories: sanitizedCategories,
          pagination: {
            current_page: page,
            total_pages: Math.ceil(total / limit),
            total_items: total,
            items_per_page: limit,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

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



