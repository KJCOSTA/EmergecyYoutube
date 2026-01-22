# Guia de Deploy - EmergencyYoutube

## ✅ Status do Projeto

O projeto está **PRONTO PARA DEPLOY**:
- ✅ Build de produção bem-sucedido
- ✅ Todas as dependências instaladas
- ✅ Erros TypeScript/ESLint corrigidos
- ✅ Configuração do Vercel criada (vercel.json)
- ✅ Documentação completa (PRODUCTION_NOTES.md)
- ✅ Código commitado no branch: `claude/fix-production-issues-O91U4`

## 🚀 Opção 1: Deploy via GitHub (Recomendado)

### Passo 1: Conectar GitHub à Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta
3. Clique em **"Add New Project"**
4. Selecione **"Import Git Repository"**
5. Conecte sua conta GitHub se ainda não estiver conectada
6. Selecione o repositório: `KJCOSTA/EmergecyYoutube`

### Passo 2: Configurar o Projeto

1. **Framework Preset**: Next.js (detectado automaticamente)
2. **Root Directory**: `.` (raiz do projeto)
3. **Build Command**: `npm run build` (padrão)
4. **Output Directory**: `.next` (padrão)
5. **Install Command**: `npm install` (padrão)

### Passo 3: Configurar Variáveis de Ambiente

Antes de fazer deploy, adicione as seguintes variáveis de ambiente no painel da Vercel:

#### ⚠️ OBRIGATÓRIAS (para features principais):

```
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_key
YOUTUBE_API_KEY=your_youtube_data_api_key
```

#### Opcionais (para features avançadas):

```
ANTHROPIC_API_KEY=your_anthropic_key
PEXELS_API_KEY=your_pexels_key
PIXABAY_API_KEY=your_pixabay_key
UNSPLASH_ACCESS_KEY=your_unsplash_key
JSON2VIDEO_API_KEY=your_json2video_key
ELEVENLABS_API_KEY=your_elevenlabs_key
TAVILY_API_KEY=your_tavily_key
REPLICATE_API_TOKEN=your_replicate_token
STABILITY_API_KEY=your_stability_key
YOUTUBE_CHANNEL_ID=your_channel_id
```

### Passo 4: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar (2-3 minutos)
3. Seu site estará disponível em: `https://emergecy-youtube.vercel.app` (ou URL similar)

### Passo 5: Deploy Automático

- Qualquer push para o branch principal fará deploy automático
- Pull requests geram preview deployments automaticamente

---

## 🚀 Opção 2: Deploy via CLI (Alternativo)

Se preferir usar o Vercel CLI:

```bash
# 1. Instalar Vercel CLI (se ainda não tiver)
npm install -g vercel

# 2. Login na Vercel
vercel login

# 3. Deploy para produção
vercel --prod

# 4. Seguir as instruções no terminal
```

**Nota**: Configure as variáveis de ambiente no arquivo `.env` ou via dashboard da Vercel.

---

## 🔧 Configuração das API Keys

### Google Gemini
1. Acesse: https://aistudio.google.com/app/apikey
2. Crie uma nova API key
3. Copie e adicione como `GOOGLE_GENERATIVE_AI_API_KEY`

### OpenAI
1. Acesse: https://platform.openai.com/api-keys
2. Crie uma nova API key
3. Copie e adicione como `OPENAI_API_KEY`

### YouTube Data API
1. Acesse: https://console.cloud.google.com/apis/credentials
2. Crie credenciais → API key
3. Habilite "YouTube Data API v3"
4. Copie e adicione como `YOUTUBE_API_KEY`

### Anthropic Claude
1. Acesse: https://console.anthropic.com/settings/keys
2. Crie uma nova API key
3. Copie e adicione como `ANTHROPIC_API_KEY`

### Outras APIs
- **Pexels**: https://www.pexels.com/api/
- **Pixabay**: https://pixabay.com/api/docs/
- **Unsplash**: https://unsplash.com/developers
- **ElevenLabs**: https://elevenlabs.io/
- **Tavily**: https://tavily.com/
- **JSON2Video**: https://json2video.com/
- **Replicate**: https://replicate.com/
- **Stability AI**: https://platform.stability.ai/

---

## ⚠️ Limitações Conhecidas

Antes de fazer deploy, esteja ciente das seguintes limitações:

### 1. FASTAUTNEW Endpoints (Não Funcionais)
- `/api/fastautnew/run` retorna dados simulados
- `/api/fastautnew/render` retorna URL fake
- **Solução**: Use o workflow completo em `/step/1-input` até `/step/6-upload`

### 2. YouTube Upload (Não Implementado)
- Upload para YouTube requer implementação OAuth2
- Atualmente retorna apenas mensagem informativa
- **Solução**: Implementar fluxo OAuth2 ou fazer upload manual

### 3. Sem Persistência de Dados
- Dados armazenados apenas no navegador (localStorage)
- Nenhuma base de dados server-side
- **Recomendação**: Adicionar PostgreSQL/MongoDB em produção

---

## 📊 Monitoramento Pós-Deploy

Após o deploy, verifique:

1. **Status das APIs**: Acesse `/api/status` para ver quais APIs estão configuradas
2. **Health Check**: Acesse `/api/health` para verificar o sistema
3. **Logs**: Monitore os logs no dashboard da Vercel
4. **Erros**: Configure Sentry ou outro serviço de tracking de erros

---

## 🔄 Próximos Passos Recomendados

### Curto Prazo:
- [ ] Adicionar variáveis de ambiente na Vercel
- [ ] Testar todas as features principais
- [ ] Configurar domínio customizado (opcional)
- [ ] Adicionar tracking de analytics

### Médio Prazo:
- [ ] Implementar upload real para YouTube (OAuth2)
- [ ] Adicionar banco de dados (PostgreSQL/Supabase)
- [ ] Implementar autenticação de usuários
- [ ] Adicionar sistema de filas para processamento

### Longo Prazo:
- [ ] Implementar endpoints FASTAUTNEW reais
- [ ] Adicionar cache e otimização de performance
- [ ] Criar testes automatizados
- [ ] Configurar CI/CD pipeline completo

---

## 📞 Suporte

Se encontrar problemas durante o deploy:

1. Verifique os logs no dashboard da Vercel
2. Revise o arquivo `PRODUCTION_NOTES.md` para limitações conhecidas
3. Certifique-se de que todas as variáveis de ambiente estão configuradas
4. Verifique se as API keys são válidas e têm créditos/quota disponível

---

## 📄 Arquivos de Configuração

- **vercel.json**: Configuração do deploy na Vercel
- **.env.example**: Template com todas as variáveis necessárias
- **PRODUCTION_NOTES.md**: Documentação completa de limitações e issues
- **package.json**: Dependências e scripts do projeto

---

**Última atualização**: 2026-01-22

**Branch de Deploy**: `claude/fix-production-issues-O91U4`

**Status do Build**: ✅ Sucesso
