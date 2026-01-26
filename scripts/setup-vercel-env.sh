#!/bin/bash

# Script para configurar variáveis de ambiente na Vercel
# Uso: ./scripts/setup-vercel-env.sh

set -e

echo "🚀 Setup de Variáveis de Ambiente na Vercel"
echo ""

# Verifica se as variáveis necessárias estão definidas
if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ VERCEL_TOKEN não está definido"
  echo "Configure com: export VERCEL_TOKEN=seu_token_aqui"
  echo ""
  echo "Para obter o token:"
  echo "1. Acesse: https://vercel.com/account/tokens"
  echo "2. Crie um novo token"
  echo "3. Copie e exporte: export VERCEL_TOKEN=seu_token"
  exit 1
fi

if [ -z "$VERCEL_PROJECT_ID" ]; then
  echo "❌ VERCEL_PROJECT_ID não está definido"
  echo "Configure com: export VERCEL_PROJECT_ID=seu_project_id"
  echo ""
  echo "Para obter o Project ID:"
  echo "1. Acesse: https://vercel.com/seu-time/orion/settings"
  echo "2. Copie o Project ID"
  exit 1
fi

# Database URL
DATABASE_URL="postgresql://neondb_owner:npg_KXJ2pi3COZDe@ep-wispy-dust-aczk6lbp-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require"

echo "📝 Configurando DATABASE_URL na Vercel..."

# Se tiver TEAM_ID, usa o endpoint de team, senão usa o endpoint de projeto
if [ -n "$VERCEL_TEAM_ID" ]; then
  ENDPOINT="https://api.vercel.com/v10/projects/$VERCEL_PROJECT_ID/env?teamId=$VERCEL_TEAM_ID"
else
  ENDPOINT="https://api.vercel.com/v10/projects/$VERCEL_PROJECT_ID/env"
fi

# Cria a variável de ambiente
response=$(curl -s -X POST "$ENDPOINT" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "DATABASE_URL",
    "value": "'"$DATABASE_URL"'",
    "type": "encrypted",
    "target": ["production", "preview", "development"]
  }')

if echo "$response" | grep -q '"key":"DATABASE_URL"'; then
  echo "✅ DATABASE_URL configurado com sucesso!"
else
  echo "❌ Erro ao configurar DATABASE_URL:"
  echo "$response"
  exit 1
fi

echo ""
echo "✅ Setup concluído!"
echo ""
echo "Próximos passos:"
echo "1. Faça um novo deploy: git push"
echo "2. As migrations serão aplicadas automaticamente"
echo "3. Teste em: https://seu-dominio.vercel.app/test/db"
