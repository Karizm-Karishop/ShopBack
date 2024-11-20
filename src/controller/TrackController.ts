import { Request, Response } from "express";
import TrackModel from "../database/models/TrackModel";
import AlbumModel from "../database/models/AlbumModel";
import dbConnection from "../database";
import { UploadToCloud } from "../helpers/cloud";
import { body, validationResult } from "express-validator";

const trackRepository = dbConnection.getRepository(TrackModel);
const albumRepository = dbConnection.getRepository(AlbumModel);
interface UploadOptions {
  allowedTypes?: string[];
  maxFiles?: number;
  maxFileSize?: number;
}
class TrackController {

  static createSingleTrack = async (req: Request, res: Response): Promise<void> => {
    await body("title").notEmpty().run(req);
    await body("album_id").isInt().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { title, album_id, artist, genre, description } = req.body;
    const trackFile = req.file;

    if (!trackFile) {
      res.status(400).json({ message: "No track file uploaded" });
      return;
    }

    try {
      const album = await albumRepository.findOne({
        where: { id: album_id },
      });

      if (!album) {
        res.status(400).json({
          success: false,
          message: "Invalid album_id. Album does not exist.",
        });
        return;
      }

      const uploadedTrack = await UploadToCloud(trackFile, res);
      const mediaUrl = (uploadedTrack as any).secure_url;

      const track = trackRepository.create({
        title,
        artist,
        genre,
        description,
        media_url: mediaUrl,
        album, 
      });

      await trackRepository.save(track);

      res.status(201).json({
        success: true,
        message: "Track created successfully",
        data: track,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Error creating track",
      });
    }
  };


  private static async uploadFiles(
    files: Express.Multer.File[], 
    options: UploadOptions = {}
  ): Promise<string[]> {
    const {
      allowedTypes = ['audio', 'video', 'image'],
      maxFiles = 10,
      maxFileSize = 50 * 1024 * 1024
    } = options;

    if (files.length > maxFiles) {
      throw new Error(`Maximum ${maxFiles} files allowed`);
    }

    const uploadPromises = files.map(async (file) => {
      if (file.size > maxFileSize) {
        throw new Error(`File ${file.originalname} exceeds maximum size of ${maxFileSize / (1024 * 1024)}MB`);
      }

      const fileType = file.mimetype.split('/')[0];
      if (!allowedTypes.includes(fileType)) {
        throw new Error(`File type ${fileType} is not allowed`);
      }

      const uploadResult = await UploadToCloud(file, {} as Response);
      return (uploadResult as any).secure_url;
    });

    return Promise.all(uploadPromises);
  }

  static uploadMediaFiles = async (req: Request, res: Response): Promise<void> => {
    await body("album_id").isInt().run(req);
    await body("title").notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array(),
      });
      return;
    }

    const { 
      album_id, 
      title, 
      artist, 
      genre, 
      description,
      allowedTypes,
      maxFiles,
      maxFileSize
    } = req.body;

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
      return;
    }

    try {
      const album = await albumRepository.findOne({
        where: { id: album_id },
      });

      if (!album) {
        res.status(400).json({
          success: false,
          message: "Invalid album_id. Album does not exist.",
        });
        return;
      }

      const uploadOptions: UploadOptions = {
        allowedTypes: allowedTypes ? allowedTypes.split(',') : undefined,
        maxFiles: maxFiles ? parseInt(maxFiles) : undefined,
        maxFileSize: maxFileSize ? parseInt(maxFileSize) : undefined
      };

      const mediaUrls = await TrackController.uploadFiles(files, uploadOptions);

      const createdTracks = await Promise.all(
        mediaUrls.map(async (mediaUrl, index) => {
          const trackTitle = files.length > 1 
            ? `${title} (${index + 1})` 
            : title;

          const track = trackRepository.create({
            title: trackTitle,
            artist,
            genre,
            description,
            media_url: mediaUrl,
            album,
          });

          return trackRepository.save(track);
        })
      );

      res.status(201).json({
        success: true,
        message: `${createdTracks.length} track(s) created successfully`,
        data: createdTracks,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Error uploading files",
      });
    }
  };

  static replaceTrackMedia = async (req: Request, res: Response): Promise<void> => {
    await body("track_id").isInt().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array(),
      });
      return;
    }

    const { track_id } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
      return;
    }

    try {
      const track = await trackRepository.findOne({
        where: { id: track_id },
        relations: ['album']
      });

      if (!track) {
        res.status(404).json({
          success: false,
          message: "Track not found",
        });
        return;
      }

      const uploadResult = await UploadToCloud(file, res);
      const newMediaUrl = (uploadResult as any).secure_url;

      track.media_url = newMediaUrl;
      await trackRepository.save(track);

      res.status(200).json({
        success: true,
        message: "Track media replaced successfully",
        data: track,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Error replacing track media",
      });
    }
  };

  static deleteTrack = async (req: Request, res: Response): Promise<void> => {
    await body("track_id").isInt().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array(),
      });
      return;
    }

    const { track_id } = req.body;

    try {
      const result = await trackRepository.delete(track_id);

      if (result.affected === 0) {
        res.status(404).json({
          success: false,
          message: "Track not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Track deleted successfully",
        data: { deletedCount: result.affected },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Error deleting track",
      });
    }
  };
}

export default TrackController;