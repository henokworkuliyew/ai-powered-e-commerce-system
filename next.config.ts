/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },

  images: {
    domains: ['images.unsplash.com', 'images.pexels.com'],
  },
  experimental: {
    turbo: false,
  },
}

module.exports = nextConfig
