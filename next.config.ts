import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/assistant-manager-chemistry-awc-test-preparation',
        destination: '/awc-test-preparation',
        permanent: true, // 301 redirect
      },
      {
        source: '/:prefix*/first-year/:path*',
        destination: 'https://daanistan.com',
        permanent: true, // 301 redirect
      },
    ];
  },
};

export default nextConfig;