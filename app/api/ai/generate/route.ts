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
      provider,
      model,
      systemPrompt,
      userPrompt,
      temperature = 0.7,
      maxTokens = 4096,
    } = body as {
      provider: AIProvider;
      model: string;
      systemPrompt: string;
      userPrompt: string;
      temperature?: number;
      maxTokens?: number;
    };

    if (!provider || !model || !userPrompt) {
      return NextResponse.json(
        { error: "Missing required fields: provider, model, userPrompt" },
        { status: 400 }
      );
    }

    // Get the appropriate model based on provider
    let aiModel;
    switch (provider) {
      case "openai":
        if (!process.env.OPENAI_API_KEY) {
          return NextResponse.json(
            { error: "OpenAI API key not configured" },
            { status: 400 }
          );
        }
        aiModel = openai(model);
        break;
      case "google":
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
          return NextResponse.json(
            { error: "Google API key not configured" },
            { status: 400 }
          );
        }
        aiModel = google(model);
        break;
      case "anthropic":
        if (!process.env.ANTHROPIC_API_KEY) {
          return NextResponse.json(
            { error: "Anthropic API key not configured" },
            { status: 400 }
          );
        }
        aiModel = anthropic(model);
        break;
      default:
        return NextResponse.json(
          { error: `Unknown provider: ${provider}` },
          { status: 400 }
        );
    }

    const { text } = await generateText({
      model: aiModel,
      system: systemPrompt,
      prompt: userPrompt,
      temperature,
      maxTokens,
    });

    return NextResponse.json({ text });
  } catch (error) {
    console.error("AI Generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI generation failed" },
      { status: 500 }
    );
  }
}
