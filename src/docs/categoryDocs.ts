/**
 * @swagger
 * tags:
 *   - name: Category
 *     description: Category management
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category_name:
 *                   type: string
 *                 description:
 *                   type: string
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation error"
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Retrieve a list of categories with pagination
 *     tags: [Category]
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
 *         description: A list of categories with pagination
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
 *                       category_name:
 *                         type: string
 *                       description:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     current_page:
 *                       type: integer
 *                     total_pages:
 *                       type: integer
 *                     total_items:
 *                       type: integer
 *                     items_per_page:
 *                       type: integer
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation error"
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category by its ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique ID of the category.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category_name:
 *                   type: string
 *                 description:
 *                   type: string
 *       '400':
 *         description: Validation error
 *       '404':
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Category not found"
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category by its ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique ID of the category.
 *     responses:
 *       '200':
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category deleted successfully"
 *                 deletedCount:
 *                   type: integer
 *       '404':
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Category not found"
 */


/**
 * @swagger
 * tags:
 *   - name: Shop
 *     description: Endpoints related to shop functionalities
 */

/**
 * @swagger
 * /api/shops:
 *   post:
 *     summary: Create a new shop
 *     tags: [Shop]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shop_name:
 *                 type: string
 *               location:
 *                 type: string
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
 *                 location:
 *                   type: string
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation error"
 */