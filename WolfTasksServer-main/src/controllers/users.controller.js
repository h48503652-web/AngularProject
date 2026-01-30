import db from '../db.js';

export function listUsers(_req, res) {
  const rows = db
    .prepare('SELECT id, name FROM users ORDER BY name ASC')
    .all();
  res.json(rows);
}
