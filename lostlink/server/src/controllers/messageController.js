import prisma from '../config/database.js';

// A conversation is uniquely identified by the item + the other participant.
// The current user is always derived from the JWT, never from the request.
function parseConversationId(raw) {
  const [itemId, otherUserId] = String(raw).split(':').map(Number);
  if (!Number.isInteger(itemId) || !Number.isInteger(otherUserId)) return null;
  return { itemId, otherUserId };
}

const userSelect = { id: true, name: true, email: true };
const itemSelect = { id: true, title: true, type: true, imageUrl: true };

export async function sendMessage(req, res, next) {
  try {
    const { receiverId, itemId, content } = req.body;
    const senderId = req.user.userId;

    if (!receiverId || !itemId || !content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'receiverId, itemId, and content are required' });
    }
    if (typeof content !== 'string' || content.trim().length > 2000) {
      return res.status(400).json({ success: false, message: 'Content must be text up to 2000 characters' });
    }

    const receiver = await prisma.user.findUnique({ where: { id: Number(receiverId) } });
    if (!receiver) return res.status(404).json({ success: false, message: 'Receiver not found' });
    if (receiver.id === senderId) {
      return res.status(400).json({ success: false, message: 'You cannot message yourself' });
    }

    const item = await prisma.item.findUnique({ where: { id: Number(itemId) } });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId: receiver.id,
        itemId: item.id,
        content: content.trim(),
      },
      include: { sender: { select: userSelect }, receiver: { select: userSelect }, item: { select: itemSelect } },
    });

    res.status(201).json({ success: true, message: 'Message sent successfully', data: message });
  } catch (error) { next(error); }
}

export async function getConversations(req, res, next) {
  try {
    const me = req.user.userId;

    const messages = await prisma.message.findMany({
      where: { OR: [{ senderId: me }, { receiverId: me }] },
      include: {
        sender: { select: userSelect },
        receiver: { select: userSelect },
        item: { select: itemSelect },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group into conversations keyed by (otherUser, item)
    const map = new Map();
    for (const m of messages) {
      const other = m.senderId === me ? m.receiver : m.sender;
      const key = `${m.itemId}:${other.id}`;
      if (!map.has(key)) {
        map.set(key, {
          conversationId: key,
          otherUser: other,
          item: m.item,
          lastMessage: { content: m.content, createdAt: m.createdAt, senderId: m.senderId },
          unreadCount: 0,
        });
      }
      const convo = map.get(key);
      if (m.receiverId === me && !m.isRead) convo.unreadCount += 1;
    }

    // Map is built from desc-ordered messages, so insertion order == latest first
    res.json({ success: true, data: [...map.values()] });
  } catch (error) { next(error); }
}

export async function getConversation(req, res, next) {
  try {
    const me = req.user.userId;
    const parsed = parseConversationId(req.params.conversationId);
    if (!parsed) return res.status(400).json({ success: false, message: 'Invalid conversation id' });

    const messages = await prisma.message.findMany({
      where: {
        itemId: parsed.itemId,
        OR: [
          { senderId: me, receiverId: parsed.otherUserId },
          { senderId: parsed.otherUserId, receiverId: me },
        ],
      },
      include: { sender: { select: userSelect }, item: { select: itemSelect } },
      orderBy: { createdAt: 'asc' },
    });

    if (messages.length === 0) {
      // No messages yet — still expose a valid shell conversation so the UI
      // can open an empty chat and send the first message. To prevent user C
      // from probing arbitrary pairs, only allow a shell tied to an item the
      // caller either owns or is contacting its owner about.
      const item = await prisma.item.findUnique({
        where: { id: parsed.itemId },
        select: { ...itemSelect, ownerId: true },
      });
      const otherUser = await prisma.user.findUnique({ where: { id: parsed.otherUserId }, select: userSelect });
      const allowed = item && (parsed.otherUserId === item.ownerId || me === item.ownerId);
      if (!item || !otherUser || !allowed) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }
      return res.json({ success: true, data: { conversationId: req.params.conversationId, otherUser, item, messages: [] } });
    }

    const otherUser = await prisma.user.findUnique({
      where: { id: parsed.otherUserId },
      select: userSelect,
    });

    res.json({
      success: true,
      data: {
        conversationId: req.params.conversationId,
        otherUser,
        item: messages[0].item,
        messages,
      },
    });
  } catch (error) { next(error); }
}

export async function markMessageAsRead(req, res, next) {
  try {
    const me = req.user.userId;
    const id = Number(req.params.id);

    // Only the receiver may mark a message read — updateMany with receiverId
    // in the where clause makes it impossible to touch someone else's data.
    const result = await prisma.message.updateMany({
      where: { id, receiverId: me },
      data: { isRead: true },
    });
    if (result.count === 0) {
      return res.status(403).json({ success: false, message: 'Message not found or not yours to update' });
    }
    res.json({ success: true, message: 'Message marked as read' });
  } catch (error) { next(error); }
}

export async function markConversationAsRead(req, res, next) {
  try {
    const me = req.user.userId;
    const parsed = parseConversationId(req.params.conversationId);
    if (!parsed) return res.status(400).json({ success: false, message: 'Invalid conversation id' });

    const result = await prisma.message.updateMany({
      where: { itemId: parsed.itemId, senderId: parsed.otherUserId, receiverId: me, isRead: false },
      data: { isRead: true },
    });
    res.json({ success: true, message: 'Conversation marked as read', data: { updated: result.count } });
  } catch (error) { next(error); }
}

export async function deleteMessage(req, res, next) {
  try {
    const me = req.user.userId;
    const id = Number(req.params.id);

    // Only the original sender may delete their own message.
    const result = await prisma.message.deleteMany({ where: { id, senderId: me } });
    if (result.count === 0) {
      return res.status(403).json({ success: false, message: 'Message not found or not yours to delete' });
    }
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) { next(error); }
}

export async function getUnreadCount(req, res, next) {
  try {
    const count = await prisma.message.count({ where: { receiverId: req.user.userId, isRead: false } });
    res.json({ success: true, data: { unreadCount: count } });
  } catch (error) { next(error); }
}
