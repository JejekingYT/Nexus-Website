import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
    ],
  },

  serverExternalPackages: [
    "discord.js",
    "@discordjs/ws",
  ],
};

export default nextConfig;