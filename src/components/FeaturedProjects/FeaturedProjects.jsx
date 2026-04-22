"use client";
import "./FeaturedProjects.css";
import { useState, useEffect, useRef } from "react";
import { formatPrice } from "@/data/properties";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useViewTransition } from "@/hooks/useViewTransition";

gsap.registerPlugin(ScrollTrigger);

const FeaturedProjects = () => {
  const containerRef = useRef(null);
  const { navigateWithTransition } = useViewTransition();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("/api/properties?featured=true&limit=6")
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setProjects(json.data.items.map(p => ({
            id: p.id,
            title: p.title,
            description: p.shortDescription || p.description.substring(0, 100) + '...',
            info: `${p.subcategory || p.category} • ${formatPrice(Number(p.price), p.category === "RENTAL")}`,
            image: p.thumbnail || p.images?.[0] || "/featured-projects/featured-work-1.jpg"
          })));
        }
      })
      .catch(err => console.error("Failed to fetch featured projects:", err));
  }, []);

  useEffect(() => {
    if (!containerRef.current || projects.length === 0) return;

    const cards = containerRef.current.querySelectorAll(".featured-property-card");

    cards.forEach((card, index) => {
      gsap.set(card, {
        opacity: 0,
        y: 60,
      });

      ScrollTrigger.create({
        trigger: card,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: "power3.out",
          });
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [projects]);

  return (
    <div className="featured-projects" ref={containerRef}>
      <div className="container">
        <div className="featured-projects-grid">
          {projects.map((project, index) => (
            <div
              key={project.id || index}
              className="featured-property-card"
              onClick={() => navigateWithTransition(`/properties/${project.id}`)}
            >
              <div className="featured-property-img">
                <img src={project.image} alt={project.title} />
                <div className="featured-property-badge">{project.info}</div>
              </div>
              <div className="featured-property-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProjects;
