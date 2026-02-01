import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xtralifemarketing.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/store/:path*",
        destination: "http://localhost:9000/store/:path*",
      },
      {
        source: "/admin/:path*",
        destination: "http://localhost:9000/admin/:path*",
      },
      {
        source: "/auth/:path*",
        destination: "http://localhost:9000/auth/:path*",
      },
    ];
  },
};

export default nextConfig;
