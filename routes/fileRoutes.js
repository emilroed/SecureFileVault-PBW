const express = require("express");
const { uploadFile, downloadFile } = require("../controllers/fileController");
const apiAuth = require("../middleware/apiAuth");
const multer = require("multer");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", apiAuth, upload.single("file"), uploadFile);
router.post("/download/:filename", apiAuth, downloadFile);

module.exports = router;
