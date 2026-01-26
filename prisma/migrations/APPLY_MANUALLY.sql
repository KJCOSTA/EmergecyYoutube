-- SQL Script para aplicar manualmente no banco de dados Neon
-- Execute este script no console SQL do Neon se as migrations automáticas falharem
--
-- Acesse: https://console.neon.tech
-- Selecione seu projeto e vá para SQL Editor
-- Cole e execute este script

-- Criar tabela TestMessage
CREATE TABLE IF NOT EXISTS "TestMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestMessage_pkey" PRIMARY KEY ("id")
);

-- Verificar se a tabela foi criada
SELECT * FROM "TestMessage" LIMIT 1;
