import { Router } from 'express';
import UserController from '../controller/UserController';

const router = Router();

router.post('/register', UserController.registerUser);

router.post('/login', UserController.login);

router.delete('/all-users', UserController.deleteAllUsers);

router.get('/all-users', UserController.getAllUsers);

router.put('/profile/:id', UserController.updateProfile);
router.get('/profile/:id', UserController.getProfileById);


export default router;