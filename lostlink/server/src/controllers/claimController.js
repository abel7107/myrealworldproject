import prisma from '../config/database.js';

const claimantSelect = { id: true, name: true, email: true };

export async function createClaim(req, res, next) {
  try {
    const itemId = Number(req.params.id);
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'A short description is required' });
    }

    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (item.ownerId === req.user.userId) {
      return res.status(400).json({ success: false, message: 'You cannot claim your own item' });
    }
    if (item.type !== 'FOUND') {
      return res.status(400).json({ success: false, message: 'Only found items can be claimed' });
    }

    const existing = await prisma.claim.findFirst({
      where: { itemId, claimantId: req.user.userId, status: 'PENDING' },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have a pending claim for this item' });
    }

    const claim = await prisma.claim.create({
      data: { itemId, claimantId: req.user.userId, message: message.trim() },
      include: { claimant: { select: claimantSelect }, item: { select: { id: true, title: true } } },
    });

    await prisma.notification.create({
      data: {
        userId: item.ownerId,
        type: 'INFO',
        message: `${claim.claimant.name} claims your item "${item.title}"`,
        link: `/item/${item.id}`,
      },
    });

    res.status(201).json({ success: true, message: 'Claim submitted', data: claim });
  } catch (error) { next(error); }
}

export async function getClaimsForItem(req, res, next) {
  try {
    const item = await prisma.item.findUnique({ where: { id: Number(req.params.id) } });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (item.ownerId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const claims = await prisma.claim.findMany({
      where: { itemId: item.id },
      include: { claimant: { select: claimantSelect } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: claims });
  } catch (error) { next(error); }
}

export async function updateClaimStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!['ACCEPTED', 'DECLINED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be ACCEPTED or DECLINED' });
    }
    const claim = await prisma.claim.findUnique({ where: { id: Number(req.params.id) }, include: { item: true } });
    if (!claim) return res.status(404).json({ success: false, message: 'Claim not found' });
    if (claim.item.ownerId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updated = await prisma.claim.update({
      where: { id: claim.id },
      data: { status },
    });

    if (status === 'ACCEPTED') {
      await prisma.item.update({ where: { id: claim.itemId }, data: { status: 'RESOLVED' } });
    }

    await prisma.notification.create({
      data: {
        userId: claim.claimantId,
        type: 'INFO',
        message: `Your claim on "${claim.item.title}" was ${status.toLowerCase()}`,
        link: `/item/${claim.itemId}`,
      },
    });

    res.json({ success: true, message: `Claim ${status.toLowerCase()}`, data: updated });
  } catch (error) { next(error); }
}
