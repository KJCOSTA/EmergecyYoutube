import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} bg-[#09090b] text-white overflow-hidden`}>
        {/* O Layout aqui garante que o Menu Lateral apareça sempre */}
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
