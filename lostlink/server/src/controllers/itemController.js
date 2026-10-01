// Temporary in-memory items — will be replaced by database
const items = [
  { id: 1, title: 'iPhone 13', type: 'LOST', category: 'Electronics', location: 'Dire Dawa', description: 'Black iPhone 13 with transparent case', status: 'ACTIVE', ownerId: 2, date: '2026-09-30', createdAt: new Date() },
  { id: 2, title: 'Black Backpack', type: 'FOUND', category: 'Bags', location: 'Addis Ababa', description: 'Found near bus station', status: 'ACTIVE', ownerId: 2, date: '2026-09-29', createdAt: new Date() },
  { id: 3, title: 'Car Keys', type: 'LOST', category: 'Keys', location: 'Dire Dawa', description: 'Toyota car keys with remote', status: 'ACTIVE', ownerId: 2, date: '2026-09-28', createdAt: new Date() },
];

export async function getItems(req, res, next) {
  try {
    const { search, type, category, location } = req.query;
    let filtered = [...items];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      );
    }
    if (type) filtered = filtered.filter(i => i.type === type.toUpperCase());
    if (category) filtered = filtered.filter(i => i.category === category);
    if (location) filtered = filtered.filter(i => i.location === location);

    res.json({ success: true, data: filtered });
  } catch (error) { next(error); }
}

export async function getItem(req, res, next) {
  try {
    const item = items.find(i => i.id === Number(req.params.id));
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) { next(error); }
}

export async function createItem(req, res, next) {
  try {
    const { title, type, category, location, description, date } = req.body;
    if (!title || !type || !category || !location) {
      return res.status(400).json({ success: false, message: 'Title, type, category, and location are required' });
    }
    const newItem = { id: items.length + 1, title, type: type.toUpperCase(), category, location, description, date, status: 'PENDING', ownerId: req.user.userId, createdAt: new Date() };
    items.push(newItem);
    res.status(201).json({ success: true, message: 'Item created', data: newItem });
  } catch (error) { next(error); }
}

export async function updateItem(req, res, next) {
  try {
    const item = items.find(i => i.id === Number(req.params.id));
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (item.ownerId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    Object.assign(item, req.body);
    res.json({ success: true, message: 'Item updated', data: item });
  } catch (error) { next(error); }
}

export async function deleteItem(req, res, next) {
  try {
    const idx = items.findIndex(i => i.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ success: false, message: 'Item not found' });
    if (items[idx].ownerId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    items.splice(idx, 1);
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) { next(error); }
}