import { NextResponse } from 'next/server'

// ⚠️ STUB: This endpoint returns mock data for testing purposes only
// TODO: Implement real video rendering using JSON2Video API or alternative service
export async function POST() {
  return NextResponse.json({
    status: 'DONE',
    video_url: 'https://video-gerado.exemplo.mp4'
  })
}
