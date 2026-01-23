import fs from 'fs/promises';
import path from 'path';
import type { IntegrationTokens } from '@/types';

const TOKENS_FILE = path.join(process.cwd(), 'data', 'integration-tokens.json');

/**
 * Get integration tokens
 */
export async function getIntegrationTokens(): Promise<IntegrationTokens> {
  try {
    const fileContent = await fs.readFile(TOKENS_FILE, 'utf-8');
    return JSON.parse(fileContent) as IntegrationTokens;
  } catch (error) {
    console.error('Failed to read integration tokens:', error);
    return {
      github: null,
      vercel: null,
      updatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Update GitHub tokens
 */
export async function updateGitHubTokens(
  token: string,
  owner: string,
  repo: string
): Promise<IntegrationTokens> {
  try {
    const tokens = await getIntegrationTokens();

    const updatedTokens: IntegrationTokens = {
      ...tokens,
      github: { token, owner, repo },
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(TOKENS_FILE, JSON.stringify(updatedTokens, null, 2), 'utf-8');

    return updatedTokens;
  } catch (error) {
    console.error('Failed to update GitHub tokens:', error);
    throw error;
  }
}

/**
 * Update Vercel tokens
 */
export async function updateVercelTokens(
  token: string,
  projectId: string
): Promise<IntegrationTokens> {
  try {
    const tokens = await getIntegrationTokens();

    const updatedTokens: IntegrationTokens = {
      ...tokens,
      vercel: { token, projectId },
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(TOKENS_FILE, JSON.stringify(updatedTokens, null, 2), 'utf-8');

    return updatedTokens;
  } catch (error) {
    console.error('Failed to update Vercel tokens:', error);
    throw error;
  }
}

/**
 * Remove GitHub tokens
 */
export async function removeGitHubTokens(): Promise<IntegrationTokens> {
  try {
    const tokens = await getIntegrationTokens();

    const updatedTokens: IntegrationTokens = {
      ...tokens,
      github: null,
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(TOKENS_FILE, JSON.stringify(updatedTokens, null, 2), 'utf-8');

    return updatedTokens;
  } catch (error) {
    console.error('Failed to remove GitHub tokens:', error);
    throw error;
  }
}

/**
 * Remove Vercel tokens
 */
export async function removeVercelTokens(): Promise<IntegrationTokens> {
  try {
    const tokens = await getIntegrationTokens();

    const updatedTokens: IntegrationTokens = {
      ...tokens,
      vercel: null,
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(TOKENS_FILE, JSON.stringify(updatedTokens, null, 2), 'utf-8');

    return updatedTokens;
  } catch (error) {
    console.error('Failed to remove Vercel tokens:', error);
    throw error;
  }
}
