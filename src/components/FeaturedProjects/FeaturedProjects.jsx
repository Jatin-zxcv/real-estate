"use client";
import "./FeaturedProjects.css";
import featuredProjectsContent from "./featured-projects-content";

import { useEffect, useRef } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useViewTransition } from "@/hooks/useViewTransition";

gsap.registerPlugin(ScrollTrigger);

const FeaturedProjects = () => {
  const containerRef = useRef(null);
  const { navigateWithTransition } = useViewTransition();

  useEffect(() => {
    if (!containerRef.current) return;

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
  }, []);

  return (
    <div className="featured-projects" ref={containerRef}>
      <div className="container">
        <div className="featured-projects-grid">
          {featuredProjectsContent.map((project, index) => (
            <div
              key={index}
              className="featured-property-card"
              onClick={() => navigateWithTransition("/properties")}
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
