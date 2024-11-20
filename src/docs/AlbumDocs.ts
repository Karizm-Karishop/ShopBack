/**
 * @swagger
 * tags:
 *   name: Album
 *   description: Operations related to album management
 */

/**
 * @swagger
 * /api/albums:
 *   post:
 *     summary: Create a new album
 *     tags: [Album]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               album_title:
 *                 type: string
 *                 description: The title of the album.
 *                 example: "Best Hits 2024"
 *               description:
 *                 type: string
 *                 description: A brief description of the album.
 *                 example: "The greatest hits of the year."
 *               cover_image:
 *                 type: string
 *                 format: binary
 *                 description: The cover image for the album.
 *     responses:
 *       '201':
 *         description: Album created successfully
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
 *                   example: "Album created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     album_title:
 *                       type: string
 *                       example: "Best Hits 2024"
 *                     description:
 *                       type: string
 *                       example: "The greatest hits of the year."
 *                     cover_image:
 *                       type: string
 *                       example: "https://cloud.example.com/album-cover.jpg"
 *       '400':
 *         description: Validation error or missing data
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
 *                         example: "Album title is required."
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
 *                   example: "Error creating album"
 */

/**
 * @swagger
 * /api/albums:
 *   get:
 *     summary: Retrieve all albums
 *     tags: [Album]
 *     responses:
 *       '200':
 *         description: A list of albums
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       album_title:
 *                         type: string
 *                         example: "Best Hits 2024"
 *                       description:
 *                         type: string
 *                         example: "The greatest hits of the year."
 *                       cover_image:
 *                         type: string
 *                         example: "https://cloud.example.com/album-cover.jpg"
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
 *                   example: "Error fetching albums"
 */

/**
 * @swagger
 * /api/albums/{id}:
 *   get:
 *     summary: Retrieve a specific album by ID
 *     tags: [Album]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the album to retrieve
 *     responses:
 *       '200':
 *         description: A specific album
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     album_title:
 *                       type: string
 *                       example: "Best Hits 2024"
 *                     description:
 *                       type: string
 *                       example: "The greatest hits of the year."
 *                     cover_image:
 *                       type: string
 *                       example: "https://cloud.example.com/album-cover.jpg"
 *       '404':
 *         description: Album not found
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
 *                   example: "Album not found"
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
 *                   example: "Error fetching album"
 */

/**
 * @swagger
 * /api/albums/{id}:
 *   put:
 *     summary: Update a specific album
 *     tags: [Album]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the album to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               album_title:
 *                 type: string
 *                 description: The title of the album.
 *                 example: "Best Hits 2024"
 *               description:
 *                 type: string
 *                 description: A brief description of the album.
 *                 example: "The greatest hits of the year."
 *               cover_image:
 *                 type: string
 *                 format: binary
 *                 description: The cover image for the album.
 *     responses:
 *       '200':
 *         description: Album updated successfully
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
 *                   example: "Album updated successfully"
 *       '400':
 *         description: Validation error or missing data
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
 *                         example: "Album title is required."
 *       '404':
 *         description: Album not found
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
 *                   example: "Error updating album"
 */

/**
 * @swagger
 * /api/albums/{id}:
 *   delete:
 *     summary: Delete a specific album
 *     tags: [Album]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the album to delete
 *     responses:
 *       '200':
 *         description: Album deleted successfully
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
 *                   example: "Album deleted successfully"
 *       '404':
 *         description: Album not found
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
 *                   example: "Error deleting album"
 */

/**
 * @swagger
 * /api/albums:
 *   delete:
 *     summary: Delete all albums
 *     tags: [Album]
 *     responses:
 *       '200':
 *         description: All albums deleted successfully
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
 *                   example: "All albums deleted successfully"
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
 *                   example: "Error deleting albums"
 */
