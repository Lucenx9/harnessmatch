import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "commandcode.ai" },
      { protocol: "https", hostname: "www.codebuff.com" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "mux.coder.com" },
      { protocol: "https", hostname: "zcode.z.ai" },
      { protocol: "https", hostname: "stagewise.io" },
    ],
  },
};

export default nextConfig;
