# ICEP Design - Strapi Migration Guide for Frontend

This guide explains how to update your Next.js code to fetch data from Strapi instead of local JSON files.

---

## 📋 Overview

**Before:** Data comes from `data/projects.json` (manual management)

**After:** Data comes from Strapi API (admin dashboard management)

All your components stay the same! Only the data source changes.

---

## 🔄 Migration Steps

### Step 1: Import from new API module

**Old way:**

```typescript
import { getProjects } from "@/lib/strapi";
```

**New way:**

```typescript
import {
  getProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectSlugs,
} from "@/lib/strapi-api";
```

### Step 2: Environment Setup

Create `.env.local` in your `icep-design` folder:

```dotenv
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_api_token_here
```

---

## 📝 Files to Update

### File 1: `app/page.tsx` (Homepage)

**Change this:**

```typescript
// ❌ OLD
import { getFeaturedProjects } from "@/lib/strapi";
```

**To this:**

```typescript
// ✅ NEW
import { getFeaturedProjects } from "@/lib/strapi-api";
```

Rest of the file stays the same!

```diff
- import { getFeaturedProjects } from "@/lib/strapi";
+ import { getFeaturedProjects } from "@/lib/strapi-api";

  export default async function Home() {
    // ... rest of code is unchanged
  }
```

---

### File 2: `app/du-an/[slug]/page.tsx` (Project Detail)

**Change these imports:**

```typescript
// ❌ OLD
import { getProjectBySlug, getProjectSlugs } from "@/lib/strapi";

// ✅ NEW
import { getProjectBySlug, getProjectSlugs } from "@/lib/strapi-api";
```

Everything else in this file stays the same!

```diff
- import { getProjectBySlug, getProjectSlugs } from "@/lib/strapi";
+ import { getProjectBySlug, getProjectSlugs } from "@/lib/strapi-api";

  export async function generateStaticParams() {
    // ... rest of code is unchanged
  }
```

---

### File 3: `components/home/featured-projects.tsx`

**Change this:**

```typescript
// ❌ OLD
import { getProjects } from "@/lib/strapi";
```

**To this:**

```typescript
// ✅ NEW
import { getProjects } from "@/lib/strapi-api";
```

Rest unchanged!

```diff
- import { getProjects } from "@/lib/strapi";
+ import { getProjects } from "@/lib/strapi-api";

  async function FeaturedProjectsSlider() {
    // ... rest of code is unchanged
  }
```

---

## 🧪 Testing After Migration

### 1. Start both servers:

```bash
# Terminal 1: Strapi (in strapi-cms folder)
npm run develop

# Terminal 2: Next.js (in icep-design folder)
npm run dev
```

### 2. Test each page:

- [ ] Homepage loads: http://localhost:3000
- [ ] Featured projects show: http://localhost:3000 (scroll down)
- [ ] Project detail page works: http://localhost:3000/du-an/penthouse-skyline
- [ ] Images load from Cloudinary: Check URL in browser devtools

### 3. Test Strapi admin:

- [ ] Create new project
- [ ] Upload images (check Cloudinary)
- [ ] Publish project
- [ ] Refresh frontend - new project appears ✅

---

## 🔄 API Response Fallback Logic

The new `lib/strapi-api.ts` has smart fallback:

```
┌─ Try Strapi API
│  ├─ Success? → Use Strapi data ✅
│  └─ Fail? → Continue
│
└─ Fallback to local JSON storage
   ├─ Success? → Use local data
   └─ Complete fail? → Show error
```

This means:

- ✅ If Strapi is down, your site still works using local data
- ✅ You can gradually migrate projects from JSON to Strapi
- ✅ Perfect for transitioning to production

---

## 📊 Data Structure Alignment

The Strapi `Project` type matches your existing structure:

```typescript
// Same fields in both systems
Project {
  id: number
  slug: string
  title: string
  summary: string
  description: string
  category: string
  style: string
  budget: string
  coverImage: ImageAsset
  gallery: ImageAsset[]
  details: DetailItem[]
  projectDetails?: ProjectDetail
  highlights?: string[]
  featured: boolean
  createdAt: string
  updatedAt: string
}
```

So your components work without any changes! 🎉

---

## 🖼️ Image URLs

Strapi + Cloudinary setup provides three types of image URLs:

