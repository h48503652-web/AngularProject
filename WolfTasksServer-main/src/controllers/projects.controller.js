import db from '../db.js';

export function listProjects(req, res) {
  const rows = db
    .prepare(
      `SELECT p.* FROM projects p
       JOIN team_members tm ON tm.team_id = p.team_id
       WHERE tm.user_id = ?
       ORDER BY p.created_at DESC`
    )
    .all(req.user.id);
  res.json(rows);
}

export function createProject(req, res) {
  const { teamId, name, description } = req.body || {};
  if (!teamId || !name) return res.status(400).json({ error: 'teamId and name required' });
  const member = db.prepare('SELECT 1 FROM team_members WHERE team_id = ? AND user_id = ?').get(teamId, req.user.id);
  if (!member) return res.status(403).json({ error: 'Not a team member' });
  const info = db.prepare('INSERT INTO projects (team_id, name, description) VALUES (?,?,?)').run(teamId, name, description || null);
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(project);
}

export function updateProject(req, res) {
  const { projectId } = req.params;
  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
  if (!existing) return res.status(404).json({ error: 'Project not found' });
  const membership = db.prepare(
    `SELECT 1 FROM team_members tm JOIN projects p ON p.team_id = tm.team_id
     WHERE p.id = ? AND tm.user_id = ?`
  ).get(projectId, req.user.id);
  if (!membership) return res.status(403).json({ error: 'Not a team member' });
  const { name, description, status } = req.body || {};
  if (name === undefined && description === undefined && status === undefined) {
    return res.status(400).json({ error: 'Nothing to update' });
  }
  const newName = name !== undefined ? name : existing.name;
  const newDescription = description !== undefined ? description : existing.description;
  const newStatus = status !== undefined ? status : existing.status;
  db.prepare('UPDATE projects SET name = ?, description = ?, status = ? WHERE id = ?').run(newName, newDescription, newStatus, projectId);
  const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
  res.json(updated);
}

export function deleteProject(req, res) {
  const { projectId } = req.params;
  const existing = db.prepare('SELECT id, team_id FROM projects WHERE id = ?').get(projectId);
  if (!existing) return res.status(404).json({ error: 'Project not found' });
  const membership = db.prepare(
    `SELECT 1 FROM team_members tm WHERE tm.team_id = ? AND tm.user_id = ?`
  ).get(existing.team_id, req.user.id);
  if (!membership) return res.status(403).json({ error: 'Not a team member' });
  db.prepare('DELETE FROM projects WHERE id = ?').run(projectId);
  return res.status(204).end();
}
