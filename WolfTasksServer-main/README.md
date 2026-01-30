# Team Tasks API (Node.js + Express + SQLite)

Production-ready minimal API for team project/task management. Works locally with SQLite file and deploys to Render with a persistent disk.

## Endpoints (brief)
- `POST /api/auth/register` — body: `{ name, email, password }`
- `POST /api/auth/login` — body: `{ email, password }` -> `{ token, user }`
- `GET /api/teams` — requires Bearer token
- `POST /api/teams` — `{ name }`
- `POST /api/teams/:teamId/members` — `{ userId, role }`
- `GET /api/projects` — user projects
- `POST /api/projects` — `{ teamId, name, description? }`
- `GET /api/tasks?projectId=`
- `POST /api/tasks` — `{ projectId, title, ... }`
- `PATCH /api/tasks/:id` — partial updates
- `DELETE /api/tasks/:id`
- `GET /api/comments?taskId=`
- `POST /api/comments` — `{ taskId, body }`

Auth: Bearer JWT in `Authorization` header.

## Local setup
```bash
cp .env.example .env
npm install
npm run seed  # optional demo data
npm start
# open http://localhost:3000/health
```

## Deploy to Render
- Push repo to GitHub.
- On Render: New + Web Service.
- Select repo, set Root Directory to repo root.
- Render will read `render.yaml` and provision a persistent disk at `/data` for the SQLite file.
- Ensure env var `DB_FILE` is `/data/data.sqlite` (already in render.yaml).
- First deploy: you can trigger seeding manually by running `npm run seed` in Render Shell, or set `SEED=true` temporarily and add a seeding hook.

## Notes
- DB is SQLite with WAL and foreign keys enforced.
- Simple role field exists but no advanced RBAC yet.
- For production, rotate `JWT_SECRET` and add rate limiting.
