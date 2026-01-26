import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { approvedItems } = await request.json();

  // TODO: Implement simplified storyboard creation
  const storyboard = {
    title: 'My Ultra-Fast Video',
    scenes: approvedItems.map((item: any) => ({
      scene: item.id,
      type: 'video',
      src: item.videos[0],
      caption: item.script.substring(0, 50), // Simple caption
    })),
  };

  console.log('Storyboard created:', storyboard);

  return NextResponse.json({ success: true, storyboard });
}
