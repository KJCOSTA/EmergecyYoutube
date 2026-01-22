import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Força o Next.js a não cachear esse teste

export async function POST(req: Request) {
  try {
    // 1. Recebe os dados de forma segura
    const body = await req.json();
    
    // Normaliza os nomes dos campos (aceita tanto o formato novo quanto o antigo)
    const provider = body.provider || body.service || body.id; 
    let key = body.key || body.keyValue || body.apiKey;

    // Se a chave não veio no corpo, tenta pegar das variáveis de ambiente (Servidor)
    if (!key && provider) {
       const envKeyName = provider.toUpperCase().includes('KEY') 
         ? provider.toUpperCase() 
         : `${provider.toUpperCase()}_API_KEY`;
       key = process.env[envKeyName];
    }

    // Se ainda não tem chave, erro.
    if (!key) {
      return NextResponse.json(
        { error: 'Nenhuma chave fornecida e nenhuma encontrada no servidor.' },
        { status: 400 }
      );
    }

    console.log(`[Test-Key] Testando conexão para: ${provider}...`);
    let isValid = false;
    let details = "";

    // 2. Lógica de Teste Simplificada (Usa FETCH nativo para não depender de libs)
    switch (provider) {
      case 'openai':
        // Teste leve na API da OpenAI
        const openaiRes = await fetch('https://api.openai.com/v1/models?limit=1', {
          headers: { 'Authorization': `Bearer ${key}` }
        });
        isValid = openaiRes.ok;
        if (!isValid) details = "API recusou a chave (401/403)";
        break;
      
      case 'google':
        // Teste para Google Gemini (Generative Language API)
        // Usa pageSize=1 para ser leve
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}&pageSize=1`);
        isValid = geminiRes.ok;
        if (!isValid) {
             const err = await geminiRes.json();
             details = err.error?.message || "Erro na API do Google Gemini";
        }
        break;

      case 'youtube':
        // Teste na API do YouTube otimizado para economizar cota (1 unidade vs 100 unidades do search)
        // chart=mostPopular não requer autenticação de usuário, apenas a chave de API
        const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=id&chart=mostPopular&maxResults=1&key=${key}`);
        isValid = ytRes.ok;
        if (!isValid) {
            const err = await ytRes.json();
            details = err.error?.message || "Erro na API do YouTube";
        }
        break;
      
      case 'anthropic':
        // Teste na API da Anthropic
        const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': key,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                model: "claude-3-haiku-20240307",
                max_tokens: 1,
                messages: [{ role: "user", content: "Hi" }]
            })
        });
        // Anthropic pode retornar 400 se o corpo for ruim, mas 401 se a chave for ruim.
        // Se passar do 401, a chave existe.
        isValid = anthropicRes.status !== 401 && anthropicRes.status !== 403;
        break;

      case 'pexels':
        const pexelsRes = await fetch('https://api.pexels.com/v1/curated?per_page=1', {
            headers: { 'Authorization': key }
        });
        isValid = pexelsRes.ok;
        break;

      case 'pixabay':
        const pixabayRes = await fetch(`https://pixabay.com/api/?key=${key}&q=test`);
        isValid = pixabayRes.ok;
        break;

      case 'json2video':
        const j2vRes = await fetch('https://api.json2video.com/v2/movie', {
            headers: { 'x-api-key': key }
        });
        // JSON2Video: 401 = Chave inválida. 
        // 405 (Method Not Allowed) ou 200 = Chave válida (passou da autenticação).
        isValid = j2vRes.status !== 401 && j2vRes.status !== 403;
        break;

      case 'elevenlabs':
        const elevenRes = await fetch('https://api.elevenlabs.io/v1/user', {
            headers: { 'xi-api-key': key }
        });
        isValid = elevenRes.ok;
        break;

      case 'tavily':
         // Teste real na API do Tavily (custará 1 crédito, mas garante a conexão)
         const tavilyRes = await fetch('https://api.tavily.com/search', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ api_key: key, query: "test", max_results: 1 })
         });
         isValid = tavilyRes.ok;
         if (!isValid) details = "Erro na API do Tavily (Chave inválida ou sem créditos)";
         break;

      default:
        // Fallback para serviços desconhecidos
        console.warn(`[Test-Key] Serviço desconhecido ${provider}, assumindo válido.`);
        isValid = true;
        details = "Serviço não verificado, formato aceito.";
    }

    // 3. Retorno
    if (isValid) {
      return NextResponse.json({ success: true, message: "Conexão estabelecida com sucesso!", details });
    } else {
      console.error(`[Test-Key] Falha para ${provider}: ${details}`);
      return NextResponse.json({ error: "A chave informada é inválida ou expirou.", details }, { status: 401 });
    }

  } catch (error: any) {
    console.error("Erro interno no teste de API:", error);
    return NextResponse.json({ error: error.message || "Erro interno no servidor" }, { status: 500 });
  }
}