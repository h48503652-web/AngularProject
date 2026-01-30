import db from '../db.js';

export function listTasks(req, res) {
  const { projectId } = req.query;
  let rows;
  if (projectId) {
    const member = db.prepare(`
      SELECT 1 FROM team_members tm
      JOIN projects p ON p.team_id = tm.team_id
      WHERE p.id = ? AND tm.user_id = ?
    `).get(projectId, req.user.id);
    if (!member) return res.status(403).json({ error: 'Not a member of the project team' });
    rows = db.prepare('SELECT * FROM tasks WHERE project_id = ? ORDER BY order_index ASC, created_at DESC').all(projectId);
  } else {
    rows = db.prepare(`
      SELECT t.* FROM tasks t
      JOIN projects p ON p.id = t.project_id
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE tm.user_id = ?
      ORDER BY t.created_at DESC`).all(req.user.id);
  }
  res.json(rows);
}

export function createTask(req, res) {
  const { projectId, title, description, status = 'todo', priority = 'normal', assigneeId = null, dueDate = null, orderIndex = 0 } = req.body || {};
  if (!projectId || !title) return res.status(400).json({ error: 'projectId and title required' });
  const member = db.prepare(`
    SELECT 1 FROM team_members tm
    JOIN projects p ON p.team_id = tm.team_id
    WHERE p.id = ? AND tm.user_id = ?
  `).get(projectId, req.user.id);
  if (!member) return res.status(403).json({ error: 'Not a member of the project team' });
  const info = db.prepare(`INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, due_date, order_index)
    VALUES (?,?,?,?,?,?,?,?)`).run(projectId, title, description || null, status, priority, assigneeId, dueDate, orderIndex);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(task);
}

export function updateTask(req, res) {
  const { id } = req.params;
  const allowed = ['title','description','status','priority','assignee_id','due_date','order_index'];
  const body = req.body || {};
  const fields = [];
  const values = [];
  const taskRow = db.prepare(`
    SELECT t.*, p.team_id FROM tasks t
    JOIN projects p ON p.id = t.project_id
    WHERE t.id = ?
  `).get(id);
  if (!taskRow) return res.status(404).json({ error: 'Task not found' });
  const membership = db.prepare('SELECT 1 FROM team_members WHERE team_id = ? AND user_id = ?').get(taskRow.team_id, req.user.id);
  if (!membership) return res.status(403).json({ error: 'Not authorized to modify this task' });
  for (const key of allowed) {
    if (key in body) {
      fields.push(`${key} = ?`);
      values.push(body[key]);
    }
  }
  if (fields.length === 0) return res.status(400).json({ error: 'No valid fields' });
  values.push(id);
  const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
  db.prepare(sql).run(...values);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.json(task);
}

export function deleteTask(req, res) {
  const { id } = req.params;
  const taskRow = db.prepare(`
    SELECT t.*, p.team_id FROM tasks t
    JOIN projects p ON p.id = t.project_id
    WHERE t.id = ?
  `).get(id);
  if (!taskRow) return res.status(404).json({ error: 'Task not found' });
  const membership = db.prepare('SELECT 1 FROM team_members WHERE team_id = ? AND user_id = ?').get(taskRow.team_id, req.user.id);
  if (!membership) return res.status(403).json({ error: 'Not authorized to delete this task' });
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  res.status(204).end();
}
