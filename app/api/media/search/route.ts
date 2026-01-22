import { NextRequest, NextResponse } from "next/server";
import { MediaSource, MediaItem } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface PexelsVideo {
  id: number;
  url: string;
  image: string;
  duration: number;
  video_files: Array<{
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }>;
  user: { name: string };
}

interface PexelsPhoto {
  id: number;
  url: string;
  src: { original: string; medium: string };
  photographer: string;
}

interface PixabayHit {
  id: number;
  pageURL: string;
  webformatURL: string;
  largeImageURL: string;
  duration?: number;
  videos?: {
    medium: { url: string };
  };
  user: string;
}

interface UnsplashResult {
  id: string;
  urls: { regular: string; full: string };
  user: { name: string };
  links: { html: string };
}

async function searchPexelsVideos(query: string): Promise<MediaItem[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=12`,
      {
        headers: { Authorization: apiKey },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data.videos?.map((video: PexelsVideo) => ({
      id: uuidv4(),
      source: "pexels" as MediaSource,
      sourceId: video.id.toString(),
      url: video.video_files.find((f) => f.quality === "hd")?.link || video.video_files[0]?.link || "",
      previewUrl: video.image,
      type: "video" as const,
      duration: video.duration,
      attribution: `Pexels - ${video.user.name}`,
    })) || [];
  } catch (error) {
    console.error("Pexels search error:", error);
    return [];
  }
}

async function searchPexelsPhotos(query: string): Promise<MediaItem[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12`,
      {
        headers: { Authorization: apiKey },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data.photos?.map((photo: PexelsPhoto) => ({
      id: uuidv4(),
      source: "pexels" as MediaSource,
      sourceId: photo.id.toString(),
      url: photo.src.original,
      previewUrl: photo.src.medium,
      type: "image" as const,
      duration: null,
      attribution: `Pexels - ${photo.photographer}`,
    })) || [];
  } catch (error) {
    console.error("Pexels photos search error:", error);
    return [];
  }
}

async function searchPixabayVideos(query: string): Promise<MediaItem[]> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch(
      `https://pixabay.com/api/videos/?key=${apiKey}&q=${encodeURIComponent(query)}&per_page=12`
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data.hits?.map((hit: PixabayHit) => ({
      id: uuidv4(),
      source: "pixabay" as MediaSource,
      sourceId: hit.id.toString(),
      url: hit.videos?.medium?.url || "",
      previewUrl: hit.webformatURL || `https://i.vimeocdn.com/video/${hit.id}_640x360.jpg`,
      type: "video" as const,
      duration: hit.duration || null,
      attribution: `Pixabay - ${hit.user}`,
    })) || [];
  } catch (error) {
    console.error("Pixabay search error:", error);
    return [];
  }
}

async function searchPixabayPhotos(query: string): Promise<MediaItem[]> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&per_page=12&image_type=photo`
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data.hits?.map((hit: PixabayHit) => ({
      id: uuidv4(),
      source: "pixabay" as MediaSource,
      sourceId: hit.id.toString(),
      url: hit.largeImageURL,
      previewUrl: hit.webformatURL,
      type: "image" as const,
      duration: null,
      attribution: `Pixabay - ${hit.user}`,
    })) || [];
  } catch (error) {
    console.error("Pixabay photos search error:", error);
    return [];
  }
}

async function searchUnsplash(query: string): Promise<MediaItem[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return [];

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12`,
      {
        headers: { Authorization: `Client-ID ${accessKey}` },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data.results?.map((result: UnsplashResult) => ({
      id: uuidv4(),
      source: "unsplash" as MediaSource,
      sourceId: result.id,
      url: result.urls.full,
      previewUrl: result.urls.regular,
      type: "image" as const,
      duration: null,
      attribution: `Unsplash - ${result.user.name}`,
    })) || [];
  } catch (error) {
    console.error("Unsplash search error:", error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, sources, mediaType } = body as {
      query: string;
      sources?: MediaSource[];
      mediaType?: "video" | "image" | "all";
    };

    if (!query) {
      return NextResponse.json(
        { error: "Missing required field: query" },
        { status: 400 }
      );
    }

    const requestedSources = sources || ["pexels", "pixabay", "unsplash"];
    const type = mediaType || "all";
    const results: MediaItem[] = [];

    // Run searches in parallel
    const searchPromises: Promise<MediaItem[]>[] = [];

    if (requestedSources.includes("pexels")) {
      if (type === "all" || type === "video") {
        searchPromises.push(searchPexelsVideos(query));
      }
      if (type === "all" || type === "image") {
        searchPromises.push(searchPexelsPhotos(query));
      }
    }

    if (requestedSources.includes("pixabay")) {
      if (type === "all" || type === "video") {
        searchPromises.push(searchPixabayVideos(query));
      }
      if (type === "all" || type === "image") {
        searchPromises.push(searchPixabayPhotos(query));
      }
    }

    if (requestedSources.includes("unsplash")) {
      if (type === "all" || type === "image") {
        searchPromises.push(searchUnsplash(query));
      }
    }

    const searchResults = await Promise.all(searchPromises);
    searchResults.forEach((items) => results.push(...items));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Media search error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Media search failed" },
      { status: 500 }
    );
  }
}
