# Pack #1: Adaptação Modo FAST para ORION

**Data**: 2026-01-26
**Versão**: 1.0.0
**Branch**: `claude/implement-pack-1-orion-g9WG7`

## 📋 Resumo Executivo

Este Pack expande o ORION original com funcionalidades do modo FAST planejado, aproveitando toda a infraestrutura existente (design-tokens, Inngest, Prisma, Zustand, componentes UI). O objetivo é adicionar múltiplas fontes de input, teste A/B/C de thumbnails para YouTube, seleção de mídia estilo CapCut, preview de vídeo antes do upload, e feedback em tempo real melhorado.

## ✨ Funcionalidades Implementadas

### 1. Sistema de Modos de Workflow

- **Arquivo**: `lib/workflow-modes.ts`
- **Descrição**: Configuração de 3 modos de operação (FAST, STANDARD, PREMIUM)
- **Status**: ✅ Modo FAST ativo, outros em breve
- **Componente**: `components/workflow/ModeSelector.tsx`

**Funcionalidades**:
- Seleção visual de modo com cards glassmorphism
- Badge de recomendação no modo FAST
- Lista de recursos incluídos em cada modo
- Tempo estimado de conclusão
- Integração com design system ORION

### 2. Múltiplas Fontes de Input

**Página Expandida**: `app/step/1-input/page.tsx`

**Novas fontes de input adicionadas**:

1. **Planilha do YouTube Studio**
   - Upload de arquivo (.xlsx, .xls, .csv)
   - Serviço: `lib/services/spreadsheet.service.ts`
   - Extração automática de métricas (CTR, tempo de exibição, etc.)
   - Identificação de vídeos de melhor performance
   - Geração de insights

2. **Tags de Foco**
   - Campo para palavras-chave específicas
   - Separação por vírgula
   - Usado para direcionar conteúdo

3. **Link de Vídeo Concorrente**
   - Campo para URL do YouTube
   - Análise futura de título, descrição e tags
   - Inspiração de estrutura

4. **Transcrição de Vídeo**
   - Campo de texto para transcrição completa
   - Análise de ganchos e CTAs
   - Extração de estrutura

**Validação**: Pelo menos um campo deve ser preenchido para avançar.

### 3. Agente de Análise Adaptativa

- **Arquivo**: `lib/agents/adaptive-analysis-agent.ts`
- **Descrição**: IA que se adapta aos inputs disponíveis

**Funcionalidades**:
- Analisa planilha do YouTube Studio → performance e padrões
- Analisa tema → expansão em subtópicos
- Analisa link de concorrente → estrutura e estratégias
- Analisa transcrição → ganchos, CTAs, estrutura
- Realiza análise cruzada de múltiplas fontes
- Gera resumo consolidado

### 4. Teste A/B/C de Thumbnails

**Importante**: Todas as 3 thumbnails são obrigatórias e serão enviadas para o YouTube.

- **Componente**: `components/proposal/ThumbnailEditor.tsx`
- **Types**: Modificado `TitlesAndThumbs` para remover `selectedVariation`

**Funcionalidades por variação (A, B, C)**:
- Campo de título editável
- Prompt de thumbnail editável
- Botão "Copiar Prompt" para usar externamente
- Botão "Gerar Thumbnail" (Flux/DALL-E/Stability)
- Botão "Upload" para imagem gerada externamente
- Preview da imagem
- Botão "Regenerar"
- Indicador visual de quais thumbnails estão prontas
- Bloqueio de avanço até todas as 3 estarem prontas

### 5. Seleção de Mídia Estilo CapCut

Três novos componentes para seleção avançada de mídia:

#### a) MediaUploader
- **Arquivo**: `components/studio/MediaUploader.tsx`
- Upload de mídia própria (drag & drop)
- Suporta vídeo (.mp4, .mov, .webm) e imagem (.jpg, .png, .webp)
- Validação de tamanho (máx 100MB)
- Barra de progresso durante upload

