# 🗄️ Setup do Banco de Dados - Instruções

## ⚠️ Problema Atual

O banco de dados precisa ter a tabela `TestMessage` criada para as páginas de teste funcionarem.

## ✅ Solução - 3 Opções

### Opção 1: Aplicar SQL Manualmente no Neon (MAIS RÁPIDO)

1. Acesse https://console.neon.tech
2. Faça login e selecione seu projeto
3. Vá para **SQL Editor**
4. Cole e execute o SQL abaixo:

```sql
CREATE TABLE IF NOT EXISTS "TestMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestMessage_pkey" PRIMARY KEY ("id")
);
```

5. Verifique se funcionou:
```sql
SELECT * FROM "TestMessage" LIMIT 1;
```

### Opção 2: Executar Migrations via CLI

Se você tem acesso ao banco localmente:

```bash
# 1. Configure a variável de ambiente
export DATABASE_URL="postgresql://neondb_owner:npg_KXJ2pi3COZDe@ep-wispy-dust-aczk6lbp-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require"

# 2. Execute as migrations
npm run db:migrate

# Ou use db:push (força o schema sem migrations)
npm run db:push
```

### Opção 3: Deixar a Vercel Aplicar Automaticamente

As migrations serão aplicadas automaticamente no próximo deploy da Vercel, pois o `package.json` está configurado para executar `prisma migrate deploy` durante o build.

Para forçar um novo deploy:
```bash
git commit --allow-empty -m "chore: trigger deployment"
git push
```

## 🔧 Configuração da Vercel

Certifique-se de que as seguintes variáveis de ambiente estão configuradas na Vercel:

1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Adicione:

```
DATABASE_URL=postgresql://neondb_owner:npg_KXJ2pi3COZDe@ep-wispy-dust-aczk6lbp-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require
```

## 🧪 Testar a Conexão

Após aplicar a migration, acesse:
- https://seu-dominio.vercel.app/test/db

E tente:
1. Digite uma mensagem no campo de texto
2. Clique em "Salvar no banco"
3. Clique em "Buscar do banco"

Se aparecer a mensagem salva, está funcionando! ✅

## 🐛 Troubleshooting

### Erro: "Can't reach database server"
- Verifique se a variável `DATABASE_URL` está configurada corretamente
- Use a URL com pooling (a que termina em `-pooler`)

### Erro: "Table TestMessage doesn't exist"
- Execute o SQL manualmente no Neon (Opção 1)
- Ou execute `npm run db:push` localmente

### Erro: "Prisma Client not initialized"
- Execute `npx prisma generate`
- Ou `npm run postinstall`

## 📝 Scripts Disponíveis

```bash
npm run postinstall    # Gera Prisma Client
npm run db:migrate     # Aplica migrations pendentes
npm run db:push        # Força schema sem migrations (útil para testes)
```

## 🔗 Links Úteis

- Neon Console: https://console.neon.tech
- Vercel Dashboard: https://vercel.com
- Prisma Docs: https://www.prisma.io/docs
