export const siteConfig = {
  name: "HEI Design",
  legalName: "Thiết Kế Thi Công Nội Thất - Kiến Trúc Hei Design",
  alternateName: ["HEI Design", "Hei Design"],
  description:
    "HEI Design là thương hiệu thiết kế nội thất, thi công nội thất và kiến trúc cao cấp tại TP.HCM, chuyên tạo nên không gian sống hiện đại, sang trọng và tinh tế.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://heidesign.vn",
  logoUrl:
    "https://res.cloudinary.com/dfazfoh2l/image/upload/v1785229550/logo_vutskb.webp",
  phone: "0904465448",
  displayPhone: "0904 465 448",
  email: "heidesigninterior@gmail.com",
  address:
    "17 Hẻm 710 Phan Văn Trị, KDC Cityland Park Hills, Gò Vấp, Hồ Chí Minh 700000",
  streetAddress: "17 Hẻm 710 Phan Văn Trị, KDC Cityland Park Hills, Gò Vấp",
  addressLocality: "Hồ Chí Minh",
  addressRegion: "Hồ Chí Minh",
  postalCode: "700000",
  addressCountry: "VN",
  mapUrl: "https://maps.app.goo.gl/yjPd8cWkYVqPC45U6",
  openingHours: "Mo-Sa 08:00-17:30",
  zaloUrl:
    process.env.NEXT_PUBLIC_ZALO_URL ??
    `https://zalo.me/${process.env.NEXT_PUBLIC_PHONE ?? "0904465448"}`,
  facebookUrl:
    process.env.NEXT_PUBLIC_FACEBOOK_URL ??
    process.env.NEXT_PUBLIC_MESSENGER_URL ??
    "https://m.me/",
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
    "https://www.instagram.com/heidesign_interior/",
  tiktokUrl:
    process.env.NEXT_PUBLIC_TIKTOK_URL ?? "https://www.tiktok.com/@hei.design",
  youtubeUrl:
    process.env.NEXT_PUBLIC_YOUTUBE_URL ??
    "https://www.youtube.com/@HeiDesign-N%E1%BB%99iTh%E1%BA%A5tThiC%C3%B4ng",
};

export const defaultBlurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAyMCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTQiIGZpbGw9IiMyNDJDNDAiLz48L3N2Zz4=";
