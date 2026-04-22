"use client";
import "./properties.css";
import { categories, formatPrice } from "@/data/properties";
import { useState, useRef, useEffect } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Nav from "@/components/Nav/Nav";
import ConditionalFooter from "@/components/ConditionalFooter/ConditionalFooter";
import Copy from "@/components/Copy/Copy";
import { useViewTransition } from "@/hooks/useViewTransition";

gsap.registerPlugin(ScrollTrigger);

const PropertiesPage = () => {
  const propertiesRef = useRef(null);
  const scrollTriggerInstances = useRef([]);
  const { navigateWithTransition } = useViewTransition();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("/api/properties?limit=100");
        const json = await res.json();
        if (json.success) {
          const formatted = json.data.items.map(p => ({
            ...p,
            priceFormatted: formatPrice(Number(p.price), p.category === "RENTAL"),
            areaFormatted: p.category === "LAND" ? `${p.area} Acres/Sq.yd` : `${p.area} sq.ft`
          }));
          setAllProperties(formatted);
          if (activeCategory === "ALL") {
            setFilteredProperties(formatted);
          } else {
            setFilteredProperties(formatted.filter(item => item.category === activeCategory));
          }
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, []);

  const cleanupScrollTriggers = () => {
    scrollTriggerInstances.current.forEach((instance) => {
      if (instance) instance.kill();
    });
    scrollTriggerInstances.current = [];
  };

  const setupAnimations = () => {
    cleanupScrollTriggers();

    if (!propertiesRef.current) return;

    const propertyCards = propertiesRef.current.querySelectorAll(".property-card");
    if (propertyCards.length === 0) return;

    propertyCards.forEach((card, index) => {
      gsap.set(card, {
        opacity: 0,
        scale: 0.75,
        y: 150,
      });

      if (index === 0) {
        gsap.to(card, {
          duration: 0.75,
          y: 0,
          scale: 1,
          opacity: 1,
          ease: "power3.out",
          delay: 1.4,
        });
      } else {
        const trigger = ScrollTrigger.create({
          trigger: card,
          start: "top 100%",
          onEnter: () => {
            gsap.to(card, {
              duration: 0.75,
              y: 0,
              scale: 1,
              opacity: 1,
              ease: "power3.out",
            });
          },
        });

        scrollTriggerInstances.current.push(trigger);
      }
    });

    ScrollTrigger.refresh();
  };

  useEffect(() => {
    if (activeCategory === "ALL") {
      setFilteredProperties(allProperties);
    } else {
      setFilteredProperties(allProperties.filter(p => p.category === activeCategory));
    }
  }, [activeCategory, allProperties]);

  useEffect(() => {
    setupAnimations();

    const handleResize = () => {
      setupAnimations();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cleanupScrollTriggers();
    };
  }, [filteredProperties]);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
  };

  return (
    <>
      <Nav />
      <div className="page properties">
        <section className="properties-header">
          <div className="container">
            <div className="prop-col"></div>
            <div className="prop-col">
              <Copy delay={1}>
                <h1>Our Properties</h1>
              </Copy>
              <Copy delay={1.05}>
                <p className="properties-tagline">
                  Explore our curated collection of premium properties in Hisar
                </p>
              </Copy>
              <div className="prop-filters">
                {categories.map((category, index) => (
                  <div 
                    key={category.id}
                    className={`filter ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <Copy delay={1 + (index * 0.1)}>
                      <p className="lg">
                        <span className="filter-icon">{category.icon}</span> {category.label}
                      </p>
                    </Copy>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="properties-list">
          <div className="container" ref={propertiesRef}>
            {isLoading ? (
              <div className="no-properties">
                <h3>Loading properties...</h3>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="no-properties">
                <h3>No properties found in this category</h3>
                <p>Try selecting a different category or check back later</p>
              </div>
            ) : (
              filteredProperties.map((property) => (
                <a
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="property-card"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateWithTransition(`/properties/${property.id}`);
                  }}
                >
                  <div className="property-img">
                    <img src={property.thumbnail} alt={property.title} />
                    <div className="property-category-badge">
                      {property.subcategory}
                    </div>
                    <div className="property-status-badge">
                      {property.status}
                    </div>
                  </div>
                  <div className="property-info">
                    <div className="prop-info-col">
                      <div className="prop-price">
                        <h3>{property.priceFormatted}</h3>
                      </div>
                    </div>
                    <div className="prop-info-col">
                      <div className="prop-info-sub-col">
                        <div className="prop-name">
                          <h3>{property.title}</h3>
                          <p className="lg">{property.address}, {property.city}</p>
                        </div>
                      </div>
                      <div className="prop-info-sub-col">
                        <div className="prop-specs">
                          <div className="spec">
                            <span className="spec-value">{property.areaFormatted}</span>
                          </div>
                          {property.bedrooms && (
                            <div className="spec">
                              <span className="spec-value">{property.bedrooms} BHK</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        </section>
      </div>
      <ConditionalFooter />
    </>
  );
};

export default PropertiesPage;
