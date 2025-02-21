const Database = require("better-sqlite3");

const db = new Database("./filevault.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        encrypted_filename TEXT NOT NULL,
        iv TEXT NOT NULL,
        upload_date TEXT DEFAULT CURRENT_TIMESTAMP
    )
`);

console.log("✅ Database oprettet!");
module.exports = db;
