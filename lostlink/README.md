# LostLink

A lost-and-found platform where users can report lost/found items, search the database, contact owners in-app, and resolve items once reunited. Admins can moderate users, items, and reports.

## Tech Stack

- **Frontend:** React 19, Vite, React Router 7, Tailwind CSS 4
- **Backend:** Node.js, Express 5, Prisma ORM, SQLite, JWT auth, Multer (image uploads)

## Features

- Register / login with JWT auth, protected routes
- Report lost & found items with category, location, date, contact info, and photo upload
- Browse, search, and filter items
- Item detail page with report (flag) and contact-owner actions
- In-app messaging (conversations, unread counts, read tracking)
- Mark items as resolved / reopen them
- User dashboard: profile edit, report management (edit, delete, resolve)
- Admin dashboard: stats, user suspend/activate, item status/delete, report resolve/dismiss

## Project Structure

```
.
├── src/                  # React frontend (pages, components, context, api client)
├── server/
│   ├── src/              # Express API (routes, controllers, middleware)
│   ├── prisma/           # schema, seed, SQLite dev.db
│   └── uploads/          # uploaded item images (gitignored)
└── vite.config.js        # dev server + /api and /uploads proxy to :5000
```

## Getting Started

### 1. Install dependencies

```bash
npm install
cd server && npm install
```

### 2. Configure environment

Create `server/.env`:

```env
PORT=5000
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
DATABASE_URL="file:./dev.db"
```

### 3. Set up the database

```bash
cd server
npx prisma db push
npm run db:seed
```

### 4. Run (two terminals)

```bash
# Terminal 1 — API
cd server
npm run dev        # http://localhost:5000

# Terminal 2 — Frontend
npm run dev        # http://localhost:5173
```

## Seeded Accounts

| Role  | Email                | Password   |
|-------|----------------------|------------|
| Admin | `admin@lostlink.com` | `admin123` |
| User  | `abebe@example.com`  | `user123`  |

## Useful Scripts

| Command             | Where    | Purpose                  |
|---------------------|----------|--------------------------|
| `npm run dev`       | root     | Vite dev server          |
| `npm run build`     | root     | Production build         |
| `npm run lint`      | root     | ESLint                   |
| `npm run dev`       | server/  | API with `--watch`       |
| `npm run db:push`   | server/  | Sync Prisma schema       |
| `npm run db:seed`   | server/  | Seed categories/users    |
