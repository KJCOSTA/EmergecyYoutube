import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    openai: git add . && git commit -m Fix: Deep Research Logic and Auth && git pushprocess.env.OPENAI_API_KEY,
    gemini: git add . && git commit -m Fix: Deep Research Logic and Auth && git pushprocess.env.GEMINI_API_KEY,
    anthropic: git add . && git commit -m Fix: Deep Research Logic and Auth && git pushprocess.env.ANTHROPIC_API_KEY,
    youtube: git add . && git commit -m Fix: Deep Research Logic and Auth && git pushprocess.env.YOUTUBEDATA_API_KEY || git add . && git commit -m Fix: Deep Research Logic and Auth && git pushprocess.env.YOUTUBE_CLIENT_SECRET,
    pexels: git add . && git commit -m Fix: Deep Research Logic and Auth && git pushprocess.env.PEXELS_API_KEY,
    pixabay: git add . && git commit -m Fix: Deep Research Logic and Auth && git pushprocess.env.PIXABAY_API_KEY,
    elevenlabs: git add . && git commit -m Fix: Deep Research Logic and Auth && git pushprocess.env.ELEVENLABS_API_KEY,
    tavily: git add . && git commit -m Fix: Deep Research Logic and Auth && git pushprocess.env.TAVILY_API_KEY,
    json2video: git add . && git commit -m Fix: Deep Research Logic and Auth && git pushprocess.env.JSON2VIDEO_API_KEY,
  });
}
