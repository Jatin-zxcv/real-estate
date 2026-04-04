import "./property-details.css";
import { notFound } from "next/navigation";

import { getPropertyById, getFeaturedProperties, properties } from "@/data/properties";
import PropertyDetailsClient from "./PropertyDetailsClient";

export function generateStaticParams() {
  return properties.map((property) => ({
    id: property.id
  }));
}

export const dynamicParams = false;

const PropertyDetailsPage = async ({ params }) => {
  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    notFound();
  }

  const featuredProperties = getFeaturedProperties().filter((p) => p.id !== property.id);
  const nextProperty = featuredProperties[0] || null;

  return <PropertyDetailsClient property={property} nextProperty={nextProperty} />;
};

export default PropertyDetailsPage;
