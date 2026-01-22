import { NextResponse } from "next/server";
import { ChannelData, RecentVideo } from "@/types";

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    return NextResponse.json(
      { error: "YouTube API key or Channel ID not configured" },
      { status: 400 }
    );
  }

  try {
    // Fetch channel data
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
    );

    if (!channelResponse.ok) {
      throw new Error("Failed to fetch channel data");
    }

    const channelData = await channelResponse.json();

    if (!channelData.items || channelData.items.length === 0) {
      return NextResponse.json(
        { error: "Channel not found" },
        { status: 404 }
      );
    }

    const channel = channelData.items[0];

    // Fetch recent videos
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=10&key=${apiKey}`
    );

    if (!videosResponse.ok) {
      throw new Error("Failed to fetch videos");
    }

    const videosData = await videosResponse.json();
    const videoIds = videosData.items?.map((item: { id: { videoId: string } }) => item.id.videoId).join(",") || "";

    // Fetch video statistics
    let recentVideos: RecentVideo[] = [];
    if (videoIds) {
      const statsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${apiKey}`
      );

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        recentVideos = statsData.items?.map((video: {
          id: string;
          snippet: {
            title: string;
            description: string;
            thumbnails: { medium: { url: string } };
            publishedAt: string;
          };
          statistics: {
            viewCount: string;
            likeCount: string;
            commentCount: string;
          };
        }) => ({
          id: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnailUrl: video.snippet.thumbnails.medium.url,
          publishedAt: video.snippet.publishedAt,
          viewCount: parseInt(video.statistics.viewCount || "0"),
          likeCount: parseInt(video.statistics.likeCount || "0"),
          commentCount: parseInt(video.statistics.commentCount || "0"),
        })) || [];
      }
    }

    const result: ChannelData = {
      channelId: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      subscriberCount: parseInt(channel.statistics.subscriberCount || "0"),
      videoCount: parseInt(channel.statistics.videoCount || "0"),
      viewCount: parseInt(channel.statistics.viewCount || "0"),
      recentVideos,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("YouTube API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch YouTube data" },
      { status: 500 }
    );
  }
}
