import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Mi Blog Personal",
    template: "%s | Mi Blog Personal",
  },
  description:
    "Un blog personal moderno y profesional sobre tecnología, desarrollo y más.",
  keywords: [
    "blog",
    "tecnología",
    "desarrollo",
    "programación",
    "web development",
    "javascript",
    "react",
    "nextjs",
  ],
  authors: [
    {
      name: "Tu Nombre",
      url: "https://tu-dominio.com",
    },
  ],
  creator: "Tu Nombre",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "Mi Blog Personal",
    description:
      "Un blog personal moderno y profesional sobre tecnología, desarrollo y más.",
    siteName: "Mi Blog Personal",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mi Blog Personal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mi Blog Personal",
    description:
      "Un blog personal moderno y profesional sobre tecnología, desarrollo y más.",
    images: ["/og-image.jpg"],
    creator: "@tu_usuario",
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
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
    languages: {
      "es-ES": "/es",
      "en-US": "/en",
    },
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-site-verification-code",
  },
  category: "technology",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
