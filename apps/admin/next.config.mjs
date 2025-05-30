import withPWA from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: isProd ? process.env.CDN_HOST : process.env.SUPABASE_HOST,
        port: '',
        search: '',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@repo/ui'],
  },
  transpilePackages: ['@repo/ui'],
  compiler: {
    removeConsole: isProd,
  },
};

export default withPWA({
  dest: 'public', // destination directory for the PWA files
  disable: process.env.NODE_ENV === 'development', // disable PWA in the development environment
  register: true, // register the PWA service worker
  skipWaiting: true, // skip waiting for service worker activation
  buildExcludes: [/dynamic-css-manifest\.json$/],
})(nextConfig);
