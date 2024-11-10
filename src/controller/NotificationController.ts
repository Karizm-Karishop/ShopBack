import { Request, Response } from "express";
import dbConnection from "../database";
import Notification from "../database/models/NotificationModel";
import { EventEmitter } from "events";

const notificationRepo = dbConnection.getRepository(Notification);
const notificationEmitter = new EventEmitter();

export default class NotificationController {
    /**
     * Emit a new notification
     */
    static async emitNotification(req: Request, res: Response): Promise<any> {
        try {
            const { user_id, message } = req.body;

            if (!user_id || !message) {
                return res.status(400).json({ message: "user_id and message are required" });
            }

            // Emit the notification event
            notificationEmitter.emit("newNotification", { user_id, message });

            return res.status(200).json({ message: "Notification emitted successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    /**
     * Event listener to handle new notification creation
     */
    static initializeEmitter() {
        notificationEmitter.on("newNotification", async ({ user_id, message }) => {
            try {
                const notification = notificationRepo.create({ user_id, message });
                await notificationRepo.save(notification);
                console.log("Notification created:", notification);
            } catch (error) {
                console.error("Failed to create notification:", error);
            }
        });
    }

    /**
     * Get all notifications
     */
    static async getAllNotifications(req: Request, res: Response): Promise<any> {
        try {
            const notifications = await notificationRepo.find();
            return res.status(200).json(notifications);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    /**
     * Delete a notification by ID
     */
    static async deleteNotification(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            const notification = await notificationRepo.findOne({ where: { notification_id: id as any } });
            if (!notification) {
                return res.status(404).json({ message: "Notification not found" });
            }

            await notificationRepo.delete(id);
            return res.status(200).json({ message: "Notification deleted successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
