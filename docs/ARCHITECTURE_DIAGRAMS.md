# Strapi + Cloudinary Architecture Diagrams

## 1. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER BROWSER                                 │
│            http://localhost:3000                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP Request
                         │ GET /du-an/penthouse-skyline
                         │
                    ┌────▼────────────────────────────────────┐
                    │     NEXT.JS FRONTEND                    │
                    │     (icep-design/)                      │
                    │                                         │
                    │  - Dynamic page rendering               │
                    │  - Image optimization                   │
                    │  - SEO headers                          │
                    │  - TypeScript type safety               │
                    └────┬──────────────┬──────────────────────┘
                         │              │
           ┌─────────────┘              └──────────────┐
           │                                           │
      [Primary Route]                              [Fallback]
           │                                           │
           ▼                                           ▼
    ┌─────────────────────┐              ┌──────────────────────┐
    │   STRAPI API        │              │  JSON Storage        │
    │   (Port 1337)       │              │  data/projects.json  │
    │                     │              │                      │
    │  - Content mgmt     │              │  - Backup projects   │
    │  - Draft/Publish    │              │  - Fallback data     │
    │  - User roles       │              │  - Local storage     │
    └────────┬────────────┘              └──────────────────────┘
             │
             │ Get project details + image URLs
             │
    ┌────────▼──────────────────────────────┐
    │   CLOUDINARY (dfazfoh2l)               │
    │   res.cloudinary.com                   │
    │                                        │
    │  - Image storage                       │
    │  - Auto optimization                   │
    │  - Global CDN delivery                 │
    │  - Responsive images                   │
    │  - Transformations (crop, resize)      │
    └────────────────────────────────────────┘
                         │
                         │ Image bytes
                         │
                    ┌────▼──────┐
                    │  Browser   │
                    │ Displays   │
                    │   Image    │
                    └───────────┘
```

---

## 2. Admin Workflow

```
┌──────────────────────────────────┐
│    ADMIN USER                    │
│  (Project Manager)               │
└────────────────┬─────────────────┘
                 │
                 │ Opens browser
                 │
         ┌───────▼────────────────────┐
         │   STRAPI ADMIN             │
         │   localhost:1337/admin     │
         │                            │
         │  Dashboard                 │
         │  ├─ Content Manager        │
         │  ├─ Settings               │
         │  └─ Media Library          │
         └───────┬────────────────────┘
                 │
         ┌───────┴────────────────────────────┐
         │                                    │
      [Create/Edit Project]          [Upload Images]
         │                                    │
    ┌────▼──────────┐              ┌────────▼──────────┐
    │  Fill Form:   │              │  Image Upload     │
    │  - Title      │              │                   │
    │  - Summary    │              │  - Select file    │
    │  - Category   │              │  - Optimize       │
    │  - Style      │              │  - Upload to      │
    │  - Budget     │              │    Cloudinary     │
    │  - Gallery    │              │                   │
    │  - SEO        │              │  → Cloudinary     │
    └────┬──────────┘              │    Media Library  │
         │                         │    Auto URL       │
         │                         └────────┬──────────┘
         │                                  │
         │                         ┌────────▼──────────┐
         │                         │ Image on          │
         │                         │ Cloudinary        │
         │                         │ https://res.      │
         │                         │ cloudinary.com... │
         └────────────┬────────────┘
                      │
              ┌───────▼────────────┐
              │   Click PUBLISH    │
              │                    │
              │  Project visible   │
              │  to users!         │
              └───────────────────┘
                      │
                      │ After publish
                      │
              ┌───────▼────────────┐
              │  Frontend (Next.js)│
              │  Fetches data      │
              │  Queries revalidate│
              │  Shows on website  │
              └───────────────────┘
```

---

## 3. Deployment Architecture

```
                      PRODUCTION
        ┌─────────────────────────────────┐
        │                                 │
   ┌────┴──────────┐          ┌──────────┴──────┐
   │                │          │                 │
   ▼                ▼          ▼                 ▼
