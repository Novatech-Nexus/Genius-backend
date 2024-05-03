import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['unread', 'read'],
        default: 'unread'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Notification = mongoose.model('notification', notificationSchema);
export default Notification;
