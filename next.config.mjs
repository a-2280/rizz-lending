/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/map-and-office-locations',
        // Sanity slug is `check-availability`; `/availability` has no page and 404s.
        destination: '/check-availability',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
