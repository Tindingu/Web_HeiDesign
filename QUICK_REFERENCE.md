# 📋 Quick Reference Card

Print this and keep it handy during setup!

---

## 📍 Important URLs

```
Strapi Admin:        http://localhost:1337/admin
Strapi API:          http://localhost:1337/api
Next.js Frontend:    http://localhost:3000
Cloudinary Console:  https://cloudinary.com/console
Cloudinary Media:    https://cloudinary.com/console/media_library
```

---

## 🔑 Credentials Storage

```
Strapi Admin:
├─ Email: admin@icepdesign.com
├─ Password: [Your secure password]
└─ Keep safe!

API Token:
├─ Token: [Generated in Strapi admin]
├─ Location: icep-design/.env.local
├─ Name: STRAPI_API_TOKEN
└─ ⚠️ Can only see once!

Cloudinary:
├─ Cloud Name: dfazfoh2l
├─ API Key: [From settings]
├─ API Secret: [From settings - KEEP SAFE]
├─ Location: strapi-cms/.env
└─ Get from: https://cloudinary.com/console/settings/api-keys
```

---

## ⚡ Essential Commands

```bash
# Strapi
cd strapi-cms
npm install @strapi/provider-upload-cloudinary
npm run develop          # Start Strapi on :1337

# Next.js
cd icep-design
npm run dev             # Start Next.js on :3000

# Utilities
npm run build           # Production build
npm run lint            # Check code
git diff               # See changes
```

---

## 📁 Key File Locations

```
icep-design/
├─ .env.local (secrets - CREATE THIS)
│   ├─ NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
│   ├─ STRAPI_API_TOKEN=your_token
│   └─ NEXT_PUBLIC_SITE_URL=https://icepdesign.vn
│
├─ next.config.js (ALREADY UPDATED ✅)
│
├─ lib/strapi-api.ts (ALREADY CREATED ✅)
│
└─ docs/
   └─ strapi-plugins.js.example (COPY TO→ strapi-cms/config/plugins.js)

strapi-cms/ (CREATE FOLDER)
├─ .env (CREATE - Cloudinary credentials)
│   ├─ CLOUDINARY_NAME=dfazfoh2l
│   ├─ CLOUDINARY_KEY=your_key
│   └─ CLOUDINARY_SECRET=your_secret
│
├─ config/plugins.js (CREATE - Copy from example)
│
├─ src/api/project/ (AUTO-CREATED)
│
└─ package.json (AUTO-CREATED)
```

---

## 🎯 Content Type Fields (Quick List)

```
REQUIRED FIELDS:
☐ title         (Text - Short text)
☐ slug          (UID - Auto from title)
☐ summary       (Text - Textarea)
☐ description   (Text - Textarea)
☐ category      (Text - Enumeration)
☐ style         (Text - Enumeration)
☐ budget        (Text - Short text)
☐ coverImage    (Media - Single)

OPTIONAL BUT RECOMMENDED:
☐ gallery       (Media - Multiple)
☐ client        (Text - Short text)
☐ location      (Text - Short text)
☐ area          (Text - Short text)
☐ duration      (Text - Short text)
☐ scope         (Text - Textarea)
☐ completedDate (Date)
☐ featured      (Boolean)
☐ highlights    (JSON)

SEO (OPTIONAL):
☐ seoTitle      (Text - Short text)
☐ seoDescription (Text - Textarea)
☐ seoImage      (Media - Single)
```

---

## 🔄 5-Phase Setup

```
PHASE 1 (5 min):
  ├─ Prerequisites check
  ├─ Copy Cloudinary credentials
  └─ Open two terminals

PHASE 2 (5 min):
  ├─ npx create-strapi-app
  ├─ Create admin account
  └─ Verify localhost:1337/admin

PHASE 3 (3 min):
  ├─ npm install provider
  ├─ Create config/plugins.js
  └─ Create .env (Cloudinary)

PHASE 4 (10 min):
  ├─ Create content type
  ├─ Add 20 fields
  ├─ Save & restart
  └─ Verify

PHASE 5 (10 min):
  ├─ Generate API token
  ├─ Create .env.local
  ├─ Update imports
  └─ Test & verify

TOTAL: ~45 minutes
```

---

## ✅ Verification Checklist

```
Strapi Setup:
☐ Admin panel opens at localhost:1337/admin
☐ Can log in with credentials
☐ Project content type visible
☐ All fields present

Cloudinary Config:
☐ Credentials in .env
☐ Provider installed
☐ Strapi restarted
☐ Admin can upload images

Next.js Setup:
☐ .env.local created with token
☐ Imports updated (3 files)
☐ Next.js running on :3000
☐ No console errors

Testing:
☐ Created test project in Strapi
☐ Uploaded image to Cloudinary
☐ Clicked PUBLISH
☐ Project shows on homepage
☐ Detail page loads
☐ Images display from Cloudinary

Success:
☐ All items above checked
☐ Site is working
☐ Images fast (CDN)
☐ Ready for production!
```

---

## 🐛 5-Minute Troubleshooting

