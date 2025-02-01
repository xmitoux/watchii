import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // hostname: 'nllcsgowbqddoussovlt.supabase.co',
        hostname: 'p2-67f1ef2b.imageflux.jp',
        port: '',
        search: '',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@repo/ui'],
    // turbopack用
    // https://github.com/vercel/next.js/discussions/72029
    turbo: {},
  },
  transpilePackages: ['@repo/ui'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default withPWA({
  dest: 'public', // destination directory for the PWA files
  disable: process.env.NODE_ENV === 'development', // disable PWA in the development environment
  register: true, // register the PWA service worker
  skipWaiting: true, // skip waiting for service worker activation
})(nextConfig);
