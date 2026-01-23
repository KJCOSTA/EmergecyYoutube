// Documentation Content for Export
// This file contains the markdown content for each documentation tab

export const genesisContent = `# Gênese & Intenção do Sistema

## Por Que Este Sistema Foi Criado

O **Emergency YouTube** nasceu de uma necessidade real e urgente: **democratizar a produção de vídeos profissionais para YouTube**, eliminando as barreiras técnicas, financeiras e de tempo que impedem criadores de conteúdo de manter uma presença consistente na plataforma.

### O Problema Fundamental

Criar vídeos de qualidade para YouTube tradicionalmente exige:
- **Habilidades técnicas** em edição de vídeo, design gráfico e produção de áudio
- **Investimento significativo** em equipamentos, software e possivelmente equipe
- **Tempo extensivo** - um vídeo de 10 minutos pode levar 8-20 horas de produção
- **Conhecimento de SEO** para otimização e descoberta do conteúdo

Essa barreira exclui milhões de potenciais criadores que têm conhecimento valioso mas não os recursos para transformá-lo em conteúdo visual.

### A Solução Proposta

O Emergency YouTube é um **sistema de automação inteligente** que:
1. Recebe apenas o tema/tópico do vídeo
2. Pesquisa e estrutura o conteúdo automaticamente
3. Gera roteiro, trilha sonora, thumbnail e descrição
4. Cria o storyboard com seleção de mídias
5. Renderiza o vídeo final
6. Publica diretamente no YouTube

## Prompts Fundacionais

### Diretrizes de Design

O sistema foi projetado seguindo estas premissas:

1. **Automação Máxima, Controle Humano**
   - O sistema automatiza tarefas repetitivas e técnicas
   - O humano mantém controle sobre decisões criativas e editoriais
   - Cada etapa pode ser revisada e modificada antes de avançar

2. **Qualidade de Produção Profissional**
   - Outputs devem ser indistinguíveis de produções manuais
   - Padrões de YouTube Creator Academy são referência
   - SEO e engagement são prioridades arquiteturais

3. **Interface Intuitiva**
   - Zero curva de aprendizado para operações básicas
   - Interface guiada por workflow linear
   - Feedback visual claro em cada etapa

4. **Escalabilidade**
   - Suportar múltiplos vídeos em paralelo
   - Funcionar com diferentes nichos de conteúdo
   - Permitir personalização de diretrizes por projeto

## Decisões Arquiteturais Derivadas

### Por que Next.js 15?

- **App Router** para roteamento moderno e layouts aninhados
- **Server Components** para performance e SEO
- **API Routes** para backend integrado
- **Vercel** como deploy nativo e otimizado

### Por que Zustand para Estado?

- Simplicidade sobre complexidade (vs Redux)
- Persistência nativa com localStorage
- TypeScript first
- Minimal boilerplate

### Por que Workflow em 6 Etapas?

O workflow espelha o processo real de produção de vídeo:
1. **Input** → Briefing criativo
2. **Research** → Pesquisa e referências
3. **Proposal** → Roteiro e assets
4. **Studio** → Storyboard e composição
5. **Render** → Produção final
6. **Upload** → Publicação

Esta estrutura permite:
- Validação humana em cada transição
- Rollback para etapas anteriores
- Persistência de progresso
- Clareza sobre status atual

## Elementos Intencionais

### O que o sistema FAZ:
- Pesquisa profunda sobre qualquer tema
- Geração de roteiros otimizados para engagement
- Seleção automática de mídia relevante
- Composição de vídeo com narração
- Upload direto para YouTube

### O que o sistema NÃO FAZ (exclusões conscientes):
- **Não substitui a voz humana** - se o criador quiser narrar, deve gravar separadamente
- **Não gera conteúdo controverso** - políticas de content safety são aplicadas
- **Não garante viralização** - o sistema otimiza, mas resultados dependem do conteúdo
- **Não armazena vídeos eternamente** - após upload, o vídeo vive no YouTube

## Princípios de Design

### 1. Transparência sobre Magia
O sistema mostra claramente o que está fazendo em cada etapa, evitando "caixas pretas" que frustram usuários.

### 2. Falhas Graceful
Quando uma integração falha, o sistema oferece alternativas ou permite retry, nunca travando o workflow completamente.

### 3. Dados Locais
Dados sensíveis (API keys, configurações) ficam no navegador do usuário, não em servidores externos.

### 4. Documentação Viva
Este próprio módulo é parte do sistema, não um documento externo que envelhece.

---

*Este documento representa a intenção fundacional do sistema Emergency YouTube, servindo como referência para decisões futuras e transferência de contexto entre IAs.*
`;

