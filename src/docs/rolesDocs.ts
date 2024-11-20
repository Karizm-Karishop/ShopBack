/**
 * @swagger
 * /api/roles/create-role:
 *   post:
 *     tags:
 *       - Roles
 *     summary: Create a new role
 *     description: This endpoint creates a new role with specified permissions and description.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Admin"
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Read", "Write"]
 *               description:
 *                 type: string
 *                 example: "Admin role with all permissions"
 *             required:
 *               - name
 *               - permissions
 *               - description
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Failed to create role
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/roles/all-roles:
 *   get:
 *     tags:
 *       - Roles
 *     summary: Retrieve all roles
 *     description: Fetches a list of all roles available in the system, including their permissions.
 *     responses:
 *       200:
 *         description: A list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       404:
 *         description: No roles found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/roles/role/{id}:
 *   get:
 *     tags:
 *       - Roles
 *     summary: Get a specific role by ID
 *     description: Retrieves details of a role based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID of the role to retrieve
 *     responses:
 *       200:
 *         description: Role details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/roles/update-role/{id}:
 *   patch:
 *     tags:
 *       - Roles
 *     summary: Update a specific role by ID
 *     description: Updates the name, permissions, and description of a role based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID of the role to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Manager"
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Read"]
 *               description:
 *                 type: string
 *                 example: "Manager role with read permissions only"
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/roles/delete-role/{id}:
 *   delete:
 *     tags:
 *       - Roles
 *     summary: Delete a specific role by ID
 *     description: Deletes a role based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID of the role to delete
 *     responses:
 *       204:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal Server Error
 */
