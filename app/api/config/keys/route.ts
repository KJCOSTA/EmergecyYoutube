import { NextResponse } from "next/server";
import { APIKeyStatus } from "@/types";

export async function GET() {
  const status: APIKeyStatus = {
    youtube: !!(process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_CHANNEL_ID),
    openai: !!process.env.OPENAI_API_KEY,
    google: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    pexels: !!process.env.PEXELS_API_KEY,
    pixabay: !!process.env.PIXABAY_API_KEY,
    unsplash: !!process.env.UNSPLASH_ACCESS_KEY,
    json2video: !!process.env.JSON2VIDEO_API_KEY,
    elevenlabs: !!process.env.ELEVENLABS_API_KEY,
    tavily: !!process.env.TAVILY_API_KEY,
    replicate: !!process.env.REPLICATE_API_TOKEN,
    stability: !!process.env.STABILITY_API_KEY,
  };

  return NextResponse.json(status);
}
