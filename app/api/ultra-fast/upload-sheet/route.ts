import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // TODO: Implement file parsing (CSV/XLSX)
  // For now, we'll use mock data
  const data = [
    { id: 1, topic: 'The Future of AI' },
    { id: 2, topic: 'Sustainable Energy Sources' },
  ];

  console.log('Sheet uploaded, data normalized:', data);

  return NextResponse.json({ success: true, data });
}
