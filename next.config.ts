/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com'],
  },
  experimental: {
    turbo: {
      rules: {
        '*.mdx': ['mdx-loader'],
      },
    },
  },
}

module.exports = nextConfig
