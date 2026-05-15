// ============================================
// CONTROLLER DE TRABALHOS (LÓGICA + PROMPTS)
// ============================================

// Função auxiliar para chamar ChatGPT
async function chamarChatGPT(prompt) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("API key não configurada");
  }
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  });
  
  const data = await response.json();
  const conteudo = data.choices[0].message.content;
  
  // Extrair JSON da resposta
  const jsonMatch = conteudo.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch[0]);
}

// ============================================
// 1. ENSINO SECUNDÁRIO (com prompt embutido)
// ============================================
async function gerarSecundario(req, res) {
  try {
    const { tema, disciplina, paginas } = req.body;
    
    if (!tema || !disciplina) {
      return res.status(400).json({ error: "Tema e disciplina são obrigatórios" });
    }
    
    // PROMPT SECRETO - Ensino Secundário
    const prompt = `Gere um trabalho escolar de nível SECUNDÁRIO (8ª a 12ª classe) em formato JSON PURO.
NÃO inclua introduções, explicações ou conclusões fora do JSON.
Responda APENAS com o JSON válido.

TEMA: "${tema}"
DISCIPLINA: ${disciplina}
PÁGINAS APROXIMADAS: ${paginas || 7}
IDIOMA: Português de Moçambique

FORMATO JSON EXIGIDO:
{
  "capa": {
    "escola": "Escola Secundária de Moçambique",
    "titulo": "${tema}",
    "disciplina": "${disciplina}",
    "cidade": "Maputo",
    "ano": "2026"
  },
  "indice": ["1. Introdução", "2. Desenvolvimento", "3. Conclusão", "4. Referências"],
  "introducao": "Texto EXPANSIVO da introdução com vários parágrafos. Apresente o tema, contextualize para a realidade moçambicana, explique a importância.",
  "desenvolvimento": [
    {"titulo": "Conceitos Fundamentais", "conteudo": "Texto DETALHADO e EXPANSIVO com explicações aprofundadas e exemplos."},
    {"titulo": "Aplicações Práticas", "conteudo": "Mais texto DETALHADO com exemplos do contexto moçambicano."}
  ],
  "conclusao": "Texto EXPANSIVO da conclusão com síntese e reflexão final.",
  "referencias": ["Autor, A. (2023). Título do Livro. Editora."]
}

REGRAS: Linguagem simples. Contexto moçambicano. SEJA EXPANSIVO.`;

    let trabalho;
    
    if (process.env.OPENAI_API_KEY) {
      trabalho = await chamarChatGPT(prompt);
    } else {
      // Fallback para desenvolvimento
      trabalho = {
        capa: { titulo: tema, disciplina: disciplina },
        introducao: `Este trabalho aborda o tema "${tema}" na disciplina de ${disciplina}.`,
        desenvolvimento: [{ titulo: "Conteúdo", conteudo: "Desenvolvimento detalhado..." }],
        conclusao: "Conclusão do trabalho.",
        referencias: ["Autor (2024). Livro Base."]
      };
    }
    
    res.json({ success: true, trabalho });
    
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro ao gerar trabalho secundário" });
  }
}

