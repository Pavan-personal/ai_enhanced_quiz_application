/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf2json"],
    images: {
      domains: ["cdn-icons-png.flaticon.com"],
    },
  },
};

module.exports = nextConfig;
