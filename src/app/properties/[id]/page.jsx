import "./property-details.css";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/data/properties";
import PropertyDetailsClient from "./PropertyDetailsClient";

export const dynamicParams = true;

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
