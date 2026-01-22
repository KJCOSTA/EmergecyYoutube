import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { UploadData, UploadSetup } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      proposalId,
      renderId,
      videoUrl,
      title,
      description,
      tags,
      thumbnailUrl: _thumbnailUrl,
      uploadSetup,
      accessToken,
    } = body as {
      proposalId: string;
      renderId: string;
      videoUrl: string;
      title: string;
      description: string;
      tags: string[];
      thumbnailUrl?: string;
      uploadSetup: UploadSetup;
      accessToken: string;
    };

    if (!proposalId || !renderId || !videoUrl || !title || !accessToken) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare metadata
    const metadata = {
      snippet: {
        title,
        description,
        tags,
        categoryId: uploadSetup?.category || "22", // People & Blogs
        defaultLanguage: uploadSetup?.language || "pt",
      },
      status: {
        privacyStatus: "private", // Always upload as private first
        selfDeclaredMadeForKids: uploadSetup?.madeForKids || false,
        license: uploadSetup?.license === "creative_commons" ? "creativeCommon" : "youtube",
        embeddable: uploadSetup?.allowEmbedding !== false,
      },
    };

    // In a real implementation, this would:
    // 1. Download the video from videoUrl
    // 2. Use YouTube Data API v3 to upload the video
    // 3. Set the thumbnail
    //
    // For now, we'll return a simulated upload response
    // The actual implementation would require OAuth2 authentication flow

    // Note: YouTube upload requires OAuth2 with youtube.upload scope
    // This is typically done through a separate auth flow

    const uploadData: UploadData = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      proposalId,
      renderId,
      status: "pending",
      youtubeVideoId: null,
      youtubeUrl: null,
      error: null,
    };

    // In production, you would implement the actual upload here:
    // 1. Initialize resumable upload
    // 2. Upload video in chunks
    // 3. Set thumbnail
    // 4. Return video ID

    // For now, return pending status
    // The client can poll for status updates

    return NextResponse.json({
      ...uploadData,
      message: "Upload initiated. YouTube OAuth2 authentication required.",
      metadata,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}

// Get YouTube categories
export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    // Return default categories if no API key
    return NextResponse.json({
      categories: [
        { id: "1", title: "Film & Animation" },
        { id: "2", title: "Autos & Vehicles" },
        { id: "10", title: "Music" },
        { id: "15", title: "Pets & Animals" },
        { id: "17", title: "Sports" },
        { id: "19", title: "Travel & Events" },
        { id: "20", title: "Gaming" },
        { id: "22", title: "People & Blogs" },
        { id: "23", title: "Comedy" },
        { id: "24", title: "Entertainment" },
        { id: "25", title: "News & Politics" },
        { id: "26", title: "Howto & Style" },
        { id: "27", title: "Education" },
        { id: "28", title: "Science & Technology" },
        { id: "29", title: "Nonprofits & Activism" },
      ],
    });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=BR&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();
    const categories = data.items
      ?.filter((item: { snippet: { assignable: boolean } }) => item.snippet.assignable)
      .map((item: { id: string; snippet: { title: string } }) => ({
        id: item.id,
        title: item.snippet.title,
      }));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
