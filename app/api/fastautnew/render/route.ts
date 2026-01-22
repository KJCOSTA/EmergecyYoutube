import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    status: 'DONE',
    video_url: 'https://video-gerado.exemplo.mp4'
  })
}
