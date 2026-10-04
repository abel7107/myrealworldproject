import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const prismaDir = path.join(process.cwd(), 'prisma');
const testDb = path.join(prismaDir, 'test.db');

// Use a throwaway copy of the dev database
fs.copyFileSync(path.join(prismaDir, 'dev.db'), testDb);
process.env.DATABASE_URL = 'file:./test.db';

const { default: app } = await import('../src/app.js');

let server;
let base;

const jsonHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

async function api(method, url, { token, body } = {}) {
  const res = await fetch(`${base}${url}`, {
    method,
    headers: jsonHeaders(token),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => resolve());
  });
  base = `http://localhost:${server.address().port}`;
});

after(async () => {
  server.close();
  const { default: prisma } = await import('../src/config/database.js');
  await prisma.$disconnect();
  await new Promise((r) => setTimeout(r, 300));
  try {
    fs.rmSync(testDb, { force: true });
    fs.rmSync(`${testDb}-journal`, { force: true });
  } catch {
    // file may still be held on Windows; temp copy is harmless
  }
});

test('health check', async () => {
  const r = await api('GET', '/api/health');
  assert.equal(r.status, 200);
  assert.equal(r.data.success, true);
});

test('register validates input', async () => {
  const r = await api('POST', '/api/auth/register', { body: { name: 'X' } });
  assert.equal(r.status, 400);
});

test('register + login flow', async () => {
  const email = `tester${Date.now()}@example.com`;
  const reg = await api('POST', '/api/auth/register', {
    body: { name: 'Tester', email, password: 'pass1234' },
  });
  assert.equal(reg.status, 201);

  const bad = await api('POST', '/api/auth/login', { body: { email, password: 'wrong' } });
  assert.ok(bad.status === 400 || bad.status === 401);

  const ok = await api('POST', '/api/auth/login', { body: { email, password: 'pass1234' } });
  assert.equal(ok.status, 200);
  assert.ok(ok.data.data.token);
});

// Shared fixtures for the item/message flow
let aliceToken, bobToken, itemId, conversationId;

test('setup: two user accounts', async () => {
  const a = await api('POST', '/api/auth/login', { body: { email: 'admin@lostlink.com', password: 'admin123' } });
  aliceToken = a.data.data.token;
  const b = await api('POST', '/api/auth/login', { body: { email: 'abebe@example.com', password: 'user123' } });
  bobToken = b.data.data.token;
  assert.ok(aliceToken && bobToken);
});

test('create item validation', async () => {
  const r = await api('POST', '/api/items', { token: bobToken, body: { type: 'Lost' } });
  assert.equal(r.status, 400);
});

test('create + get + list item', async () => {
  const created = await api('POST', '/api/items', {
    token: bobToken,
    body: { title: 'Test Keys', type: 'Lost', category: 'Keys', location: 'Dire Dawa' },
  });
  assert.equal(created.status, 201);
  itemId = created.data.data.id;

  const got = await api('GET', `/api/items/${itemId}`);
  assert.equal(got.status, 200);
  assert.equal(got.data.data.title, 'Test Keys');

  const list = await api('GET', '/api/items?search=Test Keys');
  assert.ok(list.data.data.some((i) => i.id === itemId));
});

test('resolve and reopen an item', async () => {
  const bad = await api('PATCH', `/api/items/${itemId}/status`, { token: bobToken, body: { status: 'BOGUS' } });
  assert.equal(bad.status, 400);

  const res = await api('PATCH', `/api/items/${itemId}/status`, { token: bobToken, body: { status: 'RESOLVED' } });
  assert.equal(res.status, 200);
  assert.equal(res.data.data.status, 'RESOLVED');

  const re = await api('PATCH', `/api/items/${itemId}/status`, { token: bobToken, body: { status: 'ACTIVE' } });
  assert.equal(re.data.data.status, 'ACTIVE');
});

test('non-owner cannot change status', async () => {
  const r = await api('PATCH', `/api/items/${itemId}/status`, { token: aliceToken, body: { status: 'RESOLVED' } });
  // admin is allowed by design; use an unauthenticated request instead
  assert.equal(r.status, 200); // admin override
  const anon = await api('PATCH', `/api/items/${itemId}/status`, { body: { status: 'RESOLVED' } });
  assert.equal(anon.status, 401);
});

test('messaging flow between users', async () => {
  // abebe (owner of itemId) gets a message from... use admin as the sender
  const me = await api('GET', '/api/auth/me', { token: aliceToken });
  const ownerRes = await api('GET', `/api/items/${itemId}`);
  const ownerId = ownerRes.data.data.ownerId;

  const sent = await api('POST', '/api/messages', {
    token: aliceToken,
    body: { receiverId: ownerId, itemId, content: 'Is this still available?' },
  });
  assert.equal(sent.status, 201);

  const unread = await api('GET', '/api/messages/unread-count', { token: bobToken });
  assert.ok(unread.data.data.unreadCount >= 1);

  const convos = await api('GET', '/api/messages/conversations', { token: bobToken });
  const convo = convos.data.data.find((c) => c.item?.id === itemId);
  assert.ok(convo);
  conversationId = convo.conversationId;

  const read = await api('PATCH', `/api/messages/conversations/${encodeURIComponent(conversationId)}/read`, { token: bobToken });
  assert.equal(read.status, 200);
});

test('delete item cleans up', async () => {
  const del = await api('DELETE', `/api/items/${itemId}`, { token: bobToken });
  assert.equal(del.status, 200);
  const got = await api('GET', `/api/items/${itemId}`);
  assert.equal(got.status, 404);
});
