import { Request, Response } from "express";
import TrackModel from "../database/models/TrackModel";
import dbConnection from "../database";
import { UploadToCloud } from "../helpers/cloud";
import { body, validationResult } from "express-validator";
import AlbumModel from "../database/models/AlbumModel";
const trackRepository = dbConnection.getRepository(TrackModel);
class TrackController {
  static createTrack = async (req: Request, res: Response): Promise<void> => {
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
      const album = await dbConnection.getRepository(AlbumModel).findOne({
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
    } catch (error:any) {
      res.status(500).json({
        success: false,
        message: error.message || "Error creating track",
      });
    }
  };
}

export default TrackController;
