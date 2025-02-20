require("dotenv").config();
const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const db = require("./database"); // Importér SQLite-database

const app = express();
//const port = 3000;
const port = process.env.PORT || 3000;

// 📂 Opret uploads-mappe, hvis den ikke findes
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 🔄 Opsætning af filupload med Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 🔐 AES-256 Kryptering
// const ENCRYPTION_KEY = "12345678901234567890123456789012"; // 32 bytes
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "fallback_key_12345678901234567890123456789012";
const IV_LENGTH = 16;

function encrypt(buffer) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
  let textParts = text.split(":");
  let iv = Buffer.from(textParts[0], "hex");
  let encryptedText = Buffer.from(textParts[1], "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted;
}

// 📌 Rute til filupload
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("Ingen fil modtaget");

  const encryptedData = encrypt(req.file.buffer);
  const encryptedFilename = `${Date.now()}-${req.file.originalname}.enc`;
  fs.writeFileSync(`${uploadDir}/${encryptedFilename}`, encryptedData, "utf-8");

  // 🔄 Gem metadata i databasen
  const insert = db.prepare(`INSERT INTO files (filename, encrypted_filename) VALUES (?, ?)`);
  const info = insert.run(req.file.originalname, encryptedFilename);

  res.json({ message: "Fil uploadet og krypteret!", fileId: info.lastInsertRowid });
});

// 📌 Rute til at hente filer
app.get("/files", (req, res) => {
  const rows = db.prepare(`SELECT * FROM files`).all();
  res.json(rows);
});

// 📌 Rute til at downloade og dekryptere en fil
app.get("/download/:id", (req, res) => {
  const file = db.prepare(`SELECT * FROM files WHERE id = ?`).get(req.params.id);
  if (!file) return res.status(404).send("Fil ikke fundet");

  const filePath = `${uploadDir}/${file.encrypted_filename}`;
  if (!fs.existsSync(filePath)) return res.status(404).send("Krypteret fil ikke fundet");

  const encryptedData = fs.readFileSync(filePath, "utf-8");
  const decryptedData = decrypt(encryptedData);

  res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
  res.send(decryptedData);
});

// 🔄 Start server
app.listen(port, () => {
  console.log(`✅ Server kører på http://localhost:${port}`);
});
