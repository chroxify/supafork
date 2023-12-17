/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/button",
        destination: "/button.svg",
      },
    ];
  },
};

module.exports = nextConfig;
