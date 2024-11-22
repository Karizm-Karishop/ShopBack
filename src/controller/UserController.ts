import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import UserModel, { UserRole } from '../database/models/UserModel';
import dbConnection from '../database';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer'
import {ConfirmHtml} from '../templates/ConfirmHtml'
dotenv.config();
const userRepository = dbConnection.getRepository(UserModel);
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.config';
import { OtpService } from '../services/OtpService';
import { OtpToken } from '../database/models/OtpToken';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

const sendConfirmationEmail = (email: string, firstName: string, userId: number) => {
  const confirmationLink = `${process.env.APP_URL}/api/user/confirm-email/${userId}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Confirmation - Complete Your Registration',
    html: ConfirmHtml(firstName, confirmationLink), 
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending confirmation email:', error);
      return;
    }
    console.log('Confirmation email sent:', info.response);
  });
};


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
    await body('firstName').trim().notEmpty().withMessage('First name is required').run(req);
    await body('lastName').trim().notEmpty().withMessage(' Last name is required').run(req);

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

    const { firstName, lastName, email, password, role = UserRole.CLIENT, phone_number, address, gender } = req.body;

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({
        success: false,
        error: 'User already exists',
        message: 'An account with this email already exists',
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      phone_number,
      address,
      gender,
      isVerified: false, 
    });

    await userRepository.save(user);

    sendConfirmationEmail(email, firstName, user.user_id);

    const token = jwt.sign({ userId: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. A confirmation email has been sent.',
      data: {
        user: excludePassword(user),
        token,
      },
    });
  });
// @ts-ignore
  static login: ExpressHandler = errorHandler(async (req: Request, res: Response) => {
    await body('email').isEmail().withMessage('Invalid email').run(req);
    await body('password').notEmpty().withMessage('Password is required').run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array(),
      });
    }

    const { email, password } = req.body;

    try {
      const user = await userRepository.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication failed',
          message: 'Invalid email or password',
        });
      }

      if (!user.isVerified) {
        try {
          sendConfirmationEmail(email, user.firstName, user.user_id);
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError);
        }
        return res.status(400).json({
          success: false,
          error: 'Email not verified',
          message: 'Please verify your email by clicking the link sent to your inbox.',
        });
      }

      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        return res.status(401).json({
          success: false,
          error: 'Authentication failed',
          message: 'Invalid email or password',
        });
      }

      const token = jwt.sign({ userId: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: excludePassword(user), 
          token,
        },
      });
    } catch (err) {
      console.error('Unexpected error during login:', err);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred. Please try again later.',
      });
    }
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
      select: ['user_id', 'firstName','lastName', 'email', 'role', 'created_at', 'updated_at'],
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

    user.firstName = user.firstName;
    user.lastName = user.lastName;
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
        'firstName',
        'lastName',
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
  static requestPasswordReset: ExpressHandler = errorHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
  
    await body('email').isEmail().withMessage('Invalid email').run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return; 
    }
  
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      res.status(200).json({
        success: true,
        message: 'If the email exists, an OTP will be sent'
      });
      return;
    }
  
    const otpService = new OtpService(
      dbConnection.getRepository(OtpToken),
      userRepository
    );
  
    try {
      await otpService.generateAndSendOTP(user);
      res.status(200).json({
        success: true,
        message: 'If the email exists, an OTP will be sent'
      });
    } catch (error: any) {
      res.status(429).json({
        success: false,
        error: error.message
      });
    }
  });
  

  static verifyOTP: ExpressHandler = errorHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
  
    await body('email').isEmail().withMessage('Invalid email').run(req);
    await body('otp').isLength({ min: 6, max: 6 }).isNumeric().run(req);
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
      return; 
    }
  
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'Invalid email or OTP',
      });
      return;
    }
  
    const otpService = new OtpService(
      dbConnection.getRepository(OtpToken),
      userRepository
    );
  
    try {
      await otpService.verifyOTP(user.user_id, otp);
  
      const resetToken = jwt.sign(
        { userId: user.user_id, type: 'password-reset' },
        JWT_SECRET,
        { expiresIn: '15m' }
      );
  
      res.status(200).json({
        success: true,
        data: { resetToken },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  });
  
  static resetPassword: ExpressHandler = errorHandler(async (req: Request, res: Response) => {
    const { resetToken, newPassword, confirmPassword } = req.body;
  
    await body('newPassword')
      .isLength({ min: 8 })
      .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage('Password must contain uppercase, lowercase, number, and special character')
      .run(req);
  
    await body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Passwords do not match');
        }
        return true;
      })
      .run(req);
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
      return; 
    }
  
    try {
      const decoded = jwt.verify(resetToken, JWT_SECRET) as { userId: number; type: string };
      if (decoded.type !== 'password-reset') {
        throw new Error('Invalid reset token');
      }
  
      const user = await userRepository.findOne({ where: { user_id: decoded.userId } });
  
      if (!user) {
        throw new Error('User not found');
      }
  
      const isSameAsOld = await bcrypt.compare(newPassword, user.password);
      if (isSameAsOld) {
        throw new Error('New password must be different from the old password');
      }
  
      user.password = await bcrypt.hash(newPassword, 12);
      user.lastPasswordReset = new Date();
      await userRepository.save(user);
  
      await dbConnection
        .getRepository(OtpToken)
        .update({ userId: user.user_id, isUsed: false }, { isUsed: true });
  
      res.status(200).json({
        success: true,
        message: 'Password reset successful',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  });

  static googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email'],
  });

  static googleAuthCallback = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', (err: any, user: { user_id: any; role: any; }, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Authentication failed' });
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
          user,
          token,
        },
      });
    })(req, res, next);
  };


// @ts-ignore
  static deactivateAccount: ExpressHandler = errorHandler(async (req: Request, res: Response) => {
    const { userId } = req.body;

    const user = await userRepository.findOne({ where: { user_id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.status = 'inactive';
    await userRepository.save(user);

    res.status(200).json({ success: true, message: 'User account deactivated' });
  });
// @ts-ignore
  static activateAccount: ExpressHandler = errorHandler(async (req: Request, res: Response) => {
    const { userId } = req.body;

    const user = await userRepository.findOne({ where: { user_id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.status = 'active';
    await userRepository.save(user);

    res.status(200).json({ success: true, message: 'User account activated' });
  });


  static confirmEmail: ExpressHandler = errorHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const user = await userRepository.findOne({ where: { user_id: Number(userId) } });
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'No user found with the provided ID',
      });
      return;
    }

    user.isVerified = true;
    await userRepository.save(user);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  });

  static enable2FA: ExpressHandler = errorHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await userRepository.findOne({ where: { user_id: Number(userId) } });
    if (!user || user.role !== UserRole.ARTIST) {
      res.status(400).json({
        success: false,
        error: '2FA not enabled',
        message: 'Only artists can enable 2FA.',
      });
      return;
    }

    const twoFactorCode = Math.floor(100000 + Math.random() * 900000);
    user.twoFactorCode = twoFactorCode;
    await userRepository.save(user);

    res.status(200).json({
      success: true,
      message: '2FA enabled successfully',
      data: { twoFactorCode },
    });
  });

  static disable2FA: ExpressHandler = errorHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await userRepository.findOne({ where: { user_id: Number(userId) } });
    if (!user || user.role !== UserRole.ARTIST) {
      res.status(400).json({
        success: false,
        error: '2FA not disabled',
        message: 'Only artists can disable 2FA.',
      });
      return;
    }
  
    user.twoFactorCode = null; 
    user.is2FAEnabled = false; 
    await userRepository.save(user);
  
    res.status(200).json({
      success: true,
      message: '2FA disabled successfully',
    });
  });


  static resendConfirmationEmail: ExpressHandler = errorHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
  
    await body('email').isEmail().withMessage('Invalid email').run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
      return;
    }
  
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'No user found with this email address',
      });
      return;
    }
  
    if (user.isVerified) {
      res.status(400).json({
        success: false,
        error: 'Email already verified',
        message: 'Your email is already verified.',
      });
      return;
    }
  
    sendConfirmationEmail(email, user.firstName, user.user_id);
  
    res.status(200).json({
      success: true,
      message: 'Confirmation email has been resent.',
    });
  });
  
  
  }
  

export default UserController;


