/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["res.cloudinary.com", "www.meiji.co.jp"], // 両方のホスト名を配列に含める
  },
};

export default nextConfig;
