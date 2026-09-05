import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  allowedDevOrigins: [
    "192.168.1.123",
    ".trycloudflare.com",
    ".ngrok-free.app",
    ".ngrok.app",
    ".loca.lt",
  ],
};

export default nextConfig;

