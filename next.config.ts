import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  images: {
    domains: [
      'picsum.photos',
      'jjkxuozeqkblmkvbgkso.supabase.co',
      'us-west-2.graphassets.com'
    ],
  },
// Optimize font loading
  experimental: {
    optimizeCss: true,
  },
  // Ensure static assets are properly served
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
};

export default nextConfig;
