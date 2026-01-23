# Vercel Comments Integration

Script para buscar e visualizar comentários de deployments do Vercel diretamente via CLI.

## 🎯 Por que usar?

### Reduz consumo de tokens do Claude
- **Contexto estruturado**: Comentários vêm com URL exata + texto + posição
- **Sem ambiguidade**: Não precisa adivinhar "qual botão" ou "qual página"
- **Batch processing**: Processa múltiplos comentários de uma vez
- **Menos idas e vindas**: Reduz clarificações e confirmações

### Workflow eficiente
1. Você faz comentários visuais nos deployments do Vercel
2. Roda `npm run vercel:comments`
3. Claude lê todos os comentários estruturados
4. Implementa todas as mudanças de forma organizada

## 📋 Pré-requisitos

### 1. Obter Vercel Token
1. Acesse https://vercel.com/account/tokens
2. Crie um novo token com escopo apropriado:
   - Personal Account: Nome como "Emergency Youtube CLI"
   - Team Account: Selecione o team correto
3. Copie o token (só é exibido uma vez!)

### 2. Obter Project ID
```bash
# Se você tem Vercel CLI instalado:
vercel project ls

# Ou encontre no dashboard:
# https://vercel.com/[seu-usuario]/[projeto]/settings
# O ID está na URL ou em "General > Project ID"
```

### 3. Obter Team ID (Apenas para Team accounts)
```bash
# Se você tem Vercel CLI instalado:
vercel team ls

# Ou encontre no dashboard:
# https://vercel.com/teams/[team-name]/settings
# O ID está na seção "Team Settings"
```

### 4. Configurar variáveis de ambiente

Adicione ao seu arquivo `.env`:

```bash
# Vercel Integration
VERCEL_TOKEN=your_vercel_token_here
VERCEL_PROJECT_ID=prj_xxxxxxxxxxxxx

# Se você usa Team account:
VERCEL_TEAM_ID=team_xxxxxxxxxxxxx
```

## 🚀 Uso

### Comandos disponíveis

```bash
# Buscar comentários não resolvidos dos últimos 10 deployments
npm run vercel:comments

# Buscar TODOS os comentários (incluindo resolvidos)
npm run vercel:comments:all

# Buscar comentários de um deployment específico
npm run vercel:comments -- --deployment-id=dpl_xxxxx

# Limitar número de deployments verificados
npm run vercel:comments -- --limit=5

# Combinar opções
npm run vercel:comments -- --limit=20 --show-resolved
```

### Parâmetros

- `--deployment-id=<id>`: Buscar comentários apenas deste deployment
- `--limit=<number>`: Limitar número de deployments verificados (padrão: 10)
- `--show-resolved`: Mostrar também comentários já resolvidos

## 📖 Como fazer comentários no Vercel

### Em Preview Deployments

1. Abra o deployment preview no Vercel
2. Clique no ícone de comentário (💬) no toolbar
3. Clique na página onde quer comentar
4. Digite seu comentário
5. Pressione Enter

### Dicas para comentários efetivos

✅ **BOM:**
```
Botão "Salvar" está com cor errada, deveria ser verde (#10b981)
```

✅ **BOM:**
```
Texto "Próximo Passo" cortado em mobile. Precisa de padding maior
```

❌ **RUIM:**
```
Arrumar isso aqui
```

❌ **RUIM:**
```
Não gostei
```

### Melhores práticas

1. **Seja específico**: Descreva exatamente o problema e a solução esperada
2. **Um problema por comentário**: Não misture múltiplos problemas
3. **Use a posição visual**: Clique exatamente no elemento com problema
4. **Marque como resolvido**: Após Claude corrigir, marque o comentário como resolvido no Vercel

## 📊 Exemplo de Output

```
🚀 Vercel Comments Fetcher

📦 Fetching last 10 deployments...

Found 3 deployments:

1. ✅ emergecy-youtube - 2h ago
   🌐 https://emergecy-youtube-git-feature-abc.vercel.app
   🆔 dpl_xxxxxxxxxxxxx

2. 🔨 emergecy-youtube - 5h ago
   🌐 https://emergecy-youtube-git-feature-def.vercel.app
   🆔 dpl_yyyyyyyyyyyyy

💬 Fetching comments...

================================================================================
📍 Deployment: https://emergecy-youtube-git-feature-abc.vercel.app
   3 comments found
================================================================================

1. ⚠️  john.doe - 1h ago
   📍 /settings (1024, 768)
   💬 Botão "Salvar" está com cor errada, deveria ser verde (#10b981)
   🔗 ID: comment_xxxxx

2. ⚠️  jane.smith - 30m ago
   📍 /dashboard (512, 256)
   💬 Gráfico não está carregando dados do último mês
   🔗 ID: comment_yyyyy

3. ✅ john.doe - 10m ago
   📍 /profile (800, 600)
   💬 Avatar precisa ser circular ao invés de quadrado
   🔗 ID: comment_zzzzz

================================================================================
📊 Summary
================================================================================

   Total comments: 3
   Unresolved: 2
   Resolved: 1

💡 Tip: Use these comments to create actionable tasks!
```

## 🔧 Troubleshooting

### "Missing required environment variables"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Confirme que `VERCEL_TOKEN` e `VERCEL_PROJECT_ID` estão definidos
- Não use aspas nas variáveis do .env

### "Failed to fetch deployments: 403"
- Seu token pode estar expirado
- Verifique se o token tem as permissões corretas
- Para Team accounts, certifique-se de incluir `VERCEL_TEAM_ID`

### "No comments found"
- Verifique se há comentários nos deployments recentes
- Use `--show-resolved` para ver comentários já resolvidos
- Tente especificar um deployment ID específico

### "Failed to fetch comments: 404"
- Nem todos os deployments suportam comentários
- ✅ **ATUALIZADO**: Agora funciona em Preview E Production deployments!
- Se você configurou o Vercel Toolbar conforme `VERCEL_TOOLBAR_PRODUCTION.md`

## 🎯 Workflow recomendado

### Workflow Tradicional (Preview Deployments)
1. **Durante desenvolvimento**:
   - Faça push para branch
   - Vercel cria Preview Deployment
   - Você ou outros revisam e adicionam comentários visuais

2. **Antes de implementar mudanças**:
   ```bash
   npm run vercel:comments
   ```

### 🆕 Novo Workflow (Produção Direta - HABILITADO!)
1. **Acesse a aplicação em PRODUÇÃO**
2. **Pressione `v`** para ativar o Vercel Toolbar
3. **Adicione comentários** com menções @Claude direto na produção
4. **Extraia comentários**:
   ```bash
   npm run vercel:comments
   ```
5. **Claude implementa** as mudanças baseado nos comentários
6. **Deploy automático** atualiza a produção

📖 **Documentação completa**: Veja `VERCEL_TOOLBAR_PRODUCTION.md` para detalhes sobre:
- Como usar menções @Claude em produção
- Configuração de variáveis de ambiente
- Boas práticas para comentários efetivos
- Deploy automático para produção
   - Veja todos os comentários estruturados
   - Use para criar todos de tarefas

3. **Após implementar**:
   - Faça novo push
   - Revise o novo deployment
   - Marque comentários como resolvidos no Vercel

4. **Para revisar histórico**:
   ```bash
   npm run vercel:comments:all
   ```
   - Vê todos os comentários incluindo resolvidos
   - Útil para audit trail

## 🔗 Links úteis

- [Vercel Comments Documentation](https://vercel.com/docs/workflow-collaboration/comments)
- [Vercel API Reference](https://vercel.com/docs/rest-api)
- [Managing Tokens](https://vercel.com/account/tokens)
