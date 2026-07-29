import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HoldVera | Trust. Secure. Delivered.",
  description: "HoldVera is a global escrow company built on trust, security, and transparency. We protect buyers and sellers by holding funds securely and releasing them only when all conditions are met.",
  keywords: ["escrow", "secure transactions", "buyer protection", "seller protection", "global escrow", "HoldVera"],
  authors: [{ name: "HoldVera" }],
  openGraph: {
    title: "HoldVera | Trust. Secure. Delivered.",
    description: "Global escrow solutions for a safer tomorrow. Bank-level security and advanced fraud protection.",
    url: "https://holdvera.site",
    siteName: "HoldVera",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HoldVera | Trust. Secure. Delivered.",
    description: "Global escrow solutions for a safer tomorrow.",
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/images/logo.png" type="image/png" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
      </head>
      <body className="min-h-full flex flex-col bg-cream">{children}</body>
    </html>
  );
}
