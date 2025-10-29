const nextConfig = {
  basePath: '/taxi',
  assetPrefix: '/taxi/',
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  trailingSlash: true,
  // Bu juda muhim!
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Forwarded-Proto',
            value: 'https',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
