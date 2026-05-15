// ============================================
// CONTROLLER DO TÉCNICO PROFISSIONAL
// TODA LÓGICA QUE ESTAVA NO wetp.html
// ============================================

async function gerarPrompt(req, res) {
  try {
    const { tema, curso, tipoTrabalho, paginas } = req.body;
    
    if (!tema || !curso || !tipoTrabalho) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }
    
    if (paginas < 8 || paginas > 25) {
      return res.status(400).json({ error: "Páginas: mínimo 8, máximo 25" });
    }
    
    const prompt = `Gere um trabalho de nível TÉCNICO PROFISSIONAL em formato JSON PURO.
NÃO inclua texto antes ou depois do JSON. Responda APENAS com JSON.

TEMA: "${tema}"
CURSO: ${curso}
TIPO: ${tipoTrabalho}
PÁGINAS: ${paginas}
IDIOMA: Português de Moçambique

FORMATO JSON:
{
  "capa": {"instituicao": "Instituto Técnico Profissional", "titulo": "${tema}", "autor": "Nome do Autor", "curso": "${curso}", "cidade": "Maputo", "ano": "2026"},
  "folhaRosto": {"natureza": "${tipoTrabalho}", "orientador": "Nome do Orientador"},
  "resumo": "Resumo EXPANSIVO de 100-150 palavras.",
  "palavrasChave": ["palavra1", "palavra2", "palavra3", "palavra4"],
  "indice": ["1. Introdução", "2. Objectivos", "3. Revisão de Literatura", "4. Metodologia", "5. Desenvolvimento", "6. Conclusão", "7. Referências"],
  "introducao": "Contextualização EXPANSIVA.",
  "objetivos": {"geral": "Objectivo geral.", "especificos": ["Obj1", "Obj2", "Obj3"]},
  "justificativa": "Texto EXPANSIVO justificando a relevância.",
  "problemaPesquisa": "Formulação do problema.",
  "revisaoLiteratura": [{"conceito": "Conceito", "definicao": "Definição detalhada.", "citacao": "Autor (Ano)..."}],
  "metodologia": {"tipoEstudo": "${tipoTrabalho}", "abordagem": "Qualitativa", "fontes": "...", "criterios": "..."},
  "desenvolvimento": [{"titulo": "Seção", "conteudo": "Conteúdo EXPANSIVO e DETALHADO."}],
  "conclusao": "Síntese EXPANSIVA dos achados.",
  "referencias": ["Autor (Ano). Título. Editora."]
}

SEJA EXPANSIVO. NÃO adicione texto extra.`;

    const encodedPrompt = encodeURIComponent(prompt);
    const chatURL = `https://chat.openai.com/?q=${encodedPrompt}`;
    
    res.json({ success: true, url: chatURL });
    
  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar prompt" });
  }
}

async function processarJSON(req, res) {
  try {
    const { jsonText, tema, curso } = req.body;
    
    if (!jsonText) {
      return res.status(400).json({ error: "JSON não fornecido" });
    }
    
    let cleanJson = jsonText;
    const jsonStart = cleanJson.indexOf('{');
    const jsonEnd = cleanJson.lastIndexOf('}') + 1;
    
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      cleanJson = cleanJson.substring(jsonStart, jsonEnd);
    }
    
    const data = JSON.parse(cleanJson);
    
    if (!data.capa || !data.introducao || !data.conclusao) {
      throw new Error('JSON incompleto.');
    }
    
    // GERAR HTML DO TRABALHO TÉCNICO
    let html = '';
    
    html += `<h1 style="text-align:center;">${data.capa.titulo || tema || 'Trabalho Técnico'}</h1>`;
    html += `<p style="text-align:center;">${data.capa.instituicao || 'Instituto Técnico'}</p>`;
    html += `<p style="text-align:center;">Curso: ${data.capa.curso || curso || ''} | ${data.capa.cidade || 'Maputo'}, ${data.capa.ano || '2026'}</p>`;
    
    if (data.folhaRosto) {
      html += `<p style="text-align:center;">${data.folhaRosto.natureza || ''} | Orientador: ${data.folhaRosto.orientador || ''}</p>`;
    }
    
    html += `<hr style="border-color:rgba(255,255,255,0.08); margin:20px 0;">`;
    
    if (data.resumo) {
      html += `<h2>RESUMO</h2><p>${data.resumo}</p>`;
    }
    
    if (data.palavrasChave) {
      html += `<p><strong>Palavras-chave:</strong> ${data.palavrasChave.join(', ')}</p><br>`;
    }
    
    if (data.indice) {
      html += `<h2>ÍNDICE</h2>`;
      data.indice.forEach(i => html += `<p>${i}</p>`);
      html += `<br>`;
    }
    
    html += `<h2>1. INTRODUÇÃO</h2><p>${(data.introducao || '').replace(/\n/g, '</p><p>')}</p>`;
    
    if (data.objetivos) {
      html += `<h2>2. OBJECTIVOS</h2>`;
      html += `<p><strong>Geral:</strong> ${data.objetivos.geral || ''}</p>`;
      html += `<p><strong>Específicos:</strong></p><ul>${(data.objetivos.especificos || []).map(o => `<li>${o}</li>`).join('')}</ul>`;
    }
    
    if (data.justificativa) {
      html += `<h2>3. JUSTIFICATIVA</h2><p>${data.justificativa.replace(/\n/g, '</p><p>')}</p>`;
    }
    
    if (data.problemaPesquisa) {
      html += `<h2>4. PROBLEMA DE PESQUISA</h2><p>${data.problemaPesquisa}</p>`;
    }
    
    if (data.revisaoLiteratura) {
      html += `<h2>5. REVISÃO DE LITERATURA</h2>`;
      data.revisaoLiteratura.forEach(r => {
        html += `<h3>${r.conceito || ''}</h3>`;
        html += `<p>${r.definicao || ''}</p>`;
        html += `<p><em>${r.citacao || ''}</em></p>`;
      });
    }
    
    if (data.metodologia) {
      html += `<h2>6. METODOLOGIA</h2>`;
      for (let k in data.metodologia) {
        html += `<p><strong>${k}:</strong> ${data.metodologia[k]}</p>`;
      }
    }
    
    if (data.desenvolvimento) {
      html += `<h2>7. DESENVOLVIMENTO</h2>`;
      data.desenvolvimento.forEach(d => {
        html += `<h3>${d.titulo || ''}</h3>`;
        html += `<p>${(d.conteudo || '').replace(/\n/g, '</p><p>')}</p>`;
      });
    }
    
    html += `<h2>8. CONCLUSÃO</h2><p>${(data.conclusao || '').replace(/\n/g, '</p><p>')}</p>`;
    
    if (data.referencias) {
      html += `<h2>REFERÊNCIAS</h2>`;
      data.referencias.forEach(r => html += `<p>${r}</p>`);
    }
    
    res.json({ success: true, html: html, titulo: data.capa.titulo || tema });
    
  } catch (error) {
    res.status(400).json({ error: 'JSON inválido: ' + error.message });
  }
}

module.exports = { gerarPrompt, processarJSON };
