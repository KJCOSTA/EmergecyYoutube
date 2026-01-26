import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { v4 as uuidv4 } from "uuid";
import { AIProvider, Soundtrack, SoundtrackSuggestion } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      theme,
      mood,
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

    const { text } = await generateText({
      model: aiModel,
      system: `You are a music supervisor for YouTube content.
Suggest 3 copyright-free music tracks that would fit the video theme and mood.
These should be actual royalty-free music suggestions from platforms like:
- YouTube Audio Library
- Pixabay Music
- Free Music Archive
- Incompetech

Return a JSON object with this structure:
{
  "suggestions": [
    {
      "title": "Track Title",
      "artist": "Artist Name",
      "genre": "Genre",
      "url": "URL or platform reference",
      "duration": 180,
      "license": "CC0 or specific license"
    }
  ]
}`,
      prompt: `Suggest 3 copyright-free music tracks for a video about: ${theme}
Mood: ${mood || "professional, engaging, educational"}`,
      temperature: 0.7,
    });

    let suggestionsData;
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        suggestionsData = JSON.parse(match[0]);
      }
    } catch {
      suggestionsData = {
        suggestions: [
          {
            title: "Corporate Upbeat",
            artist: "Various",
            genre: "Corporate",
            url: "YouTube Audio Library",
            duration: 180,
            license: "Royalty Free",
          },
          {
            title: "Inspiring Background",
            artist: "Various",
            genre: "Inspirational",
            url: "YouTube Audio Library",
            duration: 240,
            license: "Royalty Free",
          },
          {
            title: "Modern Tech",
            artist: "Various",
            genre: "Electronic",
            url: "YouTube Audio Library",
            duration: 200,
            license: "Royalty Free",
          },
        ],
      };
    }

    const suggestions: SoundtrackSuggestion[] = suggestionsData.suggestions.map(
      (s: { title: string; artist: string; genre: string; url: string; duration: number; license: string }) => ({
        id: uuidv4(),
        title: s.title,
        artist: s.artist,
        genre: s.genre,
        url: s.url,
        duration: s.duration || 180,
        license: s.license,
        isUpload: false,
      })
    );

    const soundtrack: Soundtrack = {
      id: uuidv4(),
      status: "ready",
      suggestions,
      selected: null,
      generatedAt: new Date().toISOString(),
      approvedAt: null,
    };

    return NextResponse.json(soundtrack);
  } catch (error) {
    console.error("Soundtrack generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Soundtrack generation failed" },
      { status: 500 }
    );
  }
}
