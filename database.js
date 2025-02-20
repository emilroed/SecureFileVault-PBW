const Database = require("better-sqlite3");

// Opret databasefilen, hvis den ikke findes
const db = new Database("./filevault.db");

// Opret tabel, hvis den ikke findes
db.exec(`
    CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        encrypted_filename TEXT NOT NULL,
        user_id INTEGER,
        upload_date TEXT DEFAULT CURRENT_TIMESTAMP
    )
`);

console.log("✅ Database oprettet og klar!");

module.exports = db;
