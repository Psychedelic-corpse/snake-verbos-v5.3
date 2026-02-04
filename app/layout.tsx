import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // PREVENTS IOS ZOOM ON INPUT FOCUS
  themeColor: "#164e63", // Matches 'Petróleo' theme
};

export const metadata: Metadata = {
  title: "Conjugando Verbos",
  description: "Juego educativo de español",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Verbos App",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}