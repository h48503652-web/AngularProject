import db from '../db.js';

export function listComments(req, res) {
  const { taskId } = req.query;
  if (!taskId) return res.status(400).json({ error: 'taskId required' });
  const membership = db.prepare(`
    SELECT 1 FROM team_members tm
    JOIN projects p ON p.team_id = tm.team_id
    JOIN tasks t ON t.project_id = p.id
    WHERE t.id = ? AND tm.user_id = ?
  `).get(taskId, req.user.id);
  if (!membership) return res.status(403).json({ error: 'Not authorized to view comments for this task' });
  const rows = db.prepare('SELECT c.*, u.name as author_name FROM comments c JOIN users u ON u.id = c.user_id WHERE task_id = ? ORDER BY c.created_at ASC').all(taskId);
  res.json(rows);
}

export function createComment(req, res) {
  const { taskId, body } = req.body || {};
  if (!taskId || !body) return res.status(400).json({ error: 'taskId and body required' });
  const membership = db.prepare(`
    SELECT 1 FROM team_members tm
    JOIN projects p ON p.team_id = tm.team_id
    JOIN tasks t ON t.project_id = p.id
    WHERE t.id = ? AND tm.user_id = ?
  `).get(taskId, req.user.id);
  if (!membership) return res.status(403).json({ error: 'Not authorized to comment on this task' });
  const info = db.prepare('INSERT INTO comments (task_id, user_id, body) VALUES (?,?,?)').run(taskId, req.user.id, body);
  const row = db.prepare('SELECT * FROM comments WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(row);
}
