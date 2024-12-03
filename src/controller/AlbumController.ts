// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import AlbumModel from '../database/models/AlbumModel';
import dbConnection from '../database';
import { UploadToCloud } from '../helpers/cloud';
import UserModel from '../database/models/UserModel';
const albumRepository = dbConnection.getRepository(AlbumModel);
const userRepository = dbConnection.getRepository(UserModel);

type ExpressHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
class AlbumController {

  static createAlbum: ExpressHandler = async (req, res) => {
    await body('album_title').trim().notEmpty().run(req);
    await body('description').optional().trim().run(req);
    await body("artist_id")
    .exists().withMessage("artist_id is required")
    .isInt({ min: 1 }).withMessage("artist_id must be a positive integer")
    .toInt()
    .run(req);
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: 'Validation failed', data: errors.array() });
      return;
    }
    const artist_id = req.body.artist_id;
    const artist = await userRepository.findOne({
      where: { user_id: artist_id },
    });
    
    if (!artist) {
      res.status(404).json({
        success: false,
        error: "Artist not found",
      });
      return;
    }

    const { password, ...artistWithoutPassword } = artist;

    const { album_title, description } = req.body;
    const coverImageFile = req.file;

    try {
      let coverImageUrl = null;
      if (coverImageFile) {
        const uploadResult = await UploadToCloud(coverImageFile, res);
        coverImageUrl = (uploadResult as any).secure_url;
      }

      const album = albumRepository.create({ 
        album_title, 
        description, 
        cover_image: coverImageUrl,
        artist: artist 
      });
      await albumRepository.save(album);

      const { password: pw, ...artistWithoutPw } = artist;

      res.status(201).json({ 
        success: true, 
        message: 'Album created successfully', 
        data: {
          ...album,
          artist: artistWithoutPw
        } 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }; 

  static getAllAlbums: ExpressHandler = async (req, res) => {
    try {
      const albums = await albumRepository.find();
      res.status(200).json({ success: true, data: albums });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  static getAllAlbumsArtistId: ExpressHandler = async (req, res) => {
    const { artistId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const artistIdNum = parseInt(artistId, 10);

    try {
      const artist = await userRepository.findOne({
        where: { user_id: artistIdNum }
      });

      if (!artist) {
        return res.status(404).json({
          success: false,
          error: "Artist not found",
        });
      }

      const [albums, total] = await albumRepository.findAndCount({
        where: { artist: { user_id: artistIdNum } },
        relations: ["artist"],
        skip,
        take: limit,
        order: { created_at: "DESC" },
      });

      if (!albums.length) {
        return res.status(404).json({
          success: false,
          error: "No albums found for this artist",
        });
      }

      const sanitizedAlbums = albums.map(album => {
        const { password, ...artistWithoutPassword } = album.artist;
        return {
          ...album,
          artist: artistWithoutPassword
        };
      });

      res.status(200).json({
        success: true,
        data: {
          albums: sanitizedAlbums,
          pagination: {
            current_page: page,
            total_pages: Math.ceil(total / limit),
            total_items: total,
            items_per_page: limit,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };



  static getAlbumById: ExpressHandler = async (req, res) => {
    await param('id').isInt().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: 'Validation failed', data: errors.array() });
      return;
    }

    const { id } = req.params;

    try {
      const album = await albumRepository.findOne({ where: { id: parseInt(id) } });
      if (!album) {
        res.status(404).json({ success: false, message: 'Album not found' });
        return;
      }

      res.status(200).json({ success: true, data: album });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  static updateAlbum: ExpressHandler = async (req, res) => {
    await param('id').isInt().run(req);
    await body('album_title').optional().trim().notEmpty().run(req);
    await body('description').optional().trim().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: 'Validation failed', data: errors.array() });
      return;
    }

    const { id } = req.params;
    const { album_title, description } = req.body;
    const coverImageFile = req.file;

    try {
      const album = await albumRepository.findOne({ where: { id: parseInt(id) } });
      if (!album) {
        res.status(404).json({ success: false, message: 'Album not found' });
        return;
      }

      let coverImageUrl = album.cover_image;
      if (coverImageFile) {
        const uploadResult = await UploadToCloud(coverImageFile, res);
        coverImageUrl = (uploadResult as any).secure_url;
      }

      album.album_title = album_title || album.album_title;
      album.description = description || album.description;
      album.cover_image = coverImageUrl;

      await albumRepository.save(album);

      res.status(200).json({ success: true, message: 'Album updated successfully', data: album });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  static deleteAlbum: ExpressHandler = async (req, res) => {
    await param('id').isInt().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: 'Validation failed', data: errors.array() });
      return;
    }

    const { id } = req.params;

    try {
      const result = await albumRepository.delete(id);
      if (result.affected === 0) {
        res.status(404).json({ success: false, message: 'Album not found' });
        return;
      }

      res.status(200).json({ success: true, message: 'Album deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  static deleteAllAlbums: ExpressHandler = async (_req, res) => {
    try {
      await albumRepository.clear();
      res.status(200).json({ success: true, message: 'All albums deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default AlbumController;
