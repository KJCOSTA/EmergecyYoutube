#!/usr/bin/env node
/**
 * Vercel Comments Fetcher
 *
 * Fetches comments from Vercel deployments and displays them in a readable format.
 * Supports both Personal and Team accounts.
 *
 * Usage:
 *   npm run vercel:comments
 *   npm run vercel:comments -- --deployment-id=dpl_xxx
 *   npm run vercel:comments -- --limit=5
 *
 * Environment Variables Required:
 *   VERCEL_TOKEN - Your Vercel API token
 *   VERCEL_PROJECT_ID - Your Vercel project ID
 *   VERCEL_TEAM_ID (optional) - Your Vercel team ID (for Team accounts)
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// Types
// ============================================

interface VercelComment {
  id: string;
  text: string;
  createdAt: number;
  updatedAt: number;
  author: {
    name: string;
    email?: string;
    username?: string;
  };
  position?: {
    x: number;
    y: number;
    path: string;
  };
  resolved: boolean;
  deployment?: {
    id: string;
    url: string;
  };
}

interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  state: string;
  createdAt: number;
}

interface CommentsResponse {
  comments: VercelComment[];
  pagination?: {
    count: number;
    next?: number;
    prev?: number;
  };
}

interface DeploymentsResponse {
  deployments: VercelDeployment[];
  pagination?: {
    count: number;
    next?: number;
    prev?: number;
  };
}

// ============================================
// Configuration
// ============================================

interface Config {
  vercelToken: string;
  projectId: string;
  teamId?: string;
  deploymentId?: string;
  limit: number;
  showResolved: boolean;
}

function loadConfig(): Config {
  // Load .env file if it exists
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');

    for (const line of lines) {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }

  const vercelToken = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!vercelToken || !projectId) {
    console.error('❌ Missing required environment variables:');
    if (!vercelToken) console.error('   - VERCEL_TOKEN');
    if (!projectId) console.error('   - VERCEL_PROJECT_ID');
    console.error('\nPlease add these to your .env file or set them as environment variables.');
    process.exit(1);
  }

  // Parse command line arguments
  const args = process.argv.slice(2);
  let deploymentId: string | undefined;
  let limit = 10;
  let showResolved = false;

  for (const arg of args) {
    if (arg.startsWith('--deployment-id=')) {
      deploymentId = arg.split('=')[1];
    } else if (arg.startsWith('--limit=')) {
      limit = parseInt(arg.split('=')[1], 10);
    } else if (arg === '--show-resolved') {
      showResolved = true;
    }
  }

  return {
    vercelToken,
    projectId,
    teamId,
    deploymentId,
    limit,
    showResolved,
  };
}

// ============================================
// API Calls
// ============================================

async function fetchDeployments(config: Config): Promise<VercelDeployment[]> {
  const url = new URL('https://api.vercel.com/v6/deployments');
  url.searchParams.set('projectId', config.projectId);
  url.searchParams.set('limit', config.limit.toString());

  if (config.teamId) {
    url.searchParams.set('teamId', config.teamId);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${config.vercelToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch deployments: ${response.status} - ${errorText}`);
  }

  const data: DeploymentsResponse = await response.json();
  return data.deployments;
}

async function fetchComments(config: Config, deploymentId: string): Promise<VercelComment[]> {
  const url = new URL(`https://api.vercel.com/v1/deployments/${deploymentId}/comments`);

  if (config.teamId) {
    url.searchParams.set('teamId', config.teamId);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${config.vercelToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      // No comments endpoint for this deployment
      return [];
    }
    const errorText = await response.text();
    throw new Error(`Failed to fetch comments: ${response.status} - ${errorText}`);
  }

  const data: CommentsResponse = await response.json();
  return data.comments;
}

// ============================================
// Formatting
// ============================================

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
}

function formatComment(comment: VercelComment, index: number): string {
  const status = comment.resolved ? '✅' : '⚠️';
  const author = comment.author.username || comment.author.name || 'Unknown';
  const time = formatTimestamp(comment.createdAt);
  const position = comment.position
    ? `\n   📍 ${comment.position.path} (${comment.position.x}, ${comment.position.y})`
    : '';

  return `
${index + 1}. ${status} ${author} - ${time}${position}
   💬 ${comment.text}
   🔗 ID: ${comment.id}
`;
}

function formatDeployment(deployment: VercelDeployment): string {
  const time = formatTimestamp(deployment.createdAt);
  const stateEmoji = deployment.state === 'READY' ? '✅' :
                     deployment.state === 'ERROR' ? '❌' :
                     deployment.state === 'BUILDING' ? '🔨' : '⏳';

  return `${stateEmoji} ${deployment.name} - ${time}
   🌐 https://${deployment.url}
   🆔 ${deployment.uid}`;
}

// ============================================
// Main
// ============================================

async function main() {
  console.log('🚀 Vercel Comments Fetcher\n');

  const config = loadConfig();

  try {
    let deploymentsToCheck: VercelDeployment[];

    if (config.deploymentId) {
      // Check specific deployment
      console.log(`📦 Fetching comments for deployment: ${config.deploymentId}\n`);
      deploymentsToCheck = [{
        uid: config.deploymentId,
        name: 'Specified Deployment',
        url: '',
        state: 'UNKNOWN',
        createdAt: Date.now(),
      }];
    } else {
      // Fetch recent deployments
      console.log(`📦 Fetching last ${config.limit} deployments...\n`);
      deploymentsToCheck = await fetchDeployments(config);

      if (deploymentsToCheck.length === 0) {
        console.log('ℹ️  No deployments found.');
        return;
      }

      console.log(`Found ${deploymentsToCheck.length} deployments:\n`);
      deploymentsToCheck.forEach((d, i) => {
        console.log(`${i + 1}. ${formatDeployment(d)}\n`);
      });
    }

    // Fetch comments for each deployment
    console.log('💬 Fetching comments...\n');

    let totalComments = 0;
    let unresolvedComments = 0;

    for (const deployment of deploymentsToCheck) {
      try {
        const comments = await fetchComments(config, deployment.uid);

        if (comments.length === 0) {
          continue;
        }

        const filteredComments = config.showResolved
          ? comments
          : comments.filter(c => !c.resolved);

        if (filteredComments.length === 0) {
          continue;
        }

        console.log(`\n${'='.repeat(80)}`);
        console.log(`📍 Deployment: https://${deployment.url}`);
        console.log(`   ${filteredComments.length} comment${filteredComments.length === 1 ? '' : 's'} found`);
        console.log(`${'='.repeat(80)}\n`);

        filteredComments.forEach((comment, index) => {
          console.log(formatComment(comment, index));
          totalComments++;
          if (!comment.resolved) {
            unresolvedComments++;
          }
        });

      } catch (error) {
        if (error instanceof Error && error.message.includes('404')) {
          // Silently skip deployments without comments
          continue;
        }
        console.error(`⚠️  Failed to fetch comments for ${deployment.uid}:`, error);
      }
    }

    // Summary
    console.log(`\n${'='.repeat(80)}`);
    console.log('📊 Summary');
    console.log(`${'='.repeat(80)}\n`);
    console.log(`   Total comments: ${totalComments}`);
    console.log(`   Unresolved: ${unresolvedComments}`);
    console.log(`   Resolved: ${totalComments - unresolvedComments}\n`);

    if (unresolvedComments > 0) {
      console.log('💡 Tip: Use these comments to create actionable tasks!');
    } else if (totalComments === 0) {
      console.log('ℹ️  No comments found in the recent deployments.');
      console.log('   Try adding comments in Vercel deployment previews.');
    } else {
      console.log('✅ All comments have been resolved!');
    }

  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
