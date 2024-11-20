import { Router } from 'express';
import AlbumController from '../controller/AlbumController';
import upload from '../helpers/multer';
const router = Router();
router.post('/albums',upload.single('cover_image'), AlbumController.createAlbum);
router.get('/albums', AlbumController.getAllAlbums);
router.get('/albums/:id', AlbumController.getAlbumById);
router.put('/albums/:id', upload.single('cover_image'),AlbumController.updateAlbum);
router.delete('/albums/:id', AlbumController.deleteAlbum);
router.delete('/albums', AlbumController.deleteAllAlbums);

export default router;
