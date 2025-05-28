import Notification from '../models/Notification.js';

// Get all notifications for a user
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.userId, read: false },
      { read: true }
    );

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notifications', error: error.message });
  }
};

// Create a new notification
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

    // Emit socket event (this will be handled by the socket.io setup)
    global.io.emit('roleRequestUpdate', notification);

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}; 