# Team Tasks API – Full Reference

Base URL (local): http://localhost:3000

Auth
- All endpoints under /api (except /api/auth/* and /health) require Authorization: Bearer <token>.
- Obtain the token from login/register responses.

Health
- GET /health
  - 200 { "status": "ok" }

Auth
- POST /api/auth/register
  - Body: { "name": "Alice", "email": "alice@example.com", "password": "Password1!" }
  - 201 { user: { id, name, email, role }, token }
  - 400 if missing fields, 409 if email taken

- POST /api/auth/login
  - Body: { "email": "alice@example.com", "password": "Password1!" }
  - 200 { user: { id, name, email, role }, token }
  - 400/401 on invalid input/credentials

Teams (protected)
- GET /api/teams
  - Returns teams current user belongs to with members_count
  - 200 [ { id, name, created_at, members_count } ]

- POST /api/teams
  - Body: { "name": "Core Team" }
  - 201 team
  - 400 if missing name

- POST /api/teams/:teamId/members
  - Body: { "userId": 2, "role": "member" }
  - 204 on success
  - 400 if missing userId, 403 if caller not a member

Projects (protected)
- GET /api/projects
  - 200 [ { id, team_id, name, description, status, created_at } ]

- POST /api/projects
  - Body: { "teamId": 1, "name": "Launch", "description": "..." }
  - 201 project
  - 400 missing fields, 403 if not member of team

Tasks (protected)
- GET /api/tasks?projectId=1
  - 200 [ task ] – all tasks for projectId or all user tasks across teams if projectId omitted

- POST /api/tasks
  - Body: {
      "projectId": 1,
      "title": "Plan campaign",
      "description": "Define channels",
      "status": "todo|in_progress|done",
      "priority": "low|normal|high",
      "assigneeId": 2,
      "dueDate": "2025-12-31",
      "orderIndex": 0
    }
  - 201 created task
  - 400 if missing projectId/title

- PATCH /api/tasks/:id
  - Allowed fields: title, description, status, priority, assignee_id, due_date, order_index
  - 200 updated task; 400 if no valid fields

- DELETE /api/tasks/:id
  - 204 on success

Comments (protected)
- GET /api/comments?taskId=1
  - 200 [ { id, task_id, user_id, body, created_at, author_name } ]
  - 400 if missing taskId

- POST /api/comments
  - Body: { "taskId": 1, "body": "Looks good" }
  - 201 created comment

Common Headers
- Authorization: Bearer <token>
- Content-Type: application/json

cURL examples
- Register
  curl -s -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name":"Alice","email":"alice@example.com","password":"Password1!"}'

- Login
  curl -s -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"alice@example.com","password":"Password1!"}'

- Create Team
  curl -s -X POST http://localhost:3000/api/teams \
    -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
    -d '{"name":"Core Team"}'

Notes
- DB schema is created automatically on startup. Use seed.js to insert demo data.
- JWT secret must be set in production (.env or Render env var).
