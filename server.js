const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "https://nota-alta.vercel.app" }));
app.use(express.json());

// Rotas
const trabalhoRoutes = require("./routes/trabalhoRoutes");
const perfilRoutes = require("./routes/perfilRoutes");
const chatRoutes = require("./routes/chatRoutes");

app.use("/api/trabalho", trabalhoRoutes);
app.use("/api/perfil", perfilRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API NotaAlta funcionando!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
