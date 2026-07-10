import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/themes/theme-provider";
import { getPortfolioData } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  const { site, seo } = await getPortfolioData();

  return {
    title: {
      default: seo.title,
      template: `%s | ${site.name}`,
    },
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: site.name, url: site.siteUrl }],
    creator: site.name,
    metadataBase: new URL(site.siteUrl),
    alternates: {
      canonical: seo.canonicalUrl,
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: site.siteUrl,
      siteName: site.name,
      images: [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: `${site.name} Portfolio`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle,
      description: seo.twitterDescription,
      images: [seo.twitterImage],
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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { site, socials } = await getPortfolioData();
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.siteUrl,
    jobTitle: site.title,
    email: `mailto:${site.email}`,
    sameAs: socials
      .map((item) => item.href)
      .filter((href) => href.startsWith("http")),
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
    name: site.name,
    url: site.siteUrl,
    description: site.defaultDescription,
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
