/**
 * @swagger
 * /api/permissions/create-permission:
 *   post:
 *     tags:
 *       - Permissions
 *     summary: Create a new permission
 *     description: This endpoint creates a new permission with the specified name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Read"
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Permission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       400:
 *         description: Failed to create permission
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/permissions/all-permissions:
 *   get:
 *     tags:
 *       - Permissions
 *     summary: Retrieve all permissions
 *     description: Fetches a list of all permissions available in the system.
 *     responses:
 *       200:
 *         description: A list of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 *       404:
 *         description: No permissions found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/permissions/permission/{id}:
 *   get:
 *     tags:
 *       - Permissions
 *     summary: Get a specific permission by ID
 *     description: Retrieves a permission based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID of the permission to retrieve
 *     responses:
 *       200:
 *         description: Permission details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/permissions/delete-permission/{id}:
 *   delete:
 *     tags:
 *       - Permissions
 *     summary: Delete a specific permission by ID
 *     description: Deletes a permission based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID of the permission to delete
 *     responses:
 *       204:
 *         description: Permission deleted successfully
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/permissions/update-permission/{id}:
 *   patch:
 *     tags:
 *       - Permissions
 *     summary: Update a specific permission by ID
 *     description: Updates the name of a permission based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID of the permission to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Write"
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Internal Server Error
 */
