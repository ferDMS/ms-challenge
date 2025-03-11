import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001",
  },
  // While Next.js automatically uses process.env.PORT,
  // we can make sure it's consistently documented here
  server: {
    port: parseInt(process.env.PORT || "3000", 10),
    host: "0.0.0.0",
  },
};

export default nextConfig;
