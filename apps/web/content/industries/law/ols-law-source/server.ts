import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("ehb_law.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'client',
    specialization TEXT,
    experience TEXT,
    rating REAL DEFAULT 0,
    sql_level TEXT DEFAULT 'Free',
    photo TEXT
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    cost TEXT,
    estimated_time TEXT
  );

  CREATE TABLE IF NOT EXISTS cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    lawyer_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(client_id) REFERENCES users(id),
    FOREIGN KEY(lawyer_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id INTEGER,
    sender_id INTEGER,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(case_id) REFERENCES cases(id),
    FOREIGN KEY(sender_id) REFERENCES users(id)
  );
`);

// Seed some data if empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare("INSERT INTO users (name, email, role, specialization, experience, rating, sql_level, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  insertUser.run("Ahmed Khan", "ahmed@example.com", "lawyer", "Criminal Lawyer", "10Y", 4.9, "VIP", "https://i.pravatar.cc/150?u=ahmed");
  insertUser.run("Sara Malik", "sara@example.com", "lawyer", "Family Lawyer", "8Y", 4.8, "HIGH", "https://i.pravatar.cc/150?u=sara");
  insertUser.run("Ali Raza", "ali@example.com", "lawyer", "Corporate Lawyer", "12Y", 5.0, "VIP", "https://i.pravatar.cc/150?u=ali");
  insertUser.run("Test Client", "client@example.com", "client", null, null, 0, "Free", null);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/lawyers", (req, res) => {
    const lawyers = db.prepare("SELECT * FROM users WHERE role = 'lawyer'").all();
    res.json(lawyers);
  });

  app.get("/api/cases", (req, res) => {
    const cases = db.prepare(`
      SELECT c.*, u.name as client_name, l.name as lawyer_name 
      FROM cases c 
      JOIN users u ON c.client_id = u.id 
      LEFT JOIN users l ON c.lawyer_id = l.id
    `).all();
    res.json(cases);
  });

  app.post("/api/cases", (req, res) => {
    const { client_id, lawyer_id, title, description } = req.body;
    const info = db.prepare("INSERT INTO cases (client_id, lawyer_id, title, description) VALUES (?, ?, ?, ?)").run(client_id, lawyer_id, title, description);
    res.json({ id: info.lastInsertRowid, status: "success" });
  });

  app.get("/api/stats", (req, res) => {
    const lawyers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'lawyer'").get() as { count: number };
    const cases = db.prepare("SELECT COUNT(*) as count FROM cases").get() as { count: number };
    const revenue = db.prepare("SELECT SUM(id) * 100 as total FROM cases").get() as { total: number }; // Mock revenue
    res.json({
      totalLawyers: lawyers.count,
      activeCases: cases.count,
      totalRevenue: revenue.total || 0
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
