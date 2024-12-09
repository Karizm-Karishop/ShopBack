import { Router } from 'express';
import NotificationController from '../controller/NotificationController';
const router = Router();
router.post('/', 
  NotificationController.createNotification
);
router.get('/', 
  NotificationController.getNotifications
);
router.put('/status', 
  NotificationController.updateNotificationStatus
);
router.delete('/', 
  NotificationController.deleteNotifications
);
router.get('/summary', 
  NotificationController.getNotificationSummary
);

export default router;