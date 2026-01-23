'use server';

import { getIntegrationTokens } from '@/lib/integration-tokens';
import type { VercelDeployment, VercelDeploymentsResponse } from '@/types';

/**
 * Fetch recent deployments from Vercel
 */
export async function fetchVercelDeployments(limit: number = 20): Promise<VercelDeploymentsResponse> {
  try {
    const tokens = await getIntegrationTokens();

    if (!tokens.vercel) {
      return {
        deployments: [],
        error: 'Vercel integration not configured',
      };
    }

    const { token, projectId } = tokens.vercel;

    const response = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        deployments: [],
        error: `Vercel API error: ${response.status} - ${errorText}`,
      };
    }

    const data = await response.json();

    interface VercelAPIDeployment {
      uid: string;
      name: string;
      url: string;
      state: string;
      createdAt: number;
      readyState: string;
    }

    interface VercelAPIResponse {
      deployments: VercelAPIDeployment[];
    }

    const deployments: VercelDeployment[] = (data as VercelAPIResponse).deployments.map((deployment) => ({
      uid: deployment.uid,
      name: deployment.name,
      url: deployment.url,
      state: deployment.state,
      createdAt: deployment.createdAt,
      readyState: deployment.readyState,
    }));

    return { deployments };
  } catch (error) {
    console.error('Failed to fetch Vercel deployments:', error);
    return {
      deployments: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Test Vercel connection
 */
export async function testVercelConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const tokens = await getIntegrationTokens();

    if (!tokens.vercel) {
      return {
        success: false,
        error: 'Vercel integration not configured',
      };
    }

    const { token } = tokens.vercel;

    const response = await fetch(
      'https://api.vercel.com/v2/user',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Vercel API error: ${response.status} - ${errorText}`,
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
 * Get deployment status summary
 */
export async function getDeploymentSummary(): Promise<{
  total: number;
  ready: number;
  error: number;
  building: number;
}> {
  try {
    const { deployments } = await fetchVercelDeployments(50);

    const summary = {
      total: deployments.length,
      ready: deployments.filter(d => d.state === 'READY').length,
      error: deployments.filter(d => d.state === 'ERROR').length,
      building: deployments.filter(d => d.state === 'BUILDING').length,
    };

    return summary;
  } catch (error) {
    console.error('Failed to get deployment summary:', error);
    return {
      total: 0,
      ready: 0,
      error: 0,
      building: 0,
    };
  }
}
