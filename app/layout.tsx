import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { NexusProvider } from "@/context/nexus-context";
import { SessionProvider } from "@/components/providers/session-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { JsonLd } from "@/components/seo/json-ld";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ainexus.platform.io'),
  title: {
    default: "AI Nexus — Enterprise AI Knowledge, Real-World Challenges & Placement Platform",
    template: "%s | AI Nexus Hub"
  },
  description:
    "Production-grade AI Knowledge Hub. Solve 10 innovative Agriculture AI challenges, FinTech cyber defense, VTU old question papers with step-by-step calculus derivations, 0-4y interview preparation, and earn ISO 17024 verified industry certificates.",
  keywords: [
    "AI Nexus",
    "Artificial Intelligence Platform",
    "Machine Learning Engineering",
    "Deep Learning Architecture",
    "Agriculture AI Models",
    "AI for Farmers",
    "Crop Leaf Disease AI",
    "Precision Irrigation AI",
    "Cybersecurity AI Defense",
    "LLM Red Teaming",
    "VTU Question Papers AI ML",
    "VTU Solved Model Papers",
    "AI Interview Preparation 0-4 Years",
    "System Design for AI",
    "Open Badges 3.0",
    "ISO 17024 Certified AI Engineer",
    "Next.js AI Web Application",
    "PyTorch",
    "ONNX Runtime"
  ],
  authors: [{ name: "AI Nexus Engineering & Research Labs" }],
  creator: "AI Nexus Hub",
  publisher: "AI Nexus Education Consortium",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ainexus.platform.io",
    siteName: "AI Nexus Hub",
    title: "AI Nexus — Enterprise AI Knowledge, Real-World Challenges & Placement Platform",
    description:
      "Solve 10 innovative Agriculture AI challenges, FinTech cyber defense, VTU old papers with derivations, and AI interview simulators.",
    images: [
      {
        url: "/robot-3d.png",
        width: 1200,
        height: 630,
        alt: "AI Nexus Hub — Intelligence. Amplified."
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Nexus — Enterprise AI Knowledge & Real-World Challenges",
    description:
      "Production-grade AI engineering, 10 Agriculture AI solutions, Cybersecurity defense, and VTU step-by-step derivations.",
    images: ["/robot-3d.png"],
    creator: "@ainexus_ai"
  },
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/robot-3d.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full dark`}
      style={{ colorScheme: 'dark' }}
      suppressHydrationWarning
    >
      <head>
        <JsonLd />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-purple-500/30 selection:text-purple-200`}>
        <SessionProvider>
          <QueryProvider>
            <NexusProvider>
              {children}
            </NexusProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
