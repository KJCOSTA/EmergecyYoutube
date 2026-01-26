# Páginas de Teste Técnico - ORION

Este diretório contém páginas de diagnóstico técnico isoladas para validar funcionalidades básicas do sistema sem dependências do fluxo principal.

## 🗄️ Página de Teste de Banco de Dados

**Rota:** `/test/db`

### Objetivo
Confirmar se o banco de dados PostgreSQL está conectando e persistindo dados corretamente.

### Funcionalidades
- Campo de texto simples para entrada de dados
- Botão "Salvar no banco" - persiste no PostgreSQL via Prisma
- Botão "Buscar do banco" - recupera a última mensagem salva
- Exibição completa de erros no console e na UI
- Logs detalhados no servidor e no cliente

### Implementação Técnica
- **Tabela:** `TestMessage` (schema em `/prisma/schema.prisma`)
- **API Save:** `POST /api/test/db/save`
- **API Fetch:** `GET /api/test/db/fetch`
- **ORM:** Prisma Client
- **Banco:** PostgreSQL

### Setup Necessário

Antes de usar esta página, execute a migration do Prisma:

```bash
# Instalar dependências (se ainda não fez)
npm install

# Executar migration para criar a tabela TestMessage
npx prisma migrate dev --name add_test_message_table

# Ou apenas gerar o Prisma Client (se a migration já foi aplicada no DB)
npx prisma generate
```

---

## 🤖 Página de Teste de APIs de IA

**Rota:** `/test/ai`

### Objetivo
Validar tokens de API, SDKs e chamadas reais às APIs de IA (OpenAI, Gemini, Claude).

### Funcionalidades
- Seleção do provider (OpenAI, Google Gemini, Anthropic Claude)
- Seleção do modelo específico
- Campo para inserir API key manualmente
- Campo de prompt livre
- Execução de chamada real à API
- Exibição da resposta bruta completa
- Metadados de uso (tokens, duração, etc.)
- Logs completos de request/response

### Implementação Técnica
- **API Route:** `POST /api/test/ai`
- **SDK:** Vercel AI SDK v6.0.49
- **Providers:**
  - `@ai-sdk/openai` - GPT-4o, GPT-4o Mini, GPT-4 Turbo
  - `@ai-sdk/google` - Gemini 1.5 Pro, 1.5 Flash, 2.0 Flash
  - `@ai-sdk/anthropic` - Claude 3.5 Sonnet, 3.5 Haiku
- **Sem abstrações:** Chamadas diretas sem uso do sistema ORION

### Segurança
- API keys são enviadas apenas para a requisição específica
- Não são armazenadas em variáveis de ambiente
- Não são persistidas no banco de dados
- Apenas existem na memória durante a execução

---

## 🚀 Como Usar

### Desenvolvimento Local

1. Configure o arquivo `.env` com `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/orion"
   ```

2. Execute as migrations:
   ```bash
   npx prisma migrate dev
   ```

3. Inicie o servidor:
   ```bash
   npm run dev
   ```

4. Acesse as páginas:
   - Teste de DB: http://localhost:3000/test/db
   - Teste de IA: http://localhost:3000/test/ai

### Deploy (Vercel)

No deploy, as migrations são executadas automaticamente. Apenas certifique-se de que:

1. A variável `DATABASE_URL` está configurada no Vercel
2. O Prisma está configurado para executar `prisma generate` no build

---

## 📝 Logs e Debugging

### No Cliente (Browser)
Abra o console do navegador (F12) para ver:
- `[CLIENT]` - Logs das requisições e respostas
- Erros detalhados com stack traces
- Dados completos enviados e recebidos

### No Servidor (Terminal)
Logs automáticos com prefixos:
- `[DB TEST SAVE]` - Operações de salvamento no banco
- `[DB TEST FETCH]` - Operações de busca no banco
- `[AI TEST]` - Chamadas às APIs de IA

---

## 🔧 Troubleshooting

### Erro: "Prisma Client não inicializado"
Execute: `npx prisma generate`

### Erro: "Tabela TestMessage não existe"
Execute: `npx prisma migrate dev`

### Erro de API Key inválida
Verifique:
1. A API key está correta
2. Tem créditos/quota disponível
3. O provider e modelo selecionados estão corretos

---

## ⚠️ Notas Importantes

- **Ambiente de Teste:** Estas páginas são apenas para diagnóstico técnico
- **Sem Autenticação:** Não há validação de usuário ou permissões
- **Sem Middleware:** Rotas isoladas sem middleware complexo
- **Código Explícito:** Prioriza clareza sobre abstrações
- **Logs Completos:** Todos os erros são exibidos integralmente

---

## 📂 Estrutura de Arquivos

```
/app/test/
├── README.md                       # Este arquivo
├── /db/
│   └── page.tsx                    # Página de teste de banco
└── /ai/
    └── page.tsx                    # Página de teste de IA

/app/api/test/
├── /db/
│   ├── /save/
│   │   └── route.ts               # API para salvar no banco
│   └── /fetch/
│       └── route.ts               # API para buscar do banco
└── /ai/
    └── route.ts                   # API para testar IA

/prisma/
└── schema.prisma                  # Schema com modelo TestMessage
```

---

**Criado para:** Diagnóstico técnico e validação de infraestrutura
**Projeto:** ORION - White-label Video Production Platform
