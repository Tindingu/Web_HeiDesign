# ICEP Design - Local Images

All images are now stored locally in `/public/upload/`.

## Folder Structure

```
/public/upload/
├── banner/          # Hero images, banners, background videos
├── projects/        # Portfolio project images
└── blog/           # Blog post cover images
```

## Adding New Images

1. Place images in the appropriate subdirectory
2. Reference them in components using paths like:
   - `/upload/banner/hero-cover.jpg`
   - `/upload/projects/project-1.jpg`
   - `/upload/blog/blog-1.jpg`

## Mock Data Images

To run the project with demo content, add these placeholder images:

### Banner

- `hero-cover.jpg` (1920x1080)
- `hero-video.mp4` (optional video)
- `simulator-base.jpg` (1600x900)

### Projects

- `project-1.jpg`, `project-1a.jpg`, `project-1b.jpg`, `project-1c.jpg`
- `project-2.jpg`

### Blog

- `blog-1.jpg`

Next.js Image optimization will automatically generate optimized versions (WebP, AVIF) on demand.
