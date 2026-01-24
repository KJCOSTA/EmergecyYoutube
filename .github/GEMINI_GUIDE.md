# 🤖 Guia Rápido - Gemini & Colaboradores

## ⚡ CHECKLIST OBRIGATÓRIO

### ✅ ANTES de Começar Qualquer Tarefa:

```bash
# 1. Leia SEMPRE estes arquivos primeiro:
- components/documentation/DecisionsTab.tsx (veja última Sessão)
- components/documentation/content.ts (veja último status)
- git log --oneline -10 (veja últimos commits)
```

### ✅ DEPOIS de Terminar Qualquer Tarefa:

```bash
# 1. COMMIT com padrão correto
git commit -m "tipo: VERBO MAIÚSCULO descrição

DETALHES:
- item 1
- item 2
"

# 2. ATUALIZAR DecisionsTab.tsx
# Adicione nova Sessão X (incremente o número)

# 3. ATUALIZAR content.ts
# Adicione sua feature em "✅ Funcionalidades em Produção"

# 4. COMMIT da documentação
git commit -m "docs: ATUALIZA decisões com [sua feature]"

# 5. PUSH
git push
```

---

## 📝 PADRÃO DE COMMIT (COLE E ADAPTE)

```bash
# Nova Feature
git commit -m "feat: ADICIONA [nome da feature]

Descrição mais detalhada do que foi feito.

DETALHES:
- Arquivos modificados: [lista]
- Testes: [passou/não tem]
- Breaking changes: [sim/não]
"

# Bug Fix
git commit -m "fix: CORRIGE [nome do bug]

Descrição do problema e como foi resolvido.

DETALHES:
- Arquivo: [caminho:linha]
- Issue: [descrição]
- Solução: [o que foi feito]
"

# Visual/Style
git commit -m "style: MODERNIZA [componente]

DETALHES:
- Design tokens aplicados
- Glow effects adicionados
- Gradients e animações
"

# Refatoração
git commit -m "refactor: REORGANIZA [o que]

DETALHES:
- Antes: [como estava]
- Depois: [como ficou]
- Benefícios: [lista]
"

# Documentação
git commit -m "docs: ATUALIZA [o que]

DETALHES:
- Sessão X adicionada
- Feature Y documentada
- Data: [hoje]
"
```

---

## 📚 TEMPLATE PARA ATUALIZAR DOCUMENTAÇÃO

### 1. DecisionsTab.tsx (SEMPRE incremente o número da Sessão)

```tsx
{/* Sessão X: [TÍTULO] - DD/MM/YYYY */}
<AnimatedSection delay={0.X}>
  <div className="bg-layer-1/50 border border-subtle rounded-xl p-6">
    <div className="flex items-center gap-2 mb-4">
      <Zap className="w-6 h-6 text-cyan-400" />
      <h3 className="text-xl font-semibold text-white">
        Sessão X: [TÍTULO DA DECISÃO] (DD de Mês de YYYY)
      </h3>
    </div>

    {/* Contexto */}
    <div className="mb-6">
      <h4 className="text-lg font-medium text-violet-400 mb-3">Contexto</h4>
      <p className="text-secondary text-sm leading-relaxed">
        [O que estava acontecendo? Qual era o problema?]
      </p>
    </div>

    {/* Decisão */}
    <div className="mb-6">
      <h4 className="text-lg font-medium text-green-400 mb-3">Decisão Final</h4>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
          <p className="text-secondary text-sm">
            [Decisão 1: O que foi decidido fazer]
          </p>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
          <p className="text-secondary text-sm">
            [Decisão 2: Outra decisão]
          </p>
        </div>
      </div>
    </div>

    {/* Resultado */}
    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
      <p className="text-green-300 text-sm">
        <strong>Resultado:</strong> [Qual foi o impacto? O que melhorou?]
      </p>
    </div>
  </div>
</AnimatedSection>
```

### 2. content.ts (Adicione no início)

```typescript
export const currentStateContent = `# Estado Atual & Próximos Passos

**Versão:** X.X.X
**Status:** Em Produção
**Última Atualização:** DD de Mês de YYYY  <-- ATUALIZE AQUI
**Nome Oficial:** ORION

## ✅ Funcionalidades em Produção

### [Categoria] (Última Atualização: DD/MM/YYYY)
- ✅ **[Sua Feature]**: [Descrição curta]  <-- ADICIONE AQUI
- ✅ **Feature Existente**: Descrição
...
`;
```

