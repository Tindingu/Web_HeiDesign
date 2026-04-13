# Strapi Content Type Schema for ICEP Design

Complete schema definition for the Project content type with field descriptions and validation rules.

---

## Project Content Type

### API ID: `project`

### Display Name: `Project`

### Singular: `Project`

### Plural: `Projects`

---

## Field Definitions

### Category: Basic Information

#### 1. **title**

- **Type:** Text (Short Text)
- **Required:** ✅ Yes
- **Unique:** ✅ Yes
- **Max length:** 255 characters
- **Description:** Project name (e.g., "Penthouse Skyline")
- **Example:** "Penthouse Skyline"

#### 2. **slug**

- **Type:** UID (Auto-slug)
- **Linked to:** `title`
- **Required:** ✅ Yes
- **Auto-generate:** On update
- **Description:** URL-friendly identifier
- **Example:** "penthouse-skyline"

#### 3. **summary**

- **Type:** Text (Textarea)
- **Required:** ✅ Yes
- **Max length:** 500 characters (recommended)
- **Description:** Short description for cards and previews
- **Example:** "Căn penthouse toàn cảnh kết hợp gỗ ấm áp và đá tự nhiên"

#### 4. **description**

- **Type:** Text (Textarea)
- **Required:** ✅ Yes
- **Max length:** 5000 characters (recommended)
- **Description:** Full description of the project
- **Example:** "Dự án Penthouse Skyline là một tuyệt tác thiết kế nội thất hạng sang..."
- **Note:** Supports line breaks (`\n`)

#### 5. **category**

- **Type:** Text (Enumeration)
- **Required:** ✅ Yes
- **Options:**
  - `Biệt Thự` (Villa)
  - `Nhà Phố` (Townhouse)
  - `Căn Hộ` (Apartment)
  - `Công Trình Dịch Vụ` (Services)
- **Example:** "Căn Hộ"

#### 6. **style**

- **Type:** Text (Enumeration)
- **Required:** ✅ Yes
- **Options:**
  - `Hiện Đại` (Modern)
  - `Tân Cổ Điển` (Neoclassical)
  - `Minimalism` (Minimalism)
  - `Japandi` (Japandi)
  - `Wabi Sabi` (Wabi Sabi)
  - `Tropical` (Tropical)
  - `Modern Luxury` (Modern Luxury)
- **Example:** "Hiện Đại"

#### 7. **budget**

- **Type:** Text (Short Text)
- **Required:** ✅ Yes
- **Max length:** 100 characters
- **Description:** Project budget range (no calculation)
- **Example:** "2-3 tỷ"
- **Other examples:**
  - "< 500 triệu"
  - "500 triệu - 1 tỷ"
  - "1 - 2 tỷ"

---

### Category: Media

#### 8. **coverImage**

- **Type:** Media (Single)
- **Required:** ✅ Yes
- **Allowed types:** Image files
- **Accepted formats:** .jpg, .png, .webp, .avif
- **Description:** Featured image for project cards
- **Optimal size:** 1200x800 px
- **Note:** Automatically uploaded to Cloudinary

#### 9. **gallery**

- **Type:** Media (Multiple)
- **Required:** ❌ No (but recommended)
- **Allowed types:** Image files
- **Description:** Project photos gallery (displayed in grid)
- **Optimal size:** 600x600 px each
- **Note:** Order matters - first image shows first
- **Max files:** No limit (performance: keep under 50)

---

### Category: Project Details

#### 10. **client**

- **Type:** Text (Short Text)
- **Required:** ❌ No
- **Max length:** 255 characters
- **Description:** Client name
- **Example:** "Chị Linh"

#### 11. **location**

- **Type:** Text (Short Text)
- **Required:** ❌ No
- **Max length:** 255 characters
- **Description:** Project location (district, city)
- **Example:** "Quận 7, TP.HCM"

#### 12. **area**

- **Type:** Text (Short Text)
- **Required:** ❌ No
- **Max length:** 50 characters
- **Description:** Total area with unit
- **Example:** "320 m²"

