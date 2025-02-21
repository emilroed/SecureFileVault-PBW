const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const users = [
  {
    id: 1,
    username: "admin",
    password: bcrypt.hashSync("password123", 10),
    secretKey: "MySecretKey12345678901234567890",
  },
  {
    id: 2,
    username: "user",
    password: bcrypt.hashSync("userpass", 10),
    secretKey: "UserSecretKey09876543210987654321",
  },
];

const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Adgang nægtet: Intet token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = users.find((u) => u.id === decoded.id);
    if (!req.user) return res.status(401).send("Bruger ikke fundet");
    next();
  } catch (err) {
    res.status(400).send("Ugyldigt token");
  }
};

module.exports = { users, generateToken, authenticate };
