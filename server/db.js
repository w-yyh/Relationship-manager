const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Contacts table
        db.run(`CREATE TABLE IF NOT EXISTS contacts (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            x REAL,
            y REAL,
            z REAL,
            note TEXT,
            category TEXT,
            value_provide TEXT,
            value_receive TEXT,
            tags TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )`, (err) => {
            if (!err) {
                // Attempt to add columns if they don't exist (for migration)
                // We ignore errors here because if the column exists, it will throw, which is fine.
                db.run(`ALTER TABLE contacts ADD COLUMN value_provide TEXT`, () => {});
                db.run(`ALTER TABLE contacts ADD COLUMN value_receive TEXT`, () => {});
                db.run(`ALTER TABLE contacts ADD COLUMN tags TEXT`, () => {});
            }
        });

        // Settings table
        db.run(`CREATE TABLE IF NOT EXISTS settings (
            user_id INTEGER PRIMARY KEY,
            config TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )`);
    });
}

module.exports = db;
