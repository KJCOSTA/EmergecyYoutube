import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { data } = await request.json();

  // TODO: Implement Deep Research (e.g., Tavily)
  const insights = data.map((item: any) => ({
    ...item,
    research: `Deep research insights for ${item.topic}`,
  }));

  console.log('Research complete:', insights);

  return NextResponse.json({ success: true, data: insights });
}
