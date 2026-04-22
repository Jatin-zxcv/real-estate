"use client";

import { useRef, useState } from "react";

import Nav from "@/components/Nav/Nav";
import ConditionalFooter from "@/components/ConditionalFooter/ConditionalFooter";
import CTAWindow from "@/components/CTAWindow/CTAWindow";
import Copy from "@/components/Copy/Copy";
import AnimatedButton from "@/components/AnimatedButton/AnimatedButton";

const PropertyDetailsClient = ({ property, nextProperty }) => {
  const [activeImage, setActiveImage] = useState(0);
  const touchStartXRef = useRef(0);
  const touchCurrentXRef = useRef(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubmitError("");
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          propertyId: property?.id,
          source: "PROPERTY_DETAIL",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Unable to submit inquiry right now.");
      }

      setFormSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);
    } catch (error) {
      setSubmitError(error?.message || "Unable to submit inquiry right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGalleryTouchStart = (e) => {
    const startX = e.touches[0]?.clientX || 0;
    touchStartXRef.current = startX;
    touchCurrentXRef.current = startX;
  };

  const handleGalleryTouchMove = (e) => {
    touchCurrentXRef.current = e.touches[0]?.clientX || touchCurrentXRef.current;
  };

  const handleGalleryTouchEnd = () => {
    const swipeDistance = touchStartXRef.current - touchCurrentXRef.current;
    const minimumSwipeDistance = 35;

    if (Math.abs(swipeDistance) < minimumSwipeDistance) return;

    if (swipeDistance > 0) {
      setActiveImage((prev) => Math.min(prev + 1, property.images.length - 1));
      return;
    }

    setActiveImage((prev) => Math.max(prev - 1, 0));
  };

  if (!property) {
    return (
      <>
        <Nav />
        <div className="page property-details">
          <section className="property-not-found">
            <div className="container">
              <h2>Property Not Found</h2>
              <p>The property you're looking for doesn't exist or has been removed.</p>
              <AnimatedButton label="View All Properties" route="/properties" />
            </div>
          </section>
        </div>
        <ConditionalFooter />
      </>
    );
  }

  const whatsappHref = `https://wa.me/919306899027?text=${encodeURIComponent(
    `Hi, I'm interested in the property: ${property.title}`
  )}`;

  return (
    <>
      <Nav />
      <div className="page property-details">
        <section className="property-hero">
          {property.images.length > 0 && (
            <div className="property-mobile-gallery">
              <div
                className="property-mobile-gallery-viewport"
                onTouchStart={handleGalleryTouchStart}
                onTouchMove={handleGalleryTouchMove}
                onTouchEnd={handleGalleryTouchEnd}
              >
                <div
                  className="property-mobile-gallery-track"
                  style={{ transform: `translateX(-${activeImage * 100}%)` }}
                >
                  {property.images.map((image, index) => (
                    <div className="property-mobile-gallery-slide" key={index}>
                      <img src={image} alt={`${property.title} - Slide ${index + 1}`} />
                    </div>
                  ))}
                </div>
                {property.images.length > 1 && (
                  <div className="property-mobile-gallery-dots">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`property-gallery-dot ${activeImage === index ? "active" : ""}`}
                        onClick={() => setActiveImage(index)}
                        aria-label={`View image ${index + 1}`}
                      ></button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="property-hero-img">
            <img src={property.images[activeImage]} alt={property.title} />
          </div>
          <div className="property-hero-overlay"></div>
          <div className="container">
            <div className="property-hero-header">
              <Copy delay={1} animateOnScroll={false}>
                <h1>{property.title}</h1>
              </Copy>
            </div>
            <div className="property-content">
              <div className="property-col">
                <Copy delay={1.05} animateOnScroll={false}>
                  <p>{property.address}</p>
                  <p>{property.city}, {property.state}</p>
                </Copy>
              </div>
              <div className="property-col">
                <div className="property-content-wrapper">
                  <Copy delay={1.1} animateOnScroll={false}>
                    <div className="property-price-badge">
                      <h2>{property.priceFormatted}</h2>
                    </div>
                  </Copy>
                </div>
                <div className="property-content-wrapper">
                  <Copy delay={1.15} animateOnScroll={false}>
                    <h3>{property.description}</h3>
                  </Copy>
                </div>
                <div className="property-content-wrapper property-meta">
                  <div className="property-hero-row">
                    <div className="property-hero-sub-col">
                      <Copy delay={0.2}>
                        <p>Category</p>
                        <p>{property.subcategory}</p>
                      </Copy>
                    </div>
                    <div className="property-hero-sub-col">
                      <Copy delay={0.2}>
                        <p>Status</p>
                        <p>{property.status}</p>
                      </Copy>
                    </div>
                  </div>
                </div>
                <div className="property-content-wrapper property-meta">
                  <div className="property-hero-row">
                    <div className="property-hero-sub-col">
                      <Copy delay={0.35}>
                        <p>Area</p>
                        <p>{property.areaFormatted}</p>
                      </Copy>
                    </div>
                    {property.bedrooms && (
                      <div className="property-hero-sub-col">
                        <Copy delay={0.35}>
                          <p>Configuration</p>
                          <p>{property.bedrooms} Bedrooms</p>
                          <p>{property.bathrooms} Bathrooms</p>
                        </Copy>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {property.images.length > 1 && (
          <section className="property-gallery">
            <div className="container">
              <div className="gallery-thumbnails">
                {property.images.map((image, index) => (
                  <div
                    key={index}
                    className={`gallery-thumb ${activeImage === index ? "active" : ""}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={image} alt={`${property.title} - Image ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="property-amenities">
          <div className="container">
            <div className="property-col">
              <Copy delay={0.1}>
                <p>Amenities & Features</p>
              </Copy>
            </div>
            <div className="property-col">
              <div className="amenities-grid">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <Copy delay={0.1 + index * 0.05}>
                      <span className="amenity-check">✓</span>
                      <span>{amenity}</span>
                    </Copy>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="property-inquiry">
          <div className="container">
            <div className="property-col">
              <Copy delay={0.1}>
                <p>Interested?</p>
              </Copy>
            </div>
            <div className="property-col">
              <div className="quick-contact-grid">
                <a href="tel:+919306899027" className="quick-contact-card">
                  <span className="quick-contact-icon">📞</span>
                  <span className="quick-contact-label">Call Now</span>
                  <span className="quick-contact-value">+91 93068 99027</span>
                </a>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="quick-contact-card">
                  <span className="quick-contact-icon">💬</span>
                  <span className="quick-contact-label">WhatsApp</span>
                  <span className="quick-contact-value">Send Message</span>
                </a>
                <a href="mailto:js6071251@gmail.com" className="quick-contact-card">
                  <span className="quick-contact-icon">✉️</span>
                  <span className="quick-contact-label">Email</span>
                  <span className="quick-contact-value">js6071251@gmail.com</span>
                </a>
              </div>

              <div className="inquiry-form-wrapper">
                <Copy delay={0.15}>
                  <h3>Schedule a Visit or Get More Information</h3>
                  <p className="form-subtitle">
                    Fill out the form below and our team will get back to you within 24 hours.
                  </p>
                </Copy>

                {submitError && (
                  <div className="form-success" role="alert">
                    <h4>Submission failed</h4>
                    <p>{submitError}</p>
                  </div>
                )}

                {formSubmitted ? (
                  <div className="form-success">
                    <h4>Thank you for your inquiry!</h4>
                    <p>We've received your message and will contact you shortly.</p>
                  </div>
                ) : (
                  <form className="inquiry-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">Your Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="message">Message (Optional)</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="I'd like to know more about this property..."
                      ></textarea>
                    </div>
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Inquiry"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {nextProperty && (
          <CTAWindow
            img={nextProperty.thumbnail}
            header="Explore More"
            callout={nextProperty.title}
            description={nextProperty.shortDescription}
          />
        )}
      </div>
      <ConditionalFooter />
    </>
  );
};

export default PropertyDetailsClient;
