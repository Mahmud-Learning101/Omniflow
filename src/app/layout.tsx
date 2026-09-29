import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sansFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OmniFlow // Autonomous AI Workflow & Pipeline Orchestration Laboratory",
  description: "Next-generation operational AI orchestration kernel and real-time state mesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sansFont.variable} ${monoFont.variable}`}>
      <body className="bg-obsidian text-neutral-100 antialiased min-h-screen selection:bg-racing-lime selection:text-obsidian">
        {children}
      </body>
    </html>
  );
}
