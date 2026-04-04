# Sharma Real Estates — AI Agent Instructions

## Project Overview

**Sharma Real Estates** is a centralized, admin-controlled real estate platform designed to list and manage residential, commercial, land, and rental properties in **Hisar, Haryana, India**.

**Tagline:** "We don't just build properties — we build assets."

### Business Model
- Admin-exclusive listing system (users cannot upload properties)
- Users explore curated listings and submit inquiry forms
- Sharma Real Estates receives inquiries and connects users with property owners or handles consultations internally

---

## Design System

**CRITICAL: Always reference `.impeccable.md` for styling decisions.**

The `.impeccable.md` file contains the complete design context including:
- Color system (warm earth tones, dark mode primary)
- Typography (Manrope + DM Mono)
- Animation patterns (GSAP, ScrollTrigger, Lenis)
- Component patterns (cards, buttons, spacing)
- Motion tokens and responsive breakpoints

**DO NOT deviate from the established aesthetic.** This project uses a "quiet luxury" design language with:
- Warm cream on dark backgrounds
- Generous whitespace
- Purposeful animations
- Restrained, non-salesy copy

---

## Frontend Routes (Current Scope)

| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Home — Hero, Featured Properties, Testimonials, Stats | In Progress |
| `/about` | About Us — Company story, mission, team | In Progress |
| `/properties` | Browse all properties with category filters | In Progress |
| `/properties/[id]` | Property details with inquiry form | In Progress |
| `/blueprints` | Gallery showcase | Kept As-Is |
| `/blog` | Real estate articles and updates | In Progress |
| `/contact` | Contact form + company information | In Progress |

---

## Property Categories

The filtering system supports these core categories:

### Residential
- Luxury Apartments
- Builder Floors
- Houses

### Commercial
- Retail Shops
- SCO (Shop-cum-Office) Plots
- Showrooms

### Land/Plots
- Raw land
- Investment plots with zoning details

### Rentals
- Hostels
- Rooms
- Flats
- PGs (Paying Guests)

---

## Contact Information

- **Phone:** 9306899027
- **Email:** js6071251@gmail.com
- **WhatsApp:** [wa.me/919306899027?text=Hi](https://wa.me/919306899027?text=Hi)
- **Instagram:** [@sharma_real_estates_hisar](https://instagram.com/sharma_real_estates_hisar)
- **Location:** Hisar, Haryana, India

---

## Technical Stack

- **Framework:** Next.js (App Router)
- **Library:** React with JavaScript
- **Styling:** Tailwind CSS + Custom CSS
- **Animations:** GSAP, ScrollTrigger, SplitText, Lenis
- **Currency:** ₹ INR
- **Measurements:** sq.ft

---

## Future Scope

See `future_plan.md` for backend, admin dashboard, and advanced features roadmap.

---

## Development Guidelines

1. **Preserve existing animations** — The GSAP animations and Lenis smooth scroll are core to the experience
2. **Use stock images** — High-quality property images from Unsplash/Pexels for realistic presentation
3. **Mock data first** — Use JSON data files to simulate API responses until backend is built
4. **Mobile-first responsive** — Main breakpoint at 1000px
5. **Copy tone** — Quiet confidence, sparse and intentional, never salesy
