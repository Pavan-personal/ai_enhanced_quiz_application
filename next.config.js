/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf2json"],
    images: {
      domains: ["cdn-icons-png.flaticon.com", "https://lh3.googleusercontent.com/a/"],
    },
  },
};
module.exports = nextConfig;
