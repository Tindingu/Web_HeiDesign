# ICEP Design - Strapi + Cloudinary Quick Start

## 🚀 Quick Overview

Your website is running on **Next.js 14**. Currently, it uses local JSON files and manual image management.

This guide converts it to use **Strapi CMS** with **Cloudinary** for automatic image hosting & management.

**Benefits:**

- ✅ Admin dashboard to manage projects without code
- ✅ Automatic image upload to Cloudinary (dfazfoh2l)
- ✅ Responsive admin panel for editing projects
- ✅ No more manual file management
- ✅ Same layout and design, data-driven content

---

## 📋 Prerequisites

Before starting, have these ready:

1. **Cloudinary Account** (Already done! Cloud Name: dfazfoh2l)
   - Get API Key & Secret from: https://cloudinary.com/console/settings/api-keys
   - Keep these safe! ⚠️

2. **Node.js 18+**
   - Check: `node --version`

3. **Two project folders:**
   - `icep-design/` (your Next.js frontend) ← You have this
   - `strapi-cms/` (new Strapi backend) ← We'll create this

---

## ⚙️ Step 1: Create Strapi Backend (5 minutes)

Open terminal and run:

```bash
# Create new Strapi project in a separate folder
npx create-strapi-app@latest strapi-cms --quickstart

# Wait for it to finish and automatically open http://localhost:1337
```

When prompted, create an admin account:

- Email: `admin@icep.com`
- Password: Something secure
- First name: Admin
- Last name: ICEP

✅ **Strapi is now running on http://localhost:1337**

---

## 🌥️ Step 2: Configure Cloudinary Provider (3 minutes)

### 2.1 In your Strapi project, install the provider:

```bash
cd strapi-cms
npm install @strapi/provider-upload-cloudinary
```

### 2.2 Create `config/plugins.js`

In the `strapi-cms` folder, create a new file: `config/plugins.js`

```javascript
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "@strapi/provider-upload-cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME", "dfazfoh2l"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
});
```

### 2.3 Create `.env` in strapi-cms folder

```dotenv
CLOUDINARY_NAME=dfazfoh2l
CLOUDINARY_KEY=your_api_key_here
CLOUDINARY_SECRET=your_api_secret_here
```

**Get your credentials:**

1. Go to: https://cloudinary.com/console/settings/api-keys
2. Copy "API Key" and "API Secret"
3. Paste into the .env file above

### 2.4 Restart Strapi

```bash
npm run develop
```

✅ **Cloudinary is now configured!**

---

## 📐 Step 3: Create Project Content Type (10 minutes)

Go to http://localhost:1337/admin

### 3.1 Click **Content-Type Builder** (left menu)

### 3.2 Click **Create new collection type**

- **Display name:** `Project`
- **API ID:** `project` (singular)
- Click **Continue**

### 3.3 Add these fields (in order):

**Basic Info:**

- `title` → Text (Short text, Required, Unique)
- `slug` → UID (linked to title, Required)
- `summary` → Text (Textarea, Required)
- `description` → Text (Textarea, Required)
- `category` → Text (Enumeration)
  ```
  Options:
  Biệt Thự
  Nhà Phố
  Căn Hộ
  Công Trình Dịch Vụ
  ```
- `style` → Text (Enumeration)
  ```
  Options:
  Hiện Đại
  Tân Cổ Điển
  Minimalism
  Japandi
  Wabi Sabi
  Tropical
  Modern Luxury
  ```
- `budget` → Text (Short text)
  - Example: "2-3 tỷ"

**Media:**

- `coverImage` → Media (Single media) - Featured image
- `gallery` → Media (Multiple media) - Project images

**Project Details:**

- `client` → Text (Short text)
- `location` → Text (Short text)
- `area` → Text (Short text) - Example: "320 m²"
- `duration` → Text (Short text) - Example: "6 months"
- `scope` → Text (Textarea) - Project scope
- `completedDate` → Date

**Additional:**

- `featured` → Boolean (Default: false)
- `highlights` → JSON

**SEO (Optional):**

- `seoTitle` → Text (Short text)
- `seoDescription` → Text (Textarea)
- `seoImage` → Media (Single media)

### 3.4 Click **Save** (top right)

✅ **Project content type created!**

---

## 🔑 Step 4: Create API Token (2 minutes)

### 4.1 In Strapi Admin:

- Click **Settings** (bottom left)
- Go to **API Tokens**
- Click **Create new API Token**

### 4.2 Configure:

- **Name:** `Next.js Frontend`
- **Description:** `For fetching projects from Next.js`
- **Type:** `Read` (select all content types)
- Click **Save**

### 4.3 Copy the token!

- **⚠️ Important:** Copy it immediately, you won't see it again

### 4.4 Add to Next.js:

In your `icep-design` folder, create `.env.local`:

```dotenv
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_copied_token_here
```

✅ **API Token configured!**

---

## 📝 Step 5: Create Your First Project (5 minutes)

### 5.1 In Strapi Admin:

- Go to **Content Manager** > **Projects**
- Click **Create new entry**

### 5.2 Fill in the form:

