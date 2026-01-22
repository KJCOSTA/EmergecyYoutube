import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { v4 as uuidv4 } from "uuid";
import { AIProvider, Script, ScriptSection } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      theme,
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

    // Verify AI provider is configured
    if (provider === "openai" && !process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 400 });
    }
    if (provider === "google" && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json({ error: "Google API key not configured" }, { status: 400 });
    }
    if (provider === "anthropic" && !process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "Anthropic API key not configured" }, { status: 400 });
    }

    let aiModel;
    switch (provider) {
      case "openai":
        aiModel = openai(model);
        break;
      case "google":
        aiModel = google(model);
        break;
      case "anthropic":
        aiModel = anthropic(model);
        break;
      default:
        return NextResponse.json({ error: `Unknown provider: ${provider}` }, { status: 400 });
    }

    const diretrizesContext = diretrizes?.filter((d: { appliesTo: string[] }) => d.appliesTo.includes("script"))
      .map((d: { title: string; systemPrompt: string }) => `### ${d.title}\n${d.systemPrompt}`)
      .join("\n\n");

    const researchContext = research?.consolidatedInsights || "No research data available";

    const systemPrompt = `You are an expert YouTube scriptwriter specializing in retention-focused content.
Your scripts must:
- Be at least 8 minutes long when read at a natural pace (approximately 1200-1500 words)
- Start with a powerful hook in the first 30 seconds
- Use pattern interrupts every 2-3 minutes to maintain engagement
- Include clear value propositions throughout
- End with a strong call-to-action

Return a JSON object with this structure:
{
  "sections": [
    {
      "type": "hook",
      "content": "The hook script text...",
      "duration": 30
    },
    {
      "type": "intro",
      "content": "Introduction text...",
      "duration": 60
    },
    {
      "type": "content",
      "content": "Main content section 1...",
      "duration": 120
    },
    // ... more content sections
    {
      "type": "cta",
      "content": "Call to action...",
      "duration": 30
    },
    {
      "type": "outro",
      "content": "Closing...",
      "duration": 30
    }
  ]
}

${diretrizesContext ? `\n## Diretrizes (MUST FOLLOW):\n${diretrizesContext}` : ""}`;

    const { text } = await generateText({
      model: aiModel,
      system: systemPrompt,
      prompt: `Create a retention-focused YouTube script about: ${theme}

Research Insights:
${researchContext}

Generate a complete script with all sections. The total duration should be at least 8 minutes (480 seconds).`,
      temperature: 0.8,
      maxTokens: 8000,
    });

    let scriptData;
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        scriptData = JSON.parse(match[0]);
      }
    } catch {
      // Fallback structure
      scriptData = {
        sections: [
          { type: "hook", content: "Generated script content", duration: 30 },
          { type: "intro", content: text.substring(0, 500), duration: 60 },
          { type: "content", content: text.substring(500), duration: 390 },
          { type: "cta", content: "Like and subscribe!", duration: 30 },
          { type: "outro", content: "Thanks for watching!", duration: 30 },
        ],
      };
    }

    const sections: ScriptSection[] = scriptData.sections.map((section: { type: string; content: string; duration: number }) => ({
      id: uuidv4(),
      type: section.type as ScriptSection["type"],
      content: section.content,
      duration: section.duration || 60,
    }));

    const totalDuration = sections.reduce((sum, s) => sum + s.duration, 0);

    const script: Script = {
      id: uuidv4(),
      status: "ready",
      sections,
      totalDuration,
      generatedAt: new Date().toISOString(),
      approvedAt: null,
      audioUrl: null,
      ttsProvider: null,
      ttsVoice: null,
    };

    return NextResponse.json(script);
  } catch (error) {
    console.error("Script generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Script generation failed" },
      { status: 500 }
    );
  }
}
