/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development"     // Remove console.log in production
  }
  // Tu configuración existente aquí
};

export default nextConfig;
