
import { Router } from 'express';
import TrackController from '../controller/TrackController';
import upload from '../helpers/multer';

const router = Router();
router.post(
  "/tracks/upload",
  TrackController.createTrack
);
router.put(
  "/tracks/:id",
  TrackController.updateTrack
);

router.post(
  '/tracks/upload-media',
  upload.array('files'), 
  TrackController.uploadMediaFiles
);

router.post(
  '/tracks/replace',
  upload.single('file'), 
  TrackController.replaceTrackMedia
);

router.get(
  "/tracks/:artist_id", 
  TrackController.getAllArtistTracks
);

router.get(
  "/tracks/single/:track_id", 
  TrackController.getTrackById
);
router.delete(
  "/tracks/single/:id", 
  TrackController.deleteTrackById
);

router.delete('/tracks', TrackController.deleteTrack);

export default router;

