import { Router } from "express";
import NotificationController  from "../controller/NotificationController";

const router = Router();

/**
 * @route POST /api/notifications/create
 * @desc Emit a new notification
 * @access Public
 */
router.post('/create', NotificationController.emitNotification);

/**
 * @route GET /api/notifications
 * @desc Get all notifications
 * @access Public
 */
router.get('/', NotificationController.getAllNotifications);

/**
 * @route DELETE /api/notifications/delete/:id
 * @desc Delete a notification by ID
 * @access Public
 */
router.delete('/delete/:id', NotificationController.deleteNotification);

export default router;