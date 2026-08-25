import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "./neural-arcade/components/ServiceWorkerRegister";
import { getSiteUrl } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Neural Arcade · Aprende IA jugando",
    template: "%s · Neural Arcade",
  },
  description:
    "Aprende inteligencia artificial desde cero en 26 niveles interactivos, desde matemáticas y redes neuronales hasta agentes, MCP y seguridad.",
  applicationName: "Neural Arcade",
  category: "education",
  keywords: [
    "Neural Arcade",
    "inteligencia artificial",
    "aprender IA",
    "curso de IA",
    "juego educativo",
    "redes neuronales",
    "transformers",
    "LLM",
    "RAG",
    "agentes de IA",
    "MCP",
  ],
  authors: [{ name: "Ozkar K. Azares" }],
  creator: "Ozkar K. Azares",
  publisher: "Ozkar K. Azares",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  openGraph: {
    title: "Neural Arcade · Aprende IA jugando",
    description:
      "26 niveles interactivos para aprender IA desde cero: teoría, demos, práctica, retos y maestría.",
    siteName: "Neural Arcade",
    type: "website",
    locale: "es_MX",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Neural Arcade" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neural Arcade · Aprende IA jugando",
    description: "26 niveles interactivos para aprender inteligencia artificial desde cero.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Neural Arcade",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  description:
    "Juego educativo con 26 niveles interactivos para aprender inteligencia artificial desde cero.",
  author: {
    "@type": "Person",
    name: "Ozkar K. Azares",
  },
  inLanguage: "es",
  isAccessibleForFree: true,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0d0518" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
