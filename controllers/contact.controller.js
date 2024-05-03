import Notification from '../model/contact.model.js';

export const createNotification = async (req, res, next) => {
    try {
        const { subject, name, email, message } = req.body;
        const notification = new Notification({ subject, name, email, message });
        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        next(error);
    }
};

export const getUnreadNotifications = async (req, res, next) => {
    try {
        const unreadNotifications = await Notification.find({ status: 'unread' });
        res.status(200).json(unreadNotifications);
    } catch (error) {
        next(error);
    }
};

export const markNotificationAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findById(id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        notification.status = 'read';
        await notification.save();
        res.status(200).json(notification);
    } catch (error) {
        next(error);
    }
};