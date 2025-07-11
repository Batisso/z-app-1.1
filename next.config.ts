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
};

export default nextConfig;
