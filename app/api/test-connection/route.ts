import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface TestResult {
  success: boolean;
  message: string;
  responseTime: number;
  details?: string;
}

export async function POST(req: Request) {
  try {
    const { provider } = await req.json();

    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
    }

    const startTime = Date.now();
    const result: TestResult = { success: false, message: '', responseTime: 0 };

    // Pegar a chave do ambiente
    const keyMap: Record<string, string | undefined> = {
      openai: process.env.OPENAI_API_KEY,
      gemini: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY,
      youtube: process.env.YOUTUBEDATA_API_KEY || process.env.YOUTUBE_API_KEY,
      pexels: process.env.PEXELS_API_KEY,
      pixabay: process.env.PIXABAY_API_KEY,
      elevenlabs: process.env.ELEVENLABS_API_KEY,
      tavily: process.env.TAVILY_API_KEY,
      json2video: process.env.JSON2VIDEO_API_KEY,
      github: process.env.GITHUB_TOKEN,
      vercel: process.env.VERCEL_TOKEN,
    };

    const key = keyMap[provider];

    if (!key) {
      return NextResponse.json({
        success: false,
        message: 'API key não configurada no servidor',
        responseTime: Date.now() - startTime
      });
    }

    try {
      switch (provider) {
        case 'openai':
          const openaiRes = await fetch('https://api.openai.com/v1/models?limit=1', {
            headers: { 'Authorization': `Bearer ${key}` }
          });
          result.success = openaiRes.ok;
          result.message = openaiRes.ok ? 'OpenAI respondendo! Modelos disponíveis.' : 'Falha na autenticação';
          if (openaiRes.ok) {
            const data = await openaiRes.json();
            result.details = `${data.data?.length || 0} modelos encontrados`;
          }
          break;

        case 'gemini':
          const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}&pageSize=1`);
          result.success = geminiRes.ok;
          result.message = geminiRes.ok ? 'Gemini respondendo!' : 'Falha na autenticação';
          break;

        case 'anthropic':
          // Anthropic: fazer uma mini chamada
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
          result.success = anthropicRes.status !== 401 && anthropicRes.status !== 403;
          result.message = result.success ? 'Anthropic respondendo!' : 'Falha na autenticação';
          break;

        case 'youtube':
          const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=id&chart=mostPopular&maxResults=1&key=${key}`);
          result.success = ytRes.ok;
          result.message = ytRes.ok ? 'YouTube Data API respondendo!' : 'Falha na autenticação';
          break;

        case 'pexels':
          const pexelsRes = await fetch('https://api.pexels.com/v1/curated?per_page=1', {
            headers: { 'Authorization': key }
          });
          result.success = pexelsRes.ok;
          result.message = pexelsRes.ok ? 'Pexels respondendo! Fotos disponíveis.' : 'Falha na autenticação';
          if (pexelsRes.ok) {
            const data = await pexelsRes.json();
            result.details = `${data.total_results?.toLocaleString() || 'Milhões de'} fotos disponíveis`;
          }
          break;

        case 'pixabay':
          const pixabayRes = await fetch(`https://pixabay.com/api/?key=${key}&q=nature&per_page=3`);
          result.success = pixabayRes.ok;
          result.message = pixabayRes.ok ? 'Pixabay respondendo!' : 'Falha na autenticação';
          if (pixabayRes.ok) {
            const data = await pixabayRes.json();
            result.details = `${data.totalHits?.toLocaleString() || 'Muitas'} imagens encontradas`;
          }
          break;

        case 'elevenlabs':
          const elevenRes = await fetch('https://api.elevenlabs.io/v1/voices', {
            headers: { 'xi-api-key': key }
          });
          result.success = elevenRes.ok;
          result.message = elevenRes.ok ? 'ElevenLabs respondendo!' : 'Falha na autenticação';
          if (elevenRes.ok) {
            const data = await elevenRes.json();
            result.details = `${data.voices?.length || 0} vozes disponíveis`;
          }
          break;

        case 'tavily':
          // Tavily - não fazer busca real para não gastar crédito, apenas verificar auth
          const tavilyRes = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ api_key: key, query: "test", max_results: 1 })
          });
          result.success = tavilyRes.ok;
          result.message = tavilyRes.ok ? 'Tavily respondendo! Pesquisa IA pronta.' : 'Falha na autenticação';
          break;

        case 'json2video':
          const j2vRes = await fetch('https://api.json2video.com/v2/movie', {
            headers: { 'x-api-key': key }
          });
          result.success = j2vRes.status !== 401 && j2vRes.status !== 403;
          result.message = result.success ? 'JSON2Video respondendo!' : 'Falha na autenticação';
          break;

        case 'github':
          const githubRes = await fetch('https://api.github.com/user', {
            headers: {
              'Authorization': `token ${key}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          result.success = githubRes.ok;
          result.message = githubRes.ok ? 'GitHub conectado!' : 'Falha na autenticação';
          if (githubRes.ok) {
            const data = await githubRes.json();
            result.details = `Usuário: ${data.login}`;
          }
          break;

        case 'vercel':
          const vercelRes = await fetch('https://api.vercel.com/v9/projects', {
            headers: { 'Authorization': `Bearer ${key}` }
          });
          result.success = vercelRes.ok;
          result.message = vercelRes.ok ? 'Vercel conectado!' : 'Falha na autenticação';
          if (vercelRes.ok) {
            const data = await vercelRes.json();
            result.details = `${data.projects?.length || 0} projetos encontrados`;
          }
          break;

        default:
          result.message = 'Provider não suportado para teste';
      }
    } catch (fetchError) {
      result.success = false;
      result.message = 'Erro de conexão com a API';
      result.details = fetchError instanceof Error ? fetchError.message : 'Erro desconhecido';
    }

    result.responseTime = Date.now() - startTime;
    return NextResponse.json(result);

  } catch {
    return NextResponse.json({
      success: false,
      message: 'Erro interno no servidor',
      responseTime: 0
    }, { status: 500 });
  }
}