// ============================================
// 2. TÉCNICO PROFISSIONAL (com prompt embutido)
// ============================================
async function gerarTecnico(req, res) {
  try {
    const { tema, curso, tipoTrabalho, paginas } = req.body;
    
    if (!tema || !curso || !tipoTrabalho) {
      return res.status(400).json({ error: "Tema, curso e tipo são obrigatórios" });
    }
    
    // PROMPT SECRETO - Técnico Profissional
    const prompt = `Gere um trabalho de nível TÉCNICO PROFISSIONAL em formato JSON PURO.
NÃO inclua texto antes ou depois do JSON.

TEMA: "${tema}"
CURSO: ${curso}
TIPO: ${tipoTrabalho}
PÁGINAS: ${paginas || 12}
IDIOMA: Português de Moçambique

FORMATO JSON:
{
  "capa": {"instituicao": "Instituto Técnico", "titulo": "${tema}", "curso": "${curso}", "cidade": "Maputo", "ano": "2026"},
  "resumo": "Resumo EXPANSIVO de 100-150 palavras.",
  "palavrasChave": ["palavra1", "palavra2", "palavra3"],
  "introducao": "Contextualização EXPANSIVA do tema...",
  "objetivos": {"geral": "Objetivo geral", "especificos": ["Obj1", "Obj2"]},
  "justificativa": "Texto EXPANSIVO justificando a relevância.",
  "metodologia": {"tipo": "${tipoTrabalho}", "abordagem": "Qualitativa", "fontes": "Bibliográficas"},
  "desenvolvimento": [{"titulo": "Seção", "conteudo": "Conteúdo EXPANSIVO e DETALHADO."}],
  "conclusao": "Síntese EXPANSIVA dos achados.",
  "referencias": ["Autor (Ano). Título. Editora."]
}

REGRAS: Linguagem técnica acessível. Contexto moçambicano. SEJA EXPANSIVO.`;

    let trabalho;
    
    if (process.env.OPENAI_API_KEY) {
      trabalho = await chamarChatGPT(prompt);
    } else {
      trabalho = {
        capa: { titulo: tema, curso: curso },
        introducao: `Trabalho técnico sobre "${tema}".`,
        desenvolvimento: [],
        conclusao: "Conclusão do trabalho técnico."
      };
    }
    
    res.json({ success: true, trabalho });
    
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro ao gerar trabalho técnico" });
  }
}

// ============================================
// 3. UNIVERSITÁRIO (com prompt embutido)
// ============================================
async function gerarUniversitario(req, res) {
  try {
    const { tema, curso, tipoTrabalho, paginas } = req.body;
    
    if (!tema || !curso || !tipoTrabalho) {
      return res.status(400).json({ error: "Tema, curso e tipo são obrigatórios" });
    }
    
    // PROMPT SECRETO - Universitário (Normas APA)
    const prompt = `Gere um trabalho de nível UNIVERSITÁRIO em formato JSON PURO.
Siga as normas APA 6ª edição.

TEMA: "${tema}"
CURSO: ${curso}
TIPO: ${tipoTrabalho}
PÁGINAS: ${paginas || 20}
IDIOMA: Português de Moçambique

FORMATO JSON:
{
  "capa": {"universidade": "Universidade...", "titulo": "${tema}", "autor": "...", "cidade": "Maputo", "ano": "2026"},
  "resumo": {"portugues": "Resumo EXPANSIVO 200-300 palavras.", "ingles": "Abstract..."},
  "palavrasChave": {"portugues": ["p1","p2","p3"], "ingles": ["k1","k2","k3"]},
  "introducao": "Contextualização EXPANSIVA com problema, hipóteses e objetivos.",
  "quadroTeorico": [{"titulo": "Teoria Base", "conteudo": "Texto EXPANSIVO com citações APA."}],
  "metodologia": {"paradigma": "Qualitativo", "metodo": "Pesquisa Bibliográfica"},
  "conclusao": "Síntese EXPANSIVA, recomendações e limitações.",
  "referencias": ["Autor, A. (Ano). Título. Cidade: Editora."]
}

REGRAS: Normas APA 6ª. Citações: (Autor, Ano, p. X). Contexto moçambicano. SEJA EXPANSIVO.`;

    let trabalho;
    
    if (process.env.OPENAI_API_KEY) {
      trabalho = await chamarChatGPT(prompt);
    } else {
      trabalho = {
        capa: { titulo: tema },
        resumo: { portugues: "Resumo do trabalho universitário." },
        introducao: `Introdução ao tema "${tema}".`,
        conclusao: "Conclusão do trabalho."
      };
    }
    
    res.json({ success: true, trabalho });
    
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro ao gerar trabalho universitário" });
  }
}

// ============================================
// EXPORTAR
// ============================================
module.exports = {
  gerarSecundario,
  gerarTecnico,
  gerarUniversitario
};
