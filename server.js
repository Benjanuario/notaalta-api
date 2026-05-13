const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Configurar CORS para aceitar requisições do frontend
app.use(cors({
  origin: "https://nota-alta.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ 
    message: "API NotaAlta funcionando!",
    status: "online"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
