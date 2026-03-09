import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, DM_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-outfit",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: "SnapStylo — The Elite AI Photo Studio | FLUX 1.1 Powered",
  description: "Transform your portraits into cinematic masterpieces with SnapStylo. The world's most advanced AI photo studio powered by FLUX 1.1 Pro for surgical precision and high-fidelity artistic styles.",
  keywords: ["AI photo studio", "AI portrait generator", "FLUX 1.1 Pro", "AI outpainting", "AI inpainting", "cinematic AI photography", "professional AI editor"],
  authors: [{ name: "SnapStylo Atelier" }],
  creator: "SnapStylo",
  metadataBase: new URL("https://snapstylo.com"), // Replace with actual domain when live
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SnapStylo — The Elite AI Photo Studio",
    description: "Professional-grade AI transformations in seconds. Powered by FLUX 1.1 Pro.",
    url: "https://snapstylo.com",
    siteName: "SnapStylo",
    images: [
      {
        url: "/images/style_crimson_noir.png",
        width: 1200,
        height: 630,
        alt: "SnapStylo AI Studio Showcase",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapStylo — The Elite AI Photo Studio",
    description: "Transform portraits into cinematic statements with FLUX 1.1 Pro.",
    images: ["/images/style_crimson_noir.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${outfit.variable} ${dmMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
