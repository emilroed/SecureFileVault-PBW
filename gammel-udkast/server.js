require("dotenv").config();
const express = require("express");
const fileRoutes = require("./routes/fileRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express(); // 🔹 app skal være defineret først!

// 📂 Server statiske filer fra "public/" mappen (Frontend)
app.use(express.static("public"));

const port = process.env.PORT || 3000;

// Middleware til at håndtere JSON-data
app.use(express.json());

// Tilføj API-ruter
app.use("/api/files", fileRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`✅ Server kører på http://localhost:${port}`);
});
