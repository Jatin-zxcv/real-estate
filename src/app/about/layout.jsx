export const metadata = {
  title: "About Us",
  description:
    "Learn how Sharma Real Estates helps buyers, investors, and businesses find trusted residential, commercial, land, and rental opportunities in Hisar, Haryana.",
  keywords: [
    "Sharma Real Estates",
    "about us",
    "real estate consultant Hisar",
    "property dealer Hisar",
    "real estate company Haryana",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Sharma Real Estates",
    description:
      "Learn how Sharma Real Estates helps buyers, investors, and businesses find trusted residential, commercial, land, and rental opportunities in Hisar, Haryana.",
    url: "/about",
    siteName: "Sharma Real Estates",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/studio/about-hero.png",
        width: 1200,
        height: 900,
        alt: "About Sharma Real Estates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Sharma Real Estates",
    description:
      "Learn how Sharma Real Estates helps buyers, investors, and businesses find trusted residential, commercial, land, and rental opportunities in Hisar, Haryana.",
    images: ["/studio/about-hero.png"],
  },
};

export default function AboutLayout({ children }) {
  return children;
}