import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { RenderData, StoryboardScene } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storyboardId, scenes, soundtrack } = body as {
      storyboardId: string;
      scenes: StoryboardScene[];
      soundtrack?: { url: string };
    };

    if (!storyboardId || !scenes) {
      return NextResponse.json(
        { error: "Missing required fields: storyboardId, scenes" },
        { status: 400 }
      );
    }

    const apiKey = process.env.JSON2VIDEO_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "JSON2Video API key not configured" },
        { status: 400 }
      );
    }

    // Build JSON2Video project structure
    const project = {
      resolution: "full-hd",
      quality: "high",
      scenes: scenes.map((scene) => ({
        comment: scene.text.substring(0, 50),
        duration: scene.duration,
        elements: [
          // Background media
          scene.media?.url
            ? {
                type: scene.media.type === "video" ? "video" : "image",
                src: scene.media.url,
                duration: scene.duration,
              }
            : {
                type: "color",
                color: "#1a1a1a",
                duration: scene.duration,
              },
          // Text overlay
          {
            type: "text",
            text: scene.text.substring(0, 100),
            duration: scene.duration,
            style: {
              fontSize: 24,
              fontFamily: "Arial",
              color: "#ffffff",
              backgroundColor: "rgba(0,0,0,0.5)",
            },
            position: {
              x: "center",
              y: "bottom",
            },
          },
          // Voiceover
          ...(scene.voiceoverUrl
            ? [
                {
                  type: "audio",
                  src: scene.voiceoverUrl,
                  duration: scene.duration,
                },
              ]
            : []),
        ],
        transition: {
          type: scene.transition,
          duration: 0.5,
        },
      })),
      // Background music
      ...(soundtrack?.url
        ? {
            soundtrack: {
              src: soundtrack.url,
              volume: 0.3,
            },
          }
        : {}),
    };

    // Create render job
    const createResponse = await fetch("https://api.json2video.com/v2/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ project }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      throw new Error(error.message || "Failed to create render job");
    }

    const jobData = await createResponse.json();

    const renderData: RenderData = {
      id: jobData.project || uuidv4(),
      createdAt: new Date().toISOString(),
      storyboardId,
      status: "rendering",
      progress: 0,
      videoUrl: null,
      error: null,
    };

    return NextResponse.json(renderData);
  } catch (error) {
    console.error("Render error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Render failed" },
      { status: 500 }
    );
  }
}

// Check render status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { error: "Missing jobId parameter" },
        { status: 400 }
      );
    }

    const apiKey = process.env.JSON2VIDEO_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "JSON2Video API key not configured" },
        { status: 400 }
      );
    }

    const response = await fetch(`https://api.json2video.com/v2/movies/${jobId}`, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to check render status");
    }

    const data = await response.json();

    let status: RenderData["status"] = "rendering";
    if (data.status === "done") {
      status = "completed";
    } else if (data.status === "failed") {
      status = "error";
    }

    return NextResponse.json({
      id: jobId,
      status,
      progress: data.progress || 0,
      videoUrl: data.movie || null,
      error: data.error || null,
    });
  } catch (error) {
    console.error("Render status check error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Status check failed" },
      { status: 500 }
    );
  }
}
