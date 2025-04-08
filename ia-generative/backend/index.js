const express = require("express");
const perguntar = require("./gnai");
const app = express();
require("dotenv").config();

app.use(express.json());
const cors = require("cors");
app.use(cors());

app.post("/perguntar", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt é obrigatório" });

  const resposta = await perguntar(prompt);
  res.json({ resposta });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
