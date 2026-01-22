import { NextRequest, NextResponse } from "next/server";
import { ImageProvider } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, provider } = body as { prompt: string; provider: ImageProvider };

    if (!prompt || !provider) {
      return NextResponse.json(
        { error: "Missing required fields: prompt, provider" },
        { status: 400 }
      );
    }

    let imageUrl: string;

    switch (provider) {
      case "dalle": {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          return NextResponse.json(
            { error: "OpenAI API key not configured" },
            { status: 400 }
          );
        }

        const response = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: `YouTube thumbnail: ${prompt}. High quality, vibrant colors, professional look, 16:9 aspect ratio.`,
            n: 1,
            size: "1792x1024",
            quality: "standard",
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || "DALL-E generation failed");
        }

        const data = await response.json();
        imageUrl = data.data[0].url;
        break;
      }

      case "stability": {
        const apiKey = process.env.STABILITY_API_KEY;
        if (!apiKey) {
          return NextResponse.json(
            { error: "Stability API key not configured" },
            { status: 400 }
          );
        }

        const response = await fetch(
          "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              text_prompts: [
                {
                  text: `YouTube thumbnail: ${prompt}. High quality, vibrant colors, professional look.`,
                  weight: 1,
                },
              ],
              cfg_scale: 7,
              width: 1344,
              height: 768,
              samples: 1,
              steps: 30,
            }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Stability generation failed");
        }

        const data = await response.json();
        const base64Image = data.artifacts[0].base64;
        imageUrl = `data:image/png;base64,${base64Image}`;
        break;
      }

      case "replicate": {
        const apiToken = process.env.REPLICATE_API_TOKEN;
        if (!apiToken) {
          return NextResponse.json(
            { error: "Replicate API token not configured" },
            { status: 400 }
          );
        }

        // Create prediction
        const createResponse = await fetch("https://api.replicate.com/v1/predictions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${apiToken}`,
          },
          body: JSON.stringify({
            version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
            input: {
              prompt: `YouTube thumbnail: ${prompt}. High quality, vibrant colors, professional look.`,
              width: 1344,
              height: 768,
              num_outputs: 1,
            },
          }),
        });

        if (!createResponse.ok) {
          throw new Error("Replicate prediction creation failed");
        }

        const prediction = await createResponse.json();
        let result = prediction;

        // Poll for completion
        while (result.status !== "succeeded" && result.status !== "failed") {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const statusResponse = await fetch(
            `https://api.replicate.com/v1/predictions/${result.id}`,
            {
              headers: {
                Authorization: `Token ${apiToken}`,
              },
            }
          );
          result = await statusResponse.json();
        }

        if (result.status === "failed") {
          throw new Error("Replicate generation failed");
        }

        imageUrl = result.output[0];
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unknown provider: ${provider}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ imageUrl, provider });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Image generation failed" },
      { status: 500 }
    );
  }
}
