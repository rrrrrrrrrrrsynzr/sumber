import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const databasePath = resolve(process.env.FEEDBACK_DB_PATH || './data/feedback.sqlite');
mkdirSync(dirname(databasePath), { recursive: true });

const database = new Database(databasePath);
database.pragma('journal_mode = WAL');
database.pragma('foreign_keys = ON');
database.exec(`
  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Saran', 'Pertanyaan', 'Apresiasi')),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );
  CREATE INDEX IF NOT EXISTS feedback_created_at_idx ON feedback(created_at DESC);
`);

const insertFeedback = database.prepare(`
  INSERT INTO feedback (name, category, rating, message)
  VALUES (@name, @category, @rating, @message)
`);
const selectFeedback = database.prepare(`
  SELECT id, name, category, rating, message, created_at AS createdAt
  FROM feedback
  ORDER BY created_at DESC, id DESC
  LIMIT ?
`);
const feedbackCount = database.prepare('SELECT COUNT(*) AS count FROM feedback');

export function saveFeedback(feedback) {
  const result = insertFeedback.run(feedback);
  return database.prepare(`
    SELECT id, name, category, rating, message, created_at AS createdAt
    FROM feedback WHERE id = ?
  `).get(result.lastInsertRowid);
}

export function listFeedback(limit = 1000) {
  return selectFeedback.all(limit);
}

export function countFeedback() {
  return feedbackCount.get().count;
}

export function closeDatabase() {
  database.close();
}
