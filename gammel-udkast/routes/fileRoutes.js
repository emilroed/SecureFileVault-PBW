const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const db = require("../database");
const { authenticate } = require("../middleware/auth");

const router = express.Router();
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// 🔹 Multer: Gemmer filer i "uploads/" før kryptering
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}.enc`); // Gemmer filen som en .enc-fil
  },
});
const upload = multer({ storage: storage });

// 🔐 AES-256 Kryptering
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "12345678901234567890123456789012"; // 32 bytes nøgle
const IV_LENGTH = 16; // Initialiseringsvektor skal være 16 bytes

function encryptFile(inputFilePath, outputFilePath) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);

  const input = fs.createReadStream(inputFilePath);
  const output = fs.createWriteStream(outputFilePath);

  input.pipe(cipher).pipe(output);

  return iv.toString("hex"); // Gem IV for dekryptering senere
}

function decryptFile(inputFilePath, outputFilePath, ivHex) {
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);

  const input = fs.createReadStream(inputFilePath);
  const output = fs.createWriteStream(outputFilePath);

  input.pipe(decipher).pipe(output);
}

// 🔄 Upload fil med kryptering
router.post("/upload", authenticate, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("Ingen fil modtaget");

  const encryptedFilename = req.file.filename;
  const encryptedFilePath = path.join(uploadDir, encryptedFilename);
  const iv = encryptFile(req.file.path, encryptedFilePath); // Krypter filen

  // Slet den ukrypterede fil
  fs.unlinkSync(req.file.path);

  // 🔄 Gem metadata i databasen
  const insert = db.prepare(
    `INSERT INTO files (filename, encrypted_filename, user_id, iv) VALUES (?, ?, ?, ?)`
  );
  const info = insert.run(req.file.originalname, encryptedFilename, req.user.id, iv);

  res.json({ message: "Fil uploadet og krypteret!", fileId: info.lastInsertRowid });
});

// 🔄 Hent liste over filer (kun for den loggede bruger)
router.get("/files", authenticate, (req, res) => {
  const files = db.prepare(`SELECT * FROM files WHERE user_id = ?`).all(req.user.id);
  res.json(files);
});

router.get("/files", authenticate, (req, res) => {
  console.log(`🔍 Henter filer for bruger ID: ${req.user.id}`);
  const files = db.prepare(`SELECT * FROM files WHERE user_id = ?`).all(req.user.id);
  console.log("🔍 Filer fundet:", files);
  res.json(files);
});

// 🔄 Download og dekrypter en fil
router.get("/download/:id", authenticate, (req, res) => {
  const file = db
    .prepare(`SELECT * FROM files WHERE id = ? AND user_id = ?`)
    .get(req.params.id, req.user.id);
  if (!file) return res.status(404).send("Fil ikke fundet");

  const encryptedFilePath = path.join(uploadDir, file.encrypted_filename);
  const decryptedFilePath = path.join(uploadDir, `decrypted-${file.filename}`);

  if (!fs.existsSync(encryptedFilePath)) return res.status(404).send("Krypteret fil ikke fundet");

  decryptFile(encryptedFilePath, decryptedFilePath, file.iv); // Dekrypter filen

  // Send den dekrypterede fil til brugeren
  res.download(decryptedFilePath, file.filename, () => {
    fs.unlinkSync(decryptedFilePath); // Slet den dekrypterede fil efter download
  });
});

module.exports = router;