export const systemVisionContent = `# Visão Sistêmica & Funcionamento

## O Que o Sistema Faz

O **Emergency YouTube** é uma plataforma de automação de produção de vídeos que transforma um simples tema em um vídeo completo publicado no YouTube. O sistema orquestra múltiplas IAs e serviços para executar cada etapa do processo de produção.

## Para Quem Foi Projetado

### Perfis de Usuário Primários

1. **Criadores de Conteúdo Solo**
   - Empreendedores digitais
   - Educadores e professores
   - Profissionais liberais

2. **Pequenas Empresas**
   - Marketing digital interno
   - Comunicação institucional
   - Treinamento corporativo

3. **Agências e Produtoras**
   - Produção em escala
   - Prototipagem rápida
   - Testes de conceito

### Requisitos do Usuário
- Conta Google com canal YouTube ativo
- Acesso às APIs necessárias (fornecidas ou próprias)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

## Fluxo Principal de Funcionamento

### Etapa 1: Input (Entrada de Dados)

**Objetivo:** Capturar a intenção e parâmetros do vídeo

**Entradas:**
- Tema principal do vídeo
- Configurações de formato (duração, estilo)
- Público-alvo e tom de voz
- Diretrizes específicas (opcional)

**Saídas:**
- Objeto de contexto estruturado
- Parâmetros validados para próximas etapas

### Etapa 2: Research (Pesquisa)

**Objetivo:** Coletar informações e referências sobre o tema

**Processo:**
1. Análise semântica do tema
2. Busca em fontes confiáveis
3. Extração de pontos-chave
4. Identificação de ângulos únicos
5. Estruturação de outline inicial

**Saídas:**
- Dados de pesquisa estruturados
- Referências e fontes
- Sugestões de abordagem

### Etapa 3: Proposal (Proposta Criativa)

**Objetivo:** Gerar todos os assets criativos do vídeo

**Componentes Gerados:**
- **Roteiro completo** com marcações de tempo
- **Trilha sonora** sugerida com justificativa
- **Títulos e thumbnails** otimizados para CTR
- **Descrição** com timestamps e links
- **Tags e hashtags** para SEO

**Saídas:**
- Pacote completo de proposta criativa
- Preview de cada componente
- Opções de variação

### Etapa 4: Studio (Produção Visual)

**Objetivo:** Criar o storyboard e selecionar mídias

**Processo:**
1. Divisão do roteiro em cenas
2. Busca de imagens/vídeos por cena
3. Definição de transições
4. Preview do storyboard
5. Ajustes manuais (se necessário)

**Saídas:**
- Storyboard completo com mídias
- Timeline visual do vídeo
- Assets prontos para render

### Etapa 5: Render (Composição)

**Objetivo:** Gerar o vídeo final

**Processo:**
1. Síntese de voz (TTS) do roteiro
2. Composição de vídeo com mídias
3. Sincronização de áudio
4. Aplicação de efeitos e transições
5. Exportação em formato YouTube

**Saídas:**
- Arquivo de vídeo renderizado
- Preview para aprovação
- Metadados de produção

### Etapa 6: Upload (Publicação)

**Objetivo:** Publicar o vídeo no YouTube

**Processo:**
1. Autenticação com YouTube
2. Upload do vídeo
3. Aplicação de metadados
4. Configuração de privacidade
5. Geração de thumbnail
6. Agendamento (opcional)

**Saídas:**
- Vídeo publicado no YouTube
- URL do vídeo
- Estatísticas iniciais

## Interação entre Automação e Decisão Humana

### Pontos de Validação Humana

| Etapa | Decisão Humana | Automação |
|-------|----------------|-----------|
| Input | Define tema e parâmetros | Valida e estrutura |
| Research | Aprova abordagem | Pesquisa e sintetiza |
| Proposal | Revisa e edita roteiro | Gera todas as versões |
| Studio | Ajusta mídias | Seleciona e compõe |
| Render | Aprova preview | Renderiza vídeo |
| Upload | Confirma publicação | Executa upload |

### Filosofia de Controle

**"O sistema sugere, o humano decide"**

- Cada etapa gera uma proposta completa
- O usuário pode aceitar, modificar ou regenerar
- Nenhuma ação destrutiva é executada sem confirmação
- Histórico de versões permite rollback

## Componentes Principais e Responsabilidades

### Frontend (Next.js App Router)

**Responsabilidades:**
- Interface de usuário
- Navegação por workflow
- Estado local e persistência
- Comunicação com APIs

**Tecnologias:**
- React 19 com Server Components
- Tailwind CSS para estilos
- Framer Motion para animações
- Zustand para estado

### Backend (API Routes)

**Responsabilidades:**
- Integração com IAs (Anthropic, OpenAI, Google)
- Comunicação com serviços externos
- Processamento de dados
- Validação e segurança

**Endpoints Principais:**
- /api/proposal/* - Geração de conteúdo
- /api/images/* - Geração de imagens
- /api/media/* - Busca de mídia
- /api/youtube/* - Integração YouTube
- /api/render - Composição de vídeo
- /api/tts - Text-to-Speech

### Estado Global (Zustand Stores)

**WorkflowStore:**
- Dados de cada etapa
- Navegação entre etapas
- Persistência localStorage

**GuidelinesStore:**
- Diretrizes personalizadas
- Configurações de projeto

**UIStore:**
- Estado de modais
- Preferências de interface

---

## Diagrama de Fluxo Operacional

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                     EMERGENCY YOUTUBE                           │
│                    Fluxo de Produção                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │  INPUT   │───▶│ RESEARCH │───▶│ PROPOSAL │                  │
│  │  Tema    │    │ Pesquisa │    │ Roteiro  │                  │
│  └──────────┘    └──────────┘    └──────────┘                  │
│       │               │               │                         │
│       ▼               ▼               ▼                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │ Contexto │    │  Dados   │    │  Assets  │                  │
│  │   JSON   │    │Pesquisa  │    │Criativos │                  │
│  └──────────┘    └──────────┘    └──────────┘                  │
│                                       │                         │
│                                       ▼                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │  UPLOAD  │◀───│  RENDER  │◀───│  STUDIO  │                  │
│  │ YouTube  │    │  Vídeo   │    │Storyboard│                  │
│  └──────────┘    └──────────┘    └──────────┘                  │
│       │               │               │                         │
│       ▼               ▼               ▼                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │  Vídeo   │    │ Arquivo  │    │  Mídias  │                  │
│  │Publicado │    │  .mp4    │    │Selecionad│                  │
│  └──────────┘    └──────────┘    └──────────┘                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

---

*Este documento descreve a visão sistêmica do Emergency YouTube, detalhando seu funcionamento e a interação entre componentes automatizados e decisões humanas.*
`;