#### b) AIMediaGenerator
- **Arquivo**: `components/studio/AIMediaGenerator.tsx`
- Modal para gerar mídia com IA
- Seleção de tipo (imagem/vídeo)
- Campo de prompt descritivo
- Exibição de custo estimado
- Preview da mídia gerada
- Opção de regenerar

#### c) MediaSearchModal
- **Arquivo**: `components/studio/MediaSearchModal.tsx`
- Modal estilo CapCut para buscar mídia stock
- Grid visual de resultados
- Filtros: Tipo (imagem/vídeo), Fonte (Pexels/Pixabay)
- Ordenação: Relevância, Popularidade
- Busca manual por termo
- Preview antes de confirmar seleção

### 6. Componentes de Feedback em Tempo Real

Quatro novos componentes para melhorar UX:

#### a) ProgressBar
- **Arquivo**: `components/ui/ProgressBar.tsx`
- Barra com gradiente animado
- Variantes: default, success, warning, error
- MultiProgressBar para múltiplos segmentos
- Efeito shimmer

#### b) StreamingText
- **Arquivo**: `components/ui/StreamingText.tsx`
- Efeito de digitação em tempo real
- StreamingMarkdown para renderização progressiva
- Typewriter para palavras rotativas
- Cursor animado

#### c) ActivityLog
- **Arquivo**: `components/ui/ActivityLog.tsx`
- Log estilo terminal
- Status coloridos (pending, running, success, error, warning, info)
- Timestamps
- Auto-scroll
- Hook `useActivityLog()` para gerenciamento

#### d) StepIndicator
- **Arquivo**: `components/ui/StepIndicator.tsx`
- Indicador horizontal e vertical
- Animações de pulso no step ativo
- CompactStepIndicator para espaços reduzidos
- Conectores animados entre steps

### 7. Preparação para Preview de Vídeo

**Schema Prisma**:
- Adicionados campos no model `Render`:
  - `videoPreviewUrl` String?
  - `previewApproved` Boolean @default(false)
  - `previewApprovedAt` DateTime?
  - `previewNotes` String? @db.Text

**Types**:
- Expandido `RenderData` com novos status:
  - "awaiting_preview"
  - "preview_approved"
  - "preview_rejected"

**Próximos passos** (não incluídos neste Pack):
- Criar página `app/step/5b-preview/page.tsx`
- Modificar `lib/inngest/functions/video-pipeline.ts` com `step.waitForEvent('video/preview-approved')`

## 📦 Banco de Dados (Prisma)

### Novos Campos no Model `Project`

```prisma
mode                 String                @default("FAST")
tagsFoco             String[]
linkConcorrente      String?
transcricao          String?               @db.Text
youtubeStudioData    YouTubeStudioData?
competitorAnalysis   CompetitorAnalysis?
```

### Novos Models

#### YouTubeStudioData
```prisma
model YouTubeStudioData {
  id          String   @id @default(cuid())
  projectId   String   @unique
  rawData     Json
  totalVideos Int
  analyzedAt  DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
```

#### CompetitorAnalysis
```prisma
model CompetitorAnalysis {
  id               String   @id @default(cuid())
  projectId        String   @unique
  videoUrl         String
  videoTitle       String?
  videoDescription String?  @db.Text
  videoTags        String[]
  analyzedAt       DateTime @default(now())
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  project          Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
```

### Campos Atualizados no Model `Render`

```prisma
videoPreviewUrl  String?
previewApproved  Boolean   @default(false)
previewApprovedAt DateTime?
previewNotes     String?   @db.Text
```

## 🔧 Novos Types TypeScript

**Arquivo**: `types/index.ts`

