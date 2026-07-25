# Task Manager - Backend

REST API for a simple task management app. Built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Setup

```
npm install
cp .env.example .env
```

Fill in `.env` with your own values:

- `DB_URI` - MongoDB connection string
- `JWT_SECRET_KEY` - any long random string
- `JWT_EXPIRE_TIME` - e.g. 7d
- `CLIENT_URL` - the frontend origin (for CORS + cookies)

Run in development:

```
npm run start:dev
```

## Authentication

JWT-based. On signup/login the token is returned in the response body and also set as an httpOnly cookie. Protected routes accept either an `Authorization: Bearer <token>` header or the cookie.

## API Endpoints

### Auth

| Method | Endpoint            | Access | Description       |
| ------ | ------------------- | ------ | ------------------ |
| POST   | /api/v1/auth/signup | Public | Register a new user |
| POST   | /api/v1/auth/login  | Public | Login              |
| GET    | /api/v1/auth/logout | Public | Clear auth cookie  |

### Tasks (all require authentication)

| Method | Endpoint            | Description                          |
| ------ | -------------------- | ------------------------------------ |
| GET    | /api/v1/tasks         | List the logged-in user's tasks      |
| POST   | /api/v1/tasks         | Create a task                        |
| GET    | /api/v1/tasks/:id     | Get a single task                    |
| PUT    | /api/v1/tasks/:id     | Update a task                        |
| DELETE | /api/v1/tasks/:id     | Delete a task                        |

### Query params on GET /api/v1/tasks

- `keyword` - search by title
- `status` - filter by status (`To Do`, `In Progress`, `Done`)
- `priority` - filter by priority (`Low`, `Medium`, `High`)
- `page`, `limit` - pagination (response includes `page`, `totalPages`, `totalResults`)

## Task fields

`title` (required), `description`, `status` (`To Do` | `In Progress` | `Done`, default `To Do`), `priority` (`Low` | `Medium` | `High`, default `Medium`), `dueDate`.

Each task belongs to the user who created it; a user can only read, update, or delete their own tasks.

## Deployment (Vercel)

This repo includes a `vercel.json` that runs `server.js` as a serverless function via `@vercel/node`.

Steps:

1. Import the repo into Vercel.
2. In Project Settings > Environment Variables, add: `NODE_ENV=production`, `DB_URI`, `JWT_SECRET_KEY`, `JWT_EXPIRE_TIME`, `CLIENT_URL` (your deployed frontend URL, e.g. `https://your-frontend.vercel.app`).
3. Deploy. Vercel builds and calls the exported Express `app` on each request; the app never binds a local port in that environment.

Notes:

- `CLIENT_URL` must exactly match the frontend's deployed origin for CORS and cookies to work.
- Since the API is deployed over HTTPS and the frontend is on a different origin, cookies are sent with `secure: true` and `sameSite: none` automatically when `NODE_ENV=production` (see `services/authService.js`).

## AI Tools Disclosure

AI tools (e.g. Claude) were used to help write clear and consistent commit messages, and to help draft this README. All code, architecture decisions, and implementation were written and reviewed manually.
