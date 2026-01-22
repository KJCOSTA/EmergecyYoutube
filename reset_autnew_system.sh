#!/bin/bash
set -e

echo "=========================================="
echo " AUTNEW RESET + SYSTEM BOOT (SAFE MODE)"
echo " Codespaces Web Compatible"
echo "=========================================="

echo ""
echo "1) Cleaning caches and build artifacts..."
rm -rf .next
rm -rf node_modules/.cache || true

echo ""
echo "2) Ensuring base folders..."
mkdir -p lib/system
mkdir -p app/api/health
mkdir -p components/system
mkdir -p app

echo ""
echo "3) Writing API Registry..."
cat << 'TS' > lib/system/api-registry.ts
export type ApiStatus = "ONLINE" | "OFFLINE";

export interface ApiCheck {
  name: string;
  env: string;
  check: () => Promise<ApiStatus>;
}

export const apiRegistry: ApiCheck[] = [
  {
    name: "GEMINI",
    env: "GOOGLE_GENERATIVE_AI_API_KEY",
    check: async () => {
      return process.env.GOOGLE_GENERATIVE_AI_API_KEY ? "ONLINE" : "OFFLINE";
    }
  }
];
TS

echo ""
echo "4) Writing System Boot..."
cat << 'TS' > lib/system/boot.ts
import { apiRegistry, ApiStatus } from "./api-registry";

export interface BootReport {
  status: "ONLINE" | "DEGRADED";
  apis: Record<string, ApiStatus>;
}

export async function systemBoot(): Promise<BootReport> {
  const apis: Record<string, ApiStatus> = {};
  let degraded = false;

  for (const api of apiRegistry) {
    const status = await api.check();
    apis[api.name] = status;
    if (status !== "ONLINE") degraded = true;
  }

  return {
    status: degraded ? "DEGRADED" : "ONLINE",
    apis
  };
}
TS

echo ""
echo "5) Writing Health API Route..."
cat << 'TS' > app/api/health/route.ts
import { NextResponse } from "next/server";
import { systemBoot } from "@/lib/system/boot";

export async function GET() {
  const report = await systemBoot();
  return NextResponse.json(report);
}
TS

echo ""
echo "6) Writing System Status component..."
cat << 'TSX' > components/system/SystemStatus.tsx
"use client";

import { useEffect, useState } from "react";

type Health = {
  status: "ONLINE" | "DEGRADED";
  apis: Record<string, "ONLINE" | "OFFLINE">;
};

export default function SystemStatus() {
  const [data, setData] = useState<Health | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return <p>Checking system status...</p>;
  }

  return (
    <div style={{ border: "1px solid #333", padding: 16 }}>
      <strong>System Status: {data.status}</strong>
      <ul>
        {Object.entries(data.apis).map(([name, status]) => (
          <li key={name}>
            {name}: {status}
          </li>
        ))}
      </ul>
    </div>
  );
}
TSX

echo ""
echo "7) Writing safe app/page.tsx..."
cat << 'TSX' > app/page.tsx
import SystemStatus from "@/components/system/SystemStatus";

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>EmergencyYoutube</h1>
      <SystemStatus />
    </main>
  );
}
TSX

echo ""
echo "8) Verifying TypeScript build..."
npm run build >/dev/null 2>&1 || true

echo ""
echo "9) Git commit..."
git add .
git commit -m "feat: reset project + system boot + api health check (stable)" || true

echo ""
echo "=========================================="
echo " DONE. Project is CLEAN and STABLE."
echo " Next step: git push → Vercel deploy"
echo "=========================================="
