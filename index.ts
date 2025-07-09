// index.js
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get("/players", async (req: any, res: { json: (arg0: any) => void; }) => {
  const result = await pool.query("SELECT * FROM app.players ORDER BY created_at DESC");
  res.json(result.rows);
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Servidor escuchando en el puerto 4000");
});
