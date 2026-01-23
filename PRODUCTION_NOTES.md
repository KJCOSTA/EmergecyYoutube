# Production Notes - ORION

## ⚠️ Known Limitations & Incomplete Features

### 🔴 CRITICAL - Not Production Ready

#### 1. YouTube Upload (OAuth2 Not Implemented)
**File:** `app/api/youtube/upload/route.ts`

**Status:** Returns message "YouTube OAuth2 authentication required"

**Impact:**
- Users cannot upload videos to YouTube
- Core feature is non-functional

**To Fix:**
- Implement OAuth2 flow for YouTube API
- Add client credentials and redirect URIs
- Store refresh tokens securely
- Handle token refresh automatically

**Documentation:**
- https://developers.google.com/youtube/v3/guides/authentication
- https://developers.google.com/identity/protocols/oauth2

---

### 🟡 MEDIUM PRIORITY

#### 3. Environment Variables Required
The following environment variables MUST be set for the application to work:

**Required (Core Features):**
- `GOOGLE_GENERATIVE_AI_API_KEY` - For AI generation (Gemini)
- `OPENAI_API_KEY` - For GPT models
- `YOUTUBE_API_KEY` - For YouTube channel data

**Optional (Enhanced Features):**
- `ANTHROPIC_API_KEY` - For Claude models
- `PEXELS_API_KEY` - For stock images
- `PIXABAY_API_KEY` - For stock images
- `UNSPLASH_ACCESS_KEY` - For stock images
- `JSON2VIDEO_API_KEY` - For video rendering
- `ELEVENLABS_API_KEY` - For text-to-speech
- `TAVILY_API_KEY` - For research
- `REPLICATE_API_TOKEN` - For image generation
- `STABILITY_API_KEY` - For image generation

**Setup:**
1. Copy `.env.example` to `.env`
2. Add your API keys
3. Never commit `.env` to version control

---

#### 3.1. Vercel Blob Storage (File Upload System)
**Status:** ✅ Configurado (23/01/2026)

**O que é:**
O Vercel Blob é um sistema de armazenamento de arquivos na nuvem integrado à Vercel, usado para uploads dinâmicos (avatares, thumbnails, assets gerados).

**Configuração Necessária:**
1. Acesse: https://vercel.com/dashboard → Storage → Create Database → Blob
2. Nome sugerido: `orion-storage`
3. Região: Washington DC (iad1) - mesma do projeto
4. Copie o token: `BLOB_READ_WRITE_TOKEN`
5. Adicione nas variáveis de ambiente da Vercel (Production, Preview, Development)

**Uso no Código:**
```typescript
// Upload de arquivo
import { put } from '@vercel/blob';
const { url } = await put('avatars/user-123.png', file, { access: 'public' });
// Resultado: https://8myt2syx...vercel-storage.com/avatars/user-123.png

// Listar arquivos
import { list } from '@vercel/blob';
const { blobs } = await list({ prefix: 'avatars/' });
```

**Rotas implementadas:**
- `POST /api/upload` - Upload de arquivos (max 5MB, tipos: JPEG, PNG, GIF, WebP)
- `GET /api/files/list?path=avatars` - Listar arquivos por pasta

**Localização dos arquivos:**
- **Código estático** (logos, favicon): `/public/assets/` - visível no Git
- **Uploads dinâmicos** (avatares, thumbnails): Vercel Blob - na nuvem

**Diferenças importantes:**

| Característica | `/public` | Vercel Blob |
|----------------|-----------|-------------|
| Onde fica | No Git/Servidor | Nuvem Vercel |
| Visível no VS Code | ✅ Sim | ❌ Não (só via API) |
| Uso ideal | Assets estáticos | Uploads de usuários |
| Custo | Grátis ilimitado | 1GB grátis |
| Acesso | URL direto | Via API + URL gerada |

**Limitações:**
- Limite de 5MB por arquivo (configurável em `/app/api/upload/route.ts:33`)
- 1GB de armazenamento grátis no plano atual
- Tipos permitidos: JPEG, PNG, GIF, WebP (configurável)

**Como visualizar arquivos:**
1. Via API: `GET /api/files/list`
2. Dashboard Vercel: Storage → orion-storage → Browser
3. Settings do ORION: Menu lateral → Files (quando BLOB_READ_WRITE_TOKEN estiver configurado)

---

#### 4. No Database/Persistence Layer
**Impact:**
- All data stored in browser localStorage/sessionStorage
- Data lost when browser cache is cleared
- No multi-user support
- No data backup or recovery

**Recommendation for Production:**
- Add database (PostgreSQL, MongoDB, etc.)
- Implement server-side session management
- Add user authentication
- Store video projects and history

---

#### 5. Security Considerations
**Current Issues:**
- API keys stored in client-side sessionStorage (XSS vulnerable)
- No rate limiting on API endpoints
- No request validation middleware
- Console logging may expose sensitive data

**To Fix:**
- Move API key management server-side only
- Add rate limiting (e.g., using Vercel Edge Config or Upstash)
- Implement Zod validation on all API routes
- Remove console.log statements or use proper logging service
- Add CORS configuration

---

### 🟢 WORKING FEATURES

The following features are fully implemented and production-ready:

✅ **AI-Powered Content Generation**
- Title generation (app/api/proposal/titles)
- Script generation (app/api/proposal/script)
- Description generation (app/api/proposal/description)
- Tags generation (app/api/proposal/tags)
- Soundtrack suggestions (app/api/proposal/soundtrack)

✅ **Media Search**
- Pexels integration
- Pixabay integration
- Unsplash integration

✅ **Text-to-Speech**
- OpenAI TTS
- ElevenLabs
- Google TTS

✅ **Image Generation**
- DALL-E integration
- Stability AI
- Replicate

✅ **Research**
- Tavily API integration
- LLM-based research fallback

✅ **System Health**
- API status checking
- Boot sequence validation

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Set all required environment variables in Vercel
- [ ] Test all API endpoints with real API keys
- [ ] Verify AI model responses are in Portuguese (PT-BR)
- [ ] Test image search and generation
- [ ] Test TTS generation
- [ ] Document YouTube upload limitation for users
- [ ] Add error tracking (Sentry, LogRocket, etc.)
- [ ] Add analytics (PostHog, Plausible, etc.)
- [ ] Configure proper error pages (404, 500)
- [ ] Set up monitoring/alerts for API failures
- [ ] Add user documentation/help section
- [ ] Test on mobile devices
- [ ] Perform security audit

---

## 📝 Quick Start for Development

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Add your API keys to .env

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

---

## 🔧 Known Issues

### Build Warnings
- Some TypeScript strict mode warnings may appear
- ESLint warnings for unused variables

### Runtime Warnings
- 3 npm security vulnerabilities detected (run `npm audit` for details)
- Some dependencies may have peer dependency warnings

---

## 📚 Additional Documentation Needed

- [ ] API endpoint documentation
- [ ] User guide for each workflow step
- [ ] Architecture diagram
- [ ] Data flow documentation
- [ ] Contributing guidelines
- [ ] Testing documentation

---

**Last Updated:** 2026-01-23 (Rebranding para ORION + Vercel Blob configurado)
