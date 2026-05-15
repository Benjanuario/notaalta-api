// ============================================
// CONTROLLER DO ENSINO UNIVERSITÁRIO
// TODA LÓGICA QUE ESTAVA NO weu.html
// ============================================

// Função para gerar o prompt e abrir ChatGPT
async function gerarPrompt(req, res) {
  try {
    const { tema, curso, tipoTrabalho, paginas } = req.body;
    
    if (!tema || !curso || !tipoTrabalho) {
      return res.status(400).json({ error: "Tema, curso e tipo de trabalho são obrigatórios" });
    }
    
    if (paginas < 10 || paginas > 45) {
      return res.status(400).json({ error: "Páginas: mínimo 10, máximo 45" });
    }
    
    // PROMPT SECRETO - Nível Universitário (Normas APA 6ª ed.)
    const prompt = `Gere um trabalho de nível UNIVERSITÁRIO (licenciatura/mestrado) em formato JSON PURO.
NÃO inclua texto antes ou depois do JSON. Responda APENAS com JSON.

TEMA: "${tema}"
CURSO/FACULDADE: ${curso}
TIPO DE TRABALHO: ${tipoTrabalho}
PÁGINAS APROXIMADAS: ${paginas}
IDIOMA: Português de Moçambique
NORMAS: APA 6ª edição

FORMATO JSON EXIGIDO:
{
  "capa": {
    "universidade": "Universidade ...",
    "faculdade": "${curso}",
    "titulo": "${tema}",
    "subtitulo": "Subtítulo (se houver)",
    "autor": "Nome Completo do Autor",
    "cidade": "Maputo",
    "ano": "2026"
  },
  "folhaRosto": {
    "natureza": "${tipoTrabalho}",
    "objetivo": "Trabalho apresentado para obtenção do grau de...",
    "orientador": "Prof. Dr. Nome do Orientador",
    "coorientador": "Prof. Ms. Nome (se houver)"
  },
  "resumo": {
    "portugues": "Resumo EXPANSIVO de 250-300 palavras em português. Contextualização, objetivo, metodologia, resultados e considerações finais.",
    "ingles": "Abstract EXPANSIVO of 250-300 words in English. Context, objective, methodology, results and final considerations."
  },
  "palavrasChave": {
    "portugues": ["palavra1", "palavra2", "palavra3", "palavra4", "palavra5"],
    "ingles": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
  },
  "sumario": ["1. INTRODUÇÃO", "2. REVISÃO DE LITERATURA", "3. METODOLOGIA", "4. ANÁLISE E DISCUSSÃO DOS RESULTADOS", "5. CONCLUSÃO", "REFERÊNCIAS", "APÊNDICES", "ANEXOS"],
  "introducao": {
    "contextualizacao": "Contextualização EXPANSIVA do tema (2-3 parágrafos)",
    "problemaPesquisa": "Formulação clara do problema de pesquisa",
    "hipoteses": ["Hipótese 1", "Hipótese 2"],
    "objetivoGeral": "Objetivo geral do trabalho",
    "objetivosEspecificos": ["OE1", "OE2", "OE3", "OE4"],
    "justificativa": "Justificativa EXPANSIVA (acadêmica, social, prática)",
    "estrutura": "Estrutura do trabalho"
  },
  "revisaoLiteratura": [
    {
      "titulo": "Fundamentação Teórica sobre ${tema.split(' ')[0]}",
      "conteudo": "Texto EXPANSIVO com análise aprofundada, citações diretas e indiretas conforme APA 6ª, diálogo entre diferentes autores e posicionamento crítico. Mínimo 3 parágrafos.",
      "citas": ["(Autor, Ano, p. X)", "Autor (Ano) afirma que..."]
    },
    {
      "titulo": "Estado da Arte em Moçambique",
      "conteudo": "Análise EXPANSIVA de estudos realizados em Moçambique sobre o tema, lacunas existentes e contribuições para a pesquisa."
    }
  ],
  "metodologia": {
    "paradigma": "Qualitativo / Quantitativo / Misto",
    "tipoPesquisa": "Exploratória / Descritiva / Explicativa",
    "metodo": "Método escolhido (ex: Estudo de caso, Pesquisa-ação)",
    "universoAmostra": "Descrição da população e amostra",
    "participantes": "Caracterização dos participantes",
    "instrumentosColeta": "Questionários, entrevistas, observação, análise documental",
    "procedimentos": "Passo a passo da coleta de dados",
    "analiseDados": "Técnica de análise (ex: Análise de conteúdo, estatística descritiva)",
    "limitacoes": "Limitações da pesquisa",
    "aspectosEticos": "Cuidados éticos (TCLE, anonimato, etc.)"
  },
  "analiseDados": [
    {
      "categoria": "Categoria de Análise 1",
      "apresentacao": "Apresentação dos dados",
      "analise": "Análise EXPANSIVA à luz do referencial teórico",
      "interpretacao": "Interpretação dos resultados"
    },
    {
      "categoria": "Categoria de Análise 2",
      "apresentacao": "Apresentação dos dados",
      "analise": "Análise EXPANSIVA",
      "interpretacao": "Interpretação dos resultados"
    }
  ],
  "discussao": "Discussão EXPANSIVA dos resultados, comparação com a literatura, confirmação ou refutação das hipóteses, implicações práticas e teóricas.",
  "conclusao": {
    "sintese": "Síntese EXPANSIVA do trabalho",
    "respondendoProblema": "Resposta ao problema de pesquisa",
    "hipoteses": "Confirmação ou refutação das hipóteses",
    "contribuicoes": "Contribuições teóricas e práticas",
    "limitacoes": "Limitações do estudo",
    "recomendacoes": "Recomendações para pesquisas futuras"
  },
  "referencias": [
    "Autor, A. A. (Ano). Título do livro em itálico. (Edição). Cidade: Editora.",
    "Autor, B. B. (Ano). Título do artigo. Nome da Revista em itálico, Volume(Número), páginas."
  ],
  "apendices": ["Apêndice A - Título", "Apêndice B - Título"],
  "anexos": ["Anexo A - Título", "Anexo B - Título"]
}

REGRAS IMPORTANTES:
- Normas APA 6ª edição COMPLETAS
- Citações diretas curtas: (Autor, Ano, p. X)
- Citações diretas longas (+40 palavras): recuo de 4 cm
- Citações indiretas: Autor (Ano)
- Contextualize SEMPRE para Moçambique
- SEJA EXPANSIVO e ACADÊMICO
- NÃO adicione texto antes ou depois do JSON`;

    const encodedPrompt = encodeURIComponent(prompt);
    const chatURL = `https://chat.openai.com/?q=${encodedPrompt}`;
    
    res.json({ success: true, url: chatURL });
    
  } catch (error) {
    console.error("Erro ao gerar prompt universitário:", error);
    res.status(500).json({ error: "Erro ao gerar prompt do trabalho universitário" });
  }
}

