import { NextRequest } from "next/server";
import { streamText } from "ai";
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
    } = body as {
      provider: AIProvider;
      model: string;
      systemPrompt: string;
      userPrompt: string;
      temperature?: number;
    };

    if (!provider || !model || !userPrompt) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get the appropriate model based on provider
    let aiModel;
    switch (provider) {
      case "openai":
        if (!process.env.OPENAI_API_KEY) {
          return new Response(
            JSON.stringify({ error: "OpenAI API key not configured" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
        aiModel = openai(model);
        break;
      case "google":
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
          return new Response(
            JSON.stringify({ error: "Google API key not configured" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
        aiModel = google(model);
        break;
      case "anthropic":
        if (!process.env.ANTHROPIC_API_KEY) {
          return new Response(
            JSON.stringify({ error: "Anthropic API key not configured" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
        aiModel = anthropic(model);
        break;
      default:
        return new Response(
          JSON.stringify({ error: `Unknown provider: ${provider}` }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const result = streamText({
      model: aiModel,
      system: systemPrompt,
      prompt: userPrompt,
      temperature,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI Streaming error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "AI streaming failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
