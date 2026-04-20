# ICEP Design - Complete Strapi + Cloudinary Implementation

## 📊 Project Overview

Transform your manual project management system into a professional CMS with automatic Cloudinary image hosting.

**Current System:**

- Projects stored in: `data/projects.json`
- Images: Manual `/public/upload/` folders
- Admin: Code editing required

**New System:**

- Projects managed in: Strapi Admin Dashboard
- Images: Automatic Cloudinary upload (dfazfoh2l)
- Admin: Web interface, no coding needed

---

## 🎯 What You Get

| Feature                | Before                      | After                |
| ---------------------- | --------------------------- | -------------------- |
| **Project Management** | Edit JSON file              | Admin Dashboard      |
| **Image Hosting**      | Local /public folder (404s) | Cloudinary CDN       |
| **Admin Interface**    | None (code only)            | Professional UI      |
| **Scalability**        | Limited (local storage)     | Unlimited (cloud)    |
| **Uptime**             | Depends on server           | 99.9% Cloudinary SLA |
| **Performance**        | Slow (local images)         | Fast (global CDN)    |

---

## 📁 New Files Created

### Documentation Files:

1. **STRAPI_QUICK_START.md** - Step-by-step setup (5-10 mins)
2. **STRAPI_SETUP.md** - Detailed configuration guide
3. **STRAPI_MIGRATION.md** - How to update your Next.js code
4. **docs/STRAPI_CONTENT_SCHEMA.md** - Content type field definitions
5. **docs/strapi-plugins.js.example** - Cloudinary plugin config

### Code Files:

1. **lib/strapi-api.ts** - New API integration (replaces strapi.ts)
2. **.env.example** - Updated with Cloudinary variables
3. **next.config.js** - Updated to allow Cloudinary images

---

## 🚀 Quick Start (15 minutes)

### Phase 1: Create Strapi Backend (5 min)

```bash
# In a new folder next to icep-design/
npx create-strapi-app@latest strapi-cms --quickstart

# Creates admin account automatically
# Runs on http://localhost:1337
```

### Phase 2: Setup Cloudinary (3 min)

```bash
# In strapi-cms folder
npm install @strapi/provider-upload-cloudinary

# Create config/plugins.js (copy from docs/strapi-plugins.js.example)
# Create .env with Cloudinary credentials
npm run develop
```

### Phase 3: Create Content Type (5 min)

In Strapi admin:

1. Content-Type Builder → Create "Project"
2. Add fields (title, summary, description, category, style, budget, coverImage, gallery, etc.)
3. Save & Restart Strapi

### Phase 4: Generate API Token (2 min)

In Strapi admin:

1. Settings → API Tokens → Create New
2. Copy token
3. Add to Next.js `.env.local`

### Phase 5: Verify It Works (1 min)

```bash
# Create test project in Strapi admin
# Check image uploaded to Cloudinary
# View on http://localhost:3000
```

---

## 📚 Documentation Index

| Document                           | Purpose               | Time        |
| ---------------------------------- | --------------------- | ----------- |
| **STRAPI_QUICK_START.md**          | Getting started guide | 15 min read |
| **STRAPI_SETUP.md**                | Detailed step-by-step | 30 min read |
| **STRAPI_MIGRATION.md**            | How to update Next.js | 10 min read |
| **docs/STRAPI_CONTENT_SCHEMA.md**  | Content type details  | Reference   |
| **docs/strapi-plugins.js.example** | Cloudinary config     | Copy & use  |

---

## 🔧 System Architecture

```
┌────────────────────────────────────────┐
│          Browser (User)                │
└──────────────┬───────────────────────┘
               │
               ▼
     ┌──────────────────────┐
     │   Next.js 14         │
     │   (Port 3000)        │
     │   icep-design/       │
     └──────────┬───────────┘
                │
     ┌──────────┴──────────┐
     │                     │
     ▼                     ▼
┌──────────────┐    ┌──────────────────┐
│ Strapi CMS   │    │  JSON Fallback   │
│ (Port 1337)  │    │  (data/*.json)   │
│ strapi-cms/  │    │  (Backup)        │
└──────┬───────┘    └──────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│    Cloudinary (dfazfoh2l)           │
│    - Auto image uploads             │
│    - Global CDN delivery            │
│    - Image optimization             │
└─────────────────────────────────────┘
```

