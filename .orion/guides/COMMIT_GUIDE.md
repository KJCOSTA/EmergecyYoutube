# 📝 Guia de Commits - ORION

**⚠️ REGRA #1: TODO EM PORTUGUÊS (exceto termos técnicos)**

---

## 🎯 PADRÃO OBRIGATÓRIO

```
tipo: VERBO descrição curta em português

Descrição detalhada em português (opcional).

DETALHES:
- Mudança 1
- Mudança 2
```

---

## 🔤 SINTAXES FACILITADAS (Copy & Paste)

### ✨ Nova Feature

```bash
feat: ADICIONA [nome da feature]

[Descrição do que faz em português]

DETALHES:
- Arquivos: [lista]
- Funcionalidade: [o que faz]
```

### 🐛 Bug Fix

```bash
fix: CORRIGE [nome do bug]

[Como foi resolvido em português]

DETALHES:
- Problema: [qual era]
- Solução: [o que foi feito]
- Arquivo: [caminho:linha]
```

### 🎨 Visual/Style

```bash
style: MODERNIZA [componente]

MUDANÇAS:
- Design tokens aplicados
- Glow effects adicionados
- [outras mudanças]
```

### ♻️ Refatoração

```bash
refactor: REORGANIZA [o que]

ANTES: [como estava]
DEPOIS: [como ficou]

BENEFÍCIOS:
- [benefício 1]
- [benefício 2]
```

### 📚 Documentação

```bash
docs: ATUALIZA [o que]

DETALHES:
- Sessão X adicionada
- [outras mudanças]
```

---

## ✅ EXEMPLOS PRÁTICOS

### Exemplo 1: OAuth YouTube
```bash
feat: ADICIONA autenticação OAuth2 para YouTube

Implementa fluxo completo de OAuth2 com renovação automática de tokens
para permitir upload de vídeos no YouTube.

DETALHES:
- Arquivo: lib/youtube-oauth.ts (novo)
- Funcionalidade: Login, refresh tokens, upload
- Breaking changes: Requer YOUTUBE_CLIENT_ID e YOUTUBE_CLIENT_SECRET
```

### Exemplo 2: Bug do Loading
```bash
fix: CORRIGE loading infinito na conexão do YouTube

O componente estava re-renderizando infinitamente devido ao useEffect
sem controle de execução.

DETALHES:
- Problema: Infinite loop no fetchChannelInfo
- Solução: Flag hasFetchedChannel para prevenir múltiplas chamadas
- Arquivo: app/step/1-input/page.tsx:45-60
```

### Exemplo 3: Modernização Visual
```bash
style: MODERNIZA dashboard com glow effects vibrantes

MUDANÇAS:
- Glow effects em todos os cards (shadow-glow-lg)
- Gradientes animados nos títulos
- Mesh pattern como background
- Shimmer effects no hover
- 50+ classes substituídas (zinc-* → design tokens)
```

---

## 🚫 EXEMPLOS **ERRADOS** (Não Faça!)

```bash
❌ update stuff              # Muito vago + inglês
❌ fix bug                   # Não diz qual bug
❌ changes                   # Não diz o que mudou
❌ wip                       # Nunca commite WIP!
❌ arrumei umas coisas       # Muito informal
❌ atualizei                 # Precisa dizer O QUE
```

---

## 📖 TIPOS DE COMMIT

| Tipo | Quando Usar | Exemplo |
|------|------------|---------|
| `feat:` | Nova funcionalidade | `feat: ADICIONA sistema de export JSON` |
| `fix:` | Correção de bug | `fix: CORRIGE YouTube loading infinito` |
| `style:` | Mudanças visuais/CSS | `style: MODERNIZA dashboard com glow effects` |
| `refactor:` | Refatoração (sem mudar comportamento) | `refactor: REORGANIZA estrutura de pastas` |
| `docs:` | Documentação | `docs: ATUALIZA README com guia de deploy` |
| `perf:` | Melhoria de performance | `perf: OTIMIZA queries do banco de dados` |
| `test:` | Testes | `test: ADICIONA testes para API routes` |
| `chore:` | Build/config | `chore: ATUALIZA dependências do projeto` |

---

## 🌍 REGRA DE PORTUGUÊS

### ✅ SEMPRE em português:
- Tipo do commit (quando possível: `feat`, `fix`, etc)
- Descrição do commit
- Corpo do commit
- Lista de detalhes
- Explicações

### ✅ Pode ser em inglês:
- Termos técnicos (OAuth2, JWT, API, etc)
- Nomes de tecnologias (Next.js, Prisma, etc)
- Nomes de arquivos (`app/page.tsx`)
- Variáveis e funções no código
- Siglas (SEO, UI, UX, etc)

### Exemplo Correto:
```bash
feat: ADICIONA autenticação OAuth2 no YouTube

Implementa fluxo OAuth2 completo usando YouTube Data API v3.
O usuário autoriza uma vez e os tokens são renovados automaticamente.

DETALHES:
- Tecnologia: OAuth2 com refresh tokens
- Arquivo: lib/youtube-oauth.ts
- Funcionalidade: Login, refresh automático, upload de vídeos
```

---

## 🔄 WORKFLOW RÁPIDO

```bash
# 1. Faça suas mudanças
# ... código ...

# 2. Adicione ao stage
git add .

# 3. Commit com padrão (copie template abaixo e preencha)
git commit -m "tipo: VERBO descrição

DETALHES:
- Mudança 1
- Mudança 2
"

# 4. Push
git push
```

---

## 📋 TEMPLATE RÁPIDO (Copie e Cole)

```
tipo: VERBO descrição curta em português

Descrição detalhada em português.

DETALHES:
- Arquivos modificados:
- Funcionalidade:
- Breaking changes: Não

```

**Salve em**: `.orion/templates/commit.txt`

---

**Data de Criação**: 24/01/2026
**Mantido por**: Equipe ORION
