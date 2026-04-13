# Strapi + Cloudinary Implementation Checklist

Complete checklist to guide you through the entire setup process.

---

## 📋 Phase 1: Preparation (5 minutes)

- [ ] Read STRAPI_QUICK_START.md (full overview)
- [ ] Have Cloudinary credentials ready:
  - [ ] Cloud Name: `dfazfoh2l`
  - [ ] API Key: `_____________` (get from https://cloudinary.com/console/settings/api-keys)
  - [ ] API Secret: `_____________` (keep safe!)
- [ ] Have Node.js 18+ installed (`node --version`)
- [ ] Terminal/command line ready

---

## 🏗️ Phase 2: Create Strapi Backend (5 minutes)

### Location Setup:

- [ ] Create new folder next to `icep-design/`
  ```bash
  mkdir strapi-cms
  cd strapi-cms
  ```

### Install Strapi:

- [ ] Run: `npx create-strapi-app@latest . --quickstart`
- [ ] Wait for installation to complete
- [ ] Strapi opens browser automatically to http://localhost:1337/admin

### Create Admin Account:

- [ ] Email: `admin@icepdesign.com`
- [ ] Password: `_____________________` (save this!)
- [ ] First Name: `Admin`
- [ ] Last Name: `ICEP`
- [ ] Click **Create Admin Account**

### Verify Strapi Works:

- [ ] http://localhost:1337/admin opens ✅
- [ ] Can log in with your credentials ✅
- [ ] Dashboard visible ✅

---

## 🌥️ Phase 3: Configure Cloudinary Provider (3 minutes)

### Install Package:

- [ ] In `strapi-cms` folder, run:
  ```bash
  npm install @strapi/provider-upload-cloudinary
  ```

### Create Config File:

- [ ] Create file: `strapi-cms/config/plugins.js`
- [ ] Copy content from `icep-design/docs/strapi-plugins.js.example`
- [ ] Save the file

### Create Environment Variables:

- [ ] Create file: `strapi-cms/.env`
- [ ] Add these lines:
  ```dotenv
  CLOUDINARY_NAME=dfazfoh2l
  CLOUDINARY_KEY=your_api_key_here
  CLOUDINARY_SECRET=your_api_secret_here
  ```
- [ ] Replace with your actual Cloudinary credentials
- [ ] Save the file

### Restart Strapi:

- [ ] Stop Strapi (Ctrl+C in terminal)
- [ ] Run: `npm run develop`
- [ ] Wait for "Server is running..."
- [ ] Verify can still log in ✅

---

## 📐 Phase 4: Create Project Content Type (10 minutes)

All in Strapi admin at http://localhost:1337/admin

### Access Content-Type Builder:

- [ ] Left sidebar → **Content-Type Builder**
- [ ] Click **Create new collection type**
- [ ] Display name: `Project`
- [ ] API ID: `project` (singular)
- [ ] Click **Continue**

### Add Required Fields (in order):

**Group: Basic Info**

- [ ] `title`
  - Type: **Text** → Short text
  - Required: ✅ Yes
  - Unique: ✅ Yes

- [ ] `slug`
  - Type: **UID**
  - Linked to: **title**
  - Required: ✅ Yes

- [ ] `summary`
  - Type: **Text** → Textarea
  - Required: ✅ Yes

- [ ] `description`
  - Type: **Text** → Textarea
  - Required: ✅ Yes

- [ ] `category`
  - Type: **Text** → Enumeration
  - Options:
    - [ ] Biệt Thự
    - [ ] Nhà Phố
    - [ ] Căn Hộ
    - [ ] Công Trình Dịch Vụ
  - Required: ✅ Yes

- [ ] `style`
  - Type: **Text** → Enumeration
  - Options:
    - [ ] Hiện Đại
    - [ ] Tân Cổ Điển
    - [ ] Minimalism
    - [ ] Japandi
    - [ ] Wabi Sabi
    - [ ] Tropical
    - [ ] Modern Luxury
  - Required: ✅ Yes

- [ ] `budget`
  - Type: **Text** → Short text
  - Required: ✅ Yes

**Group: Media**

- [ ] `coverImage`
  - Type: **Media** → Single media
  - Required: ✅ Yes

- [ ] `gallery`
  - Type: **Media** → Multiple media
  - Required: ❌ No

**Group: Project Details**

- [ ] `client`
  - Type: **Text** → Short text
  - Required: ❌ No

- [ ] `location`
  - Type: **Text** → Short text
  - Required: ❌ No

- [ ] `area`
  - Type: **Text** → Short text
  - Required: ❌ No
  - Example: "320 m²"

- [ ] `duration`
  - Type: **Text** → Short text
  - Required: ❌ No
  - Example: "6 months"

- [ ] `scope`
  - Type: **Text** → Textarea
  - Required: ❌ No

- [ ] `completedDate`
  - Type: **Date**
  - Required: ❌ No

**Group: Additional**

- [ ] `featured`
  - Type: **Boolean**
  - Default: ❌ false

- [ ] `highlights`
  - Type: **JSON**
  - Required: ❌ No

**Group: SEO (Optional)**

- [ ] `seoTitle`
  - Type: **Text** → Short text
  - Required: ❌ No

- [ ] `seoDescription`
  - Type: **Text** → Textarea
  - Required: ❌ No

- [ ] `seoImage`
  - Type: **Media** → Single media
  - Required: ❌ No

### Save Content Type:

- [ ] Click **Save** button (top right)
- [ ] Wait for Strapi to restart
- [ ] Verify no errors in terminal ✅

---

## 🔑 Phase 5: Generate API Token (3 minutes)

### In Strapi Admin:

- [ ] Click **Settings** (bottom left)
- [ ] Go to **API Tokens**
- [ ] Click **Create new API Token**

### Configure Token:

- [ ] Name: `Next.js Frontend`
- [ ] Description: `Access from Next.js frontend`
- [ ] Type: **Read** (all content types)
- [ ] Click **Save**

### Copy Token:

- [ ] **⚠️ IMPORTANT:** Copy the token NOW (you won't see it again)
- [ ] Paste it somewhere safe temporarily
- [ ] Token looks like: `09abc123def456...`

---

## 🔌 Phase 6: Setup Next.js Environment (2 minutes)

### In `icep-design` folder:

- [ ] Create file: `.env.local` (same level as `package.json`)
- [ ] Add these lines:
  ```dotenv
  NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
  STRAPI_API_TOKEN=paste_your_token_here
  NEXT_PUBLIC_SITE_URL=https://icepdesign.vn
  ```
- [ ] Replace with your actual API token
- [ ] Save the file

### Verify File Created:

- [ ] `.env.local` exists in `icep-design/` root
- [ ] File is in `.gitignore` (shouldn't be committed)

---

## 📝 Phase 7: Create Test Project (5 minutes)

### In Strapi Admin:

- [ ] Go to **Content Manager** → **Projects**
- [ ] Click **Create new entry**

### Fill Test Project:

- [ ] Title: `Test Project`
- [ ] Slug: Auto-generated (should be: `test-project`)
- [ ] Summary: `This is a test project`
- [ ] Description: `Complete description here`
- [ ] Category: Select one (e.g., `Căn Hộ`)
- [ ] Style: Select one (e.g., `Hiện Đại`)
- [ ] Budget: `1-2 tỷ`
- [ ] Cover Image:
  - [ ] Click upload button
  - [ ] Select a JPG/PNG image from your computer
  - [ ] Image uploads to Cloudinary automatically
  - [ ] URL appears in field
- [ ] Gallery (optional):
  - [ ] Click **Add media**
  - [ ] Upload multiple images
  - [ ] Verify they upload to Cloudinary
- [ ] Highlights (optional):
  ```json
  ["First highlight", "Second highlight", "Third highlight"]
  ```

### Publish Project:

- [ ] Click **Save** button
- [ ] Click **Publish** button
- [ ] Status shows "Published"

### Verify in Cloudinary:

- [ ] Open https://cloudinary.com/console/media_library
- [ ] Log in with your Cloudinary account
- [ ] Check that your images appear in media library
- [ ] Verify images are stored under cloud name: `dfazfoh2l`

---

## 🔄 Phase 8: Update Next.js Imports (3 minutes)

### File 1: `app/page.tsx`

- [ ] Open file
- [ ] Find line: `import { getFeaturedProjects } from "@/lib/strapi";`
- [ ] Change to: `import { getFeaturedProjects } from "@/lib/strapi-api";`
- [ ] Save file

### File 2: `app/du-an/[slug]/page.tsx`

- [ ] Open file
- [ ] Find line: `import { getProjectBySlug, getProjectSlugs } from "@/lib/strapi";`
- [ ] Change to: `import { getProjectBySlug, getProjectSlugs } from "@/lib/strapi-api";`
- [ ] Save file

### File 3: `components/home/featured-projects.tsx`

- [ ] Open file
- [ ] Find line: `import { getProjects } from "@/lib/strapi";`
- [ ] Change to: `import { getProjects } from "@/lib/strapi-api";`
- [ ] Save file

### Verify Changes:

- [ ] All 3 files updated ✅
- [ ] No syntax errors ✅

---

## ✅ Phase 9: Testing (10 minutes)

### Start Development Servers:

```bash
# Terminal 1: Strapi
cd strapi-cms
npm run develop

# Terminal 2: Next.js (new terminal)
cd icep-design
npm run dev
```

- [ ] Strapi running on http://localhost:1337 ✅
- [ ] Next.js running on http://localhost:3000 ✅
- [ ] No errors in either terminal ✅

### Test Strapi Admin:

- [ ] Open http://localhost:1337/admin
- [ ] Log in with your credentials ✅
- [ ] Can see "Test Project" you created ✅
- [ ] Can see cover image uploaded to Cloudinary ✅

### Test Next.js Frontend:

- [ ] Open http://localhost:3000
- [ ] Homepage loads without errors ✅
- [ ] Featured projects section shows your test project ✅
- [ ] Click on test project link ✅
- [ ] Detail page loads ✅
- [ ] Project images display (from Cloudinary) ✅
- [ ] Check browser's Network tab:
  - [ ] Images come from `res.cloudinary.com`
  - [ ] Images load quickly from CDN ✅

### Check Browser Console:

- [ ] No red errors in browser console ✅
- [ ] No CORS errors ✅
- [ ] No 404 errors ✅

### Test Fallback System:

- [ ] Stop Strapi server (Ctrl+C)
- [ ] Refresh Next.js page
- [ ] Old test projects from JSON should still show (fallback works) ✅
- [ ] Restart Strapi server ✅

---

## 🎉 Phase 10: Success Verification (5 minutes)

### All Systems Working:

- [ ] Can create projects in Strapi admin
- [ ] Images upload to Cloudinary automatically
- [ ] Images appear in Cloudinary media library
- [ ] Projects appear on Next.js frontend
- [ ] Project detail pages load correctly
- [ ] Images display from Cloudinary CDN
- [ ] No console errors or warnings
- [ ] Fallback system works if Strapi down

### Performance Checks:

- [ ] Homepage loads in < 3 seconds
- [ ] Images load from Cloudinary (fast CDN)
- [ ] Browser Network tab shows optimized formats
- [ ] No unnecessary API calls

### Data Integrity:

- [ ] Project data matches in Strapi and frontend
- [ ] All fields save correctly
- [ ] Created/Updated dates accurate
- [ ] Featured flag works (affects homepage)

---

## 📚 Documentation Checklist

- [ ] Read STRAPI_QUICK_START.md (overview)
- [ ] Referred to STRAPI_SETUP.md (detailed steps)
- [ ] Checked STRAPI_MIGRATION.md (frontend updates)
- [ ] Reviewed docs/STRAPI_CONTENT_SCHEMA.md (field reference)
- [ ] Understood ARCHITECTURE_DIAGRAMS.md (system design)
- [ ] Have IMPLEMENTATION_GUIDE.md for reference

---

## 🚀 Phase 11: Optional - Production Preparation

When ready to deploy:

- [ ] Deploy Strapi (Strapi Cloud easiest)
  - [ ] Sign up at https://strapi.io/cloud
  - [ ] Create new Strapi project
  - [ ] Copy production Strapi URL

- [ ] Update Next.js for production:
  - [ ] In Vercel dashboard (or your hosting):
    ```
    NEXT_PUBLIC_STRAPI_URL=https://your-strapi-domain.com
    STRAPI_API_TOKEN=your_production_token
    ```

- [ ] Generate new API token in production Strapi
- [ ] Test on staging environment first
- [ ] Deploy Next.js to Vercel (or your hosting)
- [ ] Test production site

---

## 🐛 Troubleshooting

### Issue: "ECONNREFUSED at localhost:1337"

- [ ] Strapi not running
- [ ] Solution: Start Strapi with `npm run develop`

### Issue: "Unauthorized" when fetching projects

- [ ] API token invalid or missing
- [ ] Solution: Verify `STRAPI_API_TOKEN` in `.env.local`

### Issue: Images not uploading to Cloudinary

- [ ] Cloudinary credentials wrong
- [ ] Solution: Check Cloudinary settings in `strapi-cms/.env`

### Issue: Project not showing on frontend

- [ ] Project not published (still draft)
- [ ] Solution: Press "Publish" button in Strapi, not just "Save"

### Issue: "Image with src has placeholder='blur'"

- [ ] Missing blurDataURL in image component
- [ ] Solution: Already fixed in `lib/strapi-api.ts`

---

## 📞 Support Resources

If stuck:

1. **Check documentation:**
   - STRAPI_QUICK_START.md
   - STRAPI_SETUP.md
   - docs/STRAPI_CONTENT_SCHEMA.md

2. **Check official docs:**
   - https://docs.strapi.io
   - https://cloudinary.com/documentation
   - https://nextjs.org/docs

3. **Common solutions:**

   ```bash
   # Clear cache and restart
   rm -rf .next
   npm run dev

   # Restart Strapi
   npm run develop

   # Check running processes
   lsof -i :1337  # Strapi
   lsof -i :3000  # Next.js
   ```

---

## ✨ Completion Status

Track your progress with this summary:

```
PHASE 1: Preparation          ☐ 0% → ☑ 100%
PHASE 2: Strapi Backend       ☐ 0% → ☑ 100%
PHASE 3: Cloudinary Config    ☐ 0% → ☑ 100%
PHASE 4: Content Type         ☐ 0% → ☑ 100%
PHASE 5: API Token            ☐ 0% → ☑ 100%
PHASE 6: Next.js Env          ☐ 0% → ☑ 100%
PHASE 7: Test Project         ☐ 0% → ☑ 100%
PHASE 8: Update Imports       ☐ 0% → ☑ 100%
PHASE 9: Testing              ☐ 0% → ☑ 100%
PHASE 10: Verification        ☐ 0% → ☑ 100%

TOTAL PROGRESS: [████████████████████] 100% ✅
```

---

## 🎊 You're Done!

When all items are checked, you have successfully:

✅ Set up Strapi CMS with professional admin interface
✅ Configured Cloudinary for automatic image hosting
✅ Connected Next.js frontend to Strapi backend
✅ Migrated from JSON to full CMS solution
✅ Enabled automatic image optimization via CDN
✅ Created scalable content management system

Your team can now:

- 🎨 Manage projects without coding
- 📸 Upload images that auto-optimize
- 🌐 Work from anywhere (web-based admin)
- ⚡ Publish instantly to live site
- 🔄 Version control and rollback content

**Congratulations! You're ready for production! 🚀**

---

For next steps, see: **IMPLEMENTATION_GUIDE.md** → Production Deployment section
