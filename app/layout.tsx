import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SkillProvider } from "@/context/SkillContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillForge AI — Holistic Skill Development Platform",
  description:
    "AI-powered platform for coding practice, aptitude training, and communication skill evaluation. Build your career-ready skills with personalized AI feedback.",
  keywords: ["AI", "coding practice", "aptitude training", "communication skills", "skill development"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-gray-100 min-h-screen`}>
        <SkillProvider>{children}</SkillProvider>
      </body>
    </html>
  );
}
