import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";
import { VercelToolbar } from "@/components/VercelToolbar";
import { getBrandingConfig } from "@/lib/branding";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getBrandingConfig();

  return {
    title: branding.systemName,
    description: "AI Video Production Workflow - White Label SaaS Platform",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="font-sans bg-[#09090b] text-white">
        {/* O Layout aqui garante que o Menu Lateral apareça sempre */}
        <Layout>
          {children}
        </Layout>
        {/* Vercel Toolbar - habilitado em TODOS os ambientes (dev, preview, production) */}
        {/* Permite menções @Claude e comentários visuais em produção */}
        <VercelToolbar />
        {/* Vercel Analytics & Speed Insights - Monitoramento profissional */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