export const integrationsContent = `# Arquitetura de Integrações & APIs

## Visão Geral das Integrações

O Emergency YouTube integra-se com múltiplos serviços externos para fornecer suas funcionalidades. Cada integração tem um propósito específico e nível de criticidade definido.

## APIs e Serviços Integrados

### 1. Anthropic Claude API

**Função:** Geração de conteúdo de alta qualidade (roteiros, descrições, pesquisa)

| Propriedade | Valor |
|-------------|-------|
| Criticidade | Alta |
| Modelo | Claude 3.5 Sonnet / Claude 3 Opus |
| Uso Principal | Roteiros, análise, estruturação |
| Autenticação | API Key (ANTHROPIC_API_KEY) |

**Fluxo de Dados:**
- Input: Tema, contexto, diretrizes
- Output: Texto estruturado (roteiro, descrição, tags)

**Endpoints Utilizados:**
- POST /v1/messages

---

### 2. Google Gemini API

**Função:** Geração de conteúdo alternativa e pesquisa

| Propriedade | Valor |
|-------------|-------|
| Criticidade | Moderada |
| Modelo | Gemini 1.5 Pro |
| Uso Principal | Backup de geração, análise |
| Autenticação | API Key (GOOGLE_GENERATIVE_AI_API_KEY) |

**Fluxo de Dados:**
- Input: Prompts estruturados
- Output: Texto gerado

---

### 3. OpenAI API

**Função:** Geração de imagens e modelos alternativos

| Propriedade | Valor |
|-------------|-------|
| Criticidade | Moderada |
| Modelo | GPT-4o, DALL-E 3 |
| Uso Principal | Thumbnails, imagens complementares |
| Autenticação | API Key (OPENAI_API_KEY) |

**Endpoints Utilizados:**
- POST /v1/chat/completions
- POST /v1/images/generations

---

### 4. YouTube Data API v3

**Função:** Upload de vídeos e gerenciamento de canal

| Propriedade | Valor |
|-------------|-------|
| Criticidade | Crítica |
| Versão | v3 |
| Uso Principal | Upload, metadados, thumbnails |
| Autenticação | OAuth 2.0 |

**Escopos Necessários:**
- youtube.upload
- youtube.readonly
- youtube.force-ssl

**Fluxo de Dados:**
- Input: Arquivo de vídeo, metadados
- Output: ID do vídeo publicado, URL

---

### 5. Pexels API

**Função:** Busca de imagens e vídeos stock gratuitos

| Propriedade | Valor |
|-------------|-------|
| Criticidade | Moderada |
| Uso Principal | B-roll, imagens de cena |
| Autenticação | API Key (PEXELS_API_KEY) |

**Endpoints Utilizados:**
- GET /v1/search (imagens)
- GET /videos/search (vídeos)

---

### 6. Pixabay API

**Função:** Busca alternativa de mídia stock

| Propriedade | Valor |
|-------------|-------|
| Criticidade | Baixa (backup) |
| Uso Principal | Fallback para Pexels |
| Autenticação | API Key (PIXABAY_API_KEY) |

---

### 7. ElevenLabs API

**Função:** Text-to-Speech de alta qualidade

| Propriedade | Valor |
|-------------|-------|
| Criticidade | Alta |
| Uso Principal | Narração do vídeo |
| Autenticação | API Key (ELEVENLABS_API_KEY) |

**Vozes Disponíveis:**
- Português (múltiplas vozes)
- Inglês (múltiplas vozes)

---

### 8. Replicate API

**Função:** Geração de imagens via modelos open-source

| Propriedade | Valor |
|-------------|-------|
| Criticidade | Moderada |
| Modelos | Flux, SDXL |
| Uso Principal | Thumbnails, arte conceitual |
| Autenticação | API Token (REPLICATE_API_TOKEN) |

---

## Diagrama de Conexões

\`\`\`
                    ┌─────────────────────────────────────┐
                    │         EMERGENCY YOUTUBE           │
                    │          (Next.js App)              │
                    └─────────────────────────────────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           │                         │                         │
           ▼                         ▼                         ▼
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│   IA PROVIDERS      │   │   MEDIA SERVICES    │   │   VIDEO PLATFORM    │
├─────────────────────┤   ├─────────────────────┤   ├─────────────────────┤
│                     │   │                     │   │                     │
│  ┌──────────────┐  │   │  ┌──────────────┐  │   │  ┌──────────────┐  │
│  │  Anthropic   │  │   │  │    Pexels    │  │   │  │   YouTube    │  │
│  │   Claude     │  │   │  │   Images     │  │   │  │   Data API   │  │
│  └──────────────┘  │   │  └──────────────┘  │   │  └──────────────┘  │
│                     │   │                     │   │                     │
│  ┌──────────────┐  │   │  ┌──────────────┐  │   └─────────────────────┘
│  │   Google     │  │   │  │   Pixabay    │  │
│  │   Gemini     │  │   │  │   Videos     │  │
│  └──────────────┘  │   │  └──────────────┘  │
│                     │   │                     │
│  ┌──────────────┐  │   │  ┌──────────────┐  │
│  │   OpenAI     │  │   │  │  ElevenLabs  │  │
│  │   GPT-4o     │  │   │  │     TTS      │  │
│  └──────────────┘  │   │  └──────────────┘  │
│                     │   │                     │
│  ┌──────────────┐  │   │  ┌──────────────┐  │
│  │  Replicate   │  │   │  │  Replicate   │  │
│  │   Images     │  │   │  │   Video      │  │
│  └──────────────┘  │   │  └──────────────┘  │
│                     │   │                     │
└─────────────────────┘   └─────────────────────┘
\`\`\`

## Fluxo Real de Dados

### 1. Geração de Roteiro

\`\`\`
Usuário ──▶ Input (tema) ──▶ API /proposal/script
                                    │
                                    ▼
                              Anthropic API
                                    │
                                    ▼
                           Roteiro Estruturado
                                    │
                                    ▼
                              Frontend (UI)
\`\`\`

### 2. Geração de Thumbnail

\`\`\`
Roteiro ──▶ API /images/generate ──▶ Replicate/DALL-E
                                          │
                                          ▼
                                    Imagem Base64
                                          │
                                          ▼
                                    Frontend (Preview)
\`\`\`

### 3. Upload para YouTube

\`\`\`
Vídeo Renderizado ──▶ API /youtube/upload
                            │
                            ▼
                      OAuth 2.0 Auth
                            │
                            ▼
                     YouTube Data API
                            │
                            ▼
                   Vídeo Publicado (URL)
\`\`\`

## Observações de Autenticação

### Armazenamento de Credenciais

| Tipo | Local | Segurança |
|------|-------|-----------|
| API Keys | Variáveis de ambiente (Vercel) | Não expostas ao cliente |
| API Keys do Usuário | localStorage (browser) | Criptografadas localmente |
| OAuth Tokens | Cookie httpOnly | Sessão segura |

### Fluxo OAuth (YouTube)

1. Usuário clica em "Conectar YouTube"
2. Redirect para Google OAuth
3. Usuário autoriza escopos
4. Callback com código de autorização
5. Troca por access_token + refresh_token
6. Tokens armazenados em cookie seguro

### Fallback e Redundância

**Se Anthropic falhar:**
- Tentativa com Google Gemini
- Mensagem de erro amigável se ambos falharem

**Se Pexels falhar:**
- Tentativa com Pixabay
- Permite upload manual de mídia

**Se ElevenLabs falhar:**
- Opção de TTS alternativo
- Permite upload de áudio manual

---

*Este documento detalha todas as integrações do Emergency YouTube, seus fluxos de dados e considerações de segurança.*
`;

