"use client";
import "./Nav.css";

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";

import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import SplitText from "gsap/SplitText";
import { useLenis } from "lenis/react";

import MenuBtn from "../MenuBtn/MenuBtn";
import { useViewTransition } from "@/hooks/useViewTransition";

gsap.registerPlugin(SplitText);

const Nav = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const menuRef = useRef(null);
  const isInitializedRef = useRef(false);
  const splitTextRefs = useRef([]);
  const lenis = useLenis();

  const { navigateWithTransition } = useViewTransition();

  useEffect(() => {
    if (lenis) {
      if (isOpen) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  }, [lenis, isOpen]);

  useLayoutEffect(() => {
    gsap.registerPlugin(CustomEase);
    CustomEase.create(
      "hop",
      "M0,0 C0.354,0 0.464,0.133 0.498,0.502 0.532,0.872 0.651,1 1,1"
    );
  }, []);

  useLayoutEffect(() => {
    if (menuRef.current) {
      const menu = menuRef.current;

      splitTextRefs.current.forEach((split) => {
        if (split.revert) split.revert();
      });
      splitTextRefs.current = [];

      gsap.set(menu, {
        clipPath: "circle(0% at 50% 50%)",
      });

      const h2Elements = menu.querySelectorAll("h2");
      const pElements = menu.querySelectorAll("p");

      h2Elements.forEach((h2, index) => {
        const split = SplitText.create(h2, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
        });

        gsap.set(split.lines, { y: "120%" });

        split.lines.forEach((line) => {
          line.style.pointerEvents = "auto";
        });

        splitTextRefs.current.push(split);
      });

      pElements.forEach((p, index) => {
        const split = SplitText.create(p, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
        });

        gsap.set(split.lines, { y: "120%" });

        split.lines.forEach((line) => {
          line.style.pointerEvents = "auto";
        });

        splitTextRefs.current.push(split);
      });

      isInitializedRef.current = true;
    }
  }, []);

  const animateMenu = useCallback((open) => {
    if (!menuRef.current) {
      return;
    }

    const menu = menuRef.current;

    setIsAnimating(true);

    if (open) {
      document.body.classList.add("menu-open");

      gsap.to(menu, {
        clipPath: "circle(100% at 50% 50%)",
        ease: "power3.out",
        duration: 2,
        onStart: () => {
          menu.style.pointerEvents = "all";
        },
        onStart: () => {
          splitTextRefs.current.forEach((split, index) => {
            gsap.to(split.lines, {
              y: "0%",
              stagger: 0.05,
              delay: 0.35 + index * 0.1,
              duration: 1,
              ease: "power4.out",
            });
          });
        },
        onComplete: () => {
          setIsAnimating(false);
        },
      });
    } else {
      const textTimeline = gsap.timeline({
        onStart: () => {
          gsap.to(menu, {
            clipPath: "circle(0% at 50% 50%)",
            ease: "power3.out",
            duration: 1,
            delay: 0.75,
            onComplete: () => {
              menu.style.pointerEvents = "none";

              splitTextRefs.current.forEach((split) => {
                gsap.set(split.lines, { y: "120%" });
              });

              document.body.classList.remove("menu-open");

              setIsAnimating(false);
              setIsNavigating(false);
            },
          });
        },
      });

      splitTextRefs.current.forEach((split, index) => {
        textTimeline.to(
          split.lines,
          {
            y: "-120%",
            stagger: 0.03,
            delay: index * 0.05,
            duration: 1,
            ease: "power3.out",
          },
          0
        );
      });
    }
  }, []);

  useEffect(() => {
    if (isInitializedRef.current) {
      animateMenu(isOpen);
    }
  }, [isOpen, animateMenu]);

  const toggleMenu = useCallback(() => {
    if (!isAnimating && isInitializedRef.current && !isNavigating) {
      setIsOpen((prevIsOpen) => {
        return !prevIsOpen;
      });
    } else {
    }
  }, [isAnimating, isNavigating]);

  const handleLinkClick = useCallback(
    (e, href) => {
      e.preventDefault();

      const currentPath = window.location.pathname;
      if (currentPath === href) {
        if (isOpen) {
          setIsOpen(false);
        }
        return;
      }

      if (isNavigating) return;

      setIsNavigating(true);
      navigateWithTransition(href);
    },
    [isNavigating, isOpen, setIsOpen, navigateWithTransition]
  );

  const splitTextIntoSpans = (text) => {
    return text
      .split("")
      .map((char, index) =>
        char === " " ? (
          <span key={index}>&nbsp;&nbsp;</span>
        ) : (
          <span key={index}>{char}</span>
        )
      );
  };

  return (
    <div>
      <MenuBtn isOpen={isOpen} toggleMenu={toggleMenu} />
      <div className="menu" ref={menuRef}>
        <div className="menu-wrapper">
          <div className="col col-1">
            <div className="links">
              <div className="link">
                <a href="/" onClick={(e) => handleLinkClick(e, "/")}>
                  <h2>Home</h2>
                </a>
              </div>
              <div className="link">
                <a
                  href="/properties"
                  onClick={(e) => handleLinkClick(e, "/properties")}
                >
                  <h2>Properties</h2>
                </a>
              </div>
              <div className="link">
                <a
                  href="/about"
                  onClick={(e) => handleLinkClick(e, "/about")}
                >
                  <h2>About Us</h2>
                </a>
              </div>
              <div className="link">
                <a
                  href="/advice"
                  onClick={(e) => handleLinkClick(e, "/advice")}
                >
                  <h2>Advice</h2>
                </a>
              </div>
              {/* <div className="link">
                <a
                  href="/blueprints"
                  onClick={(e) => handleLinkClick(e, "/blueprints")}
                >
                  <h2>Gallery</h2>
                </a>
              </div> */}
              <div className="link">
                <a
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, "/contact")}
                >
                  <h2>Contact</h2>
                </a>
              </div>
            </div>
          </div>
          <div className="col col-2">
            <div className="socials">
              <div className="sub-col">
                <div className="menu-meta menu-commissions">
                  <p>Get in touch</p>
                  <p>js6071251@gmail.com</p>
                  <p>+91 93068 99027</p>
                </div>
                <div className="menu-meta">
                  <p>Office Address</p>
                  <p>Model Town, Hisar</p>
                  <p>Haryana 125001</p>
                </div>
              </div>
              <div className="sub-col">
                <div className="menu-meta menu-follow-us">
                  <p>Follow Us</p>
                  <div className="menu-follow-grid">
                    <div className="menu-follow-col">
                      <p>
                        <a href="https://instagram.com/sharma_real_estates_hisar" target="_blank" rel="noopener noreferrer">
                          Instagram
                        </a>
                      </p>
                      <p>
                        <a href="https://wa.me/919306899027?text=Hi" target="_blank" rel="noopener noreferrer">
                          WhatsApp
                        </a>
                      </p>
                    </div>
                    <span className="menu-follow-divider" aria-hidden="true"></span>
                    <div className="menu-follow-col">
                      <p>
                        <a href="https://youtube.com/@sharmarealestateshisar?si=4Fnx87zoBO8xy6D-" target="_blank" rel="noopener noreferrer">
                          YouTube
                        </a>
                      </p>
                      <p>
                        <a href="https://www.facebook.com/share/1B6hquJhhG/" target="_blank" rel="noopener noreferrer">
                          Facebook
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
