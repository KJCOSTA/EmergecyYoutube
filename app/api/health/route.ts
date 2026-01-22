import { NextResponse } from "next/server";
import { systemBoot } from "@/lib/system/boot";

export async function GET() {
  const report = await systemBoot();
  return NextResponse.json(report);
}
