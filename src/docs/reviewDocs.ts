/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         review_id:
 *           type: integer
 *           description: The unique ID of the review
 *         product_id:
 *           type: integer
 *           description: The ID of the product being reviewed
 *         user_id:
 *           type: integer
 *           description: The ID of the user who created the review
 *         rating:
 *           type: number
 *           description: The rating given to the product
 *         comment:
 *           type: string
 *           description: The review comment
 *         review_date:
 *           type: string
 *           format: date-time
 *           description: The date when the review was created
 *       required:
 *         - product_id
 *         - user_id
 *         - rating
 *         - comment
 */

/**
 * @swagger
 * /api/reviews/create:
 *   post:
 *     summary: Create a new review
 *     tags: [Review]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: The review was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reviews/get-all:
 *   get:
 *     summary: Retrieve all reviews
 *     tags: [Review]
 *     responses:
 *       200:
 *         description: A list of all reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: No reviews found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reviews/product/{product_id}:
 *   get:
 *     summary: Get all reviews for a specific product
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: product_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: List of reviews for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: No reviews found for this product
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reviews/delete/{review_id}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: review_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the review to delete
 *     responses:
 *       204:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
