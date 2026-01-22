import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";
import { v4 as uuidv4 } from "uuid";
import { AIProvider, ResearchData, ResearchQuery, ResearchResult } from "@/types";
import {
  getOpenAIKey,
  getGoogleKey,
  getAnthropicKey,
  getTavilyKey,
} from "@/lib/get-api-key";

async function searchWithTavily(query: string, apiKey: string): Promise<ResearchResult[]> {
  if (!apiKey) {
    return [];
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "advanced",
        max_results: 5,
      }),
    });

    if (!response.ok) {
      throw new Error("Tavily search failed");
    }

    const data = await response.json();
    return data.results?.map((result: { title: string; url: string; content: string; score: number }) => ({
      title: result.title,
      url: result.url,
      snippet: result.content,
      score: result.score,
    })) || [];
  } catch (error) {
    console.error("Tavily search error:", error);
    return [];
  }
}

async function simulateSearchWithLLM(
  query: string,
  provider: AIProvider,
  model: string,
  openaiKey?: string,
  googleKey?: string,
  anthropicKey?: string
): Promise<ResearchResult[]> {
  const aiModel = getAIModel(provider, model, openaiKey, googleKey, anthropicKey);

  const { text } = await generateText({
    model: aiModel,
    system: `You are a research assistant. Generate realistic search results for the given query.
Return a JSON array with 3-5 results, each having: title, url, snippet, score (0-1).
Make the results relevant and informative for YouTube content creation.
Return ONLY valid JSON, no other text.`,
    prompt: `Generate search results for: "${query}"`,
    temperature: 0.7,
  });

  try {
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch {
    return [];
  }
}

function getAIModel(
  provider: AIProvider,
  model: string,
  openaiKey?: string,
  googleKey?: string,
  anthropicKey?: string
) {
  switch (provider) {
    case "openai": {
      const openai = createOpenAI({
        apiKey: openaiKey || process.env.OPENAI_API_KEY,
      });
      return openai(model);
    }
    case "google": {
      const google = createGoogleGenerativeAI({
        apiKey: googleKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      });
      return google(model);
    }
    case "anthropic": {
      const anthropicClient = createAnthropic({
        apiKey: anthropicKey || process.env.ANTHROPIC_API_KEY,
      });
      return anthropicClient(model);
    }
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      contextId,
      theme,
      channelData,
      metrics,
      provider,
      model,
      diretrizes,
    } = body;

    if (!contextId || !theme) {
      return NextResponse.json(
        { error: "Missing required fields: contextId, theme" },
        { status: 400 }
      );
    }

    // Get API keys from headers or env
    const openaiKey = getOpenAIKey(request);
    const googleKey = getGoogleKey(request);
    const anthropicKey = getAnthropicKey(request);
    const tavilyKey = getTavilyKey(request);

    // Verify AI provider is configured
    if (provider === "openai" && !openaiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 400 });
    }
    if (provider === "google" && !googleKey) {
      return NextResponse.json({ error: "Google API key not configured" }, { status: 400 });
    }
    if (provider === "anthropic" && !anthropicKey) {
      return NextResponse.json({ error: "Anthropic API key not configured" }, { status: 400 });
    }

    const aiModel = getAIModel(provider, model, openaiKey, googleKey, anthropicKey);

    // Build context for analysis
    const channelContext = channelData
      ? `Channel: ${channelData.title}
Subscribers: ${channelData.subscriberCount}
Total Views: ${channelData.viewCount}
Recent Videos: ${channelData.recentVideos?.map((v: { title: string; viewCount: number }) => `${v.title} (${v.viewCount} views)`).join(", ")}`
      : "No channel data available";

    const metricsContext = metrics?.length
      ? `Performance Metrics:\n${metrics.slice(0, 10).map((m: { title: string; views: number; ctr: number }) =>
          `- ${m.title}: ${m.views} views, ${m.ctr}% CTR`
        ).join("\n")}`
      : "No metrics data available";

    const diretrizesContext = diretrizes?.length
      ? `\n\nDiretrizes to follow:\n${diretrizes.map((d: { title: string; systemPrompt: string }) => `- ${d.title}: ${d.systemPrompt}`).join("\n")}`
      : "";

    // Step 1: Generate research queries
    const { text: queriesText } = await generateText({
      model: aiModel,
      system: `You are a YouTube research analyst. Generate 3-5 research queries to gather external information that will help create a high-performing video.
Return ONLY a JSON array of strings (queries).${diretrizesContext}`,
      prompt: `Theme: ${theme}

${channelContext}

${metricsContext}

Generate search queries to research this topic for a YouTube video.`,
      temperature: 0.7,
    });

    let queries: string[] = [];
    try {
      const match = queriesText.match(/\[[\s\S]*\]/);
      if (match) {
        queries = JSON.parse(match[0]);
      }
    } catch {
      queries = [theme, `${theme} trends 2024`, `${theme} YouTube video ideas`];
    }

    // Step 2: Execute searches
    const hasTavily = !!tavilyKey;
    const researchQueries: ResearchQuery[] = [];

    for (const query of queries.slice(0, 5)) {
      let results: ResearchResult[];
      let source: "tavily" | "llm_simulated";

      if (hasTavily) {
        results = await searchWithTavily(query, tavilyKey!);
        source = "tavily";
      } else {
        results = await simulateSearchWithLLM(query, provider, model, openaiKey, googleKey, anthropicKey);
        source = "llm_simulated";
      }

      researchQueries.push({ query, source, results });
    }

    // Step 3: Analyze and consolidate
    const { text: analysisText } = await generateText({
      model: aiModel,
      system: `You are a YouTube content strategist. Analyze the provided data and research to generate actionable insights.
Return a JSON object with this structure:
{
  "internalAnalysis": {
    "topPerformingTopics": ["topic1", "topic2"],
    "audienceInsights": ["insight1", "insight2"],
    "contentGaps": ["gap1", "gap2"],
    "recommendations": ["rec1", "rec2"]
  },
  "externalAnalysis": {
    "trendingTopics": ["trend1", "trend2"],
    "competitorInsights": ["comp1", "comp2"],
    "marketOpportunities": ["opp1", "opp2"]
  },
  "consolidatedInsights": "A detailed paragraph summarizing all findings and strategic recommendations"
}${diretrizesContext}`,
      prompt: `Theme: ${theme}

Channel Data:
${channelContext}

Metrics:
${metricsContext}

Research Results:
${researchQueries.map((q) => `Query: ${q.query}\nResults: ${q.results.map((r) => r.snippet).join("\n")}`).join("\n\n")}

Analyze this data and provide strategic insights.`,
      temperature: 0.7,
    });

    let analysis;
    try {
      const match = analysisText.match(/\{[\s\S]*\}/);
      if (match) {
        analysis = JSON.parse(match[0]);
      }
    } catch {
      analysis = {
        internalAnalysis: {
          topPerformingTopics: [],
          audienceInsights: [],
          contentGaps: [],
          recommendations: [],
        },
        externalAnalysis: {
          trendingTopics: [],
          competitorInsights: [],
          marketOpportunities: [],
        },
        consolidatedInsights: "Research analysis completed. Please review the gathered data.",
      };
    }

    const researchData: ResearchData = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      contextId,
      internalAnalysis: analysis.internalAnalysis,
      externalAnalysis: analysis.externalAnalysis,
      queries: researchQueries,
      consolidatedInsights: analysis.consolidatedInsights,
    };

    return NextResponse.json(researchData);
  } catch (error) {
    console.error("Research error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Research failed" },
      { status: 500 }
    );
  }
}