---

## 🔑 Environment Variables

### For Next.js (`icep-design/.env.local`):

```dotenv
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_token_here
NEXT_PUBLIC_SITE_URL=https://icepdesign.vn
```

### For Strapi (`strapi-cms/.env`):

```dotenv
CLOUDINARY_NAME=dfazfoh2l
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
```

**Get Cloudinary credentials:**
https://cloudinary.com/console/settings/api-keys

---

## 📋 Implementation Checklist

### Setup Phase:

- [ ] Create strapi-cms folder with `npx create-strapi-app`
- [ ] Install Cloudinary provider in Strapi
- [ ] Create `config/plugins.js` (copy from example)
- [ ] Create `.env` with Cloudinary credentials
- [ ] Run `npm run develop` in Strapi

### Strapi Configuration:

- [ ] Create "Project" content type
- [ ] Add all required fields
- [ ] Create API token
- [ ] Copy token to Next.js `.env.local`

### Next.js Migration:

- [ ] Create `.env.local` with Strapi URL and token
- [ ] Update imports in `app/page.tsx`
- [ ] Update imports in `app/du-an/[slug]/page.tsx`
- [ ] Update imports in `components/home/featured-projects.tsx`
- [ ] Restart Next.js dev server

### Testing:

- [ ] Test Strapi admin works at http://localhost:1337/admin
- [ ] Create sample project in Strapi
- [ ] Upload image (check Cloudinary)
- [ ] Publish project
- [ ] Verify project appears on http://localhost:3000
- [ ] Click project link - detail page loads
- [ ] All images display correctly

### Production:

- [ ] Host Strapi (Strapi Cloud, Heroku, or self-hosted)
- [ ] Get production Strapi URL
- [ ] Generate production API token
- [ ] Update Vercel environment variables
- [ ] Test on staging first
- [ ] Deploy to production

---

## 💻 Code Changes Summary

### Files Modified:

1. **next.config.js**
   - Added Cloudinary domain to remotePatterns
   - Added Strapi localhost for development

2. **.env.example**
   - Added Cloudinary variables
   - Added NEXT_PUBLIC_FRONTEND_URL

### Files Created:

1. **lib/strapi-api.ts** (NEW)
   - Complete Strapi API integration
   - Cloudinary image normalization
   - Smart fallback to local JSON
   - Type-safe Project interface

2. **STRAPI_QUICK_START.md** (NEW)
   - Quick reference guide
   - 5-step setup process

3. **STRAPI_SETUP.md** (NEW)
   - Comprehensive setup instructions
   - Field-by-field content type guide
   - Troubleshooting section

4. **STRAPI_MIGRATION.md** (NEW)
   - How to update Next.js files
   - Testing procedures
   - Performance notes

5. **docs/STRAPI_CONTENT_SCHEMA.md** (NEW)
   - Complete field definitions
   - Validation rules
   - Database schema reference

6. **docs/strapi-plugins.js.example** (NEW)
   - Cloudinary plugin configuration
   - Copy directly to `strapi-cms/config/plugins.js`

### Files NOT Modified:

- ✅ `app/page.tsx` (just import path changes)
- ✅ `app/du-an/[slug]/page.tsx` (just import path changes)
- ✅ All components stay the same

---

## 🔄 Migration Path

### Phase 1: Parallel Systems (During Migration)

```
Strapi contains: Some new projects
JSON contains: Old projects
Frontend: Uses both (tries Strapi first, falls back to JSON)
```

### Phase 2: Full Migration

```
Strapi contains: All projects
JSON contains: Archived backup
Frontend: Uses only Strapi
```

### Phase 3: Production

```
Strapi Cloud: All projects
Cloudinary: All images
JSON: Deleted (no longer needed)
Frontend: Production-only imports
```

