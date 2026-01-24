# 🤝 Guia de Contribuição - ORION

**Para: Todos os Colaboradores (Claude, Gemini, e outros)**

---

## 📋 REGRA #1: SEMPRE VERIFIQUE ANTES DE ATUALIZAR

### Antes de Modificar Documentação:

```bash
# 1. Leia SEMPRE os arquivos de documentação existentes
- components/documentation/DecisionsTab.tsx
- components/documentation/content.ts
- components/documentation/GenesisTab.tsx
- components/documentation/CurrentStateTab.tsx

# 2. Verifique se NÃO HÁ logs/decisões de outros colaboradores
# Procure por sessões numeradas (Sessão 1, Sessão 2, etc.)
```

**⚠️ NUNCA sobrescreva decisões de outros colaboradores!**

---

## 📝 PADRÃO DE COMMITS

### Formato Obrigatório:

```
<tipo>: <AÇÃO> descrição curta e clara

<corpo opcional com detalhes>

DETALHES:
- item 1
- item 2

<rodapé opcional>
```

### Tipos de Commit:

| Tipo | Quando Usar | Exemplo |
|------|------------|---------|
| `feat:` | Nova funcionalidade | `feat: ADICIONA sistema de export JSON` |
| `fix:` | Correção de bug | `fix: CORRIGE YouTube loading infinito` |
| `refactor:` | Refatoração (sem mudar comportamento) | `refactor: REORGANIZA estrutura de pastas` |
| `style:` | Mudanças visuais/CSS | `style: MODERNIZA dashboard com glow effects` |
| `docs:` | Documentação | `docs: ATUALIZA README com guia de deploy` |
| `perf:` | Melhoria de performance | `perf: OTIMIZA queries do banco de dados` |
| `test:` | Testes | `test: ADICIONA testes para API routes` |
| `chore:` | Tarefas de build/config | `chore: ATUALIZA dependências do projeto` |

### ✅ Exemplos BONS:

```bash
feat: ADICIONA autenticação OAuth2 para YouTube

- Implementa fluxo OAuth2 completo
- Adiciona refresh token automático
- Integra com YouTube Data API v3

DETALHES:
- Arquivo: lib/youtube-auth.ts
- Testes: 100% coverage
- Breaking change: Requer novas env vars
```

```bash
fix: CORRIGE infinite loop no fetchChannelInfo

Adiciona flag hasFetchedChannel para prevenir múltiplas chamadas.

DETALHES:
- Arquivo: app/step/1-input/page.tsx:45-60
- Issue: YouTube loading infinito
- Solução: useCallback com dependency tracking
```

### ❌ Exemplos RUINS:

```bash
update stuff              # Muito vago
fix bug                   # Qual bug?
changes                   # Que tipo de mudança?
wip                       # Work in progress - não commite WIP!
```

---

## 📚 ONDE ATUALIZAR QUANDO ALGO ENTRA EM PRODUÇÃO

### 1️⃣ Documentação de Decisões (`DecisionsTab.tsx`)

**Quando**: Sempre que uma decisão arquitetural for tomada

**Localização**: `components/documentation/DecisionsTab.tsx`

**Como**:
```tsx
{/* Sessão X: [TÍTULO DA DECISÃO] - [DATA] */}
<AnimatedSection delay={0.X}>
  <div className="bg-layer-1/50 border border-subtle rounded-xl p-6">
    <div className="flex items-center gap-2 mb-4">
      <[ICONE] className="w-6 h-6 text-[COR]" />
      <h3 className="text-xl font-semibold text-white">
        Sessão X: [TÍTULO] ([DATA])
      </h3>
    </div>

    {/* Contexto */}
    <div className="mb-6">
      <h4 className="text-lg font-medium text-violet-400 mb-3">Contexto</h4>
      <p className="text-secondary text-sm leading-relaxed">
        [DESCREVA O PROBLEMA/SITUAÇÃO]
      </p>
    </div>

    {/* Decisão */}
    <div className="mb-6">
      <h4 className="text-lg font-medium text-green-400 mb-3">Decisão Final</h4>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
          <p className="text-secondary text-sm">[DECISÃO 1]</p>
        </div>
        <!-- mais decisões -->
      </div>
    </div>

    {/* Resultado */}
    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
      <p className="text-green-300 text-sm">
        <strong>Resultado:</strong> [IMPACTO DA DECISÃO]
      </p>
    </div>
  </div>
</AnimatedSection>
```

**Exemplo Real**:
```tsx
{/* Sessão 4: Implementação OAuth2 YouTube - 25/01/2026 */}
<AnimatedSection delay={0.9}>
  <div className="bg-layer-1/50 border border-subtle rounded-xl p-6">
    <div className="flex items-center gap-2 mb-4">
      <Server className="w-6 h-6 text-red-400" />
      <h3 className="text-xl font-semibold text-white">
        Sessão 4: OAuth2 YouTube (25 de Janeiro de 2026)
      </h3>
    </div>

    <div className="mb-6">
      <h4 className="text-lg font-medium text-violet-400 mb-3">Contexto</h4>
      <p className="text-secondary text-sm leading-relaxed">
        Upload de vídeos para YouTube exige autenticação OAuth2.
        Sistema atual só tinha YouTube Data API.
      </p>
    </div>

    <div className="mb-6">
      <h4 className="text-lg font-medium text-green-400 mb-3">Decisão Final</h4>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-400 mt-1" />
          <p className="text-secondary text-sm">
            Implementar fluxo OAuth2 completo com refresh tokens
          </p>
        </div>
      </div>
    </div>
  </div>
</AnimatedSection>
```

