import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/assistant-manager-chemistry-awc-test-preparation',
        destination: '/awc-test-preparation',
        permanent: true, // 301 redirect (SEO friendly)
      },
    ]
  },
};
