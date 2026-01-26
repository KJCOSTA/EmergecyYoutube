import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { data } = await request.json();

  // TODO: Implement asset proposal generation
  const proposals = data.map((item: any) => ({
    ...item,
    script: `Generated script for ${item.topic}`,
    images: [`https://picsum.photos/seed/${item.id}/400/300`],
    videos: [`https://videos.pexels.com/video-files/3209828/3209828-480p.mp4`],
    title: `Amazing Title for ${item.topic}`,
    description: `Compelling description about ${item.topic}`,
  }));

  console.log('Proposals generated:', proposals);

  return NextResponse.json({ success: true, data: proposals });
}
