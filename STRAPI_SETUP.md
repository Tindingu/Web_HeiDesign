# Strapi + Cloudinary Setup Guide

## Overview

This guide will help you set up Strapi CMS with automatic Cloudinary image uploads for the ICEP Design project.

## Prerequisites

- Node.js 18+
- npm or yarn
- Cloudinary account (Cloud Name: dfazfoh2l)
- Git

## Step 1: Create Strapi Project

### 1.1 Create new Strapi installation (separate from Next.js)

```bash
# In a new directory (outside your Next.js project)
mkdir strapi-cms
cd strapi-cms
npx create-strapi-app@latest . --quickstart
```

This will:

- Install Strapi
- Create default SQLite database
- Generate admin account
- Start development server on http://localhost:1337

### 1.2 Save your Strapi URL

Keep note: `http://localhost:1337`

---

## Step 2: Configure Cloudinary Provider

### 2.1 Install Cloudinary Provider Package

In your Strapi project:

```bash
npm install @strapi/provider-upload-cloudinary
```

### 2.2 Configure in `config/plugins.js`

Create or update file: `config/plugins.js`

```javascript
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
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

### 2.3 Set Environment Variables in Strapi

Create `.env` file in your Strapi root:

```dotenv
CLOUDINARY_NAME=dfazfoh2l
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

**Get your credentials from Cloudinary:**

1. Go to https://cloudinary.com/console/settings/api-keys
2. Copy your API Key and API Secret
3. Paste into .env file

### 2.4 Restart Strapi

```bash
npm run develop
```

---

## Step 3: Create Project Content Type

### 3.1 Access Strapi Admin

Open: http://localhost:1337/admin

### 3.2 Create Content Type "Project"

1. Click **Content-Type Builder** (left menu)
2. Click **Create new collection type**
3. Name it: `project` (singular)
4. Click **Continue**

### 3.3 Add Fields to Project Content Type

**Add these fields in order:**

#### 3.3.1 Basic Information

1. **title** (Text - Short text, Required, Unique)
2. **slug** (UID, linked to title, Required)
3. **summary** (Text - Textarea, Required)
4. **description** (Text - Textarea, Required)
5. **category** (Text - Enumeration)
   - Options: `Biệt Thự`, `Nhà Phố`, `Căn Hộ`, `Công Trình Dịch Vụ`
6. **style** (Text - Enumeration)
   - Options: `Hiện Đại`, `Tân Cổ Điển`, `Minimalism`, `Japandi`, `Wabi Sabi`, `Tropical`, `Modern Luxury`
7. **budget** (Text - Short text)
   - Example: "2-3 tỷ", "1-2 tỷ"

#### 3.3.2 Media Fields

8. **coverImage** (Media - Single media)
9. **gallery** (Media - Multiple media)

#### 3.3.3 Project Details

10. **client** (Text - Short text)
11. **location** (Text - Short text)
12. **area** (Text - Short text, Example: "320 m²")
13. **duration** (Text - Short text, Example: "6 months")
14. **scope** (Text - Textarea)
15. **completedDate** (Date)

#### 3.3.4 Additional Fields

16. **featured** (Boolean, Default: false)
17. **highlights** (JSON - array of strings)
    - Store highlight bullet points

#### 3.3.5 SEO Fields

18. **seoTitle** (Text - Short text)
19. **seoDescription** (Text - Textarea, max 160 chars)
20. **seoImage** (Media - Single media)

### 3.4 Save Content Type

Click **Save** in top right corner

---

## Step 4: Dynamic Zones (Optional - Advanced)

If you want to add content blocks like sections with alternating images and text:

1. Add new field to Project: **contentBlocks** (Dynamic Zones)
2. Add component: **textBlock**
   - Add field: `content` (Textarea)
3. Add component: **imageBlock**
   - Add field: `image` (Media - Single)
4. Add component: **galleryBlock**
   - Add field: `images` (Media - Multiple)

This allows flexible content without hardcoding layout.

---

## Step 5: Create API Token

### 5.1 Create API Token

1. In Strapi Admin, click **Settings** (bottom left)
2. Go to **API Tokens**
3. Click **Create new API Token**
4. Name: `Next.js Frontend`
5. Description: `Access from Next.js`
6. Select **Read** for all content types
7. Click **Save**
8. **Copy the token!**

### 5.2 Add Token to Next.js

Create `.env.local` in your Next.js project:

```dotenv
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_copied_token_here
```

---

## Step 6: Update Next.js Config

Update `next.config.js`:

```javascript
import withMDX from "@next/mdx";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dfazfoh2l/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withMDX()(nextConfig);
```

---

## Step 7: Update Frontend API Routes

Create/Update `lib/strapi.ts` to fetch from Strapi API:

