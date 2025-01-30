import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: isProduction ? process.env.NEXTAUTH_URL_PRODUCTION : process.env.NEXTAUTH_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    SESSION_EMAIL: process.env.SESSION_EMAIL,
    SESSION_PASSWORD: process.env.SESSION_PASSWORD,
  },
};


export default nextConfig;
