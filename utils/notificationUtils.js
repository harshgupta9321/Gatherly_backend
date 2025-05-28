import Notification from '../models/Notification.js';

export const createNotification = async (userId, title, message, type = 'GENERAL', requestId = null) => {
  try {
    const notification = new Notification({
      userId,
      title,
      message,
      type,
      requestId
    });

    await notification.save();

    // Emit socket event if socket.io is configured
    if (global.io) {
      global.io.emit('notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}; 