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
        destination: '/availability',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
