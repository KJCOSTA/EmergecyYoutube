import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { StoryboardData, StoryboardScene, ScriptSection } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proposalId, script } = body as {
      proposalId: string;
      script: { sections: ScriptSection[] };
    };

    if (!proposalId || !script?.sections) {
      return NextResponse.json(
        { error: "Missing required fields: proposalId, script" },
        { status: 400 }
      );
    }

    // Split script sections into storyboard scenes
    const scenes: StoryboardScene[] = [];
    let order = 0;

    for (const section of script.sections) {
      // Split content into smaller chunks for scenes
      // Each scene should be roughly 15-30 seconds
      const maxSceneDuration = 30;
      const contentChunks = splitContentIntoChunks(section.content, section.duration, maxSceneDuration);

      for (const chunk of contentChunks) {
        scenes.push({
          id: uuidv4(),
          order: order++,
          scriptSectionId: section.id,
          text: chunk.text,
          voiceoverUrl: null,
          media: null,
          duration: chunk.duration,
          transition: order === contentChunks.length - 1 ? "fade" : "cut",
        });
      }
    }

    const storyboard: StoryboardData = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      proposalId,
      scenes,
      totalDuration: scenes.reduce((sum, s) => sum + s.duration, 0),
    };

    return NextResponse.json(storyboard);
  } catch (error) {
    console.error("Storyboard generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Storyboard generation failed" },
      { status: 500 }
    );
  }
}

function splitContentIntoChunks(
  content: string,
  totalDuration: number,
  maxDuration: number
): { text: string; duration: number }[] {
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
  const chunks: { text: string; duration: number }[] = [];

  let currentChunk = "";
  let currentDuration = 0;
  const durationPerSentence = totalDuration / sentences.length;

  for (const sentence of sentences) {
    const sentenceDuration = Math.round(durationPerSentence);

    if (currentDuration + sentenceDuration > maxDuration && currentChunk) {
      chunks.push({
        text: currentChunk.trim(),
        duration: currentDuration,
      });
      currentChunk = sentence;
      currentDuration = sentenceDuration;
    } else {
      currentChunk += " " + sentence;
      currentDuration += sentenceDuration;
    }
  }

  if (currentChunk.trim()) {
    chunks.push({
      text: currentChunk.trim(),
      duration: currentDuration || maxDuration,
    });
  }

  // Ensure we have at least one chunk
  if (chunks.length === 0) {
    chunks.push({
      text: content,
      duration: totalDuration,
    });
  }

  return chunks;
}
