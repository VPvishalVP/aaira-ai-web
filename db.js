require('dotenv').config();
const { createClient } = require('@libsql/client');

const url = process.env.TURSO_DATABASE_URL || 'file:local.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

const db = createClient({
  url,
  authToken: authToken || undefined
});

async function initDb() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS aaira_web_creations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        prompt TEXT,
        code TEXT NOT NULL,
        category TEXT DEFAULT 'app',
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS aaira_web_chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS aaira_web_memories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fact TEXT NOT NULL,
        category TEXT DEFAULT 'general',
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS aaira_web_auth_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key_code TEXT NOT NULL,
        ip TEXT,
        status TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);

    console.log('[DB] Turso Database initialized successfully');
  } catch (err) {
    console.error('[DB] Error initializing database:', err.message);
  }
}

module.exports = {
  db,
  initDb
};
