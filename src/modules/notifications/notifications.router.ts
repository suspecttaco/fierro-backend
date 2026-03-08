import { Router } from 'express';
import { notificationsController } from './notifications.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/',                authenticate, notificationsController.getNotifications);
router.put('/:id/read',        authenticate, notificationsController.markAsRead);
router.put('/read-all',        authenticate, notificationsController.markAllAsRead);
router.get('/preferences',     authenticate, notificationsController.getPreferences);
router.put('/preferences',     authenticate, notificationsController.updatePreference);

export default router;