- **Title:** Penthouse Skyline
- **Slug:** (auto-filled: penthouse-skyline)
- **Summary:** Căn penthouse toàn cảnh kết hợp gỗ ấm áp
- **Description:** [Your detailed description]
- **Category:** Căn Hộ
- **Style:** Hiện Đại
- **Budget:** 3-5 tỷ
- **Cover Image:** Click to upload (will go to Cloudinary!)
- **Gallery:** Upload multiple images
- **Client:** Name of client
- **Location:** District, City
- **Area:** 320 m²
- **Duration:** 6 months
- **Featured:** Toggle ON (if you want on homepage)

### 5.3 Click **Save**

### 5.4 Click **Publish**

✅ **First project created!**

---

## 🔌 Step 6: Update Next.js (15 minutes)

### 6.1 Update `lib/strapi.ts`

Replace the content with the new version from `lib/strapi-api.ts`.

Or update your imports to use the new file:

```typescript
// In components that fetch projects, change from old strapi.ts to:
import {
  getProjects,
  getFeaturedProjects,
  getProjectBySlug,
} from "@/lib/strapi-api";
```

### 6.2 Update `app/du-an/[slug]/page.tsx`

Change imports:

```typescript
import { getProjectBySlug, getProjectSlugs } from "@/lib/strapi-api";
```

The rest of the file stays the same! ✅

### 6.3 Update `app/page.tsx`

Change imports:

```typescript
import { getFeaturedProjects } from "@/lib/strapi-api";
```

### 6.4 Restart Next.js Dev Server

```bash
# In icep-design folder
npm run dev
```

---

## ✅ Step 7: Test Everything!

### Test Strapi Admin:

1. Open http://localhost:1337/admin
2. Go to Projects
3. You should see your created project
4. Click on it, update description, click Publish
5. Check Cloudinary console - your images are there! 🎉

### Test Next.js Frontend:

1. Open http://localhost:3000
2. Check if project appears on homepage
3. Click project to view detail page
4. Images should load from Cloudinary

---

## 🐛 Troubleshooting

### Images not uploading to Cloudinary?

```
❌ Problem: "Error uploading to Cloudinary"
✅ Solution: Check your Cloudinary credentials in strapi-cms/.env
```

### Getting 404 from Strapi?

```
❌ Problem: "Cannot fetch from http://localhost:1337"
✅ Solution 1: Verify Strapi is running (npm run develop)
✅ Solution 2: Check STRAPI_API_TOKEN is correct
✅ Solution 3: Verify project is published (not just draft)
```

### Images showing broken on Next.js?

```
❌ Problem: Images show 404
✅ Solution 1: Check STRAPI_URL is http://localhost:1337
✅ Solution 2: Clear .next folder: rm -rf .next
✅ Solution 3: Restart dev server
```

### CORS errors?

```
❌ Problem: CORS error from Strapi
✅ Solution: In Strapi admin, go to Settings > CORS
          Add your frontend URL: http://localhost:3000
```

---

## 🚀 Production Deployment

### When you go live:

**1. Deploy Strapi:**

- Use Strapi Cloud: https://strapi.io/cloud (easiest)
- Or: Heroku, AWS, DigitalOcean

**2. Update environment variables:**

```
Next.js (Vercel):
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-domain.com
STRAPI_API_TOKEN=your_production_token

Strapi:
CLOUDINARY_NAME=dfazfoh2l
CLOUDINARY_KEY=production_key
CLOUDINARY_SECRET=production_secret
```

**3. Test thoroughly before going live**

---

## 📚 Architecture

```
┌─────────────────────────────────────────┐
│          Browser (User)                 │
└──────────────────┬──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │    Next.js (Port 3000)│
        │   icep-design/        │
        └──────────┬─────────────┘
                   │
                   │ API Call
                   ▼
        ┌──────────────────────┐
        │  Strapi (Port 1337)  │
        │   strapi-cms/        │
        └──────────┬─────────────┘
                   │
      ┌────────────┴────────────┐
      │                         │
      ▼                         ▼
  ┌─────────┐           ┌──────────────┐
  │ SQLite  │           │  Cloudinary  │
  │ (DB)    │           │ (Images)     │
  └─────────┘           └──────────────┘
```

---

## 📖 Quick Commands Reference

```bash
# Start Strapi admin
cd strapi-cms
npm run develop

# Start Next.js frontend
cd icep-design
npm run dev

# View Cloudinary media
https://cloudinary.com/console/media_library

# View Strapi admin
http://localhost:1337/admin

# View frontend
http://localhost:3000
```

---

## 💡 Next Steps

- ✅ Now working: Project management from Strapi admin
- ⬜ Optional: Add more content types (Services, Testimonials, Blog Posts)
- ⬜ Optional: Set up webhooks for auto-deployment on project publish
- ⬜ Optional: Add preview URLs in Strapi

---

**Questions?**

- Strapi Docs: https://docs.strapi.io
- Cloudinary Docs: https://cloudinary.com/documentation
- Next.js Docs: https://nextjs.org/docs

**Need help?** Check the STRAPI_SETUP.md for detailed instructions!
