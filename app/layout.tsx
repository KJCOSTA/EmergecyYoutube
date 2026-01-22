import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emergency YouTube - AI Video Production Studio",
  description: "AI-powered YouTube video production workflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
