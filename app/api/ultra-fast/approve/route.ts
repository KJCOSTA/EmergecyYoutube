import { NextResponse } from 'next/server';

// In-memory store for approvals
const approvals = new Map<number, any>();

export async function POST(request: Request) {
  const { itemId, itemData } = await request.json();

  approvals.set(itemId, { ...itemData, approved: true });

  console.log(`Item ${itemId} approved:`, approvals.get(itemId));

  return NextResponse.json({ success: true, approvedItem: approvals.get(itemId) });
}

export async function GET() {
  return NextResponse.json({ success: true, allApproved: Object.fromEntries(approvals) });
}
