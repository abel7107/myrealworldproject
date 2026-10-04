import prisma from '../config/database.js';

const itemInclude = { category: true };

export async function getItems(req, res, next) {
  try {
    const { search, type, category, location } = req.query;

    const where = {};

    // Hide removed items from the public listing
    where.status = { not: 'REMOVED' };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (type) where.type = type.toUpperCase();
    if (location) where.location = location;
    if (category) {
      where.category = { name: category };
    }

    const items = await prisma.item.findMany({
      where,
      include: itemInclude,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

export async function getItem(req, res, next) {
  try {
    const item = await prisma.item.findUnique({
      where: { id: Number(req.params.id) },
      include: itemInclude,
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function createItem(req, res, next) {
  try {
    const { title, type, category, location, description, date, contactName, contactPhone } = req.body;
    if (!title || !type || !category || !location) {
      return res.status(400).json({ success: false, message: 'Title, type, category, and location are required' });
    }

    // Find the category by name
    const categoryRecord = await prisma.category.findUnique({ where: { name: category } });
    if (!categoryRecord) {
      return res.status(400).json({ success: false, message: `Category "${category}" does not exist` });
    }

    const newItem = await prisma.item.create({
      data: {
        title,
        type: type.toUpperCase(),
        location,
        description: description || null,
        dateLostOrFound: date ? new Date(date) : null,
        contactName: contactName || null,
        contactPhone: contactPhone || null,
        ownerId: req.user.userId,
        categoryId: categoryRecord.id,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      },
      include: itemInclude,
    });

    // Find likely matches: opposite type, same category, same/similar location,
    // still active, and not owned by the same user.
    const oppositeType = newItem.type === 'LOST' ? 'FOUND' : 'LOST';
    const candidates = await prisma.item.findMany({
      where: {
        type: oppositeType,
        status: { notIn: ['REMOVED', 'RESOLVED'] },
        categoryId: newItem.categoryId,
        ownerId: { not: newItem.ownerId },
        OR: [{ location: newItem.location }, { location: { contains: newItem.location } }],
      },
      take: 3,
    });

    for (const match of candidates) {
      await prisma.notification.create({
        data: {
          userId: newItem.ownerId,
          type: 'INFO',
          message: `Possible match: "${match.title}" (${match.type.toLowerCase()}) at ${match.location} may be your item`,
          link: `/item/${match.id}`,
        },
      });
      await prisma.notification.create({
        data: {
          userId: match.ownerId,
          type: 'INFO',
          message: `A new ${newItem.type.toLowerCase()} item "${newItem.title}" at ${newItem.location} may match your "${match.title}"`,
          link: `/item/${newItem.id}`,
        },
      });
    }

    res.status(201).json({ success: true, message: 'Item created', data: newItem });
  } catch (error) {
    next(error);
  }
}

export async function updateItem(req, res, next) {
  try {
    const item = await prisma.item.findUnique({ where: { id: Number(req.params.id) } });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (item.ownerId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { title, type, category, location, description, date, contactName, contactPhone } = req.body;
    const data = {};
    if (title !== undefined) data.title = title;
    if (type !== undefined) data.type = type.toUpperCase();
    if (location !== undefined) data.location = location;
    if (description !== undefined) data.description = description;
    if (date !== undefined) data.dateLostOrFound = date ? new Date(date) : null;
    if (contactName !== undefined) data.contactName = contactName;
    if (contactPhone !== undefined) data.contactPhone = contactPhone;
    if (category !== undefined) {
      const categoryRecord = await prisma.category.findUnique({ where: { name: category } });
      if (!categoryRecord) {
        return res.status(400).json({ success: false, message: `Category "${category}" does not exist` });
      }
      data.categoryId = categoryRecord.id;
    }
    if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;

    const updated = await prisma.item.update({
      where: { id: item.id },
      data,
      include: itemInclude,
    });
    res.json({ success: true, message: 'Item updated', data: updated });
  } catch (error) {
    next(error);
  }
}

export async function updateItemStatus(req, res, next) {
  try {
    const item = await prisma.item.findUnique({ where: { id: Number(req.params.id) } });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (item.ownerId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { status } = req.body;
    const allowed = ['PENDING', 'ACTIVE', 'RESOLVED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const updated = await prisma.item.update({
      where: { id: item.id },
      data: { status },
      include: itemInclude,
    });
    res.json({ success: true, message: `Item marked as ${status.toLowerCase()}`, data: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteItem(req, res, next) {
  try {
    const item = await prisma.item.findUnique({ where: { id: Number(req.params.id) } });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (item.ownerId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await prisma.$transaction([
      prisma.report.deleteMany({ where: { itemId: item.id } }),
      prisma.message.deleteMany({ where: { itemId: item.id } }),
      prisma.item.delete({ where: { id: item.id } }),
    ]);
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    next(error);
  }
}
