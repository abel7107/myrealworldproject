// Temporary — will use database
const users = [
  { id: 1, name: 'Admin User', email: 'admin@lostlink.com', role: 'ADMIN', phone: '+251911000000', isActive: true },
  { id: 2, name: 'Abebe Kebede', email: 'abebe@example.com', role: 'USER', phone: '+251911111111', isActive: true },
];

const items = [
  { id: 1, title: 'iPhone 13', type: 'LOST', status: 'ACTIVE', ownerId: 2 },
  { id: 2, title: 'Black Backpack', type: 'FOUND', status: 'ACTIVE', ownerId: 2 },
  { id: 3, title: 'Car Keys', type: 'LOST', status: 'ACTIVE', ownerId: 2 },
];

export async function getUsers(req, res, next) {
  try {
    res.json({ success: true, data: users });
  } catch (error) { next(error); }
}

export async function getUser(req, res, next) {
  try {
    const user = users.find(u => u.id === Number(req.params.id));
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
}

export async function updateUserStatus(req, res, next) {
  try {
    const user = users.find(u => u.id === Number(req.params.id));
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { isActive } = req.body;
    user.isActive = isActive;
    res.json({ success: true, message: 'User status updated', data: user });
  } catch (error) { next(error); }
}

export async function getItems(req, res, next) {
  try {
    res.json({ success: true, data: items });
  } catch (error) { next(error); }
}

export async function getStats(req, res, next) {
  try {
    res.json({
      success: true,
      data: {
        totalUsers: users.length,
        totalItems: items.length,
        lostItems: items.filter(i => i.type === 'LOST').length,
        foundItems: items.filter(i => i.type === 'FOUND').length,
        pendingItems: items.filter(i => i.status === 'PENDING').length,
        resolvedItems: items.filter(i => i.status === 'RESOLVED').length,
      },
    });
  } catch (error) { next(error); }
}