---

## 🎓 Learning Resources

### Official Documentation:

- **Strapi Docs:** https://docs.strapi.io
- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Next.js Docs:** https://nextjs.org/docs
- **Strapi Cloud:** https://strapi.io/cloud

### Video Tutorials:

- Strapi Getting Started: https://youtu.be/FLeU3kD_MgA
- Cloudinary Upload: https://youtu.be/S7bAuFyTjiI
- Next.js Image Optimization: https://youtu.be/IU_qq_c_lKA

---

## ⚠️ Important Notes

### Security:

- ✅ Never commit `.env` files (already in `.gitignore`)
- ✅ Never share API tokens publicly
- ✅ Regenerate tokens if exposed
- ✅ Use strong passwords for Strapi admin

### Performance:

- ✅ First load caches for 1 hour (configurable)
- ✅ Images optimized through Cloudinary
- ✅ Fallback ensures site works even if Strapi down
- ✅ Use `npm run build` to test production builds

### Backups:

- ✅ Cloudinary provides image backup
- Keep `.env` backups in secure location
- Export Strapi database regularly
- Keep old `data/projects.json` as backup

---

## 🆘 Common Issues & Quick Fixes

### Issue: "Cannot connect to Strapi"

```bash
# Make sure Strapi is running
cd strapi-cms
npm run develop

# Check port 1337 is accessible
curl http://localhost:1337/api/projects
```

### Issue: "Images not uploading"

```bash
# Verify Cloudinary credentials
# Check CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET
# Restart Strapi: npm run develop
```

### Issue: "Project not showing on frontend"

```bash
# 1. Check project is PUBLISHED (not just Saved)
# 2. Clear .next folder: rm -rf .next
# 3. Restart Next.js: npm run dev
```

### Issue: "API token not working"

```bash
# Generate new token in Strapi admin
# Copy immediately (can't see again)
# Update STRAPI_API_TOKEN in .env.local
# Restart Next.js
```

---

## 📞 Support

### If you encounter issues:

1. **Check the documentation:**
   - STRAPI_QUICK_START.md
   - Troubleshooting sections

2. **Check official docs:**
   - https://docs.strapi.io
   - https://cloudinary.com/documentation

3. **Common solutions:**
   - Restart Strapi: `npm run develop`
   - Restart Next.js: `npm run dev`
   - Clear cache: `rm -rf .next`
   - Check environment variables

---

## 🎉 Success Indicators

You're done when:

✅ Strapi admin opens at http://localhost:1337/admin
✅ Can create/edit projects in admin dashboard
✅ Images upload to Cloudinary automatically
✅ Projects appear on http://localhost:3000
✅ Project detail pages load with all images
✅ No console errors in browser
✅ Cloudinary media library shows your images
✅ Network tab shows images from `res.cloudinary.com`

---

## 📊 Project Status

| Component             | Status         | Notes                                    |
| --------------------- | -------------- | ---------------------------------------- |
| **Strapi Setup**      | ⏳ Not started | Follow STRAPI_QUICK_START.md             |
| **Cloudinary Config** | ⏳ Pending     | Add credentials to Strapi                |
| **Content Type**      | ⏳ Pending     | Create in Strapi admin                   |
| **API Token**         | ⏳ Pending     | Generate in Strapi admin                 |
| **Next.js Migration** | ⏳ Pending     | Update imports (see STRAPI_MIGRATION.md) |
| **Testing**           | ⏳ Pending     | Test after all setup                     |

---

## 🚀 Next Steps

**Start here:**

1. Read: STRAPI_QUICK_START.md (5-10 min)
2. Create: Strapi project (5 min)
3. Configure: Cloudinary provider (3 min)
4. Build: Content type (5 min)
5. Test: Create sample project (10 min)

**Then:** 6. Migrate: Update Next.js imports 7. Deploy: Push to production

**Finally:** 8. Enjoy: Manage projects from admin dashboard!

---

**Good luck! 🎨**

For detailed steps, start with → **STRAPI_QUICK_START.md**