// Função para processar o JSON e retornar o HTML pronto
async function processarJSON(req, res) {
  try {
    const { jsonText, tema, curso } = req.body;
    
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
    
    // Validar estrutura mínima
    if (!data.capa || !data.introducao || !data.conclusao) {
      throw new Error('JSON incompleto. Verifique se copiou todo o conteúdo do ChatGPT.');
    }
    
    // ============================================
    // GERAR HTML DO TRABALHO UNIVERSITÁRIO
    // ============================================
    let html = '';
    
    // CAPA
    html += `<h1 style="text-align:center; font-size:1.8rem;">${data.capa.titulo || tema || 'Trabalho Académico'}</h1>`;
    if (data.capa.subtitulo) {
      html += `<h2 style="text-align:center; font-size:1.2rem; color:#FF8C5A;">${data.capa.subtitulo}</h2>`;
    }
    html += `<p style="text-align:center; margin-top:20px;">${data.capa.universidade || 'Universidade'}</p>`;
    html += `<p style="text-align:center;">${data.capa.faculdade || curso || ''}</p>`;
    html += `<p style="text-align:center; margin-top:40px;">${data.capa.autor || 'Nome do Autor'}</p>`;
    html += `<p style="text-align:center; margin-top:60px;">${data.capa.cidade || 'Maputo'}, ${data.capa.ano || '2026'}</p>`;
    html += `<hr style="border-color:rgba(255,255,255,0.08); margin:30px 0;">`;
    
    // FOLHA DE ROSTO
    if (data.folhaRosto) {
      html += `<h2 style="text-align:center;">FOLHA DE ROSTO</h2>`;
      html += `<p style="text-align:center;">${data.folhaRosto.natureza || ''}</p>`;
      html += `<p style="text-align:center;">${data.folhaRosto.objetivo || ''}</p>`;
      html += `<p style="text-align:center; margin-top:40px;"><strong>Orientador:</strong> ${data.folhaRosto.orientador || ''}</p>`;
      if (data.folhaRosto.coorientador) {
        html += `<p style="text-align:center;"><strong>Coorientador:</strong> ${data.folhaRosto.coorientador}</p>`;
      }
      html += `<hr style="border-color:rgba(255,255,255,0.08); margin:30px 0;">`;
    }
    
    // RESUMO E ABSTRACT
    if (data.resumo) {
      html += `<h2>RESUMO</h2>`;
      html += `<p style="text-align:justify;">${(data.resumo.portugues || data.resumo || '').replace(/\n/g, '</p><p style="text-align:justify;">')}</p>`;
      
      if (data.resumo.ingles) {
        html += `<h2>ABSTRACT</h2>`;
        html += `<p style="text-align:justify;">${data.resumo.ingles.replace(/\n/g, '</p><p style="text-align:justify;">')}</p>`;
      }
    }
    
    // PALAVRAS-CHAVE
    if (data.palavrasChave) {
      const ptKeys = data.palavrasChave.portugues || data.palavrasChave;
      const enKeys = data.palavrasChave.ingles;
      
      html += `<p><strong>Palavras-chave:</strong> ${Array.isArray(ptKeys) ? ptKeys.join(', ') : ptKeys}</p>`;
      if (enKeys) {
        html += `<p><strong>Keywords:</strong> ${Array.isArray(enKeys) ? enKeys.join(', ') : enKeys}</p>`;
      }
      html += `<br>`;
    }
    
    // SUMÁRIO
    if (data.sumario && Array.isArray(data.sumario) && data.sumario.length > 0) {
      html += `<h2>SUMÁRIO</h2>`;
      data.sumario.forEach(item => html += `<p style="color:#b0b0d0;">${item}</p>`);
      html += `<br>`;
    }
    
    // 1. INTRODUÇÃO
    html += `<h2>1. INTRODUÇÃO</h2>`;
    if (typeof data.introducao === 'object') {
      if (data.introducao.contextualizacao) {
        html += `<h3>1.1. Contextualização</h3>`;
        html += `<p>${data.introducao.contextualizacao.replace(/\n/g, '</p><p>')}</p>`;
      }
      if (data.introducao.problemaPesquisa) {
        html += `<h3>1.2. Problema de Pesquisa</h3>`;
        html += `<p>${data.introducao.problemaPesquisa}</p>`;
      }
      if (data.introducao.hipoteses && Array.isArray(data.introducao.hipoteses)) {
        html += `<h3>1.3. Hipóteses</h3>`;
        html += `<ul>${data.introducao.hipoteses.map(h => `<li>${h}</li>`).join('')}</ul>`;
      }
      if (data.introducao.objetivoGeral) {
        html += `<h3>1.4. Objectivo Geral</h3>`;
        html += `<p>${data.introducao.objetivoGeral}</p>`;
      }
      if (data.introducao.objetivosEspecificos && Array.isArray(data.introducao.objetivosEspecificos)) {
        html += `<h3>1.5. Objectivos Específicos</h3>`;
        html += `<ul>${data.introducao.objetivosEspecificos.map(o => `<li>${o}</li>`).join('')}</ul>`;
      }
      if (data.introducao.justificativa) {
        html += `<h3>1.6. Justificativa</h3>`;
        html += `<p>${data.introducao.justificativa.replace(/\n/g, '</p><p>')}</p>`;
      }
      if (data.introducao.estrutura) {
        html += `<h3>1.7. Estrutura do Trabalho</h3>`;
        html += `<p>${data.introducao.estrutura}</p>`;
      }
    } else {
      html += `<p>${(data.introducao || '').replace(/\n/g, '</p><p>')}</p>`;
    }
    
    // 2. REVISÃO DE LITERATURA
    if (data.revisaoLiteratura && Array.isArray(data.revisaoLiteratura)) {
      html += `<h2>2. REVISÃO DE LITERATURA</h2>`;
      data.revisaoLiteratura.forEach((item, idx) => {
        html += `<h3>2.${idx + 1}. ${item.titulo || 'Análise Teórica'}</h3>`;
        html += `<p>${(item.conteudo || '').replace(/\n/g, '</p><p>')}</p>`;
        if (item.citas && Array.isArray(item.citas)) {
          item.citas.forEach(cita => html += `<p><em>${cita}</em></p>`);
        }
      });
    }
    
    // 3. METODOLOGIA
    if (data.metodologia) {
      html += `<h2>3. METODOLOGIA</h2>`;
      const metodologiaMap = {
        'paradigma': '3.1. Paradigma da Pesquisa',
        'tipoPesquisa': '3.2. Tipo de Pesquisa',
        'metodo': '3.3. Método de Abordagem',
        'universoAmostra': '3.4. Universo e Amostra',
        'participantes': '3.5. Participantes',
        'instrumentosColeta': '3.6. Instrumentos de Coleta',
        'procedimentos': '3.7. Procedimentos',
        'analiseDados': '3.8. Análise de Dados',
        'limitacoes': '3.9. Limitações da Pesquisa',
        'aspectosEticos': '3.10. Aspectos Éticos'
      };
      
      for (let [key, titulo] of Object.entries(metodologiaMap)) {
        if (data.metodologia[key]) {
          html += `<h3>${titulo}</h3>`;
          html += `<p>${data.metodologia[key]}</p>`;
        }
      }
    }
    
    // 4. ANÁLISE E DISCUSSÃO DOS RESULTADOS
    if (data.analiseDados && Array.isArray(data.analiseDados)) {
      html += `<h2>4. ANÁLISE E DISCUSSÃO DOS RESULTADOS</h2>`;
      data.analiseDados.forEach((item, idx) => {
        html += `<h3>4.${idx + 1}. ${item.categoria || 'Análise'}</h3>`;
        if (item.apresentacao) {
          html += `<h4>Apresentação dos Dados</h4><p>${item.apresentacao}</p>`;
        }
        if (item.analise) {
          html += `<h4>Análise dos Dados</h4><p>${item.analise}</p>`;
        }
        if (item.interpretacao) {
          html += `<h4>Interpretação</h4><p>${item.interpretacao}</p>`;
        }
      });
    }
    
    // DISCUSSÃO
    if (data.discussao) {
      html += `<h2>5. DISCUSSÃO DOS RESULTADOS</h2>`;
      html += `<p>${data.discussao.replace(/\n/g, '</p><p>')}</p>`;
    }
    
    // 5. CONCLUSÃO
    html += `<h2>6. CONCLUSÃO</h2>`;
    if (typeof data.conclusao === 'object') {
      if (data.conclusao.sintese) {
        html += `<h3>6.1. Síntese do Trabalho</h3><p>${data.conclusao.sintese}</p>`;
      }
      if (data.conclusao.respondendoProblema) {
        html += `<h3>6.2. Resposta ao Problema</h3><p>${data.conclusao.respondendoProblema}</p>`;
      }
      if (data.conclusao.hipoteses) {
        html += `<h3>6.3. Confirmação das Hipóteses</h3><p>${data.conclusao.hipoteses}</p>`;
      }
      if (data.conclusao.contribuicoes) {
        html += `<h3>6.4. Contribuições do Estudo</h3><p>${data.conclusao.contribuicoes}</p>`;
      }
      if (data.conclusao.limitacoes) {
        html += `<h3>6.5. Limitações</h3><p>${data.conclusao.limitacoes}</p>`;
      }
      if (data.conclusao.recomendacoes) {
        html += `<h3>6.6. Recomendações</h3><p>${data.conclusao.recomendacoes}</p>`;
      }
    } else {
      html += `<p>${(data.conclusao || '').replace(/\n/g, '</p><p>')}</p>`;
    }
    
    // REFERÊNCIAS
    if (data.referencias && Array.isArray(data.referencias)) {
      html += `<h2>REFERÊNCIAS BIBLIOGRÁFICAS</h2>`;
      data.referencias.forEach(ref => html += `<p style="margin-bottom:8px;">${ref}</p>`);
    }
    
    // APÊNDICES
    if (data.apendices && Array.isArray(data.apendices) && data.apendices.length > 0) {
      html += `<h2>APÊNDICES</h2>`;
      data.apendices.forEach(ap => html += `<p>${ap}</p>`);
    }
    
    // ANEXOS
    if (data.anexos && Array.isArray(data.anexos) && data.anexos.length > 0) {
      html += `<h2>ANEXOS</h2>`;
      data.anexos.forEach(an => html += `<p>${an}</p>`);
    }
    
    res.json({ 
      success: true, 
      html: html,
      titulo: data.capa.titulo || tema
    });
    
  } catch (error) {
    console.error('Erro ao processar JSON universitário:', error);
    res.status(400).json({ error: 'JSON inválido: ' + error.message });
  }
}

module.exports = { gerarPrompt, processarJSON };
