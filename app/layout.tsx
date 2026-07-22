import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/providers/AppShell";

/**
 * Primary grotesk (Neue Haas Grotesk stand-in → Inter) and a display serif
 * (Ogg / PP Editorial stand-in → Playfair Display). Both are exposed as CSS
 * variables consumed by the design system in globals.css.
 */
const inter = Inter({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arch Tech — Architecture, Interiors & Collectible Furniture",
  description:
    "Arch Tech is an award-driven studio shaping architecture, interior direction and collectible furniture. Explore selected works and configure furniture in real time.",
  openGraph: {
    title: "Arch Tech",
    description:
      "Architecture, interior direction and collectible furniture — with a live 3D configurator.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--text-primary)]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