---

### 2️⃣ Estado Atual do Projeto (`content.ts`)

**Quando**: Feature nova entra em produção

**Localização**: `components/documentation/content.ts`

**Como**:
```typescript
export const currentStateContent = `# Estado Atual & Próximos Passos

**Versão:** X.X.X
**Status:** Em Produção
**Última Atualização:** [DATA]
**Nome Oficial:** ORION

## ✅ Funcionalidades em Produção

### [CATEGORIA] (Última Atualização: [DATA])
- ✅ **[FEATURE 1]**: [Descrição curta]
- ✅ **[FEATURE 2]**: [Descrição curta]
- 🚧 **[EM PROGRESSO]**: [O que está sendo feito]

## 🎨 Visual Upgrade State of the Art (Atualizado em: [DATA])

**Status**: [CONCLUÍDO/EM PROGRESSO]

**Progresso**:
- PART 1: ✅ [Descrição]
- PART 2: ✅ [Descrição]
- PART 3: 🚧 [Descrição]
`;
```

---

### 3️⃣ Changelog do Sistema

**Quando**: Deploy em produção

**Localização**: Adicione ao início de `CHANGELOG.md` (criar se não existir)

**Formato**:
```markdown
# Changelog

## [X.X.X] - YYYY-MM-DD

### ✨ Adicionado
- Feature nova X
- Feature nova Y

### 🔧 Corrigido
- Bug X
- Bug Y

### ♻️ Modificado
- Refatoração Z
- Melhoria W

### 🗑️ Removido
- Código legado X
```

---

## 🔄 WORKFLOW COLABORATIVO

### Quando Você Terminar uma Tarefa:

```bash
# 1. Commit seguindo o padrão
git add .
git commit -m "feat: ADICIONA [sua feature]

DETALHES:
- Arquivo: [caminho]
- Testes: [status]
- Breaking changes: [sim/não]
"

# 2. Push para branch
git push -u origin claude/[seu-branch-name]

# 3. ATUALIZAR DOCUMENTAÇÃO
# Edite os arquivos de documentação conforme seções acima

# 4. Commit da documentação
git commit -m "docs: ATUALIZA decisões com [sua feature]"

# 5. Push final
git push
```

---

## 🚨 REGRAS IMPORTANTES

### ✅ SEMPRE FAÇA:

1. **Leia** documentação existente antes de modificar
2. **Verifique** logs de outros colaboradores (Sessões no DecisionsTab)
3. **Use** verbos MAIÚSCULOS nos commits (ADICIONA, CORRIGE, MODERNIZA)
4. **Incremente** número da sessão no DecisionsTab (Sessão 1, 2, 3...)
5. **Documente** TODAS as decisões arquiteturais
6. **Atualize** content.ts quando feature entra em produção
7. **Teste** antes de commitar

### ❌ NUNCA FAÇA:

1. **Não sobrescreva** sessões/decisões de outros colaboradores
2. **Não commite** código com console.logs de debug
3. **Não commite** secrets/API keys
4. **Não use** commits vagos ("update", "fix", "changes")
5. **Não faça** force push em branches compartilhadas
6. **Não esqueça** de atualizar a documentação

---

## 📖 TEMPLATE PARA GEMINI/OUTROS COLABORADORES

**Cole isso para o Gemini quando ele terminar uma tarefa**:

```
TAREFA CONCLUÍDA! Agora você DEVE atualizar a documentação:

1. ABRA e LEIA primeiro:
   - components/documentation/DecisionsTab.tsx (veja qual é a última Sessão)
   - components/documentation/content.ts

2. ADICIONE uma nova SESSÃO ao DecisionsTab.tsx:
   - Incremente o número (se última é Sessão 3, adicione Sessão 4)
   - Use a data de HOJE
   - Descreva: Contexto → Decisão → Resultado

3. ATUALIZE content.ts:
   - Adicione sua feature na seção "✅ Funcionalidades em Produção"
   - Atualize a data de "Última Atualização"

4. COMMIT:
   git commit -m "docs: ATUALIZA decisões com [sua feature]

   DETALHES:
   - Sessão X adicionada ao DecisionsTab
   - Feature [nome] documentada
   "

5. PUSH:
   git push

IMPORTANTE: Sempre use VERBOS MAIÚSCULOS (ADICIONA, CORRIGE, MODERNIZA)
```

---

## 🎯 RESUMO RÁPIDO

| Ação | Onde | Como |
|------|------|------|
| Nova feature | DecisionsTab.tsx | Adicione nova Sessão numerada |
| Feature em produção | content.ts | Adicione em "✅ Funcionalidades" |
| Bug fix | Commit message | `fix: CORRIGE [bug]` |
| Refatoração | Commit message | `refactor: REORGANIZA [o que]` |
| Visual update | Commit message | `style: MODERNIZA [componente]` |

---

## ❓ Dúvidas?

- Sempre verifique commits anteriores: `git log --oneline`
- Leia a documentação existente PRIMEIRO
- Em caso de conflito, PERGUNTE ao usuário

---

**Data de Criação**: 24 de Janeiro de 2026
**Versão**: 1.0.0
**Mantenedores**: Equipe ORION (Claude, Gemini, outros)