```typescript
// Novos tipos
export type WorkflowMode = "FAST" | "STANDARD" | "PREMIUM";
export interface YouTubeStudioData { ... }
export interface CompetitorData { ... }
export type MediaUploadSource = "user_upload" | "ai_generated" | "stock";

// Expandidos
export interface ContextData {
  // Campos adicionados:
  mode: WorkflowMode;
  tagsFoco: string[];
  linkConcorrente: string | null;
  dadosConcorrente: CompetitorData | null;
  transcricao: string | null;
  planilhaYouTubeStudio: YouTubeStudioData | null;
  // ... campos existentes mantidos
}

export interface TitlesAndThumbs {
  // Removido: selectedVariation
  // Adicionado: allVariationsRequired
  variations: TitleThumbnailVariation[]; // Sempre 3 (A, B, C)
  allVariationsRequired: boolean;
}

export interface TitleThumbnailVariation {
  // Adicionado:
  isReady: boolean;
}

export interface RenderData {
  // Novos status:
  status: "pending" | "rendering" | "completed" | "awaiting_preview" |
          "preview_approved" | "preview_rejected" | "error";
  // Novos campos:
  videoPreviewUrl: string | null;
  previewApproved: boolean;
  previewApprovedAt: string | null;
  previewNotes: string | null;
}
```

## 📦 Dependências Adicionadas

```json
{
  "dependencies": {
    "xlsx": "^..." // Para processar planilhas do YouTube Studio
  },
  "devDependencies": {
    "@types/xlsx": "^..." // Tipos TypeScript para xlsx
  }
}
```

## 🗂️ Estrutura de Arquivos Criados

```
lib/
  ├── workflow-modes.ts               # Configuração dos modos
  ├── agents/
  │   └── adaptive-analysis-agent.ts  # Agente de análise adaptativa
  └── services/
      └── spreadsheet.service.ts      # Processamento de planilhas

components/
  ├── workflow/
  │   └── ModeSelector.tsx            # Seletor de modo
  ├── proposal/
  │   └── ThumbnailEditor.tsx         # Editor de 3 thumbnails
  ├── studio/
  │   ├── MediaUploader.tsx           # Upload de mídia própria
  │   ├── AIMediaGenerator.tsx        # Geração de mídia com IA
  │   └── MediaSearchModal.tsx        # Busca de mídia stock
  └── ui/
      ├── ProgressBar.tsx             # Barra de progresso animada
      ├── StreamingText.tsx           # Texto com efeito de digitação
      ├── ActivityLog.tsx             # Log estilo terminal
      └── StepIndicator.tsx           # Indicador de etapas
```

## 🔄 Fluxo de Trabalho Atualizado

### Etapa 1: Input (Expandida)

1. Usuário seleciona modo de workflow (FAST por padrão)
2. Opcionalmente faz upload de planilha do YouTube Studio
3. Define tema/instrução (opcional se houver outras fontes)
4. Adiciona tags de foco (opcional)
5. Cola link de vídeo concorrente (opcional)
6. Cola transcrição para análise (opcional)
7. **Validação**: Pelo menos um campo deve estar preenchido
8. Sistema avança para Research

### Etapa 4: Proposta (Thumbnails A/B/C)

1. Sistema gera 3 variações de título + thumbnail
2. Para cada variação (A, B, C):
   - Usuário pode editar título
   - Usuário pode editar prompt
   - Usuário pode gerar com IA ou fazer upload manual
3. **Validação**: Todas as 3 thumbnails devem estar prontas
4. Sistema avança para Studio

### Etapa 5: Studio (Seleção de Mídia)

1. Para cada cena do roteiro:
   - Visualizar mídia sugerida
   - **Trocar**: Abrir MediaSearchModal com mais opções
   - **Upload**: Usar MediaUploader para mídia própria
   - **Gerar IA**: Usar AIMediaGenerator para criar sob demanda
2. Sistema avança para Render

### (Futuro) Etapa 5b: Preview

1. Vídeo renderizado é mostrado em player
2. Usuário aprova ou reprova
3. Se reprovar, volta para editar
4. Se aprovar, avança para Upload

### Etapa 6: Upload

