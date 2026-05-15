/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
    NEXT_PUBLIC_PYTHON_BACKEND_URL: process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || 'http://localhost:8000',
    NEXT_PUBLIC_GO_BACKEND_URL: process.env.NEXT_PUBLIC_GO_BACKEND_URL || 'http://localhost:8000',
    NEXT_PUBLIC_NODEJS_BACKEND_URL: process.env.NEXT_PUBLIC_NODEJS_BACKEND_URL || 'http://localhost:8001',
    NEXT_PUBLIC_DEFAULT_BACKEND: process.env.NEXT_PUBLIC_DEFAULT_BACKEND || 'go',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000'
  }
}

module.exports = nextConfig