### Type 1: Cloudinary URLs (Recommended)

```
https://res.cloudinary.com/dfazfoh2l/image/upload/v123/project_123.jpg
```

✅ Fast, optimized, global CDN

### Type 2: Strapi URLs (Local)

```
http://localhost:1337/uploads/project_123.jpg
```

✅ Only for development, slow for production

### Type 3: Relative URLs (Local JSON fallback)

```
/upload/projects/project_123.jpg
```

✅ Fallback only

The `normalizeImageUrl()` function in `lib/strapi-api.ts` handles all three! 📦

---

## ⚡ Performance Considerations

### Caching Strategy

By default, Strapi data is cached for **1 hour**:

```typescript
next: {
  revalidate: 3600;
} // 1 hour
```

You can change this in `lib/strapi-api.ts`:

```typescript
// Cache for 24 hours instead
next: {
  revalidate: 86400;
}

// Always fresh (no cache)
next: {
  revalidate: 0;
}

// Cache indefinitely (manual revalidation)
next: {
  revalidate: false;
}
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot GET /du-an/project-slug"

```
❌ Error: Project detail page showing 404
✅ Solution:
  1. Check project is published in Strapi (not just draft)
  2. Verify slug spelling matches
  3. Restart Next.js dev server
```

### Issue: Images showing broken

```
❌ Error: Images from Cloudinary showing 404
✅ Solution:
  1. Verify CLOUDINARY_NAME=dfazfoh2l in Strapi .env
  2. Check image upload succeeded in Cloudinary console
  3. Verify NEXT_PUBLIC_STRAPI_URL is correct
  4. Check next.config.js remotePatterns includes Cloudinary
```

### Issue: API token errors

```
❌ Error: "Authorization failed" or "Invalid token"
✅ Solution:
  1. Generate new API token in Strapi
  2. Copy immediately (can't see again)
  3. Update STRAPI_API_TOKEN in .env.local
  4. Restart Next.js
```

---

## 🚀 Going Live

When deploying to production:

1. **Deploy Strapi first**
   - Use Strapi Cloud (easiest)
   - Get production URL (e.g., https://cms.icepdesign.vn)

2. **Update Next.js environment**
   - In Vercel dashboard, add:

   ```
   NEXT_PUBLIC_STRAPI_URL=https://cms.icepdesign.vn
   STRAPI_API_TOKEN=production_token
   ```

3. **Migrate projects to Strapi**
   - Or use fallback to local JSON during transition

4. **Test thoroughly**
   - Create test project in production Strapi
   - Verify it appears on frontend
   - Check Cloudinary storage

---

## 📚 Complete Component Examples

### Example 1: Homepage with Strapi data

```typescript
import { getFeaturedProjects } from "@/lib/strapi-api";

export default async function Home() {
  // Fetch from Strapi automatically
  const projects = await getFeaturedProjects();

  return (
    <div>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### Example 2: Dynamic project page

```typescript
import { getProjectBySlug } from "@/lib/strapi-api";

export default async function ProjectPage({ params }) {
  // Data automatically comes from Strapi
  const project = await getProjectBySlug(params.slug);

  if (!project) return notFound();

  return (
    <div>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
    </div>
  );
}
```

---

## ✅ Verification Checklist

Before considering migration complete:

- [ ] `.env.local` created with Strapi URL and token
- [ ] Imports updated in all 3 files
- [ ] Strapi admin accessible at http://localhost:1337/admin
- [ ] At least one project created in Strapi
- [ ] Images upload to Cloudinary successfully
- [ ] Project appears on Next.js homepage
- [ ] Project detail page loads
- [ ] All images render correctly
- [ ] No console errors in browser

---

## 📖 Next: Advanced Features

Once migration is complete, you can:

1. **Webhook automation**
   - Auto-redeploy Next.js when project published

2. **Preview URLs**
   - Draft projects visible in URL with preview token

3. **Scheduled publishing**
   - Schedule projects to auto-publish on specific date

4. **Content localization**
   - Support Vietnamese + English content

5. **User roles**
   - Different admin levels (viewer, editor, admin)

---

**Need more details?** Check:

- STRAPI_QUICK_START.md - Getting started
- STRAPI_SETUP.md - Detailed setup
- lib/strapi-api.ts - API implementation
