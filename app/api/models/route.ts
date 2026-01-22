import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Definição dos modelos por provedor
const MODELS_DATABASE = {
  openai: {
    name: 'OpenAI',
    icon: '🤖',
    categories: [
      {
        name: 'Modelos de Vanguarda',
        description: 'Os modelos mais avançados da OpenAI',
        models: [
          { id: 'gpt-4o', name: 'GPT-4o', description: 'Modelo multimodal rápido e inteligente', isNew: false },
          { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Versão econômica do GPT-4o', isNew: false },
          { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Modelo de alta inteligência com contexto de 128k', isNew: false },
          { id: 'gpt-4', name: 'GPT-4', description: 'Modelo GPT de alta inteligência', isNew: false },
          { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Modelo rápido e econômico', isNew: false },
        ]
      },
      {
        name: 'Modelos de Imagem',
        description: 'Para geração de imagens',
        models: [
          { id: 'dall-e-3', name: 'DALL-E 3', description: 'Geração de imagens de última geração', isNew: false },
          { id: 'dall-e-2', name: 'DALL-E 2', description: 'Geração de imagens anterior', isNew: false },
        ]
      },
      {
        name: 'Modelos de Áudio',
        description: 'Para transcrição e texto-para-fala',
        models: [
          { id: 'whisper-1', name: 'Whisper', description: 'Reconhecimento de fala', isNew: false },
          { id: 'tts-1', name: 'TTS-1', description: 'Texto para fala (velocidade)', isNew: false },
          { id: 'tts-1-hd', name: 'TTS-1 HD', description: 'Texto para fala (qualidade)', isNew: false },
        ]
      },
      {
        name: 'Modelos de Embedding',
        description: 'Para representação vetorial de texto',
        models: [
          { id: 'text-embedding-3-large', name: 'Embedding 3 Large', description: 'Maior capacidade de embedding', isNew: false },
          { id: 'text-embedding-3-small', name: 'Embedding 3 Small', description: 'Embedding econômico', isNew: false },
          { id: 'text-embedding-ada-002', name: 'Ada 002', description: 'Modelo de embedding anterior', isNew: false },
        ]
      }
    ]
  },
  anthropic: {
    name: 'Anthropic',
    icon: '🔮',
    categories: [
      {
        name: 'Claude 3.5',
        description: 'A mais nova geração do Claude',
        models: [
          { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: 'Melhor equilíbrio entre velocidade e inteligência', isNew: true },
          { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', description: 'Resposta mais rápida e econômica', isNew: true },
        ]
      },
      {
        name: 'Claude 3',
        description: 'Modelos Claude 3',
        models: [
          { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Modelo mais inteligente para tarefas complexas', isNew: false },
          { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: 'Equilíbrio entre inteligência e velocidade', isNew: false },
          { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Respostas rápidas e econômicas', isNew: false },
        ]
      }
    ]
  },
  gemini: {
    name: 'Google Gemini',
    icon: '🧠',
    categories: [
      {
        name: 'Gemini 2.0',
        description: 'A mais nova geração do Gemini',
        models: [
          { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', description: 'Modelo experimental rápido', isNew: true },
        ]
      },
      {
        name: 'Gemini 1.5',
        description: 'Modelos Gemini 1.5 com contexto longo',
        models: [
          { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Melhor desempenho, contexto de 2M tokens', isNew: false },
          { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Rápido e eficiente', isNew: false },
          { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash 8B', description: 'Versão mais leve e rápida', isNew: false },
        ]
      },
      {
        name: 'Gemini 1.0',
        description: 'Modelos Gemini 1.0',
        models: [
          { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', description: 'Modelo de geração anterior', isNew: false },
        ]
      }
    ]
  },
  elevenlabs: {
    name: 'ElevenLabs',
    icon: '🎤',
    categories: [
      {
        name: 'Modelos de Voz',
        description: 'Síntese de voz de alta qualidade',
        models: [
          { id: 'eleven_multilingual_v2', name: 'Multilingual v2', description: 'Suporte a 29 idiomas incluindo português', isNew: true },
          { id: 'eleven_turbo_v2_5', name: 'Turbo v2.5', description: 'Baixa latência para streaming', isNew: true },
          { id: 'eleven_turbo_v2', name: 'Turbo v2', description: 'Modelo otimizado para velocidade', isNew: false },
          { id: 'eleven_multilingual_v1', name: 'Multilingual v1', description: 'Suporte multilíngue original', isNew: false },
          { id: 'eleven_monolingual_v1', name: 'Monolingual v1', description: 'Otimizado para inglês', isNew: false },
        ]
      }
    ]
  },
  pexels: {
    name: 'Pexels',
    icon: '📷',
    categories: [
      {
        name: 'Recursos',
        description: 'APIs disponíveis',
        models: [
          { id: 'photos', name: 'Fotos', description: 'Banco de fotos gratuitas de alta qualidade', isNew: false },
          { id: 'videos', name: 'Vídeos', description: 'Banco de vídeos gratuitos de alta qualidade', isNew: false },
        ]
      }
    ]
  },
  pixabay: {
    name: 'Pixabay',
    icon: '🖼️',
    categories: [
      {
        name: 'Recursos',
        description: 'APIs disponíveis',
        models: [
          { id: 'images', name: 'Imagens', description: 'Fotos e ilustrações gratuitas', isNew: false },
          { id: 'videos', name: 'Vídeos', description: 'Vídeos gratuitos', isNew: false },
        ]
      }
    ]
  },
  youtube: {
    name: 'YouTube',
    icon: '📺',
    categories: [
      {
        name: 'APIs',
        description: 'APIs do YouTube Data v3',
        models: [
          { id: 'data-v3', name: 'YouTube Data API v3', description: 'Gerenciar vídeos, playlists, canais', isNew: false },
          { id: 'analytics', name: 'YouTube Analytics', description: 'Métricas e estatísticas', isNew: false },
        ]
      }
    ]
  },
  tavily: {
    name: 'Tavily',
    icon: '🔍',
    categories: [
      {
        name: 'APIs de Pesquisa',
        description: 'Pesquisa web com IA',
        models: [
          { id: 'search', name: 'Search API', description: 'Pesquisa web otimizada para IA', isNew: false },
          { id: 'extract', name: 'Extract API', description: 'Extração de conteúdo de URLs', isNew: false },
        ]
      }
    ]
  },
  json2video: {
    name: 'JSON2Video',
    icon: '🎬',
    categories: [
      {
        name: 'Renderização',
        description: 'APIs de renderização de vídeo',
        models: [
          { id: 'movie', name: 'Movie API', description: 'Criar vídeos a partir de JSON', isNew: false },
          { id: 'templates', name: 'Templates', description: 'Templates pré-definidos', isNew: false },
        ]
      }
    ]
  }
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const provider = searchParams.get('provider');

  if (provider) {
    const providerData = MODELS_DATABASE[provider as keyof typeof MODELS_DATABASE];
    if (providerData) {
      return NextResponse.json(providerData);
    }
    return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
  }

  // Retorna todos os providers
  return NextResponse.json(MODELS_DATABASE);
}

// Testar conexão real e listar modelos disponíveis
export async function POST(req: Request) {
  try {
    const { provider, key } = await req.json();

    if (!provider || !key) {
      return NextResponse.json({ error: 'Provider and key are required' }, { status: 400 });
    }

    let availableModels: string[] = [];
    let error = null;

    switch (provider) {
      case 'openai':
        try {
          const res = await fetch('https://api.openai.com/v1/models', {
            headers: { 'Authorization': `Bearer ${key}` }
          });
          if (res.ok) {
            const data = await res.json();
            availableModels = data.data.map((m: { id: string }) => m.id);
          } else {
            error = 'Não foi possível listar modelos';
          }
        } catch {
          error = 'Erro de conexão';
        }
        break;

      case 'gemini':
      case 'google':
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
          if (res.ok) {
            const data = await res.json();
            availableModels = data.models.map((m: { name: string }) => m.name.replace('models/', ''));
          } else {
            error = 'Não foi possível listar modelos';
          }
        } catch {
          error = 'Erro de conexão';
        }
        break;

      case 'anthropic':
        // Anthropic não tem endpoint público para listar modelos, usar os conhecidos
        availableModels = ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'];
        break;

      case 'elevenlabs':
        try {
          const res = await fetch('https://api.elevenlabs.io/v1/models', {
            headers: { 'xi-api-key': key }
          });
          if (res.ok) {
            const data = await res.json();
            availableModels = data.map((m: { model_id: string }) => m.model_id);
          } else {
            error = 'Não foi possível listar modelos';
          }
        } catch {
          error = 'Erro de conexão';
        }
        break;

      default:
        // Para providers sem lista de modelos, assumir disponível
        availableModels = ['default'];
    }

    return NextResponse.json({
      provider,
      availableModels,
      error,
      staticModels: MODELS_DATABASE[provider as keyof typeof MODELS_DATABASE] || null
    });

  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
