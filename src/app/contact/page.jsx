"use client";
import "./contact.css";
import { useState } from "react";

import Nav from "@/components/Nav/Nav";
import ConditionalFooter from "@/components/ConditionalFooter/ConditionalFooter";
import Copy from "@/components/Copy/Copy";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubmitError("");
    setFormData(prev => ({
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
          source: "CONTACT_FORM",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Unable to submit your message right now.");
      }

      setFormSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);
    } catch (error) {
      setSubmitError(error?.message || "Unable to submit your message right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Nav />
      <div className="page contact">
        <section className="contact-hero">
          <div className="container">
            <div className="contact-col">
              <div className="contact-hero-header">
                <Copy delay={0.85}>
                  <h1>Let's find your perfect property</h1>
                </Copy>
              </div>
              <div className="contact-copy-tagline">
                <Copy delay={0.1}>
                  <p className="lg">
                    Whether you're looking to buy, sell, or invest — we're here to help. 
                    Reach out and let's start the conversation.
                  </p>
                </Copy>
              </div>
            </div>
            <div className="contact-col">
              <div className="contact-info">
                <div className="contact-info-block">
                  <Copy delay={0.85}>
                    <p>Email</p>
                    <a href="mailto:js6071251@gmail.com">js6071251@gmail.com</a>
                  </Copy>
                </div>
                <div className="contact-info-block">
                  <Copy delay={1}>
                    <p>Phone</p>
                    <a href="tel:+919306899027">+91 93068 99027</a>
                  </Copy>
                </div>
                <div className="contact-info-block">
                  <Copy delay={1.15}>
                    <p>WhatsApp</p>
                    <a href="https://wa.me/919306899027?text=Hi" target="_blank" rel="noopener noreferrer">
                      Send us a message
                    </a>
                  </Copy>
                </div>
                <div className="contact-info-block">
                  <Copy delay={1.3}>
                    <p>Office Address</p>
                    <p className="address">Near Bus Stand, Model Town</p>
                    <p className="address">Hisar, Haryana 125001</p>
                  </Copy>
                </div>
                <div className="contact-info-block">
                  <Copy delay={1.45}>
                    <p>Follow Us</p>
                    <a href="https://instagram.com/sharma_real_estates_hisar" target="_blank" rel="noopener noreferrer">
                      Instagram
                    </a>
                  </Copy>
                </div>
              </div>
              <div className="contact-img">
                <img
                  src="/contact/contact-img.jpg"
                  alt="Sharma Real Estates office"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="contact-form-section">
          <div className="container">
            <div className="contact-form-header">
              <Copy delay={0.1}>
                <h2>Send us a Message</h2>
                <p>Fill out the form below and we'll get back to you within 24 hours.</p>
              </Copy>
            </div>

            {submitError && (
              <div className="form-success-message" role="alert">
                <h3>Submission failed</h3>
                <p>{submitError}</p>
              </div>
            )}
            
            {formSubmitted ? (
              <div className="form-success-message">
                <h3>Thank you for reaching out!</h3>
                <p>We've received your message and will contact you shortly.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Your Name *</label>
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
                    <label htmlFor="phone">Phone Number *</label>
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
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
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
                    <label htmlFor="subject">Subject</label>
                    <select 
                      id="subject" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a topic</option>
                      <option value="buying">Looking to Buy Property</option>
                      <option value="selling">Looking to Sell Property</option>
                      <option value="renting">Looking for Rental</option>
                      <option value="investment">Investment Consultation</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>
                </div>
                <div className="form-group full-width">
                  <label htmlFor="message">Your Message *</label>
                  <textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5" 
                    placeholder="Tell us about your requirements, budget, preferred locations, or any questions you have..."
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </section>

        <section className="contact-map-section">
          <div className="container">
            <div className="map-placeholder">
              <div className="map-content">
                <h3>📍 Visit Our Office</h3>
                <p>Near Bus Stand, Model Town, Hisar</p>
                <p>Haryana 125001, India</p>
                <a 
                  href="https://maps.google.com/?q=Model+Town+Hisar+Haryana" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="map-link"
                >
                  Get Directions on Google Maps →
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <ConditionalFooter />
    </>
  );
};

export default ContactPage;
