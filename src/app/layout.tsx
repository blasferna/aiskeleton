import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skeleton Generator",
  description: "Generate skeletons for your HTML code. Powered by AI.",
  authors: { name: "Blas Isaias Fernández", url: "https://blasferna.com" },
  keywords: ["Skeleton Generator", "AI", "HTML", "Tailwind CSS", "React", "Next.js"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aiskeleton.vercel.app",
    images: [
      {
        url: "https://aiskeleton.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Skeleton Generator",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
