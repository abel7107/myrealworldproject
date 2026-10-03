import prisma from '../config/database.js';

export async function getUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ success: true, data: users });
  } catch (error) { next(error); }
}

export async function getUser(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
}

export async function updateUserStatus(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { isActive } = req.body;
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });
    res.json({ success: true, message: 'User status updated', data: updated });
  } catch (error) { next(error); }
}

export async function getItems(req, res, next) {
  try {
    const items = await prisma.item.findMany({
      include: { category: true, owner: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: items });
  } catch (error) { next(error); }
}

export async function updateItemStatus(req, res, next) {
  try {
    const { status } = req.body;
    const allowed = ['PENDING', 'ACTIVE', 'RESOLVED', 'REMOVED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const updated = await prisma.item.update({
      where: { id: Number(req.params.id) },
      data: { status },
    });
    res.json({ success: true, message: 'Item status updated', data: updated });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    next(error);
  }
}

export async function getStats(req, res, next) {
  try {
    const [totalUsers, totalItems, lostItems, foundItems, pendingItems, resolvedItems] =
      await Promise.all([
        prisma.user.count(),
        prisma.item.count(),
        prisma.item.count({ where: { type: 'LOST' } }),
        prisma.item.count({ where: { type: 'FOUND' } }),
        prisma.item.count({ where: { status: 'PENDING' } }),
        prisma.item.count({ where: { status: 'RESOLVED' } }),
      ]);

    res.json({
      success: true,
      data: { totalUsers, totalItems, lostItems, foundItems, pendingItems, resolvedItems },
    });
  } catch (error) { next(error); }
}
