/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.ignisterra.ai',
  generateRobotsTxt: true,
  outDir: 'public',
  generateIndexSitemap: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://www.ignisterra.ai/sitemap.xml',
    ],
  },
  exclude: ['/404'],
  priority: 0.7,
  changefreq: 'weekly',
} 