/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product
 *               description:
 *                 type: string
 *                 description: Description of the product
 *               sales_price:
 *                 type: number
 *                 format: float
 *                 description: Sales price of the product
 *               regular_price:
 *                 type: number
 *                 format: float
 *                 description: Regular price of the product
 *               quantity:
 *                 type: integer
 *                 description: Quantity available
 *               category_id:
 *                 type: integer
 *                 description: ID of the category
 *               shop_id:
 *                 type: integer
 *                 description: ID of the shop
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags for the product
 *               product_image:
 *                 type: string
 *                 format: binary
 *                 description: Single image of the product
 *               gallery:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of images for the product gallery
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               sales_price:
 *                 type: number
 *                 format: float
 *               regular_price:
 *                 type: number
 *                 format: float
 *               quantity:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               shop_id:
 *                 type: integer
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               product_image:
 *                 type: string
 *                 format: binary
 *               gallery:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */