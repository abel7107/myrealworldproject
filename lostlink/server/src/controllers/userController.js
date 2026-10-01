// Temporary — will use database
const users = [
  { id: 1, name: 'Admin User', email: 'admin@lostlink.com', role: 'ADMIN', phone: '+251911000000', isActive: true },
  { id: 2, name: 'Abebe Kebede', email: 'abebe@example.com', role: 'USER', phone: '+251911111111', isActive: true },
];

export async function getMe(req, res, next) {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
}

export async function updateMe(req, res, next) {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { name, phone } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    res.json({ success: true, message: 'Profile updated', data: user });
  } catch (error) { next(error); }
}