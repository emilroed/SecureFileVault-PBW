require("dotenv").config();
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const db = require("../database");

const UPLOAD_DIR = "./uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

// 📌 Krypter fil
function encrypt(buffer) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "utf-8"), iv);
  let encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return { iv: iv.toString("hex"), data: encrypted.toString("hex") };
}

// 📌 Dekrypter fil
function decrypt(text, iv) {
  let ivBuffer = Buffer.from(iv, "hex");
  let encryptedText = Buffer.from(text, "hex");
  let decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "utf-8"),
    ivBuffer
  );
  let decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted;
}

// 📌 Upload fil
exports.uploadFile = (req, res) => {
  if (!req.file) return res.status(400).send("Ingen fil modtaget");

  let { iv, data } = encrypt(req.file.buffer);
  const encryptedFilename = `${Date.now()}-${req.file.originalname}.enc`;
  fs.writeFileSync(`${UPLOAD_DIR}/${encryptedFilename}`, iv + ":" + data, "utf-8");

  db.prepare("INSERT INTO files (filename, encrypted_filename, iv) VALUES (?, ?, ?)").run(
    req.file.originalname,
    encryptedFilename,
    iv
  );

  res.json({ message: "Fil uploadet!", filename: encryptedFilename });
};

// 📌 Download fil
exports.downloadFile = (req, res) => {
  const file = db
    .prepare("SELECT * FROM files WHERE encrypted_filename = ?")
    .get(req.params.filename);
  if (!file) return res.status(404).send("Fil ikke fundet");

  const filePath = `${UPLOAD_DIR}/${file.encrypted_filename}`;
  if (!fs.existsSync(filePath)) return res.status(404).send("Krypteret fil ikke fundet");

  const encryptedData = fs.readFileSync(filePath, "utf-8").split(":");

  try {
    const decryptedData = decrypt(encryptedData[1], file.iv);
    res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
    res.send(decryptedData);
  } catch (err) {
    res.status(403).json({ message: "Fejl ved dekryptering" });
  }
};
