import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themes/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Update this with your actual details
export const metadata: Metadata = {
  title: {
    default: "Subham Kumar",
    template: "%s | Subham Kumar",
  },
  description:
    "Portfolio of Subham Kumar – Full-stack Developer passionate about building scalable web applications and delightful user experiences.",
  keywords: [
    "Subham Kumar",
    "Web Developer",
    "Frontend Engineer",
    "Full Stack Developer",
    "React Developer",
    "Next.js Portfolio",
  ],
  authors: [{ name: "Subham Kumar", url: "https://subhamkumar.dev" }],
  creator: "Subham Kumar",
  metadataBase: new URL("https://subhamkumar.dev"),
  openGraph: {
    title: "Subham Kumar",
    description:
      "Explore the portfolio of Subham Kumar – showcasing web apps, open source projects, and technical writing.",
    url: "https://subhamkumar.dev",
    siteName: "Subham Kumar",
    images: [
      {
        url: "/og-image.jpg", // Put this in your public directory
        width: 1200,
        height: 630,
        alt: "Subham Kumar Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Subham Kumar",
    description:
      "Full-stack Developer portfolio with projects in React, Next.js, and more.",
    creator: "@yourTwitterHandle", // replace with your actual Twitter handle
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
