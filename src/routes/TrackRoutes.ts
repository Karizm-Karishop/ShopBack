
import { Router } from 'express';
import TrackController from '../controller/TrackController';
import upload from '../helpers/multer';

const router = Router();
router.post(
  '/tracks',
  upload.single('trackFile'), 
  TrackController.createSingleTrack
);

router.post(
  '/tracks/upload',
  upload.array('files'), 
  TrackController.uploadMediaFiles
);

router.post(
  '/tracks/replace',
  upload.single('file'), 
  TrackController.replaceTrackMedia
);

router.delete('/tracks', TrackController.deleteTrack);

export default router;

