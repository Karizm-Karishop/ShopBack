/**
 * @swagger
 * tags:
 *   name: User
 *   description: Endpoints related to managing users
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [artist, client, admin]
 *                 default: client
 *               phone_number:
 *                 type: string
 *                 nullable: true
 *               address:
 *                 type: string
 *                 nullable: true
 *               gender:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       '201':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 */

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       '400':
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid credentials"
 */

/**
 * @swagger
 * /api/user/all-users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [User]
 *     responses:
 *       '200':
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 */

/**
 * @swagger
 * /api/user/update-profile/{id}:
 *   put:
 *     summary: Update user profile by ID
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [artist, client, admin]
 *                 default: client
 *               phone_number:
 *                 type: string
 *                 nullable: true
 *               address:
 *                 type: string
 *                 nullable: true
 *               gender:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       '200':
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     phone_number:
 *                       type: string
 *                     address:
 *                       type: string
 *                     gender:
 *                       type: string
 *       '400':
 *         description: Invalid user ID format or validation errors
 *       '403':
 *         description: Forbidden (Only user or Admin can update the profile)
 *       '404':
 *         description: User not found
 */

/**
 * @swagger
 * /api/user/delete-all-users:
 *   delete:
 *     summary: Delete all users (Admin only)
 *     tags: [User]
 *     responses:
 *       '200':
 *         description: Users deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedCount:
 *                   type: integer
 *       '403':
 *         description: Forbidden (Only Admin can delete all users)
 */

/**
 * @swagger
 * /api/user/update-profile/{id}:
 *   put:
 *     summary: Update user profile by ID
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: integer
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
 *     responses:
 *       '200':
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       '400':
 *         description: Invalid user ID format or validation errors
 *       '403':
 *         description: Forbidden (Only user or Admin can update the profile)
 *       '404':
 *         description: User not found
 */

/**
 * @swagger
 * /api/user/delete-profile/{id}:
 *   delete:
 *     summary: Delete user profile by ID
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Profile deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Invalid user ID format
 *       '404':
 *         description: User not found
 */

/**
 * @swagger
 * /api/user/forget-password:
 *   post:
 *     summary: Request password reset link
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password reset link sent
 *       '400':
 *         description: Invalid email or user not found
 */

/**
 * @swagger
 * /api/verify-otp:
 *   post:
 *     summary: Verify OTP for password reset
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: OTP verified successfully
 *       '400':
 *         description: Invalid OTP or expired OTP
 */
/**
 * @swagger
 * /api/user/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *               - confirmPassword
 *               - resetToken
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: example@gmail.com
 *               newPassword:
 *                 type: string
 *                 description: The new password to be set
 *                 example: examplePass@123
 *               confirmPassword:
 *                 type: string
 *                 description: Must match the newPassword field
 *                 example: examplePass@123
 *               resetToken:
 *                 type: string
 *                 description: The token sent for password reset
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInR5cGUiOiJwYXNzd29yZC1yZXNldCIsImlhdCI6MTczMjA0MjEzMywiZXhwIjoxNzMyMDQzMDMzfQ.kJkyfZynugxnBJfhI3fvCzF5ZkxqlIYD7wdPDwWYHxI
 *     responses:
 *       '200':
 *         description: Password reset successfully
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
 *                   example: Password reset successful
 *       '400':
 *         description: Validation errors or invalid reset token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: Passwords do not match
 *                       param:
 *                         type: string
 *                         example: confirmPassword
 *                       location:
 *                         type: string
 *                         example: body
 */