---

## 🚨 REGRAS DE OURO

### ✅ SEMPRE:
1. **LEIA** antes de modificar (DecisionsTab + content.ts)
2. **INCREMENTE** número da Sessão (se última é 3, adicione 4)
3. **USE** verbos MAIÚSCULOS nos commits (ADICIONA, CORRIGE, MODERNIZA)
4. **DOCUMENTE** tudo que entra em produção
5. **VERIFIQUE** `git log` para ver padrão dos commits anteriores

### ❌ NUNCA:
1. **NÃO sobrescreva** Sessões de outros colaboradores
2. **NÃO use** commits vagos ("update", "fix bug", "changes")
3. **NÃO commite** sem documentar
4. **NÃO esqueça** de incrementar o número da Sessão
5. **NÃO use** verbos minúsculos nos commits

---

## 🎯 EXEMPLO REAL COMPLETO

### Cenário: Você implementou OAuth2 para YouTube

**1. Commit da Feature**
```bash
git commit -m "feat: ADICIONA autenticação OAuth2 para YouTube

Implementa fluxo completo de OAuth2 com refresh tokens automáticos
para permitir upload de vídeos no YouTube.

DETALHES:
- Arquivo: lib/youtube-oauth.ts (novo)
- Arquivo: app/api/youtube/auth/route.ts (novo)
- Testes: Fluxo manual testado
- Breaking changes: Requer YOUTUBE_CLIENT_ID e YOUTUBE_CLIENT_SECRET
"
```

**2. Atualizar DecisionsTab.tsx**
```tsx
{/* Sessão 4: OAuth2 YouTube - 25/01/2026 */}
<AnimatedSection delay={0.9}>
  <div className="bg-layer-1/50 border border-subtle rounded-xl p-6">
    <div className="flex items-center gap-2 mb-4">
      <Server className="w-6 h-6 text-red-400" />
      <h3 className="text-xl font-semibold text-white">
        Sessão 4: Implementação OAuth2 YouTube (25 de Janeiro de 2026)
      </h3>
    </div>

    <div className="mb-6">
      <h4 className="text-lg font-medium text-violet-400 mb-3">Contexto</h4>
      <p className="text-secondary text-sm leading-relaxed">
        Sistema precisava fazer upload de vídeos no YouTube, mas só tinha
        YouTube Data API que não permite uploads. Necessário OAuth2.
      </p>
    </div>

    <div className="mb-6">
      <h4 className="text-lg font-medium text-green-400 mb-3">Decisão Final</h4>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-400 mt-1" />
          <p className="text-secondary text-sm">
            Implementar OAuth2 completo com refresh tokens automáticos
          </p>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-400 mt-1" />
          <p className="text-secondary text-sm">
            Armazenar tokens de forma segura no localStorage
          </p>
        </div>
      </div>
    </div>

    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
      <p className="text-green-300 text-sm">
        <strong>Resultado:</strong> Sistema agora pode fazer upload direto
        para YouTube. Usuário autoriza uma vez e tokens são renovados automaticamente.
      </p>
    </div>
  </div>
</AnimatedSection>
```

**3. Atualizar content.ts**
```typescript
**Última Atualização:** 25 de Janeiro de 2026  // <-- Mudou de 24 para 25

### YouTube & Upload (Última Atualização: 25/01/2026)
- ✅ **OAuth2 YouTube**: Autenticação completa com refresh tokens  // <-- NOVO
- ✅ **YouTube Data API**: Busca de informações do canal
- ✅ **Upload Automático**: Envio direto para YouTube  // <-- NOVO
```

**4. Commit da Documentação**
```bash
git commit -m "docs: ATUALIZA decisões com OAuth2 YouTube

DETALHES:
- Sessão 4 adicionada ao DecisionsTab
- Feature OAuth2 documentada no content.ts
- Data atualizada para 25/01/2026
"
```

**5. Push**
```bash
git push
```

---

## 📞 QUANDO EM DÚVIDA

```bash
# Veja como outros fizeram
git log --oneline -20

# Veja última sessão documentada
grep -n "Sessão" components/documentation/DecisionsTab.tsx

# Veja última atualização
grep "Última Atualização" components/documentation/content.ts
```

---

**LEMBRE-SE**: Sempre LEIA antes de MODIFICAR!

**Data**: 24/01/2026
