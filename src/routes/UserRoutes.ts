import { Router } from 'express';
import UserController from '../controller/UserController';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import  UserModel from '../database/models/UserModel';
import '../config/passport.config';

const router = Router();

router.post('/register', UserController.registerUser);     
router.post('/login', UserController.login);             
router.put('/profile/:id', UserController.updateProfile);      
router.get('/profile/:id', UserController.getProfileById);     
router.get('/confirm-email/:userId', UserController.confirmEmail); 
router.post('/resend-confirmation', UserController.resendConfirmationEmail); 
router.post('/enable-2fa/:userId', UserController.enable2FA);  
router.post('/disable-2fa/:userId', UserController.disable2FA); 
router.post('/forgot-password', UserController.requestPasswordReset); 
router.post('/verify-otp', UserController.verifyOTP);          
router.post('/reset-password', UserController.resetPassword);  
router.delete('/all-users', UserController.deleteAllUsers);    
router.get('/all-users', UserController.getAllUsers);   
router.post('/activate', UserController.activateAccount);    
router.post('/deactivate', UserController.deactivateAccount);          
router.get('/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );
  
  router.get('/auth/google/callback',
    passport.authenticate('google', { session: false }),
    async (req, res) => {
      try {
        const user = req.user as UserModel;

        const token = jwt.sign(
          {
            userId: user.user_id, 
            role: user.role, 
            firstName: user.firstName, 
            lastName: user.lastName, 
            email: user.email, 
            profile_picture: user.profile_picture
          },
          process.env.JWT_SECRET as string,
          { expiresIn: '1h' }
        );

        res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
      } catch (error) {
        console.error('Auth callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login/?error=Authentication failed`);
      }
    }
  );

export default router;
