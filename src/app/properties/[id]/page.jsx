import "./property-details.css";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/data/properties";
import PropertyDetailsClient from "./PropertyDetailsClient";
import { resolveMediaUrl } from "@/lib/site";

export const dynamicParams = true;

function summarizeText(text, maxLength = 160) {
  const compactText = String(text || "").replace(/\s+/g, " ").trim();

  if (compactText.length <= maxLength) {
    return compactText;
  }

  return `${compactText.slice(0, maxLength - 1).trimEnd()}...`;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) {
    return {
      title: "Property Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const localizedTitle = property.city && !property.title.toLowerCase().includes(property.city.toLowerCase())
    ? `${property.title} in ${property.city}`
    : property.title;
  const description = summarizeText(property.shortDescription || property.description);
  const image = resolveMediaUrl(property.thumbnail || property.images?.[0]);

  return {
    title: localizedTitle,
    description,
    keywords: [
      property.category,
      property.subcategory,
      property.city,
      "Hisar properties",
      "Sharma Real Estates",
    ].filter(Boolean),
    alternates: {
      canonical: `/properties/${id}`,
    },
    authors: [{ name: "Sharma Real Estates" }],
    creator: "Sharma Real Estates",
    publisher: "Sharma Real Estates",
    openGraph: {
      title: `${localizedTitle} | Sharma Real Estates`,
      description,
      url: `/properties/${id}`,
      siteName: "Sharma Real Estates",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${localizedTitle} | Sharma Real Estates`,
      description,
      images: [image],
    },
  };
}

const PropertyDetailsPage = async ({ params }) => {
  const { id } = await params;
  
  const property = await prisma.property.findUnique({
    where: { id }
  });

  if (!property) {
    notFound();
  }

  // Format the property to match what the client component expects
  const formattedProperty = {
    ...property,
    priceFormatted: formatPrice(Number(property.price), property.category === "RENTAL"),
    areaFormatted: property.category === "LAND" ? `${property.area} Acres/Sq.yd` : `${property.area} sq.ft`
  };

  const nextProperty = await prisma.property.findFirst({
    where: {
      featured: true,
      id: { not: property.id }
    }
  });

  return <PropertyDetailsClient property={formattedProperty} nextProperty={nextProperty} />;
};

export default PropertyDetailsPage;
