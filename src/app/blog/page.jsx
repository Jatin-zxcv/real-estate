"use client";
import "./blog.css";
import { blogPosts, getBlogCategories } from "@/data/blog";
import { useState, useRef, useEffect } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Nav from "@/components/Nav/Nav";
import ConditionalFooter from "@/components/ConditionalFooter/ConditionalFooter";
import Copy from "@/components/Copy/Copy";
import { useViewTransition } from "@/hooks/useViewTransition";

gsap.registerPlugin(ScrollTrigger);

const BlogPage = () => {
  const blogRef = useRef(null);
  const scrollTriggerInstances = useRef([]);
  const { navigateWithTransition } = useViewTransition();
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  
  const categories = ["All", ...getBlogCategories()];

  const cleanupScrollTriggers = () => {
    scrollTriggerInstances.current.forEach((instance) => {
      if (instance) instance.kill();
    });
    scrollTriggerInstances.current = [];
  };

  const setupAnimations = () => {
    cleanupScrollTriggers();

    if (!blogRef.current) return;

    const posts = blogRef.current.querySelectorAll(".blog-card");
    if (posts.length === 0) return;

    posts.forEach((post, index) => {
      gsap.set(post, {
        opacity: 0,
        y: 80,
      });

      if (index < 3) {
        gsap.to(post, {
          duration: 0.75,
          y: 0,
          opacity: 1,
          ease: "power3.out",
          delay: 1.2 + (index * 0.1),
        });
      } else {
        const trigger = ScrollTrigger.create({
          trigger: post,
          start: "top 95%",
          onEnter: () => {
            gsap.to(post, {
              duration: 0.75,
              y: 0,
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
    if (activeCategory === "All") {
      setFilteredPosts(blogPosts);
    } else {
      setFilteredPosts(blogPosts.filter(p => p.category === activeCategory));
    }
  }, [activeCategory]);

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
  }, [filteredPosts]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  return (
    <>
      <Nav />
      <div className="page blog">
        <section className="blog-header">
          <div className="container">
            <div className="blog-col"></div>
            <div className="blog-col">
              <Copy delay={1}>
                <h1>Insights & Updates</h1>
              </Copy>
              <Copy delay={1.05}>
                <p className="blog-tagline">
                  Real estate tips, market insights, and guides to help you make informed decisions
                </p>
              </Copy>
              <div className="blog-filters">
                {categories.map((category, index) => (
                  <div 
                    key={category}
                    className={`filter ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <Copy delay={1 + (index * 0.1)}>
                      <p className="lg">{category}</p>
                    </Copy>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="blog-list">
          <div className="container" ref={blogRef}>
            {filteredPosts.length === 0 ? (
              <div className="no-posts">
                <h3>No articles found in this category</h3>
                <p>Try selecting a different category or check back later</p>
              </div>
            ) : (
              <div className="blog-grid">
                {filteredPosts.map((post) => (
                  <a
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="blog-card"
                    onClick={(e) => {
                      e.preventDefault();
                      // For now, blog detail pages aren't implemented
                      // navigateWithTransition(`/blog/${post.slug}`);
                    }}
                  >
                    <div className="blog-img">
                      <img src={post.thumbnail} alt={post.title} />
                      <div className="blog-category-badge">
                        {post.category}
                      </div>
                    </div>
                    <div className="blog-info">
                      <div className="blog-meta">
                        <span className="blog-date">{post.publishedAt}</span>
                        <span className="blog-divider">•</span>
                        <span className="blog-read-time">{post.readTime}</span>
                      </div>
                      <h3 className="blog-title">{post.title}</h3>
                      <p className="blog-excerpt">{post.excerpt}</p>
                      <div className="blog-author">
                        <span>By {post.author}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
        
        <section className="blog-cta">
          <div className="container">
            <div className="blog-cta-content">
              <Copy delay={0.1}>
                <h2>Have Questions About Real Estate?</h2>
                <p>
                  Our team is here to help you navigate the property market. 
                  Reach out for personalized guidance on buying, selling, or investing.
                </p>
              </Copy>
              <a href="/contact" className="blog-cta-btn">
                Get in Touch
              </a>
            </div>
          </div>
        </section>
      </div>
      <ConditionalFooter />
    </>
  );
};

export default BlogPage;
