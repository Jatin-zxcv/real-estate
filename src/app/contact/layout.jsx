export const metadata = {
  title: "Contact Us",
  description:
    "Contact Sharma Real Estates for verified property listings, site visits, and consultation in Hisar, Haryana.",
  keywords: [
    "contact Sharma Real Estates",
    "property inquiry Hisar",
    "real estate contact Haryana",
    "site visit Hisar",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Sharma Real Estates",
    description:
      "Contact Sharma Real Estates for verified property listings, site visits, and consultation in Hisar, Haryana.",
    url: "/contact",
    siteName: "Sharma Real Estates",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/contact/contact-img.jpg",
        width: 1200,
        height: 900,
        alt: "Contact Sharma Real Estates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Sharma Real Estates",
    description:
      "Contact Sharma Real Estates for verified property listings, site visits, and consultation in Hisar, Haryana.",
    images: ["/contact/contact-img.jpg"],
  },
};

export default function ContactLayout({ children }) {
  return children;
}