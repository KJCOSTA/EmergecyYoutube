'use server';

import {
  getUserProfile,
  updateUserProfile as updateProfileLib,
} from '@/lib/user-profile';
import {
  getAllDocs,
  getDocById,
  getDocsByCategory,
  getVisibleDocs,
  createDoc as createDocLib,
  updateDoc as updateDocLib,
  deleteDoc as deleteDocLib,
  reorderDocs as reorderDocsLib,
} from '@/lib/docs-manager';
import {
  getIntegrationTokens,
  updateGitHubTokens as updateGitHubLib,
  updateVercelTokens as updateVercelLib,
  removeGitHubTokens as removeGitHubLib,
  removeVercelTokens as removeVercelLib,
} from '@/lib/integration-tokens';
import {
  logSystemEvent,
  getSystemLogs,
  clearSystemLogs as clearLogsLib,
  searchLogs as searchLogsLib,
  getLogsByLevel,
  getLogsBySource,
} from '@/lib/logger';
import type { UserProfile, DocPage, DocCategory, IntegrationTokens, SystemLog, LogLevel, LogSource } from '@/types';

// ============================================
// User Profile Actions
// ============================================

export async function getProfile(): Promise<UserProfile> {
  return getUserProfile();
}

export async function updateProfile(
  updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>
): Promise<UserProfile> {
  const profile = await updateProfileLib(updates);
  await logSystemEvent('info', 'user', 'Perfil atualizado');
  return profile;
}

// ============================================
// Documentation Actions
// ============================================

export async function getDocs() {
  return getAllDocs();
}

export async function getDoc(id: string) {
  return getDocById(id);
}

export async function getDocsByCateg(category: DocCategory) {
  return getDocsByCategory(category);
}

export async function getVisibleDocsAction() {
  return getVisibleDocs();
}

export async function createDocPage(
  doc: Omit<DocPage, 'id' | 'createdAt' | 'updatedAt'>
): Promise<DocPage> {
  const newDoc = await createDocLib(doc);
  await logSystemEvent('success', 'system', `Nova página de documentação criada: ${newDoc.title}`);
  return newDoc;
}

export async function updateDocPage(
  id: string,
  updates: Partial<Omit<DocPage, 'id' | 'createdAt'>>
): Promise<DocPage | null> {
  const updatedDoc = await updateDocLib(id, updates);
  if (updatedDoc) {
    await logSystemEvent('info', 'system', `Página de documentação atualizada: ${updatedDoc.title}`);
  }
  return updatedDoc;
}

export async function deleteDocPage(id: string): Promise<boolean> {
  const success = await deleteDocLib(id);
  if (success) {
    await logSystemEvent('warning', 'system', `Página de documentação removida: ID ${id}`);
  }
  return success;
}

export async function reorderDocPages(docIds: string[]): Promise<void> {
  await reorderDocsLib(docIds);
  await logSystemEvent('info', 'system', 'Ordem das páginas de documentação atualizada');
}

// ============================================
// Integration Tokens Actions
// ============================================

export async function getTokens(): Promise<IntegrationTokens> {
  return getIntegrationTokens();
}

export async function saveGitHubTokens(
  token: string,
  owner: string,
  repo: string
): Promise<IntegrationTokens> {
  const tokens = await updateGitHubLib(token, owner, repo);
  await logSystemEvent('success', 'system', `Integração GitHub configurada: ${owner}/${repo}`);
  return tokens;
}

export async function saveVercelTokens(
  token: string,
  projectId: string
): Promise<IntegrationTokens> {
  const tokens = await updateVercelLib(token, projectId);
  await logSystemEvent('success', 'system', `Integração Vercel configurada: ${projectId}`);
  return tokens;
}

export async function removeGitHubTokensAction(): Promise<IntegrationTokens> {
  const tokens = await removeGitHubLib();
  await logSystemEvent('warning', 'system', 'Integração GitHub removida');
  return tokens;
}

export async function removeVercelTokensAction(): Promise<IntegrationTokens> {
  const tokens = await removeVercelLib();
  await logSystemEvent('warning', 'system', 'Integração Vercel removida');
  return tokens;
}

// ============================================
// Logs Actions
// ============================================

export async function getLogs(limit?: number): Promise<SystemLog[]> {
  return getSystemLogs(limit);
}

export async function clearLogs(): Promise<void> {
  await clearLogsLib();
  await logSystemEvent('warning', 'system', 'Logs do sistema limpos');
}

export async function searchSystemLogs(query: string): Promise<SystemLog[]> {
  return searchLogsLib(query);
}

export async function getLogsByLevelAction(level: LogLevel): Promise<SystemLog[]> {
  return getLogsByLevel(level);
}

export async function getLogsBySourceAction(source: LogSource): Promise<SystemLog[]> {
  return getLogsBySource(source);
}

export async function addLog(
  level: LogLevel,
  source: LogSource,
  message: string,
  details?: Record<string, unknown>
): Promise<void> {
  await logSystemEvent(level, source, message, details);
}
