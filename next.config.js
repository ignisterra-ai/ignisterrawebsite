/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.imgur.com'],
  },
  compress: true,
  poweredByHeader: false,
  trailingSlash: true,
  i18n: {
    locales: ['en', 'zh-TW', 'zh-CN'],
    defaultLocale: 'en',
    localeDetection: true
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/index.html'
      }
    ]
  }
}

module.exports = nextConfig 