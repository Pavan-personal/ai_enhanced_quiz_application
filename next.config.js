/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["pdf2json"],
    // reactStrictMode: true,
    swcMinify: true,
    
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "cdn-icons-png.flaticon.com",
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/***',
        search: '',
      },
    ],
  },
};
module.exports = nextConfig;
