/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         notification_id:
 *           type: integer
 *           description: Unique identifier for the notification
 *         user_id:
 *           type: integer
 *           description: ID of the user receiving the notification
 *         message:
 *           type: string
 *           description: Content of the notification
 *         is_read:
 *           type: boolean
 *           description: Whether the notification has been read
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Time when the notification was created
 *
 * tags:
 *   - name: Notification
 *     description: API for managing notifications
 *
 * /api/notifications/create:
 *   post:
 *     summary: Emit a new notification
 *     tags: [Notification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the user
 *               message:
 *                 type: string
 *                 description: Notification message
 *             required:
 *               - user_id
 *               - message
 *     responses:
 *       200:
 *         description: Notification emitted successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 *
 * /api/notifications:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notification]
 *     responses:
 *       200:
 *         description: List of all notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Internal server error
 *
 * /api/notifications/delete/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the notification to delete
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 */

