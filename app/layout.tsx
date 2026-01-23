import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";
import { VercelToolbar } from "@/components/VercelToolbar";
import { getBrandingConfig } from "@/lib/branding";

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
      <body className="font-sans bg-[#09090b] text-white overflow-hidden">
        {/* O Layout aqui garante que o Menu Lateral apareça sempre */}
        <Layout>
          {children}
        </Layout>
        {/* Vercel Toolbar - habilitado em TODOS os ambientes (dev, preview, production) */}
        {/* Permite menções @Claude e comentários visuais em produção */}
        <VercelToolbar />
      </body>
    </html>
  );
}
