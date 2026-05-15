const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "https://nota-alta.vercel.app" }));
app.use(express.json());

// ============================================
// ROTA DE TESTE 1 (mais simples possível)
// ============================================
app.get("/api/teste1", (req, res) => {
  res.json({ 
    success: true, 
    message: "✅ Rota de teste 1 funcionando!",
    timestamp: new Date().toISOString()
  });
});

// ============================================
// ROTA DE TESTE 2 (POST simples)
// ============================================
app.post("/api/teste2", (req, res) => {
  res.json({ 
    success: true, 
    message: "✅ Rota de teste 2 funcionando!",
    dadosRecebidos: req.body
  });
});

// ============================================
// ROTA DE TESTE 3 (simula o gerar-prompt)
// ============================================
app.post("/api/teste3/gerar", (req, res) => {
  const { tema, disciplina, paginas } = req.body;
  
  console.log("📥 Recebido:", { tema, disciplina, paginas });
  
  const prompt = `Tema: ${tema}, Disciplina: ${disciplina}, Páginas: ${paginas}`;
  const chatURL = `https://chat.openai.com/?q=${encodeURIComponent(prompt)}`;
  
  res.json({ 
    success: true, 
    url: chatURL,
    mensagem: "Teste funcionando! Agora as rotas reais devem funcionar."
  });
});

// ============================================
// IMPORTAR ROTAS REAIS
// ============================================
let trabalhoRoutes, perfilRoutes, chatRoutes;

try {
  trabalhoRoutes = require("./routes/trabalhoRoutes");
  console.log("✅ Rotas de trabalho carregadas com sucesso");
} catch (error) {
  console.error("❌ Erro ao carregar rotas de trabalho:", error.message);
  trabalhoRoutes = null;
}

try {
  perfilRoutes = require("./routes/perfilRoutes");
  console.log("✅ Rotas de perfil carregadas com sucesso");
} catch (error) {
  console.error("❌ Erro ao carregar rotas de perfil:", error.message);
  perfilRoutes = null;
}

try {
  chatRoutes = require("./routes/chatRoutes");
  console.log("✅ Rotas de chat carregadas com sucesso");
} catch (error) {
  console.error("❌ Erro ao carregar rotas de chat:", error.message);
  chatRoutes = null;
}

// ============================================
// USAR ROTAS REAIS (se existirem)
// ============================================
if (trabalhoRoutes) {
  app.use("/api/trabalho", trabalhoRoutes);
  console.log("📌 Rotas /api/trabalho ativadas");
} else {
  console.log("⚠️ Rotas /api/trabalho NÃO foram ativadas (arquivo não encontrado)");
}

if (perfilRoutes) {
  app.use("/api/perfil", perfilRoutes);
}

if (chatRoutes) {
  app.use("/api/chat", chatRoutes);
}

// ============================================
// ROTA PRINCIPAL
// ============================================
app.get("/", (req, res) => {
  res.json({ 
    message: "API NotaAlta funcionando!",
    status: "online",
    endpoints_disponiveis: {
      testes: [
        "GET /api/teste1",
        "POST /api/teste2",
        "POST /api/teste3/gerar"
      ],
      reais: {
        trabalho: trabalhoRoutes ? "/api/trabalho/*" : "❌ NÃO DISPONÍVEL",
        perfil: perfilRoutes ? "/api/perfil/*" : "❌ NÃO DISPONÍVEL",
        chat: chatRoutes ? "/api/chat/*" : "❌ NÃO DISPONÍVEL"
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`📚 API NotaAlta pronta para uso`);
  console.log(`🧪 Teste: GET https://notaalta-api.onrender.com/api/teste1`);
});
