import { getAbsoluteUrl, getSiteUrl } from "@/lib/site";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Sharma Real Estates",
  url: getSiteUrl(),
  description:
    "Admin-curated residential, commercial, land, and rental properties in Hisar, Haryana.",
  image: getAbsoluteUrl("/home/hero.jpg"),
  logo: getAbsoluteUrl("/logos/terrene-logo.png"),
  telephone: "+919306899027",
  email: "js6071251@gmail.com",
  areaServed: [
    {
      "@type": "AdministrativeArea",
      name: "Hisar, Haryana",
    },
    {
      "@type": "Country",
      name: "India",
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hisar",
    addressRegion: "Haryana",
    addressCountry: "IN",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+919306899027",
      email: "js6071251@gmail.com",
      availableLanguage: ["English", "Hindi"],
      areaServed: "IN",
    },
  ],
  knowsAbout: [
    "Residential properties",
    "Commercial properties",
    "Land plots",
    "Rental properties",
    "Property investment",
  ],
  sameAs: ["https://instagram.com/sharma_real_estates_hisar"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Sharma Real Estates",
  url: getSiteUrl(),
  inLanguage: "en-IN",
};

export default function StructuredData() {
  return (
    <>
      {[organizationSchema, websiteSchema].map((schema) => (
        <script
          key={schema["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}