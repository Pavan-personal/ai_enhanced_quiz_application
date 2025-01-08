/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf2json"],
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: ["cdn-icons-png.flaticon.com", "lh3.googleusercontent.com"],
    },
  },
};
module.exports = nextConfig;
