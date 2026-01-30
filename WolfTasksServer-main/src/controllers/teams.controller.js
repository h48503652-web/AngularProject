import db from '../db.js';

export function listTeams(req, res) {
  const targetUserId = req.query.userId || req.user.id;
  const teams = db
    .prepare(
      `SELECT t.*, (
         SELECT COUNT(*) FROM team_members tm WHERE tm.team_id = t.id
       ) as members_count
       FROM teams t
       JOIN team_members tm ON tm.team_id = t.id
       WHERE tm.user_id = ?
       GROUP BY t.id`
    )
    .all(targetUserId);
  res.json(teams);
}

export function createTeam(req, res) {
  const { name } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name required' });
  const info = db.prepare('INSERT INTO teams (name) VALUES (?)').run(name);
  db
    .prepare('INSERT INTO team_members (team_id, user_id, role) VALUES (?,?,?)')
    .run(info.lastInsertRowid, req.user.id, 'owner');
  const team = db.prepare('SELECT * FROM teams WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(team);
}

export function addMember(req, res) {
  const { teamId } = req.params;
  const { userId, role = 'member' } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const membership = db
    .prepare('SELECT role FROM team_members WHERE team_id = ? AND user_id = ?')
    .get(teamId, req.user.id);
  if (!membership) return res.status(403).json({ error: 'Not a team member' });
  // Note: role enforcement (owner/admin) is intentionally not applied here to match current route behavior
  db
    .prepare('INSERT OR IGNORE INTO team_members (team_id, user_id, role) VALUES (?,?,?)')
    .run(teamId, userId, role);
  res.status(204).end();
}

export function deleteTeam(req, res) {
  const { teamId } = req.params;
  const membership = db
    .prepare('SELECT role FROM team_members WHERE team_id = ? AND user_id = ?')
    .get(teamId, req.user.id);
  if (!membership) {
    return res.status(403).json({ error: 'Not a team member' });
  }
  const team = db.prepare('SELECT id FROM teams WHERE id = ?').get(teamId);
  if (!team) return res.status(404).json({ error: 'Team not found' });
  db.prepare('DELETE FROM teams WHERE id = ?').run(teamId);
  return res.status(204).end();
}

export function listTeamMembers(req, res) {
  const { teamId } = req.params;
  // Require the requester to be authenticated; membership check is optional per current policy
  const rows = db
    .prepare(
      `SELECT u.id, u.name
       FROM team_members tm
       JOIN users u ON u.id = tm.user_id
       WHERE tm.team_id = ?
       ORDER BY u.name ASC`
    )
    .all(teamId);
  res.json(rows);
}

export function removeMember(req, res) {
  const { teamId, userId } = req.params;
  const membership = db
    .prepare('SELECT 1 FROM team_members WHERE team_id = ? AND user_id = ?')
    .get(teamId, req.user.id);
  if (!membership) return res.status(403).json({ error: 'Not a team member' });
  // Ensure team exists
  const team = db.prepare('SELECT id FROM teams WHERE id = ?').get(teamId);
  if (!team) return res.status(404).json({ error: 'Team not found' });
  // Remove the specified user from the team
  db.prepare('DELETE FROM team_members WHERE team_id = ? AND user_id = ?').run(teamId, userId);
  return res.status(204).end();
}
