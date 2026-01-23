'use client';

import { VercelToolbar as Toolbar } from '@vercel/toolbar/next';

/**
 * Componente que integra o Vercel Toolbar em todos os ambientes.
 *
 * O Vercel Toolbar permite:
 * - Adicionar comentários visuais nas páginas usando @menções
 * - Mencionar @Claude para direcionar comentários para a IA
 * - Colaboração em tempo real com a equipe
 * - Funciona em desenvolvimento, preview E produção
 *
 * Configuração:
 * - Habilitado em todos os ambientes (dev, preview, production)
 * - Requer VERCEL_TOKEN e VERCEL_PROJECT_ID configurados
 * - Menções são extraídas via CLI: npm run vercel:comments
 */
export function VercelToolbar() {
  // Habilitar em TODOS os ambientes (dev, preview, production)
  // Para garantir que menções @Claude funcionem em produção
  const shouldInject = true;

  if (!shouldInject) {
    return null;
  }

  return <Toolbar />;
}