```
Strapi won't start?
→ npm install @strapi/provider-upload-cloudinary
→ npm run develop

Images not uploading?
→ Check .env has Cloudinary credentials
→ Restart Strapi
→ Try uploading again

Project not showing?
→ Make sure you clicked PUBLISH (not just Save)
→ Check Strapi API is working
→ Restart Next.js

Images broken?
→ Check URL is from res.cloudinary.com
→ Verify CLOUDINARY_NAME=dfazfoh2l
→ Check next.config.js has remotePatterns

Getting errors in console?
→ Restart both Strapi and Next.js
→ Clear browser cache
→ Check .env files
```

---

## 🚀 Quick Command Reference

```bash
# Create Strapi
mkdir strapi-cms && cd strapi-cms
npx create-strapi-app@latest . --quickstart

# Install provider
npm install @strapi/provider-upload-cloudinary

# Start Strapi (Terminal 1)
npm run develop

# Start Next.js (Terminal 2)
cd ../icep-design
npm run dev

# Check port usage
lsof -i :1337  # Strapi
lsof -i :3000  # Next.js

# Reinstall dependencies
npm install

# Clear cache
rm -rf .next   # Next.js
rm -rf .strapi # Strapi
```

---

## ⏱️ Time Budget

```
Preparation:     5 min
Strapi setup:    5 min
Cloudinary:      3 min
Content type:    10 min
API token:       3 min
Test project:    5 min
Code updates:    2 min
Testing:         10 min
Verification:    5 min
             ─────────
TOTAL:          48 min
```

---

## 📊 Before/After Comparison

```
BEFORE:
├─ data/projects.json (manual)
├─ /public/upload/ (404 errors)
├─ No admin (code editing)
└─ Limited scalability

AFTER:
├─ Strapi admin dashboard
├─ Cloudinary CDN (fast worldwide)
├─ Professional web interface
├─ Unlimited scalability
├─ Team can manage
└─ No coding knowledge needed!
```

---

## 🎯 Success Metrics

After implementation, you'll have:

```
✅ Professional admin dashboard
✅ Zero image hosting hassles
✅ Global CDN for fast delivery
✅ Automatic image optimization
✅ No more 404 errors
✅ Team can update projects
✅ Production-ready system
✅ Unlimited scalability
✅ No coding needed for updates
✅ Professional appearance
```

---

## 📚 Documentation Quick Links

```
📍 START HERE:
   START_HERE.md
   DOCUMENTATION_INDEX.md
   STRAPI_QUICK_START.md

📖 DETAILED GUIDES:
   STRAPI_SETUP.md
   STRAPI_MIGRATION.md
   IMPLEMENTATION_GUIDE.md

📋 EXECUTE WITH:
   IMPLEMENTATION_CHECKLIST.md

📚 REFERENCE:
   docs/STRAPI_CONTENT_SCHEMA.md
   docs/ARCHITECTURE_DIAGRAMS.md
   docs/strapi-plugins.js.example
```

---

## 💡 Pro Tips

1. **Don't Use Multiple Browsers**
   - One browser, same session
   - Easier to open tabs

2. **Keep Code Editor Open**
   - For .env.local editing
   - For config/plugins.js copying

3. **Use Copy-Paste**
   - Less typos for passwords
   - Copy code from examples

4. **Test as You Go**
   - Don't wait for completion
   - Fix issues immediately
   - Easier to debug step-by-step

5. **Take Notes**
   - Write down credentials
   - Keep API token safe
   - Document any issues

---

## ⚠️ Critical Things to Remember

```
NEVER commit to git:
❌ .env (any environment variables)
❌ .env.local
❌ API tokens
❌ Credentials

ALWAYS keep safe:
✅ Strapi admin password
✅ API tokens
✅ Cloudinary credentials
✅ Database backups

ALWAYS do:
✅ PUBLISH projects (not just Save)
✅ Clear .next folder before restart
✅ Restart servers after config changes
✅ Test after each major step
```

---

## 🎉 When Everything Works

```
You'll see:
✅ Strapi dashboard fully functional
✅ Projects manageable by anyone
✅ Images automatically uploaded
✅ Website fast and professional
✅ Zero image hosting issues
✅ Team happy and productive
✅ Zero technical debt
✅ Ready to scale
```

---

## 🔗 Important Links (Bookmark These)

```
Development:
http://localhost:1337/admin      Strapi Admin
http://localhost:3000            Website
http://localhost:3000/admin/projects  Admin Dashboard

External:
https://cloudinary.com/console   Cloudinary
https://docs.strapi.io           Strapi Docs
https://nextjs.org/docs          Next.js Docs

Your Credentials:
Cloud Name: dfazfoh2l
(Others from settings)
```

---

## 📞 Help Matrix

```
If stuck on...          Check...             Time
─────────────────────────────────────────────────
"Can't access admin"    STRAPI_QUICK_START.md  5 min
"Fields won't save"     STRAPI_SETUP.md        10 min
"Images not uploading"  Troubleshooting        5 min
"Project not showing"   IMPLEMENTATION_CHK    10 min
"Code errors"           STRAPI_MIGRATION.md   10 min
"System design"         ARCHITECTURE_DIAGRAMS  5 min
```

---

## ✨ Final Reminder

```
📍 Start: STRAPI_QUICK_START.md
📋 Follow: IMPLEMENTATION_CHECKLIST.md
⏱️  Time: 45 minutes
✅ Result: Professional CMS system
🚀 Next: Deploy to production!
```

---

**Print this card and keep it during setup! 📋**

Good luck! 💪
