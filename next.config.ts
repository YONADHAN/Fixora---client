import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fixora-storage-yonadhan.s3.ap-south-1.amazonaws.com',
      },
    ],
  },
}

export default nextConfig
