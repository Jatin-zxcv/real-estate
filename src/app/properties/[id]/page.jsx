"use client";
import "./property-details.css";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import { getPropertyById, getFeaturedProperties } from "@/data/properties";

import Nav from "@/components/Nav/Nav";
import ConditionalFooter from "@/components/ConditionalFooter/ConditionalFooter";
import CTAWindow from "@/components/CTAWindow/CTAWindow";
import Copy from "@/components/Copy/Copy";
import AnimatedButton from "@/components/AnimatedButton/AnimatedButton";

const PropertyDetailsPage = () => {
  const params = useParams();
  const [property, setProperty] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (params?.id) {
      const foundProperty = getPropertyById(params.id);
      setProperty(foundProperty);
    }
  }, [params]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would send to an API
    console.log("Inquiry submitted:", { ...formData, propertyId: property?.id });
    setFormSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 3000);
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

  const featuredProperties = getFeaturedProperties().filter(p => p.id !== property.id);
  const nextProperty = featuredProperties[0];

  return (
    <>
      <Nav />
      <div className="page property-details">
        <section className="property-hero">
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

        {/* Image Gallery */}
        {property.images.length > 1 && (
          <section className="property-gallery">
            <div className="container">
              <div className="gallery-thumbnails">
                {property.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`gallery-thumb ${activeImage === index ? 'active' : ''}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={image} alt={`${property.title} - Image ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Amenities Section */}
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
                    <Copy delay={0.1 + (index * 0.05)}>
                      <span className="amenity-check">✓</span>
                      <span>{amenity}</span>
                    </Copy>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Inquiry Form */}
        <section className="property-inquiry">
          <div className="container">
            <div className="property-col">
              <Copy delay={0.1}>
                <p>Interested?</p>
              </Copy>
            </div>
            <div className="property-col">
              <div className="inquiry-form-wrapper">
                <Copy delay={0.15}>
                  <h3>Schedule a Visit or Get More Information</h3>
                  <p className="form-subtitle">
                    Fill out the form below and our team will get back to you within 24 hours.
                  </p>
                </Copy>
                
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
                    <button type="submit" className="submit-btn">
                      Send Inquiry
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Quick Actions */}
        <section className="property-quick-contact">
          <div className="container">
            <div className="quick-contact-grid">
              <a href="tel:+919306899027" className="quick-contact-card">
                <span className="quick-contact-icon">📞</span>
                <span className="quick-contact-label">Call Now</span>
                <span className="quick-contact-value">+91 93068 99027</span>
              </a>
              <a href="https://wa.me/919306899027?text=Hi, I'm interested in the property: ${property.title}" target="_blank" rel="noopener noreferrer" className="quick-contact-card">
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

export default PropertyDetailsPage;
