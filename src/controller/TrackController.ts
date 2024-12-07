// @ts-nocheck
import { Request, Response } from "express";
import TrackModel from "../database/models/TrackModel";
import AlbumModel from "../database/models/AlbumModel";
import dbConnection from "../database";
import { UploadToCloud } from "../helpers/cloud";
import { body, validationResult,param } from "express-validator";
import UserModel from "../database/models/UserModel";

const trackRepository = dbConnection.getRepository(TrackModel);
const albumRepository = dbConnection.getRepository(AlbumModel);
const userRepository = dbConnection.getRepository(UserModel);

interface UploadOptions {
  allowedTypes?: string[];
  maxFiles?: number;
  maxFileSize?: number;
}

class TrackController {

  static createTrack = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Request Body:", req.body);
  
      await body("album_id")
        .exists().withMessage("album_id is required")
        .isInt({ min: 1 }).withMessage("album_id must be a positive integer")
        .toInt() 
        .run(req);
      
      await body("artist_id")
        .exists().withMessage("artist_id is required")
        .isInt({ min: 1 }).withMessage("artist_id must be a positive integer")
        .toInt()
        .run(req);
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Validation Errors:", errors.array());
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const album_id = req.body.album_id;
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
  
      let tracks: any[] = [];
      try {
        tracks = Array.isArray(req.body.tracks) 
          ? req.body.tracks 
          : (typeof req.body.tracks === 'string' 
              ? JSON.parse(req.body.tracks) 
              : [req.body.tracks]);
      } catch (parseError) {
        res.status(400).json({
          message: "Invalid tracks format",
          error: parseError.message,
        });
        return;
      }
  
      if (!tracks || tracks.length === 0) {
        res.status(400).json({ message: "No tracks provided" });
        return;
      }
  
      const album = await albumRepository.findOne({ where: { id: album_id } });
      if (!album) {
        res.status(400).json({
          success: false,
          message: "Invalid album_id. Album does not exist.",
        });
        return;
      }
  
      const trackValidationErrors: { field: string; message: string }[] = [];
      tracks.forEach((track: any, index: number) => {
        const requiredFields = [
          { field: 'title', message: 'Title is required for each track' },
          { field: 'genre', message: 'Genre is required for each track' },
        ];
        requiredFields.forEach(({ field, message }) => {
          if (!track[field] || track[field].trim() === '') {
            trackValidationErrors.push({
              field: `tracks[${index}].${field}`,
              message,
            });
          }
        });
      });
  
      if (trackValidationErrors.length > 0) {
        console.log("Track Metadata Errors:", trackValidationErrors);
        res.status(400).json({ errors: trackValidationErrors });
        return;
      }
  
      const createdTracks = [];
      for (const trackMetadata of tracks) {
        const track = trackRepository.create({
          title: trackMetadata.title.trim(),
          artist: artistWithoutPassword.firstName,
          genre: trackMetadata.genre.trim(),
          description: (trackMetadata.description || "").trim(),
          release_date: trackMetadata.release_date
            ? new Date(trackMetadata.release_date)
            : new Date(),
          media_url: trackMetadata.file || '', 
          album,
          metadata: {
            file: {
              url: trackMetadata.file || '',
              originalName: trackMetadata.title, 
              mimetype: trackMetadata.mimetype || '',
              size: trackMetadata.fileSize || 0, 
            },
            artistName: artistWithoutPassword.firstName,
          },
        });
        
        const savedTrack = await trackRepository.save(track);
        createdTracks.push(savedTrack);
      }
  
      res.status(201).json({
        success: true,
        message: "Tracks created successfully",
        data: createdTracks,
        artist: artistWithoutPassword,
      });
    } catch (error) {
      console.error("Error in createTrack:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while creating tracks",
        error: error.message || 'Unknown error',
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

  static updateTrack = async (req: Request, res: Response): Promise<void> => {
    try {
      await param("id").isInt().withMessage("Invalid track ID").toInt().run(req);
  
      await body("title").optional().isString().withMessage("Title must be a string").run(req);
      await body("genre").optional().isString().withMessage("Genre must be a string").run(req);
      await body("description").optional().isString().withMessage("Description must be a string").run(req);
      await body("release_date").optional().isISO8601().toDate().withMessage("Invalid release date").run(req);
      await body("media_url").optional().isURL().withMessage("Invalid media URL").run(req);
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
      }
  
      const { id } = req.params;
      const { title, genre, description, release_date, media_url } = req.body;
  
      const track = await trackRepository.findOne({ where: { id: Number(id) } });
  
      if (!track) {
        res.status(404).json({
          success: false,
          message: "Track not found",
        });
        return;
      }
  
      // Update track fields if provided
      if (title) track.title = title.trim();
      if (genre) track.genre = genre.trim();
      if (description) track.description = description.trim();
      if (release_date) track.release_date = new Date(release_date);
      if (media_url) track.media_url = media_url.trim();
  
      // Save updated track
      const updatedTrack = await trackRepository.save(track);
  
      res.status(200).json({
        success: true,
        message: "Track updated successfully",
        data: updatedTrack,
      });
    } catch (error: any) {
      console.error("Error in updateTrack:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating the track",
        error: error.message || "Unknown error",
      });
    }
  };
  

static getAllArtistTracks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { artist_id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const artist = await userRepository.findOne({ 
      where: { user_id: parseInt(artist_id, 10) } 
    });

    if (!artist) {
      res.status(404).json({
        success: false,
        message: "Artist not found"
      });
      return;
    }

    const [tracks, total] = await trackRepository.findAndCount({
      where: { artist: artist.firstName },
      relations: ["album"],
      skip,
      take: limit,
      order: { release_date: "DESC" }
    });

    if (!tracks.length) {
      res.status(404).json({
        success: false,
        message: "No tracks found for this artist"
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: tracks,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error in getAllArtistTracks:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching artist tracks",
      error: error.message || 'Unknown error'
    });
  }
};


static getTrackById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { track_id } = req.params;
    
    const track = await trackRepository.findOne({
      where: { id: parseInt(track_id, 10) },
      relations: ["album"] 
    });

    if (!track) {
      res.status(404).json({
        success: false,
        message: "Track not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: track
    });
  } catch (error) {
    console.error("Error in getTrackById:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the track",
      error: error.message || 'Unknown error'
    });
  }
};


static deleteTrackById: ExpressHandler = async (req, res) => {
  await param('id').isInt().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      data: errors.array()
    });
    return;
  }

  const { id } = req.params;

  try {
    const result = await trackRepository.delete(id);
    if (result.affected === 0) {
      res.status(404).json({
        success: false,
        message: 'Track not found',
        data: null
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Track deleted successfully',
      data: { deletedCount: result.affected }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the track",
      error: error.message || 'Unknown error'
    });
  }
};
}


export default TrackController;