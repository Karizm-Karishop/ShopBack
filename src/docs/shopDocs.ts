
/**
 * @swagger
 * /api/shops/:
 *   post:
 *     summary: Create a shop
 *     tags: [Shop]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               shop_name:
 *                 type: string
 *               icon:
 *                 type: string
 *                 format: binary
 *                 description: The icon of the shop, uploaded as an image from the local machine
 *               description:
 *                 type: string
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               artist_id:
 *                 type: integer
 *                 example: 123
 *     responses:
 *       '201':
 *         description: Shop created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shop_name:
 *                   type: string
 *                   example: "Artistic Creations"
 *                 icon_url:
 *                   type: string
 *                   example: "https://example.com/uploads/shop-icon.png"
 *                 description:
 *                   type: string
 *                   example: "A place for creative artists"
 *                 category:
 *                   type: object
 *                   properties:
 *                     category_id:
 *                       type: integer
 *                       example: 1
 *                     category_name:
 *                       type: string
 *                       example: "Art"
 *       '400':
 *         description: Invalid input or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input"
 *       '404':
 *         description: Shop not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Shop not found"
 */

/**
 * @swagger
 * /api/shops/{id}:
 *   put:
 *     summary: Update an existing shop
 *     tags: [Shop]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique ID of the shop.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               shop_name:
 *                 type: string
 *               icon:
 *                 type: string
 *                 format: binary
 *                 description: The updated icon of the shop, uploaded as an image from the local machine
 *               description:
 *                 type: string
 *               category_id:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Shop updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shop_name:
 *                   type: string
 *                   example: "Artistic Creations"
 *                 icon:
 *                   type: string
 *                   example: "shop-icon.png"
 *                 description:
 *                   type: string
 *                   example: "An updated place for creative artists"
 *       '400':
 *         description: Invalid input or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input"
 *       '404':
 *         description: Shop not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Shop not found"
 */

/**
 * @swagger
 * /api/shops/{id}:
 *   get:
 *     summary: Retrieve a shop by its ID
 *     tags: [Shop]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique ID of the shop.
 *     responses:
 *       '200':
 *         description: The shop details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shop_name:
 *                   type: string
 *                   example: "Artistic Creations"
 *                 location:
 *                   type: string
 *                   example: "Downtown"
 *       '404':
 *         description: Shop not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Shop not found"
 */

/**
 * @swagger
 * /api/shops:
 *   get:
 *     summary: Retrieve a list of shops with pagination
 *     tags: [Shop]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: The number of items per page.
 *     responses:
 *       '200':
 *         description: A list of shops with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       shop_name:
 *                         type: string
 *                         example: "Artistic Creations"
 *                       location:
 *                         type: string
 *                         example: "Downtown"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     current_page:
 *                       type: integer
 *                       example: 1
 *                     total_pages:
 *                       type: integer
 *                       example: 10
 *                     total_items:
 *                       type: integer
 *                       example: 100
 *                     items_per_page:
 *                       type: integer
 *                       example: 10
 */

/**
 * @swagger
 * /api/shops/{id}:
 *   delete:
 *     summary: Delete a shop by its ID
 *     tags: [Shop]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique ID of the shop.
 *     responses:
 *       '200':
 *         description: Shop deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Shop deleted successfully"
 *       '404':
 *         description: Shop not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Shop not found"
 */

/**
 * @swagger
 * /api/shops:
 *   delete:
 *     summary: Delete all shops
 *     tags: [Shop]
 *     responses:
 *       '200':
 *         description: All shops deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedCount:
 *                   type: integer
 *                   example: 50
 */
/**
 * @swagger
 * /api/shops/artist/{artist_id}:
 *   get:
 *     summary: Retrieve all shops associated with a specific artist
 *     tags: [Shop]
 *     parameters:
 *       - in: path
 *         name: artist_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique ID of the artist.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: The number of items per page.
 *     responses:
 *       '200':
 *         description: A list of shops associated with the artist.
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
 *                     shops:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           shop_name:
 *                             type: string
 *                             example: "Artistic Creations"
 *                           category:
 *                             type: object
 *                             properties:
 *                               category_name:
 *                                 type: string
 *                                 example: "Art"
 *                           artist:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: "John Doe"
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         current_page:
 *                           type: integer
 *                           example: 1
 *                         total_pages:
 *                           type: integer
 *                           example: 5
 *                         total_items:
 *                           type: integer
 *                           example: 50
 *                         items_per_page:
 *                           type: integer
 *                           example: 10
 *       '404':
 *         description: No shops found for the specified artist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "No shops found for this artist"
 */