export const techStackContent = `# Stack Tecnológica & Linguagens

## Visão Geral da Stack

O Emergency YouTube utiliza uma stack moderna e otimizada para aplicações web de alta performance, com foco em Developer Experience (DX) e User Experience (UX).

## Linguagens de Programação

### TypeScript 5.7

**Uso:** 100% do código frontend e backend

**Características Utilizadas:**
- Strict mode habilitado
- Path aliases (@/components, @/lib)
- Type inference avançado
- Utility types (Partial, Pick, Omit)

**Benefícios:**
- Detecção de erros em tempo de desenvolvimento
- Autocomplete inteligente
- Refatoração segura
- Documentação inline via tipos

---

## Frameworks e Bibliotecas

### Next.js 15.1.11

**Categoria:** Framework Full-Stack

| Feature | Uso no Projeto |
|---------|----------------|
| App Router | Roteamento e layouts |
| Server Components | Performance e SEO |
| API Routes | Backend integrado |
| Image Optimization | Otimização de mídia |
| Font Optimization | Fontes otimizadas |

**Configurações Especiais:**
- Output: Standalone (otimizado para containers)
- TypeScript: Strict mode
- ESLint: Integrado

---

### React 19

**Categoria:** UI Library

**Hooks Utilizados:**
- useState, useEffect (padrão)
- useCallback, useMemo (otimização)
- useRef (referências DOM)

**Patterns:**
- Functional Components exclusivamente
- Custom Hooks para lógica reutilizável
- Composição sobre herança

---

### Tailwind CSS 3.4.17

**Categoria:** Framework CSS

**Customizações:**
- Cores: primary (red), accent (yellow)
- Animações customizadas
- Typography plugin
- Forms plugin

**Utilities Mais Usados:**
\`\`\`
bg-zinc-900     → Background escuro
text-white      → Texto principal
border-zinc-800 → Bordas sutis
rounded-xl      → Cantos arredondados
flex/grid       → Layouts
\`\`\`

---

### Zustand 5.0

**Categoria:** State Management

**Stores Implementadas:**
1. WorkflowStore - Estado do workflow
2. GuidelinesStore - Diretrizes
3. UIStore - Estado da interface

**Middleware:**
- persist (localStorage)
- devtools (desenvolvimento)

---

### Framer Motion 11.15

**Categoria:** Animações

**Uso:**
- Transições de página
- Animações de entrada
- Hover effects
- Loading states

---

### Lucide React 0.469

**Categoria:** Iconografia

**Padrão de Uso:**
\`\`\`tsx
import { IconName } from "lucide-react";
<IconName className="w-5 h-5" />
\`\`\`

---

## Tecnologias de Infraestrutura

### Vercel

**Função:** Hospedagem e Deploy

**Features Utilizadas:**
- Automatic deployments (Git push)
- Edge Functions
- Environment Variables
- Analytics
- Preview deployments

**Configuração:**
- Framework preset: Next.js
- Build command: next build
- Output directory: .next

---

### GitHub

**Função:** Versionamento e CI

**Workflows:**
- Push to main → Deploy production
- Push to feature/* → Preview deploy
- Pull requests → Checks automáticos

---

## Diagrama por Camadas

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   React 19  │  │  Tailwind   │  │   Framer    │             │
│  │     UI      │  │    CSS      │  │   Motion    │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Zustand   │  │   Lucide    │  │    clsx     │             │
│  │    State    │  │   Icons     │  │   + merge   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
├─────────────────────────────────────────────────────────────────┤
│                         FRAMEWORK                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Next.js 15                            │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │  │   App    │  │  Server  │  │   API    │              │   │
│  │  │  Router  │  │Components│  │  Routes  │              │   │
│  │  └──────────┘  └──────────┘  └──────────┘              │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                          BACKEND                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Vercel AI  │  │    Zod     │  │  node-fetch │             │
│  │     SDK     │  │ Validation │  │   HTTP      │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
├─────────────────────────────────────────────────────────────────┤
│                         IA LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Anthropic  │  │   Google   │  │   OpenAI    │             │
│  │    SDK      │  │    AI      │  │    SDK      │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
├─────────────────────────────────────────────────────────────────┤
│                       INFRAESTRUTURA                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      Vercel                              │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │  │  Edge    │  │   CDN    │  │  Env     │              │   │
│  │  │Functions │  │  Global  │  │  Vars    │              │   │
│  │  └──────────┘  └──────────┘  └──────────┘              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

## Dependências Principais

### Production Dependencies

| Pacote | Versão | Função |
|--------|--------|--------|
| next | 15.1.11 | Framework |
| react | 19.0.0 | UI Library |
| zustand | 5.0.3 | State Management |
| tailwindcss | 3.4.17 | Styling |
| framer-motion | 11.15.0 | Animations |
| lucide-react | 0.469.0 | Icons |
| @ai-sdk/anthropic | latest | Claude AI |
| @ai-sdk/google | latest | Gemini AI |
| @ai-sdk/openai | latest | GPT AI |
| zod | 3.24.1 | Validation |
| clsx | 2.1.1 | Class merging |
| tailwind-merge | 2.6.0 | Tailwind utilities |

### Dev Dependencies

| Pacote | Versão | Função |
|--------|--------|--------|
| typescript | 5.7.3 | Type checking |
| eslint | 9.x | Linting |
| @types/react | 19.x | React types |
| @types/node | 22.x | Node types |

---

*Este documento cataloga todas as tecnologias utilizadas no Emergency YouTube, sua função e posição na arquitetura.*
`;