┌──────────┐   ┌──────────┐ ┌──────────┐   ┌──────────┐
│Vercel    │   │Strapi    │ │Cloudinary│   │Database  │
│(Next.js  │   │Cloud     │ │(dfazfoh2)│   │(Postgres)│
│Frontend) │   │(CMS)     │ │(Images)  │   │(Strapi)  │
└──────────┘   └──────────┘ └──────────┘   └──────────┘
   │              │            │              │
   │ 1. User      │ 2. Fetch   │ 3. Get       │
   │ visits       │ project    │ image URL    │
   │              │            │              │
   └──────────────────────────────────────────┘
```

---

## 4. Content Migration Path

```
CURRENT STATE:
├─ data/projects.json (2 projects)
├─ /public/upload/projects/ (manual images)
└─ No admin interface

        ↓↓↓ MIGRATION ↓↓↓

TRANSITION STATE (Week 1):
├─ data/projects.json (2 legacy projects)
├─ Strapi (3 new projects)
├─ Cloudinary (5 total images)
└─ Frontend checks Strapi first, falls back to JSON

        ↓↓↓ MIGRATION ↓↓↓

FINAL STATE:
├─ Strapi (all 5 projects)
├─ Cloudinary (all images)
├─ data/projects.json (deleted or archived)
└─ Frontend only uses Strapi API
```

---

## 5. File Structure After Setup

```
icep-design/
├── .env.local (secrets - git ignored)
│   ├── NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
│   ├── STRAPI_API_TOKEN=...
│   └── NEXT_PUBLIC_SITE_URL=...
│
├── .env.example (template)
│
├── next.config.js (updated)
│   └── remotePatterns: [Cloudinary, Strapi]
│
├── lib/
│   ├── strapi-api.ts (NEW - API integration)
│   ├── strapi.ts (OLD - can be deleted later)
│   ├── project-storage.ts (local JSON fallback)
│   └── ...
│
├── app/
│   ├── page.tsx (updated imports)
│   ├── du-an/[slug]/page.tsx (updated imports)
│   └── ...
│
├── components/
│   └── home/featured-projects.tsx (updated imports)
│
├── public/
│   └── upload/ (keep as fallback)
│
├── data/
│   └── projects.json (fallback - can archive later)
│
├── docs/
│   ├── STRAPI_CONTENT_SCHEMA.md (NEW)
│   └── strapi-plugins.js.example (NEW)
│
├── IMPLEMENTATION_GUIDE.md (NEW)
├── STRAPI_QUICK_START.md (NEW)
├── STRAPI_SETUP.md (NEW)
├── STRAPI_MIGRATION.md (NEW)
└── package.json

strapi-cms/ (NEW - separate folder)
├── .env
│   ├── CLOUDINARY_NAME=dfazfoh2l
│   ├── CLOUDINARY_KEY=...
│   └── CLOUDINARY_SECRET=...
│
├── config/
│   └── plugins.js (Cloudinary config)
│
├── database.sqlite (data storage)
│
├── src/
│   ├── api/
│   │   └── project/ (auto-generated)
│   │       ├── routes/ (API endpoints)
│   │       └── controllers/
│   │
│   └── admin/ (admin panel)
│
├── package.json
└── package-lock.json
```

---

## 6. Request Lifecycle (Detailed)

```
USER REQUEST:
http://localhost:3000/du-an/penthouse-skyline

    │
    ▼

NEXT.JS SERVER:
1. Query parameters: { slug: 'penthouse-skyline' }
2. Call: getProjectBySlug('penthouse-skyline')
3. src: lib/strapi-api.ts

    │
    ▼

STRAPI API LAYER:
┌─────────────────────────────┐
│ Try Strapi First:           │
│ GET /api/projects?filter... │
│ Authorization: Bearer TOKEN │
└─────────────────────────────┘
    │
    ├─ Success: Return project data
    │   {
    │     id: 1,
    │     slug: 'penthouse-skyline',
    │     title: 'Penthouse Skyline',
    │     coverImage: {
    │       url: 'https://res.cloudinary.com/...',
    │       alt: 'Skyline view'
    │     },
    │     gallery: [...],
    │     ...
    │   }
    │
    └─ Fail: Try fallback

    │
    ▼

