import prisma from '../config/database.js';

export async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
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

export async function updateMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { name, phone } = req.body;
    const data = {};
    if (name) data.name = name;
    if (phone !== undefined) data.phone = phone;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
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
    res.json({ success: true, message: 'Profile updated', data: updated });
  } catch (error) { next(error); }
}
