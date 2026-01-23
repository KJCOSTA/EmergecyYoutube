'use server';

import { getIntegrationTokens } from '@/lib/integration-tokens';
import type { GitHubCommit, GitHubCommitsResponse } from '@/types';

/**
 * Fetch recent commits from GitHub
 */
export async function fetchGitHubCommits(limit: number = 20): Promise<GitHubCommitsResponse> {
  try {
    const tokens = await getIntegrationTokens();

    if (!tokens.github) {
      return {
        commits: [],
        error: 'GitHub integration not configured',
      };
    }

    const { token, owner, repo } = tokens.github;

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        commits: [],
        error: `GitHub API error: ${response.status} - ${errorText}`,
      };
    }

    const data = await response.json();

    const commits: GitHubCommit[] = data.map((commit: any) => ({
      sha: commit.sha.substring(0, 7),
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      url: commit.html_url,
    }));

    return { commits };
  } catch (error) {
    console.error('Failed to fetch GitHub commits:', error);
    return {
      commits: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Test GitHub connection
 */
export async function testGitHubConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const tokens = await getIntegrationTokens();

    if (!tokens.github) {
      return {
        success: false,
        error: 'GitHub integration not configured',
      };
    }

    const { token, owner, repo } = tokens.github;

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `GitHub API error: ${response.status} - ${errorText}`,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate auto-update changelog from recent commits
 */
export async function generateChangelogFromCommits(): Promise<string> {
  try {
    const { commits, error } = await fetchGitHubCommits(10);

    if (error || commits.length === 0) {
      return '# Changelog\n\nNenhum commit encontrado ou erro ao buscar dados.';
    }

    let changelog = '# Changelog Automático\n\n';
    changelog += `*Última atualização: ${new Date().toLocaleString('pt-BR')}*\n\n`;
    changelog += '## Commits Recentes\n\n';

    commits.forEach((commit) => {
      const date = new Date(commit.date).toLocaleDateString('pt-BR');
      changelog += `- **${date}** - ${commit.message} (${commit.author})\n`;
    });

    return changelog;
  } catch (error) {
    console.error('Failed to generate changelog:', error);
    return '# Changelog\n\nErro ao gerar changelog.';
  }
}
