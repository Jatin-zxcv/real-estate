import "./globals.css";
import ClientLayout from "@/client-layout";
import TopBar from "@/components/TopBar/TopBar";
import StructuredData from "@/components/StructuredData";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

const siteDescription =
  "Sharma Real Estates curates verified residential, commercial, land, and rental properties in Hisar, Haryana. Explore premium listings and trusted local guidance.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sharma Real Estates | Premium Properties in Hisar",
    template: "%s | Sharma Real Estates",
  },
  description: siteDescription,
  keywords: [
    "Sharma Real Estates",
    "real estate in Hisar",
    "properties in Hisar",
    "residential properties Hisar",
    "commercial property Hisar",
    "land plots Hisar",
    "rental property Hisar",
    "property consultant Haryana",
    "investment property Hisar",
    "real estate agency Haryana",
  ],
  authors: [{ name: "Sharma Real Estates", url: siteUrl }],
  creator: "Sharma Real Estates",
  publisher: "Sharma Real Estates",
  applicationName: "Sharma Real Estates",
  category: "Real Estate",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sharma Real Estates | Premium Properties in Hisar",
    description: siteDescription,
    url: "/",
    siteName: "Sharma Real Estates",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/home/hero.jpg",
        width: 1600,
        height: 900,
        alt: "Sharma Real Estates premium properties in Hisar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sharma Real Estates | Premium Properties in Hisar",
    description: siteDescription,
    images: ["/home/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logos/terrene-logo-symbol.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/logos/terrene-logo-symbol.png", sizes: "180x180", type: "image/png" }],
  },
  referrer: "origin-when-cross-origin",
  other: {
    "msapplication-TileColor": "#111111",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body>
        <ClientLayout>
          <TopBar />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