```typescript
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const API_TOKEN = process.env.STRAPI_API_TOKEN;

export type Project = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  style: string;
  budget: string;
  coverImage: {
    id: number;
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  gallery: Array<{
    id: number;
    url: string;
    alt?: string;
  }>;
  client?: string;
  location?: string;
  area?: string;
  duration?: string;
  scope?: string;
  completedDate?: string;
  featured: boolean;
  highlights?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: {
    id: number;
    url: string;
  };
  createdAt: string;
  updatedAt: string;
};

async function fetchStrapi(path: string) {
  const url = `${STRAPI_URL}/api${path}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Strapi error: ${response.statusText}`);
  }

  return response.json();
}

export async function getProjects(): Promise<Project[]> {
  const data = await fetchStrapi(
    "/projects?populate=coverImage,gallery,seoImage&sort=createdAt:desc",
  );
  return data.data.map(mapProject);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const data = await fetchStrapi(
    "/projects?filters[featured][$eq]=true&populate=coverImage,gallery&sort=createdAt:desc&pagination[limit]=3",
  );
  return data.data.map(mapProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const data = await fetchStrapi(
    `/projects?filters[slug][$eq]=${slug}&populate=*`,
  );

  if (data.data.length === 0) return null;
  return mapProject(data.data[0]);
}

export async function getProjectSlugs(): Promise<string[]> {
  const data = await fetchStrapi(
    "/projects?fields=slug&pagination[limit]=1000",
  );
  return data.data.map((p: any) => p.slug);
}

function mapProject(item: any): Project {
  const baseUrl = STRAPI_URL;

  const getImageUrl = (image: any) => {
    if (!image) return "";
    if (image.url?.startsWith("http")) return image.url;
    return `${baseUrl}${image.url}`;
  };

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    summary: item.summary,
    description: item.description,
    category: item.category,
    style: item.style,
    budget: item.budget,
    coverImage: {
      id: item.coverImage?.id || 0,
      url: getImageUrl(item.coverImage),
      alt: item.coverImage?.alternativeText || item.title,
    },
    gallery: (item.gallery || []).map((img: any) => ({
      id: img.id,
      url: getImageUrl(img),
      alt: img.alternativeText || item.title,
    })),
    client: item.client,
    location: item.location,
    area: item.area,
    duration: item.duration,
    scope: item.scope,
    completedDate: item.completedDate,
    featured: item.featured || false,
    highlights: item.highlights || [],
    seoTitle: item.seoTitle || item.title,
    seoDescription: item.seoDescription || item.summary,
    seoImage: item.seoImage
      ? {
          id: item.seoImage.id,
          url: getImageUrl(item.seoImage),
        }
      : undefined,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}
```

---

## Step 8: Testing

### 8.1 Create Test Project in Strapi

1. Open http://localhost:1337/admin
2. Go to **Content Manager** > **Projects**
3. Click **Create new entry**
4. Fill in all fields
5. Upload images (they'll auto-upload to Cloudinary)
6. Click **Save** and then **Publish**

### 8.2 Test in Next.js

1. Open http://localhost:3000
2. Check if new project appears
3. Click on project to view detail page
4. Verify images load from Cloudinary

---

## Troubleshooting

### Images not uploading to Cloudinary?

- Verify Cloudinary credentials in Strapi `.env`
- Check Cloudinary API limits haven't been exceeded
- Restart Strapi: `npm run develop`

### Getting 404 from Strapi API?

- Verify Strapi is running on port 1337
- Check API token is correct
- Verify content is published (not just drafted)

### Images showing broken on Next.js?

- Check `next.config.js` remotePatterns includes Cloudinary domain
- Verify image URLs start with `https://res.cloudinary.com`
- Clear `.next` folder and rebuild

### CORS errors?

- In Strapi, go to Settings > CORS
- Add your Next.js URL: `http://localhost:3000`

---

## Production Deployment

### For Vercel (Next.js):

```bash
vercel env add NEXT_PUBLIC_STRAPI_URL https://your-strapi-domain.com
vercel env add STRAPI_API_TOKEN your_token
```

### For Strapi Hosting:

- Use Strapi Cloud: https://strapi.io/cloud
- Or self-host on Heroku, DigitalOcean, etc.
- Always use production Cloudinary credentials

---

## File Structure After Setup

```
icep-design/
├── .env.local (your secrets)
├── .env.example (template)
├── next.config.js (updated)
├── lib/
│   ├── strapi.ts (updated)
│   └── seo.ts
├── app/
│   ├── du-an/
│   │   └── [slug]/
│   │       └── page.tsx (updated)
│   └── page.tsx
└── components/
    └── home/
        └── featured-projects.tsx

strapi-cms/ (separate folder)
├── .env
├── config/
│   └── plugins.js (Cloudinary config)
├── src/
│   └── api/
│       └── project/ (auto-generated)
└── package.json
```

---

## Next Steps

1. ✅ Set up Strapi project
2. ✅ Configure Cloudinary provider
3. ✅ Create Project content type
4. ✅ Generate API token
5. ✅ Update Next.js config
6. ✅ Create test project
7. Create admin dashboard for managing projects
8. Set up preview URLs in Strapi
9. Configure webhooks for auto-deployment

---

**Questions?** Check Strapi docs: https://docs.strapi.io
