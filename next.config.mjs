/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: false,
    // Keep Remotion's Node-only packages out of the webpack bundle
    serverComponentsExternalPackages: [
      "@remotion/bundler",
      "@remotion/renderer",
      "@remotion/studio",
      "esbuild",
    ],
  },
};

export default nextConfig;
