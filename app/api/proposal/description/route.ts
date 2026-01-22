import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { v4 as uuidv4 } from "uuid";
import { AIProvider, Description } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      theme,
      script,
      research,
      diretrizes,
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

    const diretrizesContext = diretrizes?.filter((d: { appliesTo: string[] }) => d.appliesTo.includes("description"))
      .map((d: { title: string; systemPrompt: string }) => `### ${d.title}\n${d.systemPrompt}`)
      .join("\n\n");

    const scriptSummary = script?.sections?.map((s: { content: string }) => s.content).join("\n").substring(0, 1000) || "";
    const researchContext = research?.consolidatedInsights || "";

    const systemPrompt = `You are an SEO expert for YouTube video descriptions.
Create a description that:
- Starts with a compelling summary (first 2 lines are crucial for SEO)
- Includes timestamps for main sections
- Has relevant links placeholders
- Uses natural keyword placement
- Is 200-500 words
- Includes a call-to-action

${diretrizesContext ? `\n## Diretrizes (MUST FOLLOW):\n${diretrizesContext}` : ""}

Return ONLY the description text, no JSON wrapper.`;

    const { text } = await generateText({
      model: aiModel,
      system: systemPrompt,
      prompt: `Create an SEO-optimized YouTube description for a video about: ${theme}

Script Summary:
${scriptSummary}

Research Insights:
${researchContext}`,
      temperature: 0.7,
      maxTokens: 2000,
    });

    const description: Description = {
      id: uuidv4(),
      status: "ready",
      content: text.trim(),
      generatedAt: new Date().toISOString(),
      approvedAt: null,
    };

    return NextResponse.json(description);
  } catch (error) {
    console.error("Description generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Description generation failed" },
      { status: 500 }
    );
  }
}
