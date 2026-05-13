export const metadata = {
  title: "Advice & Insights",
  description:
    "Read real estate advice, market insights, and property guidance for buyers and investors in Hisar, Haryana.",
  keywords: [
    "real estate advice",
    "Hisar property market",
    "property investment tips",
    "Sharma Real Estates",
  ],
  alternates: {
    canonical: "/advice",
  },
  openGraph: {
    title: "Advice & Insights | Sharma Real Estates",
    description:
      "Read real estate advice, market insights, and property guidance for buyers and investors in Hisar, Haryana.",
    url: "/advice",
    siteName: "Sharma Real Estates",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/home/hero.jpg",
        width: 1600,
        height: 900,
        alt: "Sharma Real Estates real estate advice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Advice & Insights | Sharma Real Estates",
    description:
      "Read real estate advice, market insights, and property guidance for buyers and investors in Hisar, Haryana.",
    images: ["/home/hero.jpg"],
  },
};

export default function AdviceLayout({ children }) {
  return children;
}