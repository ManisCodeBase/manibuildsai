import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import DigitalTwinButton from "@/components/features/DigitalTwinButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://manibuildsai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mani N | Senior AI Engineer — Advanced RAG, Agentic AI & .NET Azure Systems",
    template: "%s | Mani N · manibuildsai.com",
  },
  description:
    "Manikanta Neerukattu (Mani N) — Senior Software Engineer & Applied AI Engineer with 10 years in the Microsoft ecosystem. Specializes in Advanced RAG pipelines, multi-agent orchestration, Semantic Kernel, and LLM-powered automation. Based in Hyderabad, India.",
  keywords: [
    "AI Engineer",
    "Applied AI Engineer",
    "Advanced RAG",
    "Semantic Kernel",
    "Azure OpenAI",
    "Agentic AI",
    "Multi-Agent Systems",
    "MCP Model Context Protocol",
    "LangGraph",
    "AutoGen",
    ".NET 8 AI",
    "Azure AI Foundry",
    "LLM Engineer",
    "manibuildsai",
    "Manikanta Neerukattu",
  ],
  authors: [{ name: "Manikanta Neerukattu", url: siteUrl }],
  creator: "Manikanta Neerukattu",
  publisher: "Manikanta Neerukattu",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Mani | AI Engineer",
    title: "Mani N | Senior AI Engineer — Advanced RAG, Agentic AI & .NET Azure Systems",
    description:
      "Senior AI Engineer with 10 years building production-grade Advanced RAG, multi-agent systems, and Semantic Kernel solutions at Insightsoftware, Philips, and ADP.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Mani — AI Engineer | manibuildsai.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mani N | Senior AI Engineer — Advanced RAG, Agentic AI & .NET Azure",
    description:
      "10 years building production AI. Advanced RAG, Semantic Kernel, multi-agent systems at Insightsoftware, Philips & ADP.",
    images: [`${siteUrl}/og-image.png`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="noise-overlay">
        <Navbar />
        <main>{children}</main>
        <DigitalTwinButton />
      </body>
    </html>
  );
}
