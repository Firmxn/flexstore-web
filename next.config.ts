import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // AGENTS.md di root proyek ditulis manual; jangan biarkan Next.js
  // menimpanya dengan versi generate-an.
  agentRules: false,
  images: {
    // Uploadthing menyajikan file dari domain ufs.sh / utfs.io.
    // picsum.photos dipakai oleh data seed.
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "**.ufs.sh" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
