/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         user_id:
 *           type: integer
 *           description: The unique identifier for a user.
 *         name:
 *           type: string
 *           description: The full name of the user.
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user.
 *         password:
 *           type: string
 *           description: The user's account password.
 *         role:
 *           type: string
 *           description: The role of the user (e.g., CLIENT, ADMIN).
 *         phone_number:
 *           type: string
 *           description: The user's phone number.
 *         address:
 *           type: string
 *           description: The user's address.
 *         profile_picture:
 *           type: string
 *           description: The URL of the user's profile picture.
 *         gender:
 *           type: string
 *           description: The user's gender.
 * 
 *   responses:
 *     UserNotFound:
 *       description: User not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "User not found"
 *     ValidationError:
 *       description: Validation error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               errors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     msg:
 *                       type: string
 *                     param:
 *                       type: string
 *     UserDeleted:
 *       description: User(s) deleted successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "User(s) deleted successfully"
 *     UserRegistered:
 *       description: User registered successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "User registered successfully"
 *               token:
 *                 type: string
 *     UserProfileUpdated:
 *       description: Profile updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Profile updated successfully"
 * 
 *   parameters:
 *     UserIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       description: The unique ID of the user
 *       schema:
 *         type: integer
 * 
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     operationId: registerUser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/UserRegistered'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 * 
 * /api/user/login:
 *   post:
 *     summary: Log in an existing user
 *     operationId: loginUser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password"
 * 
 * /api/user/all-users:
 *   get:
 *     summary: Retrieve all users
 *     operationId: getAllUsers
 *     responses:
 *       200:
 *         description: A list of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   delete:
 *     summary: Delete all users
 *     operationId: deleteAllUsers
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserDeleted'
 * 
 * /api/user/profile/{id}:
 *   get:
 *     summary: Retrieve user profile by ID
 *     operationId: getProfileById
 *     parameters:
 *       - $ref: '#/components/parameters/UserIdParam'
 *     responses:
 *       200:
 *         description: The user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/UserNotFound'
 *   put:
 *     summary: Update user profile
 *     operationId: updateProfile
 *     parameters:
 *       - $ref: '#/components/parameters/UserIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserProfileUpdated'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/UserNotFound'
 */
