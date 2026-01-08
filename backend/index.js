require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20kb" }));

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("Missing JWT_SECRET in .env");
  process.exit(1);
}

const users = [];
const products = [];
const orders = [];

const loginAttempts = {};

function rateLimitLogin(req, res, next) {
  const ip = req.ip || "unknown";
  const now = Date.now();

  if (!loginAttempts[ip]) {
    loginAttempts[ip] = { count: 0, firstTimeMs: now };
  }

  if (now - loginAttempts[ip].firstTimeMs > 60_000) {
    loginAttempts[ip] = { count: 0, firstTimeMs: now };
  }

  loginAttempts[ip].count += 1;

  if (loginAttempts[ip].count > 10) {
    return res.status(429).json({ error: "Too many attempts" });
  }

  next();
}

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Forbidden" });
    return next();
  };
}

function safeUser(u) {
  return { id: u.id, email: u.email, role: u.role };
}

function findUserByEmail(email) {
  return users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
}

app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/dev/make-admin", async (req, res) => {
  const email = String(req.body.email || "").trim();
  const password = String(req.body.password || "");

  if (!email.includes("@") || password.length < 8) {
    return res.status(400).json({ error: "Invalid input" });
  }
  if (findUserByEmail(email)) {
    return res.status(409).json({ error: "User exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = { id: users.length + 1, email, passwordHash, role: "admin" };
  users.push(admin);

  return res.json({ message: "Admin created", admin: safeUser(admin) });
});

app.post("/register", async (req, res) => {
  const email = String(req.body.email || "").trim();
  const password = String(req.body.password || "");

  if (!email.includes("@") || email.length > 120) {
    return res.status(400).json({ error: "Invalid input" });
  }
  if (password.length < 8 || password.length > 72) {
    return res.status(400).json({ error: "Invalid input" });
  }
  if (findUserByEmail(email)) {
    return res.status(409).json({ error: "Email already used" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, email, passwordHash, role: "client" };
  users.push(user);

  return res.status(201).json({ message: "User registered", user: safeUser(user) });
});

app.post("/login", rateLimitLogin, async (req, res) => {
  const email = String(req.body.email || "").trim();
  const password = String(req.body.password || "");

  const user = findUserByEmail(email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "2h" });
  return res.json({ token, role: user.role });
});

app.get("/products", (req, res) => {
  return res.json(products);
});

app.post("/products", auth, requireRole("seller"), (req, res) => {
  const name = String(req.body.name || "").trim();
  const price = Number(req.body.price);
  const description = String(req.body.description || "").trim();

  if (name.length < 2 || name.length > 80) return res.status(400).json({ error: "Invalid input" });
  if (!Number.isInteger(price) || price < 1 || price > 1_000_000) return res.status(400).json({ error: "Invalid input" });
  if (description.length > 500) return res.status(400).json({ error: "Invalid input" });

  const product = {
    id: products.length + 1,
    name,
    price,
    description,
    sellerId: req.user.id
  };
  products.push(product);

  return res.status(201).json({ message: "Product added", product });
});

app.post("/orders", auth, requireRole("client"), (req, res) => {
  const productId = Number(req.body.productId);
  if (!Number.isInteger(productId) || productId < 1) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const order = {
    id: orders.length + 1,
    productId,
    clientId: req.user.id,
    status: "PENDING"
  };
  orders.push(order);

  return res.status(201).json({ message: "Order created", order });
});

app.patch("/orders/:id/status", auth, requireRole("seller"), (req, res) => {
  const orderId = Number(req.params.id);
  const status = String(req.body.status || "").toUpperCase();

  if (!Number.isInteger(orderId) || orderId < 1) return res.status(400).json({ error: "Invalid input" });
  if (!["ACCEPTED", "REJECTED", "SHIPPED"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const order = orders.find(o => o.id === orderId);
  if (!order) return res.status(404).json({ error: "Order not found" });

  const product = products.find(p => p.id === order.productId);
  if (!product) return res.status(404).json({ error: "Product not found" });

  if (product.sellerId !== req.user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  order.status = status;
  return res.json({ message: "Order updated", order });
});

app.get("/admin/users", auth, requireRole("admin"), (req, res) => {
  return res.json(users.map(safeUser));
});

app.post("/admin/promote", auth, requireRole("admin"), (req, res) => {
  const userId = Number(req.body.userId);
  const newRole = String(req.body.newRole || "").trim();

  if (!Number.isInteger(userId) || userId < 1) return res.status(400).json({ error: "Invalid input" });
  if (!["client", "seller", "admin"].includes(newRole)) return res.status(400).json({ error: "Invalid role" });

  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.role = newRole;
  return res.json({ message: "User promoted", user: safeUser(user) });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
