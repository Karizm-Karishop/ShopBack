/**
 * @swagger
 * /api/tracks:
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
 *                 description: The title of the track.
 *                 example: "Song of Nature"
 *               album_id:
 *                 type: integer
 *                 description: ID of the associated album.
 *                 example: 1
 *               artist:
 *                 type: string
 *                 description: The artist of the track.
 *                 example: "John Doe"
 *               genre:
 *                 type: string
 *                 description: The genre of the track.
 *                 example: "Classical"
 *               description:
 *                 type: string
 *                 description: A brief description of the track.
 *                 example: "A soothing classical melody."
 *               track:
 *                 type: string
 *                 format: binary
 *                 description: The track file to be uploaded.
 *     responses:
 *       '201':
 *         description: Track created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Track created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "Song of Nature"
 *                     artist:
 *                       type: string
 *                       example: "John Doe"
 *                     genre:
 *                       type: string
 *                       example: "Classical"
 *                     description:
 *                       type: string
 *                       example: "A soothing classical melody."
 *                     media_url:
 *                       type: string
 *                       example: "https://cloud.example.com/track-file.mp3"
 *                     album:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *       '400':
 *         description: Validation error or missing file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: "Title is required"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error creating track"
 */
