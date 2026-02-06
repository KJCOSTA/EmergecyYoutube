# 💰 Guia de Economia de Quotas - ORION

**Para: Claude, Gemini e outros colaboradores de IA**

---

## 🎯 OBJETIVO

Economizar quotas de tokens ao ler/escrever arquivos, evitando desperdício de contexto e processamento.

---

## 📊 ENTENDENDO O CUSTO

| Operação | Custo Aproximado (tokens) | Quando Evitar |
|----------|---------------------------|---------------|
| Ler arquivo grande (1000 linhas) | ~15,000 tokens | Se só precisa de 10 linhas |
| Grep em diretório grande | ~5,000 tokens | Se sabe o arquivo exato |
| Glob recursivo profundo | ~3,000 tokens | Se sabe o caminho |
| Read sem limit | ~20,000+ tokens | Arquivos >500 linhas |

---

## ✅ TÉCNICAS DE ECONOMIA

### 1. **Use `limit` e `offset` no Read**

❌ **RUIM** (gasta 15,000 tokens):
```typescript
// Lê arquivo inteiro de 1000 linhas
Read({ file_path: "/app/page.tsx" })
```

✅ **BOM** (gasta 300 tokens):
```typescript
// Lê só as primeiras 20 linhas
Read({ file_path: "/app/page.tsx", limit: 20 })
```

✅ **MELHOR** (gasta 300 tokens):
```typescript
// Lê linhas 100-120 (onde está o código que você quer)
Read({ file_path: "/app/page.tsx", offset: 100, limit: 20 })
```

---

### 2. **Use Grep antes de Read**

❌ **RUIM** (gasta 20,000 tokens):
```typescript
// Lê arquivo inteiro procurando por "useState"
Read({ file_path: "/app/page.tsx" })
// ... procura manualmente no resultado
```

✅ **BOM** (gasta 500 tokens):
```typescript
// Usa Grep para encontrar ONDE está "useState"
Grep({
  pattern: "useState",
  path: "/app/page.tsx",
  output_mode: "content",
  "-n": true  // mostra número da linha
})

// Depois lê só aquela região
Read({ file_path: "/app/page.tsx", offset: 45, limit: 10 })
```

---

### 3. **Use Glob específico, não recursivo**

❌ **RUIM** (gasta 5,000 tokens):
```typescript
// Busca em TODA a árvore
Glob({ pattern: "**/*.tsx" })
```

✅ **BOM** (gasta 200 tokens):
```typescript
// Busca só onde você sabe que está
Glob({ pattern: "app/step/*.tsx" })
```

---

### 4. **Evite ler documentação que você já conhece**

❌ **RUIM**:
```typescript
// Lê DecisionsTab.tsx INTEIRO toda vez
Read({ file_path: "/components/documentation/DecisionsTab.tsx" })
```

✅ **BOM**:
```typescript
// Primeiro verifica qual é a última Sessão com grep
Grep({
  pattern: "Sessão \\d+:",
  path: "/components/documentation/DecisionsTab.tsx",
  output_mode: "content"
})

// Depois lê só o final do arquivo
Read({
  file_path: "/components/documentation/DecisionsTab.tsx",
  offset: 650,  // perto do final
  limit: 50
})
```

---

### 5. **Use `head_limit` no Grep**

❌ **RUIM** (retorna 500 resultados):
```typescript
Grep({
  pattern: "text-zinc-",
  output_mode: "files_with_matches"
})
// Resultado: 500 arquivos
```

✅ **BOM** (retorna só 10):
```typescript
Grep({
  pattern: "text-zinc-",
  output_mode: "files_with_matches",
  head_limit: 10  // só os 10 primeiros
})
```

---

### 6. **Use Bash com flags eficientes**

❌ **RUIM**:
```bash
# Lê TODO o arquivo
cat arquivo-gigante.json
```

✅ **BOM**:
```bash
# Lê só as primeiras 20 linhas
head -20 arquivo-gigante.json

# Ou usa grep com contexto limitado
grep -A 5 -B 5 "erro" arquivo-gigante.log | head -20
```

---

### 7. **Centralize leituras em arquivos únicos**

#### ❌ **RUIM** (Estrutura atual):
```
components/documentation/DecisionsTab.tsx   (684 linhas - lê toda vez)
components/documentation/content.ts          (958 linhas - lê toda vez)
```

#### ✅ **BOM** (Nova estrutura proposta):
```
.orion/
├── docs/
│   ├── DECISIONS_LOG.md          # Append-only, lê só final
│   ├── VISUAL_UPGRADE.md         # Arquivo específico (100 linhas)
│   └── STACK_CHANGES.md          # Arquivo específico (50 linhas)
```

**Vantagem**: Ler `.orion/docs/VISUAL_UPGRADE.md` (100 linhas) gasta 1,500 tokens vs ler `DecisionsTab.tsx` (684 linhas) que gasta 10,000 tokens.

