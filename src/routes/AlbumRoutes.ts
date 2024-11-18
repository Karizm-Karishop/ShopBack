
import { Router } from 'express';
import AlbumController from '../controller/AlbumController';

const router = Router();

router.post('/albums', AlbumController.createAlbum);
router.put('/albums/:id', AlbumController.updateAlbum);
router.get('/albums', AlbumController.getAllAlbums);
router.delete('/delete/albums', AlbumController.deleteAllAlbums);
router.get('/albums/:id', AlbumController.getAlbumById);

export default router;