FALLBACK LAYER (if Strapi down):
┌──────────────────────────┐
│ Try Local JSON:          │
│ data/projects.json       │
│ Return matching project  │
└──────────────────────────┘

    │
    ▼

NEXT.JS RENDERING:
1. Normalize image URLs
2. Generate HTML
3. Add image components with optimization
4. Serialize to browser

    │
    ▼

BROWSER:
1. Download HTML
2. Parse image URLs (from Cloudinary)
3. Load images in parallel
4. Display with animations
5. Cache image URLs

    │
    ▼

USER SEES:
✅ Project details
✅ Optimized images from Cloudinary
✅ Fast load times (CDN delivery)
```

---

## 7. Image Optimization Pipeline

```
ADMIN UPLOADS:
Local file (5MB JPG)
    │
    ▼
Cloudinary receives
    │
    ├─ Auto compression
    ├─ Format conversion (WebP, AVIF)
    ├─ Resize generation (thumbnails)
    ├─ Quality optimization
    └─ CDN distribution worldwide

    │
    ▼
Cloudinary URL returned:
https://res.cloudinary.com/dfazfoh2l/image/upload/.../photo.jpg

    │
    ▼
Next.js Image Component:
<Image
  src={cloudinaryUrl}
  alt="Project photo"
  width={600}
  height={600}
/>

    │
    ├─ Browser requests: /upload/photo.jpg
    ├─ Next.js Image Optimization:
    │   ├─ Detects browser (Chrome, Firefox, Safari)
    │   ├─ Serves optimal format (WebP, AVIF, JPG)
    │   ├─ Serves optimal size (mobile: 400px, desktop: 800px)
    │   └─ Adds blur-up effect while loading
    │
    └─ User gets: Fast, optimized image

    │
    ▼
BENEFITS:
✅ 50-70% smaller file sizes
✅ Multiple device support (mobile, tablet, desktop)
✅ Blur effect while loading = perceived speed
✅ Global CDN = fast worldwide delivery
✅ No manual image optimization needed
```

---

## 8. Fallback System (Resilience)

```
Normal Operation:
User Request → Strapi (✅) → Display project

    ↓

Strapi Down:
User Request → Strapi (❌) → Try Local JSON (✅) → Display project

    ↓

Everything Down:
User Request → Strapi (❌) → JSON (❌) → Show Error

This ensures:
✅ Site works even if Strapi temporarily down
✅ Smooth transition during migration
✅ Development works without Strapi running
```

---

## 9. Content Type Relationship

```
┌─────────────────────────────┐
│      PROJECT                │
│                             │
│  [Strapi Collection]        │
│                             │
├─────────────────────────────┤
│ Fields:                     │
├─────────────────────────────┤
│ • Title (string)            │
│ • Slug (UID)                │
│ • Summary (text)            │
│ • Description (long text)   │
│ • Category (enum)           │
│ • Style (enum)              │
│ • Budget (string)           │
│ • Client (optional)         │
│ • Location (optional)       │
│ • Area (string)             │
│ • Duration (string)         │
│ • Scope (text)              │
│ • Featured (boolean)        │
│ • Highlights (JSON array)   │
├─────────────────────────────┤
│ Media:                      │
├─────────────────────────────┤
│ • coverImage (single)       │
│   └─ Auto → Cloudinary      │
│                             │
│ • gallery (multiple)        │
│   └─ Auto → Cloudinary      │
│                             │
│ • seoImage (optional)       │
│   └─ Auto → Cloudinary      │
├─────────────────────────────┤
│ SEO metadata:               │
├─────────────────────────────┤
│ • seoTitle (string)         │
│ • seoDescription (string)   │
│ • seoImage (media)          │
│ • createdAt (auto)          │
│ • updatedAt (auto)          │
│ • publishedAt (auto)        │
└─────────────────────────────┘
```

---

**These diagrams show the complete system architecture and data flows.**

For implementation steps, see: **STRAPI_QUICK_START.md**
