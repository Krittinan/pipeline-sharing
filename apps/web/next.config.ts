import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // build shared package จาก source ได้ตรงๆ
  transpilePackages: ['@repo/shared'],
  images: {
    // จำกัด host ที่ image optimizer ยอมโหลด (กัน open-proxy/SSRF) — เพิ่ม host ตามที่ใช้จริง
    remotePatterns: [{ protocol: 'https', hostname: 'i.pravatar.cc' }],
  },
};

export default nextConfig;
