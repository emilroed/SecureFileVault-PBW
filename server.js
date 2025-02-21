require("dotenv").config();
const express = require("express");

const fileRoutes = require("./routes/fileRoutes");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/api/files", fileRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server kører på http://localhost:${PORT}`);
});
