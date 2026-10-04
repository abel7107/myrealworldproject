import prisma from '../config/database.js';

export async function getNotifications(req, res, next) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    res.json({ success: true, data: notifications });
  } catch (error) { next(error); }
}

export async function getNotificationUnreadCount(req, res, next) {
  try {
    const count = await prisma.notification.count({ where: { userId: req.user.userId, isRead: false } });
    res.json({ success: true, data: { unreadCount: count } });
  } catch (error) { next(error); }
}

export async function markNotificationRead(req, res, next) {
  try {
    const result = await prisma.notification.updateMany({
      where: { id: Number(req.params.id), userId: req.user.userId },
      data: { isRead: true },
    });
    if (result.count === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, message: 'Marked as read' });
  } catch (error) { next(error); }
}

export async function markAllNotificationsRead(req, res, next) {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.userId, isRead: false },
      data: { isRead: true },
    });
    res.json({ success: true, message: 'All marked as read' });
  } catch (error) { next(error); }
}
