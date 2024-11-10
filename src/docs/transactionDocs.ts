/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the transaction
 *         amount:
 *           type: number
 *           description: The transaction amount
 *         user_id:
 *           type: integer
 *           description: ID of the user associated with the transaction
 *         transaction_date:
 *           type: string
 *           format: date-time
 *           description: The date of the transaction
 *         status:
 *           type: string
 *           description: The status of the transaction
 *         type:
 *           type: string
 *           description: The type of the transaction
 *       required:
 *         - amount
 *         - user_id
 *         - status
 *         - type
 */

/**
 * @swagger
 * /api/transactions/create:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: The transaction was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Failed to create the transaction
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/transactions/get-all:
 *   get:
 *     summary: Retrieve all transactions
 *     tags: [Transaction]
 *     responses:
 *       200:
 *         description: A list of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: No transactions found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/transactions/get-transaction/{id}:
 *   get:
 *     summary: Retrieve a transaction by ID
 *     tags: [Transaction]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The transaction ID
 *     responses:
 *       200:
 *         description: The transaction details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 *       400:
 *         description: Invalid transaction ID
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/transactions/update/{id}:
 *   patch:
 *     summary: Update a transaction by ID
 *     tags: [Transaction]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       200:
 *         description: The updated transaction details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 *       400:
 *         description: Invalid transaction ID
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/transactions/delete/{id}:
 *   delete:
 *     summary: Delete a transaction by ID
 *     tags: [Transaction]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The transaction ID
 *     responses:
 *       204:
 *         description: Transaction successfully deleted
 *       404:
 *         description: Transaction not found
 *       400:
 *         description: Invalid transaction ID
 *       500:
 *         description: Internal server error
 */
