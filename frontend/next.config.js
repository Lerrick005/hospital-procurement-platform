/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['localhost'],
    },
    reactStrictMode: true,
    swcMinify: true,
    poweredByHeader: false,
    compress: true,
  }
  
  module.exports = nextConfig