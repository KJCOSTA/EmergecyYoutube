import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { v4 as uuidv4 } from "uuid";
import { AIProvider, TitlesAndThumbs, TitleThumbnailVariation } from "@/types";

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

    const diretrizesContext = diretrizes?.filter((d: { appliesTo: string[] }) => d.appliesTo.includes("thumbnail"))
      .map((d: { title: string; systemPrompt: string }) => `### ${d.title}\n${d.systemPrompt}`)
      .join("\n\n");

    const scriptHook = script?.sections?.find((s: { type: string }) => s.type === "hook")?.content || "";
    const researchContext = research?.consolidatedInsights || "";

    const systemPrompt = `You are a YouTube title and thumbnail strategist.
Create 3 variations of titles and thumbnail prompts.

Each title should:
- Be under 60 characters
- Create curiosity or urgency
- Include power words
- Be clear about the value

Each thumbnail prompt should:
- Be detailed for AI image generation
- Describe the visual elements clearly
- Include colors, composition, and mood
- NOT include text (text will be added separately)
- Focus on eye-catching visuals

${diretrizesContext ? `\n## Diretrizes (MUST FOLLOW):\n${diretrizesContext}` : ""}

Return a JSON object with this structure:
{
  "variations": [
    {
      "title": "Title 1",
      "thumbnailPrompt": "Detailed thumbnail prompt 1..."
    },
    {
      "title": "Title 2",
      "thumbnailPrompt": "Detailed thumbnail prompt 2..."
    },
    {
      "title": "Title 3",
      "thumbnailPrompt": "Detailed thumbnail prompt 3..."
    }
  ]
}`;

    const { text } = await generateText({
      model: aiModel,
      system: systemPrompt,
      prompt: `Create 3 title and thumbnail variations for a video about: ${theme}

Hook from script: ${scriptHook}

Research insights: ${researchContext}`,
      temperature: 0.8,
      maxTokens: 2000,
    });

    let variationsData;
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        variationsData = JSON.parse(match[0]);
      }
    } catch {
      variationsData = {
        variations: [
          { title: theme, thumbnailPrompt: `A professional YouTube thumbnail about ${theme}` },
          { title: `How to ${theme}`, thumbnailPrompt: `Eye-catching visual representation of ${theme}` },
          { title: `${theme} Explained`, thumbnailPrompt: `Educational and engaging thumbnail about ${theme}` },
        ],
      };
    }

    const variations: TitleThumbnailVariation[] = variationsData.variations.map(
      (v: { title: string; thumbnailPrompt: string }) => ({
        id: uuidv4(),
        title: v.title,
        thumbnailPrompt: v.thumbnailPrompt,
        thumbnailUrl: null,
        imageProvider: null,
      })
    );

    const titlesAndThumbs: TitlesAndThumbs = {
      id: uuidv4(),
      status: "ready",
      variations,
      selectedVariation: null,
      generatedAt: new Date().toISOString(),
      approvedAt: null,
    };

    return NextResponse.json(titlesAndThumbs);
  } catch (error) {
    console.error("Titles generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Titles generation failed" },
      { status: 500 }
    );
  }
}
