# Sharma Real Estates — Future Implementation Plan

This document outlines features and infrastructure to be implemented after the frontend-only phase is complete.

---

## Phase 2: Backend Infrastructure

### Database Setup (PostgreSQL + Prisma)

```prisma
// Planned schema

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      Role     @default(ADMIN)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  SUPER_ADMIN
}

model Property {
  id          String        @id @default(cuid())
  title       String
  slug        String        @unique
  description String        @db.Text
  price       Decimal
  category    Category
  subcategory String?
  status      PropertyStatus @default(AVAILABLE)
  
  // Location
  address     String
  city        String        @default("Hisar")
  state       String        @default("Haryana")
  pincode     String?
  
  // Specifications
  area        Decimal       // in sq.ft
  bedrooms    Int?
  bathrooms   Int?
  amenities   String[]
  
  // Media
  images      String[]
  thumbnail   String?
  
  // Meta
  featured    Boolean       @default(false)
  views       Int           @default(0)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  inquiries   Inquiry[]
}

enum Category {
  RESIDENTIAL
  COMMERCIAL
  LAND
  RENTAL
}

enum PropertyStatus {
  AVAILABLE
  SOLD
  UNDER_CONSTRUCTION
  RENTED
}

model Inquiry {
  id         String       @id @default(cuid())
  name       String
  email      String
  phone      String
  message    String       @db.Text
  status     LeadStatus   @default(NEW)
  propertyId String?
  property   Property?    @relation(fields: [propertyId], references: [id])
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
}

enum LeadStatus {
  NEW
  CONTACTED
  FOLLOW_UP
  CLOSED
  CONVERTED
}

model BlogPost {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String   @db.Text
  excerpt     String?
  thumbnail   String?
  author      String   @default("Sharma Real Estates")
  published   Boolean  @default(false)
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/properties` | GET | List properties with filters |
| `/api/properties/[id]` | GET | Get single property |
| `/api/properties` | POST | Create property (Admin) |
| `/api/properties/[id]` | PUT | Update property (Admin) |
| `/api/properties/[id]` | DELETE | Delete property (Admin) |
| `/api/inquiries` | POST | Submit inquiry form |
| `/api/inquiries` | GET | List inquiries (Admin) |
| `/api/blog` | GET | List blog posts |
| `/api/blog/[slug]` | GET | Get single blog post |
| `/api/blog` | POST | Create blog post (Admin) |

---

## Phase 3: Admin Dashboard

### Required Pages

1. **Admin Login** (`/admin/login`)
   - Secure authentication portal
   - NextAuth.js or Clerk integration

2. **Dashboard** (`/admin`)
   - Quick metrics: Total properties, Active inquiries, Recent views
   - Recent activity feed
   - Quick actions

3. **Property Management** (`/admin/properties`)
   - DataTable with sorting, filtering, pagination
   - CRUD operations
   - Bulk actions (publish, unpublish, delete)
   - Image upload with preview

4. **Inquiry Management** (`/admin/inquiries`)
   - Centralized inbox
   - Lead status tracking
   - Filter by property, status, date
   - Quick reply actions

5. **Blog Management** (`/admin/blog`)
   - Rich text editor (Tiptap or Lexical)
   - Draft/Publish workflow
   - SEO meta fields

---

## Phase 4: Authentication & Security

### Implementation

- **Auth Provider:** NextAuth.js or Clerk
- **Strategy:** Email/Password for admin
- **Role-Based Access Control (RBAC):**
  - `ADMIN` — Manage properties, inquiries, blog
  - `SUPER_ADMIN` — All above + user management

### Security Measures

- [ ] CSRF protection
- [ ] XSS prevention (sanitize inputs)
- [ ] SQL injection prevention (Prisma ORM)
- [ ] Rate limiting on API routes
- [ ] Secure session management
- [ ] HTTPS enforcement

---

## Phase 5: Media & Storage

### Cloud Integration

- **Provider:** AWS S3 or Cloudinary
- **Features:**
  - Bulk image uploads
  - Automatic optimization
  - CDN delivery
  - Responsive image variants

### Future Media Types

- [ ] 360° panoramic images
- [ ] Virtual 3D tours
- [ ] Video walkthroughs
- [ ] Property floor plans

---

## Phase 6: Automated Communications

### Email Service

- **Provider:** SendGrid or AWS SES
- **Automated Emails:**
  - Inquiry confirmation to user
  - New inquiry alert to admin
  - Follow-up reminders

### SMS Notifications (Optional)

- New lead alerts
- Appointment reminders

---

## Phase 7: Analytics & CRM

### Internal CRM Features

- Lead tagging and categorization
- Follow-up scheduling
- Communication history
- Conversion tracking

### Analytics

- Property view counts
- Inquiry source tracking
- Popular properties dashboard
- User engagement metrics

---

## Phase 8: SEO & Discoverability

### Technical SEO

- [ ] Dynamic meta tags per property
- [ ] Schema.org structured data (RealEstateListing)
- [ ] Dynamic sitemap generation
- [ ] Open Graph images
- [ ] Canonical URLs

### Advanced Features

- [ ] Map-based property search
- [ ] User watchlists (saved properties)
- [ ] Property comparison tool
- [ ] Neighborhood guides

---

## Deployment & DevOps

### Hosting

- **Platform:** Vercel (optimized for Next.js)
- **Database:** Vercel Postgres or Supabase

### CI/CD

- GitHub Actions pipeline
- Automated testing
- Preview deployments on PR

### Performance Targets

- Lighthouse Score: 90+
- Page Load Time: < 2 seconds
- Core Web Vitals: Green

---

## Timeline (Estimated)

| Phase | Description | Duration |
|-------|-------------|----------|
| 1 | Frontend (Current) | 1-2 weeks |
| 2 | Backend + Database | 1-2 weeks |
| 3 | Admin Dashboard | 1-2 weeks |
| 4 | Authentication | 3-5 days |
| 5 | Media Storage | 3-5 days |
| 6 | Email Integration | 2-3 days |
| 7 | Analytics/CRM | 1-2 weeks |
| 8 | SEO Optimization | 3-5 days |

---

## Notes

- All backend features are out of scope for Phase 1 (frontend-only)
- Mock JSON data is used to simulate API responses
- Design system from `.impeccable.md` must be preserved
- Refer to `AGENTS.md` for current implementation status
