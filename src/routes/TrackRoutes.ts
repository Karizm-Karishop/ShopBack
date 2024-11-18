import { Router } from 'express';
import TrackController from '../controller/TrackController';
import upload from '../helpers/multer';

const router = Router();

router.post('/tracks', upload.single('track'), TrackController.createTrack);

export default router;
