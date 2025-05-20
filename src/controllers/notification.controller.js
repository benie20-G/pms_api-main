const { PrismaClient } = require('@prisma/client');
const ServerResponse = require('../utils/ServerResponse');

const prisma = new PrismaClient();

const getNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;

        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        return ServerResponse.success(res, 'Notifications retrieved successfully', notifications);
    } catch (error) {
        console.error('Error in getNotifications:', error);
        return ServerResponse.serverError(res);
    }
};

const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.userId;

        const notification = await prisma.notification.findUnique({
            where: { id: notificationId }
        });

        if (!notification) {
            return ServerResponse.notFound(res, 'Notification not found');
        }

        if (notification.userId !== userId) {
            return ServerResponse.error(res, 'Unauthorized access to notification');
        }

        const updatedNotification = await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true }
        });

        return ServerResponse.success(res, 'Notification marked as read', updatedNotification);
    } catch (error) {
        console.error('Error in markAsRead:', error);
        return ServerResponse.serverError(res);
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;

        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });

        return ServerResponse.success(res, 'All notifications marked as read');
    } catch (error) {
        console.error('Error in markAllAsRead:', error);
        return ServerResponse.serverError(res);
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead
}; 