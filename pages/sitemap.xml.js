function SiteMap() {
  // 返回空组件，因为实际内容将由getServerSideProps生成
  return null;
}

export async function getServerSideProps({ res }) {
  // 设置网站URL
  const baseUrl = 'https://www.ignisterra.ai';
  
  // 获取当前日期作为lastmod
  const date = new Date().toISOString().split('T')[0];
  
  // 网站所有页面列表 - 更新为实际页面
  const pages = [
    '',                     // 首页
    '/blazecipher',         // 已有页面
    '/corporate-ai-genesis', // 已有页面
    '/prism-buy-ai',        // 已有页面
    '/prism-travel'         // 已有页面
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
  
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap; 