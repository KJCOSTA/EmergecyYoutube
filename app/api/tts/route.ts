import { NextRequest, NextResponse } from "next/server";
import { TTSProvider } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, provider, voice } = body as {
      text: string;
      provider: TTSProvider;
      voice: string;
    };

    if (!text || !provider) {
      return NextResponse.json(
        { error: "Missing required fields: text, provider" },
        { status: 400 }
      );
    }

    let audioBuffer: ArrayBuffer;

    switch (provider) {
      case "openai": {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          return NextResponse.json(
            { error: "OpenAI API key not configured" },
            { status: 400 }
          );
        }

        const response = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "tts-1-hd",
            input: text,
            voice: voice || "alloy",
            response_format: "mp3",
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || "OpenAI TTS failed");
        }

        audioBuffer = await response.arrayBuffer();
        break;
      }

      case "elevenlabs": {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
          return NextResponse.json(
            { error: "ElevenLabs API key not configured" },
            { status: 400 }
          );
        }

        const voiceId = voice || "21m00Tcm4TlvDq8ikWAM"; // Default to Rachel
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "xi-api-key": apiKey,
            },
            body: JSON.stringify({
              text,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error("ElevenLabs TTS failed");
        }

        audioBuffer = await response.arrayBuffer();
        break;
      }

      case "google": {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
          return NextResponse.json(
            { error: "Google API key not configured" },
            { status: 400 }
          );
        }

        // Google Cloud TTS requires different authentication
        // For simplicity, we'll use a basic synthesis endpoint
        const response = await fetch(
          `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              input: { text },
              voice: {
                languageCode: "pt-BR",
                name: voice || "pt-BR-Wavenet-A",
              },
              audioConfig: {
                audioEncoding: "MP3",
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Google TTS failed");
        }

        const data = await response.json();
        const audioContent = data.audioContent;

        // Convert base64 to buffer
        const binaryString = atob(audioContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        audioBuffer = bytes.buffer;
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unknown TTS provider: ${provider}` },
          { status: 400 }
        );
    }

    // Convert to base64 for response
    const base64Audio = Buffer.from(audioBuffer).toString("base64");
    const audioUrl = `data:audio/mp3;base64,${base64Audio}`;

    return NextResponse.json({ audioUrl, provider });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "TTS generation failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return available voices for each provider
  const voices = {
    openai: [
      { id: "alloy", name: "Alloy" },
      { id: "echo", name: "Echo" },
      { id: "fable", name: "Fable" },
      { id: "onyx", name: "Onyx" },
      { id: "nova", name: "Nova" },
      { id: "shimmer", name: "Shimmer" },
    ],
    elevenlabs: process.env.ELEVENLABS_API_KEY
      ? [
          { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" },
          { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi" },
          { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella" },
          { id: "ErXwobaYiN019PkySvjV", name: "Antoni" },
          { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli" },
          { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh" },
        ]
      : [],
    google: [
      { id: "pt-BR-Wavenet-A", name: "Brazilian Portuguese - Female" },
      { id: "pt-BR-Wavenet-B", name: "Brazilian Portuguese - Male" },
      { id: "en-US-Wavenet-D", name: "English US - Male" },
      { id: "en-US-Wavenet-F", name: "English US - Female" },
    ],
  };

  return NextResponse.json(voices);
}