export const currentStateContent = `# Estado Atual & Próximos Passos

## Status Geral do Projeto

**Versão:** 1.0.0
**Status:** Em Produção
**URL:** https://emergecy-youtube.vercel.app
**Última Atualização:** Janeiro 2025

---

## Funcionalidades Concluídas

### Core Features

| Funcionalidade | Status | Prioridade | Impacto |
|----------------|--------|------------|---------|
| Dashboard com Boot Sequence | Concluído | Alta | Alto |
| Workflow de 6 etapas | Concluído | Crítica | Crítico |
| Input de tema e configuração | Concluído | Crítica | Alto |
| Pesquisa com IA | Concluído | Alta | Alto |
| Geração de roteiro | Concluído | Crítica | Crítico |
| Geração de títulos/thumbnails | Concluído | Alta | Alto |
| Geração de descrição e tags | Concluído | Alta | Alto |
| Seleção de trilha sonora | Concluído | Média | Médio |
| Sistema de diretrizes | Concluído | Média | Alto |
| Configuração de API Keys | Concluído | Crítica | Crítico |
| Persistência de estado | Concluído | Alta | Alto |

### Integrações Operacionais

| Integração | Status | Testado |
|------------|--------|---------|
| Anthropic Claude | Operacional | Sim |
| Google Gemini | Operacional | Sim |
| OpenAI GPT-4 | Operacional | Sim |
| Pexels | Operacional | Sim |
| Pixabay | Operacional | Sim |

---

## Funcionalidades Parciais

| Funcionalidade | Progresso | Bloqueio | Prioridade |
|----------------|-----------|----------|------------|
| Upload YouTube | 80% | OAuth config | Alta |
| Render de vídeo | 70% | Integração FFmpeg | Alta |
| TTS (ElevenLabs) | 60% | API quota | Média |
| Storyboard editor | 50% | UX refinement | Média |

---

## Funcionalidades Não Iniciadas

| Funcionalidade | Complexidade | Prioridade | Impacto |
|----------------|--------------|------------|---------|
| Multi-idioma interface | Média | Baixa | Médio |
| Histórico de vídeos | Baixa | Média | Alto |
| Templates de vídeo | Média | Média | Alto |
| Batch processing | Alta | Baixa | Médio |
| Analytics dashboard | Alta | Baixa | Médio |
| Colaboração multi-usuário | Alta | Baixa | Baixo |

---

## Dívidas Técnicas

### Alta Prioridade

| Dívida | Descrição | Impacto | Esforço |
|--------|-----------|---------|---------|
| Error boundaries | Implementar error boundaries em todas as páginas | Estabilidade | Baixo |
| Loading states | Padronizar loading states em todas as operações | UX | Médio |
| Testes E2E | Adicionar testes end-to-end com Playwright | Qualidade | Alto |

### Média Prioridade

| Dívida | Descrição | Impacto | Esforço |
|--------|-----------|---------|---------|
| Code splitting | Otimizar bundle size com lazy loading | Performance | Médio |
| API rate limiting | Implementar rate limiting no frontend | Custo | Médio |
| Retry logic | Melhorar retry logic para falhas de API | Resiliência | Médio |

### Baixa Prioridade

| Dívida | Descrição | Impacto | Esforço |
|--------|-----------|---------|---------|
| CSS cleanup | Remover estilos não utilizados | Manutenção | Baixo |
| Type coverage | Aumentar coverage de tipos | DX | Médio |
| Documentation | Documentar funções complexas | Manutenção | Médio |

---

## Riscos Conhecidos

### Riscos Técnicos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| API rate limits | Média | Alto | Cache, retry, fallbacks |
| Custo de APIs | Alta | Médio | Monitoramento, alertas |
| Mudanças em APIs externas | Média | Alto | Versionamento, abstrações |
| Performance em mobile | Baixa | Médio | Testing, otimização |

### Riscos de Negócio

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Políticas YouTube | Média | Crítico | Compliance, guidelines |
| Competição | Alta | Médio | Inovação, UX |
| Dependência de IAs | Média | Alto | Multi-provider |

---

## Sugestões de Evolução Futura

### Curto Prazo (1-3 meses)

1. **Completar Upload YouTube**
   - Prioridade: Crítica
   - Impacto: Crítico
   - Complexidade: Média

2. **Implementar Render Local**
   - Prioridade: Alta
   - Impacto: Alto
   - Complexidade: Alta

3. **Adicionar Testes**
   - Prioridade: Alta
   - Impacto: Médio
   - Complexidade: Média

### Médio Prazo (3-6 meses)

1. **Templates de Vídeo**
   - Criar biblioteca de templates por nicho
   - Permitir customização de templates
   - Sistema de compartilhamento

2. **Histórico e Analytics**
   - Dashboard de vídeos produzidos
   - Métricas de performance
   - Insights de melhoria

3. **Melhorias de UX**
   - Onboarding interativo
   - Tooltips contextuais
   - Keyboard shortcuts

### Longo Prazo (6-12 meses)

1. **API Pública**
   - Expor funcionalidades via API
   - SDK para integrações
   - Documentação completa

2. **Marketplace de Assets**
   - Trilhas sonoras
   - Templates
   - Vozes TTS

3. **Versão Enterprise**
   - Multi-tenant
   - SSO/SAML
   - SLA garantido

---

## Métricas de Qualidade

### Performance

| Métrica | Atual | Meta |
|---------|-------|------|
| LCP (Largest Contentful Paint) | 1.2s | < 2.5s |
| FID (First Input Delay) | 50ms | < 100ms |
| CLS (Cumulative Layout Shift) | 0.05 | < 0.1 |
| Bundle Size | 450KB | < 500KB |

### Code Quality

| Métrica | Atual | Meta |
|---------|-------|------|
| TypeScript Coverage | 100% | 100% |
| ESLint Errors | 0 | 0 |
| Test Coverage | 0% | > 70% |

---

## Conclusão

O Emergency YouTube está em estágio de **produção funcional** com as principais features de geração de conteúdo operacionais. Os próximos passos críticos são:

1. Completar a integração de upload YouTube
2. Implementar render de vídeo completo
3. Adicionar cobertura de testes
4. Resolver dívidas técnicas de alta prioridade

O sistema está preparado para escalar e evoluir conforme as necessidades dos usuários.

---

*Este documento reflete o estado atual do Emergency YouTube e serve como roadmap para decisões de desenvolvimento futuro.*
`;

