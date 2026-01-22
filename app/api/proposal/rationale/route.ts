import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { AIProvider } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      theme,
      research,
      channelData,
      provider,
      model,
    } = body;

    if (!theme || !provider || !model) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let aiModel;
    switch (provider as AIProvider) {
      case "openai":
        if (!process.env.OPENAI_API_KEY) {
          return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 400 });
        }
        aiModel = openai(model);
        break;
      case "google":
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
          return NextResponse.json({ error: "Google API key not configured" }, { status: 400 });
        }
        aiModel = google(model);
        break;
      case "anthropic":
        if (!process.env.ANTHROPIC_API_KEY) {
          return NextResponse.json({ error: "Anthropic API key not configured" }, { status: 400 });
        }
        aiModel = anthropic(model);
        break;
      default:
        return NextResponse.json({ error: `Unknown provider: ${provider}` }, { status: 400 });
    }

    const researchContext = research ? `
Research Insights: ${research.consolidatedInsights}
Top Performing Topics: ${research.internalAnalysis?.topPerformingTopics?.join(", ") || "N/A"}
Trending Topics: ${research.externalAnalysis?.trendingTopics?.join(", ") || "N/A"}
Market Opportunities: ${research.externalAnalysis?.marketOpportunities?.join(", ") || "N/A"}
` : "";

    const channelContext = channelData ? `
Channel: ${channelData.title}
Subscribers: ${channelData.subscriberCount}
Recent Performance: ${channelData.recentVideos?.slice(0, 3).map((v: { title: string; viewCount: number }) => `${v.title} (${v.viewCount} views)`).join(", ") || "N/A"}
` : "";

    const { text } = await generateText({
      model: aiModel,
      system: `You are a YouTube content strategist.
Write a compelling explanation of why this video proposal will perform well.
Focus on:
- Data-backed insights from research
- Alignment with audience interests
- Market opportunity and timing
- Competitive advantages
- Expected performance indicators

Write in a confident, analytical tone. Be specific with references to data.
Keep it to 2-3 paragraphs.`,
      prompt: `Explain why a video about "${theme}" will perform well.

${researchContext}
${channelContext}`,
      temperature: 0.7,
      maxTokens: 1000,
    });

    return NextResponse.json({ rationale: text.trim() });
  } catch (error) {
    console.error("Rationale generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Rationale generation failed" },
      { status: 500 }
    );
  }
}
