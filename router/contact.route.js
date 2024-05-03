import express from 'express';
import { createNotification, getUnreadNotifications, markNotificationAsRead } from '../controllers/contact.controller.js';

const router = express.Router();

router.post("/notifications", createNotification);
router.get("/notifications/unread", getUnreadNotifications);
router.put("/notifications/:id/read", markNotificationAsRead);

export default router;