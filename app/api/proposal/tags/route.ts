import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { v4 as uuidv4 } from "uuid";
import { AIProvider, Tags } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      theme,
      description,
      research,
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

    const researchContext = research?.externalAnalysis?.trendingTopics?.join(", ") || "";

    const { text } = await generateText({
      model: aiModel,
      system: `You are a YouTube SEO specialist.
Generate 15-30 relevant tags for a YouTube video.
Tags should include:
- Primary keywords (high search volume)
- Secondary keywords (medium search volume)
- Long-tail keywords
- Related topics
- Trending terms

Return ONLY a JSON array of strings (the tags), no other text.
Example: ["tag1", "tag2", "tag3"]`,
      prompt: `Generate tags for a YouTube video about: ${theme}

Description summary: ${description?.substring(0, 500) || "N/A"}

Trending topics in this niche: ${researchContext}`,
      temperature: 0.7,
    });

    let tagsList: string[] = [];
    try {
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        tagsList = JSON.parse(match[0]);
      }
    } catch {
      // Parse as comma-separated if JSON fails
      tagsList = text.split(",").map((t) => t.trim().replace(/["'\[\]]/g, "")).filter(Boolean);
    }

    const tags: Tags = {
      id: uuidv4(),
      status: "ready",
      items: tagsList,
      generatedAt: new Date().toISOString(),
      approvedAt: null,
    };

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Tags generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Tags generation failed" },
      { status: 500 }
    );
  }
}
