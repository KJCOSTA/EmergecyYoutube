import { NextRequest, NextResponse } from 'next/server';
import type { SystemMonitorData, SystemHealth, APIHealthStatus } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/system/health
 * Returns system health metrics and API status
 */
export async function GET(request: NextRequest) {
  try {
    // System Health Metrics
    const memoryUsage = process.memoryUsage();
    const systemHealth: SystemHealth = {
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
      },
      uptime: process.uptime(),
      nodeVersion: process.version,
      platform: process.platform,
      timestamp: new Date().toISOString(),
    };

    // API Health Checks
    const apiStatuses: APIHealthStatus[] = [];

    // Check OpenAI
    apiStatuses.push(await checkOpenAI());

    // Check YouTube
    apiStatuses.push(await checkYouTube());

    // Check Google Gemini
    apiStatuses.push(await checkGoogle());

    // Check Anthropic
    apiStatuses.push(await checkAnthropic());

    // Check Pexels
    apiStatuses.push(await checkPexels());

    // Check Pixabay
    apiStatuses.push(await checkPixabay());

    // Check Unsplash
    apiStatuses.push(await checkUnsplash());

    const response: SystemMonitorData = {
      system: systemHealth,
      apis: apiStatuses,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve system health' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to check OpenAI API
 */
async function checkOpenAI(): Promise<APIHealthStatus> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      name: 'OpenAI',
      status: 'offline',
      error: 'API key not configured',
    };
  }

  try {
    const startTime = Date.now();
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(5000), // 5s timeout
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        name: 'OpenAI',
        status: 'online',
        responseTime,
      };
    } else {
      return {
        name: 'OpenAI',
        status: 'offline',
        error: `HTTP ${response.status}`,
      };
    }
  } catch (error) {
    return {
      name: 'OpenAI',
      status: 'offline',
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

/**
 * Helper function to check YouTube API
 */
async function checkYouTube(): Promise<APIHealthStatus> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return {
      name: 'YouTube',
      status: 'offline',
      error: 'API key not configured',
    };
  }

  try {
    const startTime = Date.now();
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=id&chart=mostPopular&maxResults=1&key=${apiKey}`,
      {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      }
    );

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        name: 'YouTube',
        status: 'online',
        responseTime,
      };
    } else {
      return {
        name: 'YouTube',
        status: 'offline',
        error: `HTTP ${response.status}`,
      };
    }
  } catch (error) {
    return {
      name: 'YouTube',
      status: 'offline',
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

/**
 * Helper function to check Google Gemini API
 */
async function checkGoogle(): Promise<APIHealthStatus> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    return {
      name: 'Google Gemini',
      status: 'offline',
      error: 'API key not configured',
    };
  }

  try {
    const startTime = Date.now();
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      }
    );

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        name: 'Google Gemini',
        status: 'online',
        responseTime,
      };
    } else {
      return {
        name: 'Google Gemini',
        status: 'offline',
        error: `HTTP ${response.status}`,
      };
    }
  } catch (error) {
    return {
      name: 'Google Gemini',
      status: 'offline',
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

/**
 * Helper function to check Anthropic API
 */
async function checkAnthropic(): Promise<APIHealthStatus> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      name: 'Anthropic',
      status: 'offline',
      error: 'API key not configured',
    };
  }

  // Anthropic doesn't have a simple health endpoint, so we just check if key exists
  return {
    name: 'Anthropic',
    status: apiKey ? 'unknown' : 'offline',
    error: apiKey ? undefined : 'API key not configured',
  };
}

/**
 * Helper function to check Pexels API
 */
async function checkPexels(): Promise<APIHealthStatus> {
  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) {
    return {
      name: 'Pexels',
      status: 'offline',
      error: 'API key not configured',
    };
  }

  try {
    const startTime = Date.now();
    const response = await fetch('https://api.pexels.com/v1/curated?per_page=1&page=1', {
      method: 'GET',
      headers: {
        Authorization: apiKey,
      },
      signal: AbortSignal.timeout(5000),
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        name: 'Pexels',
        status: 'online',
        responseTime,
      };
    } else {
      return {
        name: 'Pexels',
        status: 'offline',
        error: `HTTP ${response.status}`,
      };
    }
  } catch (error) {
    return {
      name: 'Pexels',
      status: 'offline',
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

/**
 * Helper function to check Pixabay API
 */
async function checkPixabay(): Promise<APIHealthStatus> {
  const apiKey = process.env.PIXABAY_API_KEY;

  if (!apiKey) {
    return {
      name: 'Pixabay',
      status: 'offline',
      error: 'API key not configured',
    };
  }

  try {
    const startTime = Date.now();
    const response = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=nature&per_page=3`,
      {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      }
    );

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        name: 'Pixabay',
        status: 'online',
        responseTime,
      };
    } else {
      return {
        name: 'Pixabay',
        status: 'offline',
        error: `HTTP ${response.status}`,
      };
    }
  } catch (error) {
    return {
      name: 'Pixabay',
      status: 'offline',
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

/**
 * Helper function to check Unsplash API
 */
async function checkUnsplash(): Promise<APIHealthStatus> {
  const apiKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!apiKey) {
    return {
      name: 'Unsplash',
      status: 'offline',
      error: 'API key not configured',
    };
  }

  try {
    const startTime = Date.now();
    const response = await fetch('https://api.unsplash.com/photos?per_page=1', {
      method: 'GET',
      headers: {
        Authorization: `Client-ID ${apiKey}`,
      },
      signal: AbortSignal.timeout(5000),
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        name: 'Unsplash',
        status: 'online',
        responseTime,
      };
    } else {
      return {
        name: 'Unsplash',
        status: 'offline',
        error: `HTTP ${response.status}`,
      };
    }
  } catch (error) {
    return {
      name: 'Unsplash',
      status: 'offline',
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}
