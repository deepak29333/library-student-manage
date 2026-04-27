# Library Management SaaS

A full-stack Library Management SaaS with role-based access control.

## Structure

```
library-student-manage/
  backend/    — Node.js + TypeScript + Koa + TypeORM + PostgreSQL
  frontend/   — React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
```

## Roles

| Role | Capabilities |
|---|---|
| `SUPER_ADMIN` | Manage libraries, assign billing plans, create library admins |
| `LIBRARY_ADMIN` | Manage students within their library |
| `STUDENT` | View own profile and subscription |

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- npm >= 9

---

## Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm install
npm run dev
```

Backend runs on `http://localhost:4000`

### Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default 4000) |
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_USER` | PostgreSQL user |
| `DB_PASS` | PostgreSQL password |
| `DB_NAME` | PostgreSQL database name |
| `JWT_SECRET` | Secret key for JWT signing |

### Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with ts-node-dev (hot reload) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled output |

Billing plans (Starter, Growth, Enterprise) are seeded automatically on first run.

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

The Vite dev server proxies all `/api` requests to `http://localhost:4000`.

### Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## API Overview

All API routes are prefixed with `/api`.

| Method | Route | Role | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Get JWT token |
| POST | `/api/libraries` | SUPER_ADMIN | Create library |
| POST | `/api/library-admins` | SUPER_ADMIN | Create admin and assign to library |
| POST | `/api/assign-plan` | SUPER_ADMIN | Assign billing plan to library |
| POST | `/api/students` | LIBRARY_ADMIN | Create student |
| GET | `/api/students` | LIBRARY_ADMIN | List students |
| GET | `/api/students/:id` | LIBRARY_ADMIN | Get student detail |
| GET | `/api/me` | STUDENT | Own profile |
| GET | `/api/my-subscription` | STUDENT | Own subscription |

---

## Testing with Postman

1. Call `POST /api/auth/login` with `{ "email": "...", "password": "..." }`
2. Copy the `token` from the response
3. Set header `Authorization: Bearer <token>` on all subsequent requests
