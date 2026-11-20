const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "healthy", database: "connected" });
  } catch (error) {
    res.status(503).json({ status: "unhealthy" });
  }
});

app.get("/api/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.post("/api/tasks", async (req, res) => {
  const title = req.body?.title;

  if (typeof title !== "string" ||
      !title.trim() ||
      title.length > 200) {
    return res.status(400).json({
      error: "Title must be between 1 and 200 characters"
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
      [title.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Backend running on port 3000");
});