---

## 🗂️ ESTRUTURA OTIMIZADA PARA QUOTAS

### ANTES (Gastava muito):
```
components/documentation/
├── DecisionsTab.tsx       # 684 linhas (10,000 tokens/leitura)
├── content.ts             # 958 linhas (14,000 tokens/leitura)
└── [outros tabs]          # Misturado com código React
```

### DEPOIS (Economiza 80%):
```
.orion/
├── docs/
│   ├── DECISIONS_LOG.md   # Append-only, lê offset:-50
│   ├── VISUAL_UPGRADE.md  # 100 linhas (1,500 tokens)
│   ├── STACK_CHANGES.md   # 50 linhas (750 tokens)
│   └── CHANGELOG.md       # Append-only, lê offset:-20
└── guides/
    └── [guias já criados]
```

**Como usar**:
```typescript
// Em vez de ler DecisionsTab inteiro
Read({ file_path: "/components/documentation/DecisionsTab.tsx" })  // 10,000 tokens ❌

// Leia arquivo dedicado
Read({ file_path: "/.orion/docs/VISUAL_UPGRADE.md" })  // 1,500 tokens ✅
```

---

## 📝 TEMPLATES PARA ECONOMIZAR

### Template 1: Verificar Última Decisão

```typescript
// 1. Grep para encontrar última sessão (200 tokens)
Grep({
  pattern: "Sessão \\d+:",
  path: "/.orion/docs/DECISIONS_LOG.md",
  output_mode: "content",
  head_limit: 1
})

// 2. Lê só as últimas 30 linhas (450 tokens)
Read({
  file_path: "/.orion/docs/DECISIONS_LOG.md",
  offset: -30  // negativo = do final
})
```

**Total**: 650 tokens vs 10,000 tokens (economia de 93%)

---

### Template 2: Adicionar Nova Decisão

```typescript
// 1. Verifica última linha (200 tokens)
Bash({ command: "tail -1 /.orion/docs/DECISIONS_LOG.md" })

// 2. Append (não precisa ler arquivo inteiro!)
Bash({
  command: `cat >> /.orion/docs/DECISIONS_LOG.md <<'EOF'
## Sessão X: [TÍTULO] - DD/MM/YYYY

**Contexto**: [descrição]
**Decisão**: [o que foi decidido]
**Resultado**: [impacto]

---
EOF`
})
```

**Total**: 200 tokens vs 14,000 tokens (economia de 98%)

---

### Template 3: Substituições em Massa (Sed)

```bash
# Em vez de ler arquivo, editar e escrever (gasta 30,000 tokens)
# Use sed direto (gasta 100 tokens)

sed -i 's/text-zinc-400/text-muted/g' app/page.tsx
sed -i 's/bg-zinc-900/bg-layer-1/g' app/page.tsx
```

---

## 📊 COMPARAÇÃO DE CUSTOS

| Tarefa | Método Antigo | Tokens | Método Novo | Tokens | Economia |
|--------|--------------|---------|-------------|---------|----------|
| Ver última decisão | Read DecisionsTab completo | 10,000 | Read DECISIONS_LOG offset:-30 | 450 | 95% |
| Adicionar decisão | Read + Edit DecisionsTab | 14,000 | Bash append | 200 | 98% |
| Ver progresso visual | Read content.ts completo | 14,000 | Read VISUAL_UPGRADE.md | 1,500 | 89% |
| Substituir cores | Read + Edit 25 arquivos | 375,000 | Sed batch | 2,500 | 99% |

---

## 🎯 REGRAS DE OURO

1. **SEMPRE use `limit` ao ler arquivos >100 linhas**
2. **SEMPRE use Grep antes de Read para achar linha específica**
3. **NUNCA leia arquivo completo se só precisa de uma seção**
4. **USE offset negativo para ler final de arquivo** (`offset: -50`)
5. **PREFIRA Bash (sed, grep, tail) para operações simples**
6. **CENTRALIZE docs em `.orion/` (arquivos pequenos e específicos)**
7. **USE append (>>) em vez de ler+editar+escrever**

---

## 📈 RESULTADO ESPERADO

### ANTES (gastava ~500,000 tokens/sessão):
- Ler documentação: 24,000 tokens
- Ler código: 150,000 tokens
- Editar arquivos: 200,000 tokens
- Commits/verificações: 126,000 tokens

### DEPOIS (gasta ~50,000 tokens/sessão):
- Ler docs centralizados: 2,000 tokens
- Grep+Read seletivo: 15,000 tokens
- Sed batch: 3,000 tokens
- Commits otimizados: 30,000 tokens

**ECONOMIA: 90% dos tokens!** 🎉

---

**Data de Criação**: 24/01/2026
**Mantido por**: Equipe ORION
