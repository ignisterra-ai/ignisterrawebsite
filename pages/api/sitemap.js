export default function handler(req, res) {
  // 设置网站URL
  const baseUrl = 'https://www.ignisterra.ai';
  
  // 获取当前日期作为lastmod
  const date = new Date().toISOString().split('T')[0];
  
  // 网站所有页面列表
  const pages = [
    '',            // 首页
    '/about',     // 如果有关于页面
    '/services',  // 如果有服务页面
    '/contact'    // 如果有联系页面
    // 添加网站所有其他页面
  ];
  
  // 生成sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
    <url>
      <loc>${baseUrl}${page}</loc>
      <lastmod>${date}</lastmod>
      <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
      <priority>${page === '' ? '1.0' : '0.8'}</priority>
    </url>
  `).join('')}
</urlset>`;
  
  // 设置正确的内容类型
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
} 