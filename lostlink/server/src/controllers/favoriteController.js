import prisma from '../config/database.js';

export async function toggleFavorite(req, res, next) {
  try {
    const itemId = Number(req.params.id);
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    const existing = await prisma.favorite.findUnique({
      where: { userId_itemId: { userId: req.user.userId, itemId } },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return res.json({ success: true, message: 'Removed from watchlist', data: { favorited: false } });
    }

    await prisma.favorite.create({ data: { userId: req.user.userId, itemId } });
    res.json({ success: true, message: 'Added to watchlist', data: { favorited: true } });
  } catch (error) { next(error); }
}

export async function getFavorites(req, res, next) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.userId },
      include: { item: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: favorites.map((f) => f.item) });
  } catch (error) { next(error); }
}

export async function isFavorited(req, res, next) {
  try {
    const fav = await prisma.favorite.findUnique({
      where: { userId_itemId: { userId: req.user.userId, itemId: Number(req.params.id) } },
    });
    res.json({ success: true, data: { favorited: !!fav } });
  } catch (error) { next(error); }
}
