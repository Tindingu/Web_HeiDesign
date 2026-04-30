export const siteConfig = {
  name: "ICEP Design",
  description:
    "Đơn vị thiết kế và thi công nội thất trọn gói chuyên nghiệp cho không gian cao cấp.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://icepdesign.vn",
  phone: "0795743429",
  email: "info@icepdesign.vn",
  address: "Thành phố Hồ Chí Minh, Việt Nam",
  zaloUrl:
    process.env.NEXT_PUBLIC_ZALO_URL ??
    `https://zalo.me/${process.env.NEXT_PUBLIC_PHONE ?? "0795743429"}`,
  facebookUrl:
    process.env.NEXT_PUBLIC_FACEBOOK_URL ??
    process.env.NEXT_PUBLIC_MESSENGER_URL ??
    "https://m.me/",
};

export const defaultBlurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAyMCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTQiIGZpbGw9IiMyNDJDNDAiLz48L3N2Zz4=";