1. Todas as 3 thumbnails são enviadas ao YouTube
2. YouTube executa teste A/B/C automaticamente
3. Usuário monitora performance

## 📊 Melhorias de UX

1. **Feedback Visual Constante**:
   - ProgressBar mostra progresso de operações longas
   - ActivityLog exibe o que está acontecendo
   - StreamingText para geração de IA em tempo real

2. **Validações Claras**:
   - Indicadores visuais do que está pendente
   - Mensagens de erro específicas
   - Bloqueios inteligentes (ex: 3 thumbnails obrigatórias)

3. **Flexibilidade**:
   - Múltiplas fontes de input opcionais
   - Usuário escolhe nível de personalização
   - Opção de usar stock, IA ou upload próprio

4. **Transparência**:
   - Custos de geração IA exibidos antecipadamente
   - Tempo estimado por modo
   - Preview antes de upload

## 🚀 Próximos Passos (Não Incluídos)

1. **Preview de Vídeo**:
   - Criar página `app/step/5b-preview/page.tsx`
   - Modificar pipeline Inngest com `step.waitForEvent()`
   - Implementar aprovação/reprovação

2. **APIs Reais**:
   - Integrar API do YouTube para análise de concorrente
   - Conectar geradores de IA (Flux, DALL-E, Runway)
   - Implementar upload real para Vercel Blob/S3

3. **Modos STANDARD e PREMIUM**:
   - Ativar quando funcionalidades estiverem prontas
   - STANDARD: Editor avançado, timeline
   - PREMIUM: Editor profissional, múltiplos formatos

4. **Streaming Real**:
   - Implementar streaming de geração de roteiro
   - Atualizar `app/api/proposal/script/route.ts`

## 🧪 Testando as Mudanças

1. **Página de Input**:
   ```bash
   # Iniciar dev server
   npm run dev

   # Acessar: http://localhost:3000/step/1-input
   ```
   - Testar seletor de modo
   - Upload de planilha (arquivos de teste em `test-data/`)
   - Múltiplos campos

2. **Componentes UI**:
   ```typescript
   import ProgressBar from "@/components/ui/ProgressBar";
   <ProgressBar progress={75} label="Processando" />
   ```

3. **Thumbnails A/B/C**:
   ```typescript
   import ThumbnailEditor from "@/components/proposal/ThumbnailEditor";
   // Passar 3 variações e callbacks
   ```

## 📝 Commits Realizados

1. **499482e**: `feat: adiciona base do Pack #1 - modos de workflow e inputs múltiplos`
2. **7497f24**: `feat: expande página de input com múltiplas fontes`
3. **5605656**: `feat: adiciona componentes de feedback em tempo real`
4. **e4c67b3**: `feat: adiciona componentes para thumbnails A/B/C e seleção de mídia`

## ⚠️ Observações Importantes

1. **Migração do Banco**:
   - Schema foi atualizado
   - Prisma Client foi gerado
   - Migração será aplicada no deploy (DATABASE_URL configurado na Vercel)

2. **Funcionalidades Existentes**:
   - Todas mantidas e funcionando
   - Design system aproveitado
   - Inngest pipeline preservado

3. **Compatibilidade**:
   - Novos campos são opcionais
   - Sistema funciona com ou sem novos inputs
   - Modo FAST é padrão

## 🎯 Conclusão

O Pack #1 adiciona com sucesso:
- ✅ Sistema de modos de workflow
- ✅ Múltiplas fontes de input
- ✅ Análise adaptativa com IA
- ✅ Teste A/B/C de thumbnails (3 obrigatórias)
- ✅ Seleção de mídia estilo CapCut
- ✅ Feedback em tempo real melhorado
- ✅ Preparação para preview de vídeo

Tudo aproveitando a infraestrutura existente do ORION, sem quebrar funcionalidades e seguindo o design system estabelecido.

---

**Desenvolvido por**: Claude Code
**Data**: 2026-01-26
**Branch**: `claude/implement-pack-1-orion-g9WG7`
