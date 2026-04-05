"use client";
import "./Footer.css";

import { useRef } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useViewTransition } from "@/hooks/useViewTransition";
import Copy from "../Copy/Copy";

import { RiInstagramLine } from "react-icons/ri";
import { RiWhatsappLine } from "react-icons/ri";
import { RiPhoneLine } from "react-icons/ri";
import { RiMailLine } from "react-icons/ri";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const { navigateWithTransition } = useViewTransition();
  const socialIconsRef = useRef(null);

  useGSAP(
    () => {
      if (!socialIconsRef.current) return;

      const icons = socialIconsRef.current.querySelectorAll(".icon");
      gsap.set(icons, { opacity: 0, x: -40 });

      ScrollTrigger.create({
        trigger: socialIconsRef.current,
        start: "top 90%",
        once: true,
        animation: gsap.to(icons, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: -0.1,
          ease: "power3.out",
        }),
      });
    },
    { scope: socialIconsRef }
  );

  return (
    <div className="footer">
      <div className="footer-meta">
        <div className="container footer-meta-header">
          <div className="footer-meta-col">
            <div className="footer-meta-block">
              <div className="footer-meta-logo">
                <Copy delay={0.1}>
                  <h3 className="lg">Sharma Real Estates</h3>
                </Copy>
              </div>
              <Copy delay={0.2}>
                <h2>We don't just build properties — we build assets.</h2>
              </Copy>
            </div>
          </div>
          <div className="footer-meta-col">
            <div className="footer-nav-links">
              <Copy delay={0.1}>
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateWithTransition("/");
                  }}
                >
                  <h3>Home</h3>
                </a>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateWithTransition("/about");
                  }}
                >
                  <h3>About Us</h3>
                </a>
                <a
                  href="/properties"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateWithTransition("/properties");
                  }}
                >
                  <h3>Properties</h3>
                </a>
                <a
                  href="/blog"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateWithTransition("/blog");
                  }}
                >
                  <h3>Blog</h3>
                </a>
                <a
                  href="/blueprints"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateWithTransition("/blueprints");
                  }}
                >
                  <h3>Gallery</h3>
                </a>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateWithTransition("/contact");
                  }}
                >
                  <h3>Contact</h3>
                </a>
              </Copy>
            </div>
          </div>
        </div>
        <div className="container footer-socials">
          <div className="footer-meta-col">
            <div className="footer-socials-wrapper" ref={socialIconsRef}>
              <a href="https://instagram.com/sharma_real_estates_hisar" target="_blank" rel="noopener noreferrer" className="icon">
                <RiInstagramLine />
              </a>
              <a href="https://wa.me/919306899027?text=Hi" target="_blank" rel="noopener noreferrer" className="icon">
                <RiWhatsappLine />
              </a>
              <a href="tel:+919306899027" className="icon">
                <RiPhoneLine />
              </a>
              <a href="mailto:js6071251@gmail.com" className="icon">
                <RiMailLine />
              </a>
            </div>
          </div>
          <div className="footer-meta-col">
            <Copy delay={0.1}>
              <p>
                Your trusted partner for premium properties in Hisar. 
                15+ years of excellence in real estate.
              </p>
            </Copy>
          </div>
        </div>
      </div>
      <div className="footer-outro">
        <div className="container">
          <div className="footer-copyright">
            <p>
              Hisar, Haryana — <span>125001</span>
            </p>
            <p>+91 93068 99027</p>
            <p>All rights reserved &copy; 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
