import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";

export const metadata: Metadata = {
  title: "Emergency YouTube",
  description: "AI Video Production Workflow",
};

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
      </body>
    </html>
  );
}
