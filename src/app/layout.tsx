import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/themes/theme-provider";

const siteUrl = "https://subhams.site";

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
  authors: [{ name: "Subham Kumar", url: siteUrl }],
  creator: "Subham Kumar",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Subham Kumar",
    description:
      "Explore the portfolio of Subham Kumar – showcasing web apps, open source projects, and technical writing.",
    url: siteUrl,
    siteName: "Subham Kumar",
    images: [
      {
        url: "/og-image.jpg",
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
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Subham Kumar",
    url: siteUrl,
    jobTitle: "Full Stack Developer",
    email: "mailto:shubhamkr354@gmail.com",
    sameAs: [
      "https://github.com/DigitalSubham",
      "https://www.linkedin.com/in/subham-kr/",
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "React Native",
      "Node.js",
      "TypeScript",
      "Full Stack Development",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Subham Kumar",
    url: siteUrl,
    description:
      "Portfolio of Subham Kumar, a full-stack developer building React, Next.js, React Native, and Node.js applications.",
    inLanguage: "en",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
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
