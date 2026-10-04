const API_BASE = "/api";

const TOKEN_KEY = "lostlink_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request(path, { method = "GET", body, params } = {}) {
  const url = new URL(API_BASE + path, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }

  const headers = {};
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let payload;
  if (body instanceof FormData) {
    payload = body; // browser sets multipart boundary
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const res = await fetch(url.pathname + url.search, {
    method,
    headers,
    body: payload,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}

export const api = {
  // Auth
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),
  register: (name, email, password) =>
    request("/auth/register", { method: "POST", body: { name, email, password } }),
  getMe: () => request("/auth/me"),

  // Items
  getItems: (params) => request("/items", { params }),
  getItem: (id) => request(`/items/${id}`),
  createItem: (item) => request("/items", { method: "POST", body: item }),
  updateItem: (id, item) =>
    request(`/items/${id}`, { method: "PUT", body: item }),
  deleteItem: (id) => request(`/items/${id}`, { method: "DELETE" }),
  setItemStatus: (id, status) =>
    request(`/items/${id}/status`, { method: "PATCH", body: { status } }),

  reportItem: (id, payload) =>
    request(`/items/${id}/report`, { method: "POST", body: payload }),

  // Messages
  sendMessage: (receiverId, itemId, content) =>
    request("/messages", { method: "POST", body: { receiverId, itemId, content } }),
  getConversations: () => request("/messages/conversations"),
  getConversation: (conversationId) =>
    request(`/messages/conversations/${encodeURIComponent(conversationId)}`),
  getUnreadCount: () => request("/messages/unread-count"),
  markMessageAsRead: (id) => request(`/messages/${id}/read`, { method: "PATCH" }),
  markConversationAsRead: (conversationId) =>
    request(`/messages/conversations/${encodeURIComponent(conversationId)}/read`, { method: "PATCH" }),
  deleteMessage: (id) => request(`/messages/${id}`, { method: "DELETE" }),

  // Users
  updateMe: (updates) => request("/users/me", { method: "PUT", body: updates }),

  // Admin
  getUsers: () => request("/admin/users"),
  getUser: (id) => request(`/admin/users/${id}`),
  updateUserStatus: (id, isActive) =>
    request(`/admin/users/${id}/status`, { method: "PUT", body: { isActive } }),
  getAdminItems: () => request("/admin/items"),
  updateAdminItemStatus: (id, status) =>
    request(`/admin/items/${id}/status`, { method: "PUT", body: { status } }),
  getStats: () => request("/admin/stats"),
  getReports: () => request("/admin/reports"),
  updateReport: (id, status) =>
    request(`/admin/reports/${id}`, { method: "PUT", body: { status } }),
};