export const decisionsContent = `# Decisoes Arquiteturais - Claude Code

## Registro de Decisoes de Desenvolvimento

Este documento registra todas as decisoes arquiteturais importantes tomadas durante o desenvolvimento do ORION, incluindo debates, consensos e justificativas tecnicas.

---

## Sessao 1: O Grande Debate Arquitetural (Janeiro 2026)

### Contexto

Necessidade de migrar de localStorage para persistencia real em banco de dados, implementar workflows duraveis para processos longos (renderizacao de video, deep research), e criar sistema de aprovacao humana (human-in-the-loop).

### Participantes do Debate

1. **Claude (Anthropic)** - Posicao: Conservadora e battle-tested. Priorizou estabilidade.
2. **Gemini (Google)** - Posicao: Bleeding edge. Descobriu ToolLoopAgent no AI SDK 6.
3. **ChatGPT (OpenAI)** - Posicao: Validador critico. Confirmou existencia do SDK 6.

### Pontos Criticos Identificados

#### 1. Vercel Functions Timeout
- Limite de 300s (5 min) no Vercel Pro
- Processos como renderizacao podem levar minutos/horas
- Solucao: workflows duraveis externos

#### 2. Vercel Workflow DevKit em Beta
- Embora exista, ainda esta em Public Beta
- Risco de bugs criticos em producao

#### 3. AI SDK Versao Atual
- Projeto usa AI SDK 4.3.19
- Para usar ToolLoopAgent, precisa migrar para v6

### Consenso Unanime: OPCAO B - Arquitetura Hibrida

Apos debate intenso, as tres IAs chegaram a um consenso:

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Intelligence | AI SDK 6 + ToolLoopAgent | Agentes autonomos com loop de ferramentas |
| Orchestration | Inngest | Durabilidade, retries, sleep nativo |
| Persistence | Vercel Postgres + Prisma | Estado persistente cross-device |
| Storage | Vercel Blob | 1GB incluido no Pro |
| Notifications | Resend | 10K emails/mes gratis |

**Custo Total: $20/mes (Vercel Pro)**

---

## Arquitetura do Pipeline de Video

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│  AI SDK 6 (ToolLoopAgent)          Inngest                      │
│  ┌─────────────────────┐           ┌─────────────────────┐      │
│  │ Research Agent      │──────────>│ step.run()          │      │
│  │ (Gemini 2.0)        │           │ step.sleep()        │      │
│  └─────────────────────┘           │ step.waitForEvent() │      │
│  ┌─────────────────────┐           │ Retry automatico    │      │
│  │ Script Agent        │──────────>│                     │      │
│  │ (Claude 3.5)        │           └─────────────────────┘      │
│  └─────────────────────┘                    │                   │
│                                             ▼                   │
│                        ┌────────────────────────────────────┐   │
│                        │ Vercel Postgres + Blob             │   │
│                        └────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

### Fluxo do Workflow

1. **Deep Research (Gemini)** → Pesquisa trends e referencias
2. **Script Generation (Claude)** → Gera roteiro otimizado
3. **AGUARDAR APROVACAO** → Email + step.waitForEvent('7d')
4. **Storyboard Generation** → Cria cenas com prompts visuais
5. **Render (JSON2VIDEO)** → step.sleep() enquanto renderiza
6. **Upload YouTube** → Com retry automatico

---

## Modelo de Dados (Prisma Schema)

\`\`\`prisma
model Project {
  id          String         @id @default(cuid())
  name        String
  status      ProjectStatus  @default(DRAFT)
  createdAt   DateTime       @default(now())

  // Relacionamentos
  context     Context?
  research    Research?
  script      Script?
  storyboard  Storyboard?
  render      Render?
  upload      Upload?
  workflow    WorkflowState?
}

enum ProjectStatus {
  DRAFT
  RESEARCHING
  SCRIPTING
  AWAITING_APPROVAL
  APPROVED
  RENDERING
  UPLOADING
  COMPLETED
  FAILED
}

model WorkflowState {
  inngestRunId     String?
  currentStep      String
  awaitingApproval Boolean   @default(false)
  approvalToken    String?   @unique
}
\`\`\`

---

## Fases de Implementacao

### FASE 1: Setup & Dependencias
- Ajustar package.json para AI SDK 6
- Instalar inngest, prisma, @prisma/client, resend

### FASE 2: Banco de Dados (Prisma)
- Gerar prisma/schema.prisma completo
- Executar migration inicial

### FASE 3: Configuracao Inngest
- Criar client (lib/inngest/client.ts)
- Criar API route (app/api/inngest/route.ts)

### FASE 4: Agentes AI SDK 6
- Implementar agentes em lib/agents/
- Usar ToolLoopAgent real do SDK 6
- Conectar agentes dentro dos Steps do Inngest

### FASE 5: Sistema de Aprovacao
- Implementar notificacoes por email (Resend)
- Criar pagina de aprovacao /approve/[token]

---

## Referencias e Fontes

- [AI SDK 6 - ToolLoopAgent](https://ai-sdk.dev/docs/reference/ai-sdk-core/tool-loop-agent)
- [Vercel Workflow Documentation](https://vercel.com/docs/workflow)
- [Inngest Vercel Integration](https://inngest.com/docs/guides/vercel)
- [Workflow DevKit GitHub](https://github.com/vercel/workflow-devkit)

---

*Documento gerado em: 23/01/2026*
*Participantes: Claude (Anthropic), Gemini (Google), ChatGPT (OpenAI)*
`;