#### 13. **duration**

- **Type:** Text (Short Text)
- **Required:** ❌ No
- **Max length:** 100 characters
- **Description:** Project duration
- **Example:** "6 months" or "6 tháng"

#### 14. **scope**

- **Type:** Text (Textarea)
- **Required:** ❌ No
- **Max length:** 1000 characters
- **Description:** Project scope (what's included)
- **Example:** "Thiết kế nước ngoài, thi công toàn bộ"

#### 15. **completedDate**

- **Type:** Date
- **Required:** ❌ No
- **Description:** Project completion date
- **Format:** YYYY-MM-DD
- **Example:** 2024-06-15

---

### Category: Additional

#### 16. **featured**

- **Type:** Boolean
- **Default value:** false
- **Description:** Show on homepage featured section?
- **Impact:** When true, project appears in getFeaturedProjects()
- **Example:** true (for showcase projects)

#### 17. **highlights**

- **Type:** JSON
- **Required:** ❌ No
- **Description:** Key highlights (bullet points)
- **Format:**
  ```json
  [
    "Thiết kế hiện đại với các chi tiết tinh tế",
    "Sử dụng vật liệu cao cấp nhập khẩu",
    "Thi công nhanh với chất lượng đảm bảo"
  ]
  ```
- **Note:** Display as bullet list on detail page

---

### Category: SEO (Optional but Recommended)

#### 18. **seoTitle**

- **Type:** Text (Short Text)
- **Required:** ❌ No
- **Max length:** 60 characters (for Google)
- **Description:** SEO page title
- **Example:** "Penthouse Skyline | Thiết kế nội thất cao cấp | ICEP"
- **Fallback:** Uses `title` if not set

#### 19. **seoDescription**

- **Type:** Text (Textarea)
- **Required:** ❌ No
- **Max length:** 160 characters (for Google)
- **Description:** SEO meta description
- **Example:** "Căn penthouse toàn cảnh với thiết kế hiện đại, kết hợp gỗ ấm áp và đá tự nhiên..."
- **Fallback:** Uses `summary` if not set

#### 20. **seoImage**

- **Type:** Media (Single)
- **Required:** ❌ No
- **Description:** Image for Open Graph (social sharing)
- **Optimal size:** 1200x630 px
- **Fallback:** Uses `coverImage` if not set

---

## Advanced Fields (Optional)

### Sections (for page layout flexibility)

If you want flexible content blocks, add:

#### **contentBlocks** (Dynamic Zones)

Create a Dynamic Zone with these components:

**Component 1: textSection**

- `title` (Text)
- `content` (Textarea)

**Component 2: imageSection**

- `image` (Media - Single)
- `caption` (Text)

**Component 3: gallerySection**

- `images` (Media - Multiple)
- `title` (Text)

This allows flexible "content + image" combinations without hardcoding layout.

---

## Database Schema (Internal)

```typescript
// Strapi internal schema (for reference)
Project {
  id: number
  createdAt: datetime
  updatedAt: datetime
  publishedAt: datetime (nullable)

  // Basic Info
  title: string (required, unique)
  slug: string (required)
  summary: string (required)
  description: string (required)
  category: string (enum, required)
  style: string (enum, required)
  budget: string (required)

  // Media
  coverImage: {
    id: number
    url: string
    formats: {
      small, medium, large, thumbnail
    }
    alternativeText: string
    caption: string
  }
  gallery: Array<{
    id: number
    url: string
    alternativeText: string
  }>

  // Details
  client: string
  location: string
  area: string
  duration: string
  scope: string
  completedDate: date

  // Additional
  featured: boolean
  highlights: json

  // SEO
  seoTitle: string
  seoDescription: string
  seoImage: { id, url }
}
```

---

## Validation Rules

### Required Fields (Cannot be empty):

- ✅ title
- ✅ slug
- ✅ summary
- ✅ description
- ✅ category
- ✅ style
- ✅ budget
- ✅ coverImage

### Unique Fields:

- ✅ title
- ✅ slug

### Length Limits:

- title: max 255 chars
- summary: recommend max 500 chars
- description: recommend max 5000 chars
- Other text fields: max 255 chars

### Enum Constraints:

- category: must be one of 4 options
- style: must be one of 7 options

---

## Input Examples

### Minimal Project (Required fields only):

```json
{
  "title": "Simple Apartment",
  "slug": "simple-apartment",
  "summary": "A clean, modern apartment",
  "description": "This is a beautifully designed apartment with...",
  "category": "Căn Hộ",
  "style": "Hiện Đại",
  "budget": "1-2 tỷ",
  "coverImage": 123 // Reference to uploaded image
}
```

### Complete Project (All fields):

```json
{
  "title": "Penthouse Skyline",
  "slug": "penthouse-skyline",
  "summary": "Căn penthouse toàn cảnh kết hợp gỗ ấm áp và đá tự nhiên",
  "description": "Dự án Penthouse Skyline là một tuyệt tác thiết kế nội thất...",
  "category": "Căn Hộ",
  "style": "Hiện Đại",
  "budget": "3-5 tỷ",
  "coverImage": 123,
  "gallery": [456, 457, 458],
  "client": "Chị Linh",
  "location": "Quận 7, TP.HCM",
  "area": "320 m²",
  "duration": "6 months",
  "scope": "Thiết kế nước ngoài, thi công toàn bộ",
  "completedDate": "2024-06-15",
  "featured": true,
  "highlights": ["Thiết kế hiện đại", "Vật liệu cao cấp", "Thi công nhanh"],
  "seoTitle": "Penthouse Skyline | ICEP Design",
  "seoDescription": "Căn penthouse toàn cảnh với thiết kế hiện đại...",
  "seoImage": 789
}
```

---

## Frontend Type Mapping

How Strapi fields map to Next.js types:

```typescript
// Strapi → Next.js
{
  title: string
  slug: string
  summary: string
  description: string
  category: string
  style: string
  budget: string
  coverImage: {
    url: string
    alt: string  // From alternativeText
  }
  gallery: Array<{
    url: string
    alt: string
  }>
  client?: string
  location?: string
  area?: string
  duration?: string
  scope?: string
  completedDate?: string
  featured: boolean
  highlights?: string[]
  seoTitle?: string
  seoDescription?: string
  seoImage?: {
    url: string
  }
  createdAt: string
  updatedAt: string
}
```

---

## Publishing Workflow

### Draft Status:

- Project created but not visible to users
- Only admins see in Content Manager
- Not returned by API queries

### Published Status:

- Project visible to users
- Returned by API queries
- Appears on homepage if `featured=true`

**Important:** Always **Publish** projects, don't just Save!

---

## Best Practices

1. **Always include featured image** (coverImage)
2. **Upload gallery before publishing** - better UX
3. **Use descriptive alt text** for accessibility
4. **Keep descriptions under 5000 chars** for performance
5. **Use consistent category/style values**
6. **Fill SEO fields manually** (not auto-generated)
7. **Add highlights** for better presentation
8. **Test on mobile** before publishing
9. **Batch upload images** via Media Library first
10. **Review on frontend** after publishing

---

## Troubleshooting

### Image not appearing after upload?

- Verify Cloudinary credentials are correct
- Check image is published (not just saved)
- Clear browser cache and hard refresh (Ctrl+Shift+R)

### Slug not auto-generating?

- Check title field is filled first
- Try clicking outside title field
- Manually edit slug if needed

### Images broken on frontend?

- Verify image URL is from Cloudinary (res.cloudinary.com)
- Check Cloudinary media library
- Verify next.config.js includes Cloudinary domain

### Changes not showing on frontend?

- Check project is Published (not Draft)
- Restart Next.js dev server
- Clear .next folder
- Wait for revalidate interval (default 1 hour)

---

**More help?** Check STRAPI_QUICK_START.md or STRAPI_SETUP.md
