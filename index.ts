// ✅ ARCHIVO: index.ts (BACKEND)
import express from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*", // Permitir todos los orígenes para pruebas. En producción puedes restringir.
  })
);
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Obtener todos los jugadores
app.get("/players", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM app.players ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error en GET /players:", err);
    res.status(500).json({ error: "Error al obtener jugadores" });
  }
});

// ✅ Agregar nuevo jugador
app.post("/players", async (req, res) => {
  try {
    const { name, duration } = req.body;

    if (!name || !duration) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

    const result = await pool.query(
      `INSERT INTO app.players (name, start_time, duration, status, created_at)
       VALUES ($1, NOW(), $2, 'active', NOW()) RETURNING *`,
      [name, duration]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error en POST /players:", err);
    res.status(500).json({ error: "Error al insertar jugador" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});