export const siteConfig = {
  name: "HEI Design",
  description:
    "Đơn vị thiết kế và thi công nội thất trọn gói chuyên nghiệp cho không gian cao cấp.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://heidesign.vn",
  phone: "0904465448",
  email: "heidesigninterior@gmail.com",
  address:
    "17 Hẻm 710 Phan Văn Trị, KDC Cityland Park Hills, Gò Vấp, Hồ Chí Minh 700000",
  zaloUrl:
    process.env.NEXT_PUBLIC_ZALO_URL ??
    `https://zalo.me/${process.env.NEXT_PUBLIC_PHONE ?? "0904465448"}`,
  facebookUrl:
    process.env.NEXT_PUBLIC_FACEBOOK_URL ??
    process.env.NEXT_PUBLIC_MESSENGER_URL ??
    "https://m.me/",
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://instagram.com",
  tiktokUrl: process.env.NEXT_PUBLIC_TIKTOK_URL ?? "https://tiktok.com",
};

export const defaultBlurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAyMCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTQiIGZpbGw9IiMyNDJDNDAiLz48L3N2Zz4=";
