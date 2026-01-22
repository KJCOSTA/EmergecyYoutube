import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    openai: !!process.env.OPENAI_API_KEY,
    gemini: !!process.env.GEMINI_API_KEY || !!process.env.GOOGLE_GENERATIVE_AI_API_KEY || !!process.env.GOOGLE_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    youtube: !!process.env.YOUTUBEDATA_API_KEY || !!process.env.YOUTUBE_API_KEY,
    pexels: !!process.env.PEXELS_API_KEY,
    pixabay: !!process.env.PIXABAY_API_KEY,
    elevenlabs: !!process.env.ELEVENLABS_API_KEY,
    tavily: !!process.env.TAVILY_API_KEY,
    json2video: !!process.env.JSON2VIDEO_API_KEY,
  });
}
