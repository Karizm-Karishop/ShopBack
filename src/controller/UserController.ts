import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel, { UserRole } from '../database/models/UserModel';
import dbConnection from '../database';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
dotenv.config();
const userRepository = dbConnection.getRepository(UserModel);
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.config';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

type ExpressHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const excludePassword = (user: any) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const errorHandler = (fn: ExpressHandler): ExpressHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error('Error:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };
      
      if (error instanceof Error) {
        switch (error.name) {
          case 'ValidationError':
            res.status(400).json(response);
            break;
          case 'UnauthorizedError':
            res.status(401).json(response);
            break;
          case 'ForbiddenError':
            res.status(403).json(response);
            break;
          case 'NotFoundError':
            res.status(404).json(response);
            break;
          default:
            res.status(500).json(response);
        }
      } else {
        res.status(500).json(response);
      }
    }
  };
};

class UserController {
  static registerUser: ExpressHandler = errorHandler(async (req: Request, res: Response) => {
    await body('name').trim().notEmpty().withMessage('Name is required').run(req);
    await body('email').isEmail().withMessage('Invalid email').run(req);
    await body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
      .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array()
      });
      return;
    }

    const { name, email, password, role = UserRole.CLIENT, phone_number, address, gender } = req.body;
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({
        success: false,
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone_number,
      address,
      gender
    });

    await userRepository.save(user);

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: excludePassword(user),
        token
      }
    });
  });

  static login: ExpressHandler = errorHandler(async (req: Request, res: Response) => {
    await body('email').isEmail().withMessage('Invalid email').run(req);
    await body('password').notEmpty().withMessage('Password is required').run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array()
      });
      return;
    }

    const { email, password } = req.body;

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
      return;
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      res.status(401).json({
        success: false,
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
      return;
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: excludePassword(user),
        token
      }
    });
  });

  static deleteAllUsers: ExpressHandler = errorHandler(async (req: Request, res: Response) => {
    if ((req as any).user?.role !== UserRole.ADMIN) {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Only administrators can perform this action'
      });
      return;
    }

    const deleteResult = await userRepository.delete({});
    res.status(200).json({
      success: true,
      message: 'Users deleted successfully',
      data: {
        deletedCount: deleteResult.affected
      }
    });
  });

  static getAllUsers: ExpressHandler = errorHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await userRepository.findAndCount({
      select: ['user_id', 'name', 'email', 'role', 'created_at', 'updated_at'],
      skip,
      take: limit,
      order: { created_at: 'DESC' }
    });

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: limit
        }
      }
    });
  });

  static updateProfile: ExpressHandler = errorHandler(async (req: Request, res: Response) => {
    await body('firstName').optional().trim().notEmpty().run(req);
    await body('lastName').optional().trim().notEmpty().run(req);
    await body('email').optional().isEmail().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array()
      });
      return;
    }

    const { firstName, lastName, email } = req.body;
    const userId = parseInt(req.params.id, 10);
    
    if (isNaN(userId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'Invalid user ID format'
      });
      return;
    }

    if ((req as any).user?.userId !== userId && (req as any).user?.role !== UserRole.ADMIN) {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You do not have permission to update this profile'
      });
      return;
    }

    const user = await userRepository.findOne({ where: { user_id: userId } });
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'User not found'
      });
      return;
    }

    if (email && email !== user.email) {
      const emailExists = await userRepository.findOne({ where: { email } });
      if (emailExists) {
        res.status(409).json({
          success: false,
          error: 'Conflict',
          message: 'Email is already in use'
        });
        return;
      }
    }

    user.name = `${firstName || ''} ${lastName || ''}`.trim() || user.name;
    user.email = email || user.email;
    user.updated_at = new Date();

    await userRepository.save(user);
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: excludePassword(user)
      }
    });
  });

  static getProfileById: ExpressHandler = errorHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id, 10);
    
    if (isNaN(userId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'Invalid user ID format'
      });
      return;
    }

    const user = await userRepository.findOne({
      where: { user_id: userId },
      select: [
        'user_id',
        'name',
        'email',
        'phone_number',
        'address',
        'role',
        'profile_picture',
        'gender',
        'created_at',
        'updated_at'
      ]
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  });
}

export default UserController;


