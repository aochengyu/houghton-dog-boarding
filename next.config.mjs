/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    // Build the CSP string
    const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : "*.supabase.co";

    const csp = [
      "default-src 'self'",
      // Next.js requires 'unsafe-inline' for its hydration scripts
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Tailwind uses inline styles; Google Fonts CDN
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      // Supabase storage for pet photos + data URIs for Next Image
      `img-src 'self' data: blob: https://${supabaseHost} https://*.supabase.co`,
      // Supabase REST + realtime WebSocket
      `connect-src 'self' https://${supabaseHost} https://*.supabase.co wss://${supabaseHost} wss://*.supabase.co`,
      // Lock down everything else
      "media-src 'none'",
      "object-src 'none'",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "X-Frame-Options",          value: "DENY" },
          { key: "X-XSS-Protection",         value: "1; mode=block" },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = { poll: 1000, aggregateTimeout: 300 };
    }
    return config;
  },
};
export default nextConfig;
