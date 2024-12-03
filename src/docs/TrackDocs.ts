/**
 * @swagger
 * tags:
 *   name: Track
 *   description: API for managing tracks
 */

/**
 * @swagger
 * /api/tracks/upload:
 *   post:
 *     summary: Upload multiple music tracks with metadata and media files
 *     tags: [Track]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               album_id:
 *                 type: integer
 *                 description: ID of the album to associate the tracks with.
 *                 example: 1
 *               tracks:
 *                 type: array
 *                 description: Array of tracks with metadata and associated media files.
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       description: Title of the track.
 *                       example: "Song Title"
 *                     artist:
 *                       type: string
 *                       description: Name of the artist(s).
 *                       example: "Artist Name"
 *                     genre:
 *                       type: string
 *                       description: Genre of the track.
 *                       example: "Pop"
 *                     release_date:
 *                       type: string
 *                       format: date
 *                       description: Release date of the track.
 *                       example: "2024-01-01"
 *                     file:
 *                       type: string
 *                       format: binary
 *                       description: Media file for the track.
 *     responses:
 *       201:
 *         description: Tracks uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tracks uploaded successfully."
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Track'
 *       400:
 *         description: Validation error or missing data
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /tracks/replace:
 *   post:
 *     summary: Replace a media file for an existing track
 *     tags: [Track]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               track_id:
 *                 type: integer
 *                 description: ID of the track to replace the file for.
 *                 example: 123
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: New media file.
 *     responses:
 *       200:
 *         description: Track media replaced successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Track media replaced successfully."
 *       400:
 *         description: Validation error or missing file
 *       404:
 *         description: Track not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /tracks:
 *   delete:
 *     summary: Delete a track
 *     tags: [Track]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               track_id:
 *                 type: integer
 *                 description: ID of the track to delete.
 *                 example: 123
 *     responses:
 *       200:
 *         description: Track deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Track deleted successfully."
 *       404:
 *         description: Track not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Track:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Song Title"
 *         artist:
 *           type: string
 *           example: "Artist Name"
 *         genre:
 *           type: string
 *           example: "Pop"
 *         release_date:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         description:
 *           type: string
 *           example: "A beautiful track."
 *         media_url:
 *           type: string
 *           example: "https://example.com/media/song.mp3"
 *         album:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             name:
 *               type: string
 *               example: "Album Name"
 */
