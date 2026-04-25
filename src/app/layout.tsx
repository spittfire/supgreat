import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SUPGREAT — Dein Blut. Dein Protokoll.",
  description:
    "Personalisierte Supplement-Empfehlungen basierend auf deinem Bluttest, deiner Anamnese und deinem Lifestyle.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F1" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0B0D" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="relative min-h-full flex flex-col bg-carbon text-pearl">
        <ThemeProvider>
          {/* Subtle radial highlight top */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 bg-radial-subtle"
          />
          {/* Sage pool bottom-right */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 bg-radial-sage"
          />
          {/* Grain texture overlay */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 bg-grain opacity-[0.035] mix-blend-overlay"
          />

          <div className="relative z-0 flex flex-col min-h-full">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
