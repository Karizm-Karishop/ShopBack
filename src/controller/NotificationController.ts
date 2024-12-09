import { Request, Response } from 'express';
import { NotificationModel, NotificationStatus, NotificationType, NotificationPriority } from '../database/models/NotificationModel';
import dbConnection from '../database';
import { FindManyOptions, FindOptionsWhere, Like, Between } from 'typeorm';
import UserModel from '../database/models/UserModel';

const notificationRepository = dbConnection.getRepository(NotificationModel);
const userRepository = dbConnection.getRepository(UserModel);

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  total?: number;
}

class NotificationController {
  static async createNotification(req: Request, res: Response) {
    try {
      const { 
        type, 
        message, 
        status = NotificationStatus.UNREAD, 
        priority = NotificationPriority.MEDIUM, 
        details,
        userId 
      } = req.body;

      const user = userId ? await userRepository.findOne({ where: { user_id: userId } }) : null;

      const notification = notificationRepository.create({
        type,
        message,
        status,
        priority,
        details,
        user: user || undefined
      });

      await notificationRepository.save(notification);

      res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        data: notification
      });
    } catch (error) {
      console.error('Create notification error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create notification',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getNotifications(req: Request, res: Response) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        type, 
        status, 
        priority, 
        search, 
        startDate, 
        endDate,
        userId
      } = req.query;

      const options: FindManyOptions<NotificationModel> = {
        where: {},
        order: { createdAt: 'DESC' },
        take: Number(limit),
        skip: (Number(page) - 1) * Number(limit)
      };

      const whereConditions: FindOptionsWhere<NotificationModel> = {};

      if (type) whereConditions.type = type as NotificationType;
      if (status) whereConditions.status = status as NotificationStatus;
      if (priority) whereConditions.priority = priority as NotificationPriority;
      if (search) whereConditions.message = Like(`%${search}%`);
      
      if (startDate && endDate) {
        whereConditions.dateReceived = Between(
          new Date(startDate as string), 
          new Date(endDate as string)
        );
      }

      if (userId) {
        whereConditions.user = { user_id: Number(userId) };
      }

      options.where = whereConditions;

      const [notifications, total] = await notificationRepository.findAndCount(options);

      res.status(200).json({
        success: true,
        data: notifications,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve notifications',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async updateNotificationStatus(req: Request, res: Response) {
    try {
      const { notificationIds, status } = req.body;

      if (!notificationIds || notificationIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No notification IDs provided'
        });
      }

      const updateResult = await notificationRepository
        .createQueryBuilder()
        .update(NotificationModel)
        .set({ status: status as NotificationStatus })
        .where('id IN (:...ids)', { ids: notificationIds })
        .execute();

      res.status(200).json({
        success: true,
        message: 'Notifications updated successfully',
        data: {
          affectedRows: updateResult.affected
        }
      });
    } catch (error) {
      console.error('Update notification status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update notification status',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async deleteNotifications(req: Request, res: Response) {
    try {
      const { notificationIds, hardDelete = false } = req.body;

      if (!notificationIds || notificationIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No notification IDs provided'
        });
      }

      if (hardDelete) {
        const deleteResult = await notificationRepository
          .createQueryBuilder()
          .delete()
          .where('id IN (:...ids)', { ids: notificationIds })
          .execute();

        return res.status(200).json({
          success: true,
          message: 'Notifications permanently deleted',
          data: {
            affectedRows: deleteResult.affected
          }
        });
      } else {
        const updateResult = await notificationRepository
          .createQueryBuilder()
          .update(NotificationModel)
          .set({ isDeleted: true })
          .where('id IN (:...ids)', { ids: notificationIds })
          .execute();

        return res.status(200).json({
          success: true,
          message: 'Notifications soft deleted',
          data: {
            affectedRows: updateResult.affected
          }
        });
      }
    } catch (error) {
      console.error('Delete notifications error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete notifications',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getNotificationSummary(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      const whereConditions: FindOptionsWhere<NotificationModel> = {
        isDeleted: false
      };

      if (userId) {
        whereConditions.user = { user_id: Number(userId) };
      }

      const [
        totalCount, 
        unreadCount, 
        highPriorityCount, 
        last24HoursCount
      ] = await Promise.all([
        notificationRepository.count({ where: whereConditions }),
        notificationRepository.count({ 
          where: { 
            ...whereConditions, 
            status: NotificationStatus.UNREAD 
          } 
        }),
        notificationRepository.count({ 
          where: { 
            ...whereConditions, 
            priority: NotificationPriority.HIGH 
          } 
        }),
        notificationRepository.count({ 
          where: { 
            ...whereConditions,
            createdAt: Between(
              new Date(Date.now() - 24 * 60 * 60 * 1000), 
              new Date()
            ) 
          } 
        })
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalCount,
          unreadCount,
          highPriorityCount,
          last24HoursCount
        }
      });
    } catch (error) {
      console.error('Get notification summary error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve notification summary',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default NotificationController;