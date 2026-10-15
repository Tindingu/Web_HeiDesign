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
        pathname: "/dfazfoh2l/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    // pg reads sslrootcert from DATABASE_URL at runtime. Include the CA in
    // every server bundle so the relative path also exists on Vercel.
    outputFileTracingIncludes: {
      "/*": ["./botkeep-ca.pem"],
    },
    // Static generation reads from PostgreSQL. Keeping the worker count low
    // prevents parallel build workers from exhausting Botkeep connections.
    cpus: 2,
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
