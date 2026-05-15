// ============================================
// CONTROLLER DO ENSINO SECUNDÁRIO
// TODA LÓGICA QUE ESTAVA NO wesec.html
// ============================================

// Função para gerar o prompt e abrir ChatGPT
async function gerarPrompt(req, res) {
  try {
    const { tema, disciplina, paginas } = req.body;
    
    if (!tema || !disciplina) {
      return res.status(400).json({ error: "Tema e disciplina são obrigatórios" });
    }
    
    if (paginas < 5 || paginas > 20) {
      return res.status(400).json({ error: "Páginas: mínimo 5, máximo 20" });
    }
    
    // PROMPT SECRETO
    const prompt = `Gere um trabalho escolar de nível SECUNDÁRIO (8ª a 12ª classe) em formato JSON PURO.
NÃO inclua introduções, explicações ou conclusões fora do JSON.
Responda APENAS com o JSON válido.

TEMA: "${tema}"
DISCIPLINA: ${disciplina}
PÁGINAS APROXIMADAS: ${paginas}
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
  "indice": ["1. Introdução", "2. Desenvolvimento", "2.1. Conceitos Fundamentais", "2.2. Aplicações Práticas", "3. Conclusão", "4. Referências"],
  "introducao": "Texto EXPANSIVO da introdução com vários parágrafos. Apresente o tema, contextualize, explique a importância e descreva o que será abordado.",
  "desenvolvimento": [
    {
      "titulo": "Conceitos Fundamentais",
      "conteudo": "Texto DETALHADO e EXPANSIVO. Desenvolva completamente este tópico com explicações aprofundadas, exemplos do contexto moçambicano."
    },
    {
      "titulo": "Aplicações Práticas",
      "conteudo": "Mais texto DETALHADO. Continue a desenvolver o tema com profundidade, trazendo diferentes perspectivas, exemplos práticos."
    }
  ],
  "conclusao": "Texto EXPANSIVO da conclusão com vários parágrafos. Faça uma síntese abrangente do que foi abordado.",
  "referencias": [
    "Autor, A. (2023). Fundamentos de ${disciplina}. Maputo: Editora Escolar."
  ]
}

REGRAS: Linguagem simples. Contexto moçambicano. SEJA EXPANSIVO. NÃO adicione texto antes ou depois do JSON.`;

    const encodedPrompt = encodeURIComponent(prompt);
    const chatURL = `https://chat.openai.com/?q=${encodedPrompt}`;
    
    res.json({ success: true, url: chatURL });
    
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro ao gerar prompt" });
  }
}

// Função para processar o JSON e retornar o HTML pronto
async function processarJSON(req, res) {
  try {
    const { jsonText, tema, disciplina } = req.body;
    
    if (!jsonText) {
      return res.status(400).json({ error: "JSON não fornecido" });
    }
    
    // Limpar e validar JSON
    let cleanJson = jsonText;
    const jsonStart = cleanJson.indexOf('{');
    const jsonEnd = cleanJson.lastIndexOf('}') + 1;
    
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      cleanJson = cleanJson.substring(jsonStart, jsonEnd);
    }
    
    const data = JSON.parse(cleanJson);
    
    // Validar estrutura
    if (!data.capa || !data.introducao || !data.desenvolvimento || !data.conclusao) {
      throw new Error('JSON incompleto. Verifique se copiou todo o conteúdo.');
    }
    
    // GERAR HTML DO TRABALHO (TODA LÓGICA DE FORMATAÇÃO AQUI)
    let html = '';
    
    // Capa
    html += `<h1 style="text-align:center;">${data.capa.titulo || tema || 'Trabalho Escolar'}</h1>`;
    html += `<p style="text-align:center; color:#b0b0d0;">${data.capa.escola || 'Escola Secundária'}</p>`;
    html += `<p style="text-align:center; color:#b0b0d0;">Disciplina: ${data.capa.disciplina || disciplina || ''}</p>`;
    html += `<p style="text-align:center; color:#b0b0d0;">${data.capa.cidade || 'Maputo'}, ${data.capa.ano || '2026'}</p>`;
    html += `<hr style="border-color:rgba(255,255,255,0.08); margin:25px 0;">`;
    
    // Índice
    if (data.indice && Array.isArray(data.indice) && data.indice.length > 0) {
      html += `<h2>ÍNDICE</h2>`;
      data.indice.forEach(item => html += `<p style="color:#b0b0d0;">${item}</p>`);
      html += `<br>`;
    }
    
    // Introdução
    html += `<h2>1. INTRODUÇÃO</h2>`;
    html += `<p>${data.introducao.replace(/\n/g, '</p><p>')}</p>`;
    
    // Desenvolvimento
    html += `<h2>2. DESENVOLVIMENTO</h2>`;
    if (Array.isArray(data.desenvolvimento)) {
      data.desenvolvimento.forEach(sec => {
        html += `<h3 style="color:#FF8C5A; margin-top:18px;">${sec.titulo || ''}</h3>`;
        html += `<p>${(sec.conteudo || '').replace(/\n/g, '</p><p>')}</p>`;
      });
    }
    
    // Conclusão
    html += `<h2>3. CONCLUSÃO</h2>`;
    html += `<p>${data.conclusao.replace(/\n/g, '</p><p>')}</p>`;
    
    // Referências
    if (data.referencias && Array.isArray(data.referencias) && data.referencias.length > 0) {
      html += `<h2>4. REFERÊNCIAS BIBLIOGRÁFICAS</h2>`;
      data.referencias.forEach(ref => html += `<p style="margin-bottom:4px;">${ref}</p>`);
    }
    
    res.json({ 
      success: true, 
      html: html,
      titulo: data.capa.titulo || tema
    });
    
  } catch (error) {
    console.error('Erro ao processar JSON:', error);
    res.status(400).json({ error: 'JSON inválido: ' + error.message });
  }
}

module.exports = { gerarPrompt, processarJSON };
