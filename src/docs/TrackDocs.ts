/**
 * @swagger
 * tags:
 *   name: Track
 *   description: API for managing tracks
 */

/**
 * @swagger
 * /tracks:
 *   post:
 *     summary: Create a new track
 *     tags: [Track]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the track.
 *                 example: "Song of Nature"
 *               album_id:
 *                 type: integer
 *                 description: ID of the album.
 *                 example: 1
 *               artist:
 *                 type: string
 *                 description: Artist of the track.
 *                 example: "John Doe"
 *               genre:
 *                 type: string
 *                 description: Genre of the track.
 *                 example: "Classical"
 *               description:
 *                 type: string
 *                 description: Description of the track.
 *                 example: "A soothing classical melody."
 *               trackFile:
 *                 type: string
 *                 format: binary
 *                 description: The track file to be uploaded.
 *     responses:
 *       201:
 *         description: Track created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Track'
 *       400:
 *         description: Validation error or missing file
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /tracks/upload:
 *   post:
 *     summary: Upload multiple media files
 *     tags: [Track]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the track(s).
 *               album_id:
 *                 type: integer
 *                 description: ID of the album.
 *               artist:
 *                 type: string
 *               genre:
 *                 type: string
 *               description:
 *                 type: string
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: List of media files to upload.
 *     responses:
 *       201:
 *         description: Tracks created successfully
 *       400:
 *         description: Validation error or missing files
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /tracks/replace:
 *   post:
 *     summary: Replace media file of an existing track
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
 *                 description: ID of the track.
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: New media file.
 *     responses:
 *       200:
 *         description: Track media replaced successfully
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
 *     responses:
 *       200:
 *         description: Track deleted successfully
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
 *         title:
 *           type: string
 *         artist:
 *           type: string
 *         genre:
 *           type: string
 *         description:
 *           type: string
 *         media_url:
 *           type: string
 *         album:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 */
