# 🌌 ORION - Centro de Controle de Documentação

**Versão**: 1.0.0
**Última Atualização**: 24/01/2026
**Colaboradores**: Claude (Anthropic), Gemini (Google), Outros

---

## 🎯 PROPÓSITO DESTA ESTRUTURA

Centralizar TODA a documentação do projeto em **arquivos pequenos e específicos** para:
- ✅ Economizar 90% de quotas de tokens das IAs
- ✅ Facilitar colaboração entre múltiplas IAs (Claude, Gemini, etc)
- ✅ Manter histórico append-only (sem sobrescritas)
- ✅ Busca rápida e eficiente

---

## 📁 ESTRUTURA COMPLETA

```
.orion/
├── README.md                    # 👈 Você está aqui (índice geral)
│
├── docs/                        # 📚 Documentação técnica
│   ├── DECISIONS_LOG.md        # ✅ Log de decisões (append-only)
│   ├── STACK_CHANGES.md        # ✅ Mudanças na stack
│   └── VISUAL_UPGRADE.md       # ✅ Histórico upgrade visual
│
├── guides/                      # 📖 Guias para colaboradores
│   ├── COMMIT_GUIDE.md         # ✅ Como fazer commits (PT-BR)
│   ├── QUOTA_SAVING.md         # ✅ Economizar quotas de IA
│   └── QUICK_START.md          # ✅ Início rápido (30s)
│
└── templates/                   # 📋 Templates prontos
    └── commit.txt              # ✅ Template de commit
```

---

## 🚀 INÍCIO RÁPIDO (30 SEGUNDOS)

### Para Gemini/Claude/Outros Colaboradores:

1. **ANTES de qualquer tarefa**:
   ```typescript
   Read({ file_path: "/.orion/docs/DECISIONS_LOG.md", offset: -50, limit: 50 })
   ```

2. **Padrão de commit**:
   ```bash
   tipo: VERBO descrição em português

   DETALHES:
   - Mudança 1
   - Mudança 2
   ```

3. **DEPOIS de terminar**:
   ```bash
   # Commit da feature
   git commit -m "feat: ADICIONA [feature]..."

   # Atualizar docs (se necessário)
   cat >> .orion/docs/DECISIONS_LOG.md <<'EOF'
   ## Sessão X: ...
   EOF

   # Commit docs
   git commit -m "docs: ATUALIZA log de decisões"

   # Push
   git push
   ```

---

## 📖 GUIA DE CADA ARQUIVO

### 📚 `/docs/` - Documentação Técnica

#### `DECISIONS_LOG.md` (Mais Importante!)
**O que é**: Log cronológico de TODAS as decisões arquiteturais
**Como usar**:
- Leia antes de modificar: `offset: -50, limit: 50` (economiza 95% tokens)
- Adicione nova sessão sempre no FINAL
- Incremente número da sessão (1, 2, 3, ...)

**Quando atualizar**:
- ✅ Nova decisão arquitetural tomada
- ✅ Mudança na stack técnica
- ✅ Feature grande implementada

#### `STACK_CHANGES.md`
**O que é**: Log de mudanças na stack técnica (append-only)
**Como usar**: Leia completo (só 50 linhas)

**Quando atualizar**:
- ✅ Nova biblioteca adicionada/removida
- ✅ Upgrade de versão importante
- ✅ Mudança de tecnologia

#### `VISUAL_UPGRADE.md`
**O que é**: Histórico específico do upgrade visual
**Como usar**: Leia completo (100 linhas)

**Quando atualizar**:
- ✅ Mudanças no design system
- ✅ Novos componentes visuais
- ✅ Correções de UI/UX

---

### 📖 `/guides/` - Guias para Colaboradores

#### `QUICK_START.md` ⚡ (COMECE AQUI!)
**O que é**: Guia de 30 segundos para novos colaboradores
**Leia quando**: Primeira vez trabalhando no ORION

#### `COMMIT_GUIDE.md`
**O que é**: Padrão completo de commits em português
**Leia quando**: Antes de fazer qualquer commit

#### `QUOTA_SAVING.md` 💰 (MUITO IMPORTANTE!)
**O que é**: Como economizar 90% de quotas de tokens
**Leia quando**: Sempre! Antes de ler arquivos grandes

**Dicas principais**:
- Use `limit` e `offset` no Read
- Use Grep antes de Read
- Prefira arquivos `.orion/docs/` (pequenos) vs arquivos React (grandes)

---

### 📋 `/templates/` - Templates Prontos

#### `commit.txt`
**O que é**: Template pronto para copiar/colar
**Como usar**: `cat .orion/templates/commit.txt`

---

## 💡 POR QUE ESTA ESTRUTURA?

### PROBLEMA ANTIGO:
```
components/documentation/DecisionsTab.tsx  (684 linhas)
↓
Read completo = 10,000 tokens ❌
```

### SOLUÇÃO NOVA:
```
.orion/docs/DECISIONS_LOG.md (append-only)
↓
Read offset:-50 = 450 tokens ✅ (economia de 95%)
```

**Resultado**: 90% menos gasto de quotas + colaboração mais fácil!

---

## 🔍 BUSCA RÁPIDA

```bash
# Ver última decisão
tail -50 .orion/docs/DECISIONS_LOG.md

# Buscar por palavra-chave
grep -i "oauth" .orion/docs/*.md

# Ver todas as sessões
grep "^## Sessão" .orion/docs/DECISIONS_LOG.md

# Ver stack atual
cat .orion/docs/STACK_CHANGES.md | head -50

# Template de commit
cat .orion/templates/commit.txt
```

---

## 📊 COMPARAÇÃO DE CUSTOS

| Tarefa | ANTES (.tsx) | DEPOIS (.orion/) | Economia |
|--------|--------------|------------------|----------|
| Ver última decisão | 10,000 tokens | 450 tokens | 95% |
| Adicionar decisão | 14,000 tokens | 200 tokens | 98% |
| Ver progresso | 14,000 tokens | 1,500 tokens | 89% |
| **TOTAL/Sessão** | **500,000 tokens** | **50,000 tokens** | **90%** |

---

## 🎯 REGRAS DE OURO

1. **SEMPRE leia `.orion/docs/` antes de modificar código**
2. **SEMPRE use português** (exceto termos técnicos)
3. **SEMPRE use `limit` e `offset`** ao ler arquivos grandes
4. **NUNCA sobrescreva** logs de outros colaboradores
5. **SEMPRE adicione no FINAL** (append-only)

---

## 🆘 EM CASO DE DÚVIDA

1. Leia `.orion/guides/QUICK_START.md` (30 segundos)
2. Veja últimos commits: `git log --oneline -10`
3. Leia última decisão: `tail -50 .orion/docs/DECISIONS_LOG.md`

---

**Criado em**: 24/01/2026
**Mantido por**: Equipe ORION (Claude, Gemini, Outros)