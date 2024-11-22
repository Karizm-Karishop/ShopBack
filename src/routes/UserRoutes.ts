import { Router } from 'express';
import UserController from '../controller/UserController';
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
router.get('/auth/google', UserController.googleAuth);          
router.get('/auth/google/callback', UserController.googleAuthCallback); 
router.delete('/all-users', UserController.deleteAllUsers);    
router.get('/all-users', UserController.getAllUsers);   
router.post('/activate', UserController.activateAccount);    
router.post('/deactivate', UserController.deactivateAccount);          

export default router;
