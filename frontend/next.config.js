/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000'
  },
  // Configuration for Vercel deployment
  output: process.env.VERCEL ? 'export' : undefined,
  images: {
    unoptimized: process.env.VERCEL ? true : false
  },
  // Handle rewrites for API routes when using static export
  async rewrites() {
    if (process.env.VERCEL) {
      return [
        {
          source: '/api/:path*',
          destination: '/api/mock-api'
        }
      ];
    }
    return [];
  }
}

module.exports = nextConfig
