"use client";
import "./about.css";

import Nav from "@/components/Nav/Nav";
import ConditionalFooter from "@/components/ConditionalFooter/ConditionalFooter";
import HowWeWork from "@/components/HowWeWork/HowWeWork";
import Spotlight from "@/components/Spotlight/Spotlight";
import CTAWindow from "@/components/CTAWindow/CTAWindow";
import Copy from "@/components/Copy/Copy";

const AboutPage = () => {
  return (
    <>
      <Nav />
      <div className="page about">
        <section className="about-hero">
          <div className="container">
            <div className="about-hero-col">
              <Copy delay={0.85}>
                <p>
                  We see real estate as more than transactions. It's about 
                  understanding dreams, building trust, and creating lasting 
                  value for families and investors alike.
                </p>
              </Copy>
            </div>
            <div className="about-hero-col">
              <Copy delay={0.85}>
                <h2>
                  Sharma Real Estates exists to connect you with properties 
                  that feel right — spaces where life unfolds, businesses 
                  thrive, and investments grow.
                </h2>
              </Copy>
              <div className="about-hero-hero-img">
                <img src="/studio/about-hero.png" alt="About Sharma Real Estates" />
              </div>
            </div>
          </div>
        </section>
        <section className="more-facts">
          <div className="container">
            <div className="more-facts-items">
              <div className="fact">
                <Copy delay={0.1}>
                  <p>Properties Sold</p>
                  <h2>500+</h2>
                </Copy>
              </div>
              <div className="fact">
                <Copy delay={0.2}>
                  <p>Happy Families</p>
                  <h2>350+</h2>
                </Copy>
              </div>
              <div className="fact">
                <Copy delay={0.3}>
                  <p>Years Experience</p>
                  <h2>20+</h2>
                </Copy>
              </div>
              <div className="fact">
                <Copy delay={0.4}>
                  <p>Active Listings</p>
                  <h2>100+</h2>
                </Copy>
              </div>
              <div className="fact">
                <Copy delay={0.5}>
                  <p>Client Satisfaction</p>
                  <h2>98%</h2>
                </Copy>
              </div>
            </div>
          </div>
        </section>
        <section className="our-story">
          <div className="container">
            <div className="our-story-content">
              <div className="our-story-header">
                <Copy delay={0.1}>
                  <h3>Our Story</h3>
                </Copy>
              </div>
              <div className="our-story-body">
                <Copy delay={0.15}>
                  <p className="lg">
                    Founded in Hisar over 20 years ago, Sharma Real Estates 
                    began with a simple belief: everyone deserves a trustworthy 
                    partner in their property journey. What started as a small 
                    family business has grown into one of Hisar's most respected 
                    real estate consultancies.
                  </p>
                </Copy>
                <Copy delay={0.2}>
                  <p>
                    Today, we specialize in residential, commercial, land, and 
                    rental properties across Hisar and surrounding areas. Our 
                    team personally verifies every listing, ensuring you see 
                    only genuine opportunities that match your requirements.
                  </p>
                </Copy>
                <Copy delay={0.25}>
                  <p>
                    We don't just help you find properties — we guide you 
                    through the entire process, from site visits to documentation, 
                    making your real estate experience seamless and stress-free.
                  </p>
                </Copy>
              </div>
            </div>
          </div>
        </section>
        <section className="our-values">
          <div className="container">
            <div className="our-values-header">
              <Copy delay={0.1}>
                <h3>Our Values</h3>
              </Copy>
            </div>
            <div className="our-values-grid">
              <div className="value-card">
                <Copy delay={0.15}>
                  <h4>Trust First</h4>
                  <p>
                    Transparency in pricing, honest assessments, and no hidden 
                    surprises. Your trust is our foundation.
                  </p>
                </Copy>
              </div>
              <div className="value-card">
                <Copy delay={0.2}>
                  <h4>Local Expertise</h4>
                  <p>
                    Deep knowledge of Hisar's neighborhoods, market trends, and 
                    upcoming developments guides every recommendation.
                  </p>
                </Copy>
              </div>
              <div className="value-card">
                <Copy delay={0.25}>
                  <h4>Client Focus</h4>
                  <p>
                    Your needs come first. We listen, understand, and only 
                    show properties that truly match your requirements.
                  </p>
                </Copy>
              </div>
              <div className="value-card">
                <Copy delay={0.3}>
                  <h4>Long-term Thinking</h4>
                  <p>
                    We help you see beyond today — considering future value, 
                    development potential, and investment returns.
                  </p>
                </Copy>
              </div>
            </div>
          </div>
        </section>
        <section className="how-we-work-container">
          <div className="container">
            <HowWeWork />
          </div>
        </section>
        <CTAWindow
          img="/studio/about-cta-window.jpg"
          header="Ready to find your property?"
          callout="Let's start your journey"
          description="Whether you're looking for your dream home, a commercial space, or an investment opportunity — we're here to help you find the perfect property."
        />
        {/* <Spotlight /> */}
      </div>
      <ConditionalFooter />
    </>
  );
};

export default AboutPage;
