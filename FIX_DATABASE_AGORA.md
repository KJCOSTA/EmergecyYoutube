# ⚡ FIX RÁPIDO - Banco de Dados

## 🎯 Objetivo
Fazer a tabela `TestMessage` funcionar no banco Neon para as páginas de teste.

---

## ✅ SOLUÇÃO MAIS RÁPIDA (5 minutos)

### Passo 1: Criar a tabela no Neon Console

1. **Abra o Neon Console:**
   ```
   https://console.neon.tech
   ```

2. **Faça login e selecione seu projeto**

3. **Clique em "SQL Editor"** (menu lateral esquerdo)

4. **Cole e execute este SQL:**
   ```sql
   CREATE TABLE IF NOT EXISTS "TestMessage" (
       "id" TEXT NOT NULL,
       "content" TEXT NOT NULL,
       "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
       "updatedAt" TIMESTAMP(3) NOT NULL,
       CONSTRAINT "TestMessage_pkey" PRIMARY KEY ("id")
   );
   ```

5. **Clique em "Run"**

6. **Verifique se funcionou:**
   ```sql
   SELECT * FROM "TestMessage";
   ```
   Deve retornar: `No rows returned` (está OK!)

---

### Passo 2: Configurar variável na Vercel

1. **Abra o dashboard da Vercel:**
   ```
   https://vercel.com
   ```

2. **Vá para seu projeto ORION**

3. **Settings → Environment Variables**

4. **Adicione uma nova variável:**
   - **Key:** `DATABASE_URL`
   - **Value:**
     ```
     postgresql://neondb_owner:npg_KXJ2pi3COZDe@ep-wispy-dust-aczk6lbp-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require
     ```
   - **Environments:** Marque todos (Production, Preview, Development)

5. **Clique em "Save"**

---

### Passo 3: Fazer um novo deploy

**Opção A - Via interface da Vercel:**
1. Vá para **Deployments**
2. Clique nos 3 pontinhos do último deploy
3. Clique em **"Redeploy"**

**Opção B - Via Git (já configurado para fazer deploy automático):**
```bash
# Já está tudo pronto! Só fazer merge do PR:
# https://github.com/KJCOSTA/orion/pull/new/claude/add-test-pages-xIgaW
```

---

## 🧪 Testar

Após o deploy, acesse:
```
https://seu-dominio.vercel.app/test/db
```

**Teste:**
1. Digite: "Olá banco!"
2. Clique em **"Salvar no banco"**
3. Clique em **"Buscar do banco"**

✅ **Se aparecer "Olá banco!" = FUNCIONOU!**

---

## 🆘 Se não funcionar

### Erro: "Can't reach database"
- ✅ Variável `DATABASE_URL` está configurada na Vercel?
- ✅ Usou a URL com `-pooler` no final?
- ✅ Fez redeploy depois de adicionar a variável?

### Erro: "Table doesn't exist"
- ✅ Executou o SQL no Neon Console?
- ✅ O comando retornou sem erros?

### Outro erro
Olhe os logs:
1. Vercel Dashboard → seu projeto → Deployments
2. Clique no último deploy
3. Clique em **"Functions"** → selecione uma função
4. Veja os logs de erro

---

## 📝 O que já está pronto

✅ Código das páginas de teste (`/test/db` e `/test/ai`)
✅ APIs funcionando (`/api/test/db/*` e `/api/test/ai`)
✅ Botão na página inicial
✅ Navegação entre testes
✅ Migrations configuradas no build
✅ Package.json atualizado

**Falta APENAS:**
1. Criar a tabela no Neon (SQL acima)
2. Configurar DATABASE_URL na Vercel
3. Redeploy

---

## 🎉 Pronto!

Depois de seguir os 3 passos acima, tudo vai funcionar!

Qualquer problema, olhe: `SETUP_DATABASE.md` (guia completo)
