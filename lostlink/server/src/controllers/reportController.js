import prisma from '../config/database.js';

export async function createReport(req, res, next) {
  try {
    const itemId = Number(req.params.id);
    const { reason, description } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Reason is required' });
    }
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    const report = await prisma.report.create({
      data: {
        reason,
        description: description || null,
        reporterId: req.user.userId,
        itemId,
      },
      include: {
        item: { select: { id: true, title: true } },
        reporter: { select: { id: true, name: true, email: true } },
      },
    });
    if (item.ownerId !== req.user.userId) {
      await prisma.notification.create({
        data: {
          userId: item.ownerId,
          type: 'REPORT',
          message: `Your item "${item.title}" was reported (${reason})`,
          link: `/item/${item.id}`,
        },
      });
    }

    res.status(201).json({ success: true, message: 'Report submitted', data: report });
  } catch (error) {
    next(error);
  }
}

export async function getReports(req, res, next) {
  try {
    const reports = await prisma.report.findMany({
      include: {
        item: { include: { category: true } },
        reporter: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
}

export async function updateReport(req, res, next) {
  try {
    const { status } = req.body;
    if (!['PENDING', 'RESOLVED', 'DISMISSED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const updated = await prisma.report.update({
      where: { id: Number(req.params.id) },
      data: { status, resolvedAt: status === 'PENDING' ? null : new Date() },
    });
    res.json({ success: true, message: 'Report updated', data: updated });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    next(error);
  }
}
