export const metadata = {
  title: "Properties in Hisar",
  description:
    "Browse verified residential, commercial, land, and rental properties curated by Sharma Real Estates across Hisar, Haryana.",
  keywords: [
    "properties in Hisar",
    "residential properties Hisar",
    "commercial property Hisar",
    "land plots Hisar",
    "rental property Hisar",
    "Sharma Real Estates",
  ],
  alternates: {
    canonical: "/properties",
  },
  openGraph: {
    title: "Properties in Hisar | Sharma Real Estates",
    description:
      "Browse verified residential, commercial, land, and rental properties curated by Sharma Real Estates across Hisar, Haryana.",
    url: "/properties",
    siteName: "Sharma Real Estates",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/featured-projects/featured-work-1.jpg",
        width: 1200,
        height: 900,
        alt: "Sharma Real Estates properties in Hisar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Properties in Hisar | Sharma Real Estates",
    description:
      "Browse verified residential, commercial, land, and rental properties curated by Sharma Real Estates across Hisar, Haryana.",
    images: ["/featured-projects/featured-work-1.jpg"],
  },
};

export default function PropertiesLayout({ children }) {
  return children;
}