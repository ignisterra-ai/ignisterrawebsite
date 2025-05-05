import Head from 'next/head';

// 公司信息的結構化資料
export function CompanyJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ignis Terra AI Solution',
    url: 'https://www.ignisterra.ai',
    logo: 'https://www.ignisterra.ai/icons/icon-512x512.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+886-xxx-xxx-xxx',
      contactType: 'customer service',
      areaServed: ['TW', 'HK', 'SG', 'CN'],
      availableLanguage: ['Chinese', 'English']
    },
    sameAs: [
      'https://www.facebook.com/ignisterraai',
      'https://www.linkedin.com/company/ignis-terra-ai',
      'https://twitter.com/ignisterraai'
    ]
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
}

// 網頁信息的結構化資料
export function WebpageJsonLd({ 
  title, 
  description, 
  url = 'https://www.ignisterra.ai', 
  pageType = 'WebPage' 
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': pageType,
    name: title,
    description: description,
    url: url,
    publisher: {
      '@type': 'Organization',
      name: 'Ignis Terra AI Solution',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.ignisterra.ai/icons/icon-512x512.png'
      }
    }
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
}

// 麵包屑導航的結構化資料
export function BreadcrumbJsonLd({ items }) {
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
} 