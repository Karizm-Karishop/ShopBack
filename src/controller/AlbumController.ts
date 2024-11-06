import { body, validationResult } from 'express-validator';
import AlbumModel from '../database/models/AlbumModel';
import dbConnection from '../database';
import { Request, Response, NextFunction } from 'express';
import { UploadToCloud } from '../helpers/cloud';
import TrackModel from '../database/models/TrackModel';
const albumRepository = dbConnection.getRepository(AlbumModel);
const trackRepository = dbConnection.getRepository(TrackModel);

type ExpressHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
class AlbumController {
  static createAlbum: ExpressHandler = async (req, res) => {
    await body('album_title').trim().notEmpty().run(req);
    await body('description').optional().trim().run(req);
    await body('cover_image').optional().run(req);
    await body('media_type').isIn(['audio', 'video']).run(req);
    await body('is_multiple_upload').isBoolean().run(req);
    await body('tracks').isArray().run(req);
    await body('tracks.*.title').trim().notEmpty().run(req);
    await body('tracks.*.artist').optional().trim().run(req);
    await body('tracks.*.file').optional().run(req); 

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array(),
      });
      return;
    }

    const { album_title, description, media_type, is_multiple_upload, tracks } = req.body;

    try {
      let coverImageUrl = null;
      if (req.files && req.files['cover_image']) {
        const coverImageFile = req.files['cover_image'][0];
        const uploadResult = await UploadToCloud(coverImageFile, res);
        coverImageUrl = (uploadResult as any).secure_url;
      }

      const album = albumRepository.create({
        album_title,
        description,
        cover_image: coverImageUrl,
        media_type,
        is_multiple_upload,
      });

      album.tracks = await Promise.all(
        tracks.map(async (track: any) => {
          let trackFileUrl = null;
          if (track.file) {
            const uploadResult = await UploadToCloud(track.file, res);
            trackFileUrl = (uploadResult as any).secure_url;
          }

          return trackRepository.create({
            title: track.title,
            artist: track.artist,
            file: trackFileUrl,
          } as any);
        })
      );

      await albumRepository.save(album);

      res.status(201).json({
        success: true,
        message: 'Album created successfully',
        data: album,
      });
    } catch (error:any) {
      res.status(500).json({
        success: false,
        error: 'Server Error',
        message: error.message,
      });
    }
  };

  static updateAlbum: ExpressHandler = async (req, res) => {
    const albumId = parseInt(req.params.id, 10);
    if (isNaN(albumId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'Invalid album ID format',
      });
      return;
    }

    const { album_title, description, media_type, is_multiple_upload, tracks } = req.body;

    try {
      const album = await albumRepository.findOne({
        where: { id: albumId },
        relations: ['tracks'],
      });

      if (!album) {
        res.status(404).json({
          success: false,
          error: 'Not found',
          message: 'Album not found',
        });
        return;
      }

      if (req.files && req.files['cover_image']) {
        const coverImageFile = req.files['cover_image'][0];
        const uploadResult = await UploadToCloud(coverImageFile, res);
        album.cover_image = (uploadResult as any).secure_url;
      }

      album.album_title = album_title || album.album_title;
      album.description = description || album.description;
      album.media_type = media_type || album.media_type;
      album.is_multiple_upload = is_multiple_upload || album.is_multiple_upload;

      if (tracks) {
        album.tracks = await Promise.all(
          tracks.map(async (track: any) => {
            let trackFileUrl = null;
            if (track.file) {
              const uploadResult = await UploadToCloud(track.file, res);
              trackFileUrl = (uploadResult as any).secure_url;
            }
            return trackRepository.create({
              title: track.title,
              artist: track.artist,
              file: trackFileUrl,
            } as any);
          })
        );
      }

      await albumRepository.save(album);

      res.status(200).json({
        success: true,
        message: 'Album updated successfully',
        data: album,
      });
    } catch (error:any) {
      res.status(500).json({
        success: false,
        error: 'Server Error',
        message: error.message,
      });
    }
  };

  static getAllAlbums: ExpressHandler = async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [albums, total] = await albumRepository.findAndCount({
      skip,
      take: limit,
      order: { created_at: 'DESC' }
    });

    res.status(200).json({
      success: true,
      data: {
        albums,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: limit
        }
      }
    });
  };

  static deleteAllAlbums: ExpressHandler = async (_req, res) => {
    const deleteResult = await albumRepository.delete({});
    res.status(200).json({
      success: true,
      message: 'Albums deleted successfully',
      data: {
        deletedCount: deleteResult.affected
      }
    });
  };

  static getAlbumById: ExpressHandler = async (req, res) => {
    const albumId = parseInt(req.params.id, 10);
    
    if (isNaN(albumId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'Invalid album ID format'
      });
      return;
    }

    const album = await albumRepository.findOne({
      where: { id: albumId },
      relations: ['tracks']
    });

    if (!album) {
      res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'Album not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { album }
    });
  };
}

export default AlbumController;