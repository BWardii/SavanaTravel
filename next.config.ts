import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/admin/enquiries", destination: "/admin/2026/enquiries", permanent: false },
      { source: "/admin/contacts", destination: "/admin/2026/contacts", permanent: false },
      { source: "/admin/manual-entry", destination: "/admin/2026/manual-entry", permanent: false },
    ];
  },
};

export default nextConfig;
