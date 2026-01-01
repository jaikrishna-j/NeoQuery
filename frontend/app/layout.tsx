import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeoQuery - AI-Powered RAG Chatbot",
  description: "Intelligent question-answering powered by RAG and OpenAI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body 
        className={`${inter.variable} antialiased min-h-screen bg-[#0a0a0a] text-[#e5e5e5]`}
        suppressHydrationWarning
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
