import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

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
  themeColor: "#0A0B0D",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-carbon text-pearl">
        {/* Subtle radial highlight top */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 bg-radial-subtle"
        />
        {/* Amber pool bottom-right */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 bg-radial-amber"
        />
        {/* Grain texture overlay */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 bg-grain opacity-[0.035] mix-blend-overlay"
        />

        <div className="relative z-0 flex flex-col min-h-full">{children}</div>
      </body>
    </html>
  );
}
