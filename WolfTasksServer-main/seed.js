import 'dotenv/config';
import db from './src/db.js';
import bcrypt from 'bcryptjs';

function upsertUser(name, email, password, role='user') {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return existing.id;
  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)').run(name, email, hash, role);
  return info.lastInsertRowid;
}

function seed() {
  const aliceId = upsertUser('Alice', 'alice@example.com', 'Password1!');
  const bobId = upsertUser('Bob', 'bob@example.com', 'Password1!');

  const tinfo = db.prepare('INSERT INTO teams (name) VALUES (?)').run('Core Team');
  const teamId = tinfo.lastInsertRowid;
  db.prepare('INSERT OR IGNORE INTO team_members (team_id, user_id, role) VALUES (?,?,?)').run(teamId, aliceId, 'owner');
  db.prepare('INSERT OR IGNORE INTO team_members (team_id, user_id, role) VALUES (?,?,?)').run(teamId, bobId, 'member');

  const pinfo = db.prepare('INSERT INTO projects (team_id, name, description) VALUES (?,?,?)').run(teamId, 'Launch', 'Product launch project');
  const projectId = pinfo.lastInsertRowid;

  const taskStmt = db.prepare('INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, order_index) VALUES (?,?,?,?,?,?,?)');
  taskStmt.run(projectId, 'Plan campaign', 'Define channels and KPIs', 'in_progress', 'high', aliceId, 1);
  taskStmt.run(projectId, 'Design assets', 'Create visuals', 'todo', 'normal', bobId, 2);
  taskStmt.run(projectId, 'Update landing page', 'Copy and layout', 'todo', 'low', null, 3);

  console.log('Seed completed. Users: alice@example.com/bob@example.com, password: Password1!');
}

seed();
