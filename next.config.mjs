/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["res.cloudinary.com"], // Cloudinary のホストを追加
  },
};

export default nextConfig;
