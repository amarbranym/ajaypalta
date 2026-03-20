import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ajay Palta | HOPE Cycle Thermodynamic Innovation",
  description: "Explore the HOPE (High-efficiency, Optimized-pressure Expansion) cycle. Professional thermodynamic modeling, interactive calculators, and next-generation engine efficiency analysis by Ajay Palta.",
  keywords: ["HOPE Cycle", "Thermodynamics", "Engine Efficiency", "Ajay Palta", "Isothermal Compression", "Steam Assisted Expansion", "Net Zero Energy"],
  authors: [{ name: "Ajay Palta" }],
  openGraph: {
    title: "Ajay Palta | HOPE Cycle Thermodynamic Innovation",
    description: "The future of internal combustion efficiency. Interactive thermodynamic modeling and analysis.",
    url: "https://ajaypalta.com",
    siteName: "Ajay Palta",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ajay Palta | HOPE Cycle Innovation",
    description: "Next-generation thermodynamic cycle analysis and modeling.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
