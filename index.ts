// index.js
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "https://inflables-system.vercel.app", 
  })
)
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get("/players", async (req: any, res: { json: (arg0: any) => void; }) => {
  const result = await pool.query("SELECT * FROM app.players ORDER BY created_at DESC");
  res.json(result.rows);
});


app.post("/players", async (req: { body: { name: any; duration: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }) => {
  const { name, duration } = req.body;
  if (!name || !duration) return res.status(400).json({ error: "Faltan datos" });

  const result = await pool.query(
    `INSERT INTO app.players (name, start_time, duration, status, created_at)
     VALUES ($1, NOW(), $2, 'active', NOW()) RETURNING *`,
    [name, duration]
  );
  res.status(201).json(result.rows[0]);
});


app.listen(process.env.PORT || 4000, () => {
  console.log("Servidor escuchando en el puerto 4000");
});
