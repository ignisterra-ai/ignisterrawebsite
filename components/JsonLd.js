import Head from 'next/head';

// 公司信息的結構化資料
export function CompanyJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ignis Terra AI Solution',
    url: 'https://www.ignisterra.ai',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.ignisterra.ai/icons/icon-512x512.png',
      width: '512',
      height: '512'
    },
    description: 'Ignis Terra提供專業AI解決方案，助力企業實現智能化轉型。我們的專家團隊為您打造定制化AI工具，提升效率、優化流程、創造價值。',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+886-2-xxxx-xxxx',
      email: 'contact@ignisterra.ai',
      contactType: 'customer service',
      areaServed: ['TW', 'HK', 'SG', 'CN'],
      availableLanguage: ['Chinese', 'English']
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Taipei',
      addressRegion: 'Taiwan',
      postalCode: '10xxx',
      streetAddress: '台北市信義區忠孝東路xx號'
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
        key="company-jsonld"
      />
    </Head>
  );
}

// 網頁信息的結構化資料
export function WebpageJsonLd({ 
  title, 
  description, 
  url = 'https://www.ignisterra.ai', 
  pageType = 'WebPage',
  imageUrl,
  datePublished,
  dateModified
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

  // 添加可選屬性
  if (imageUrl) {
    jsonLd.image = {
      '@type': 'ImageObject',
      url: imageUrl
    };
  }

  if (datePublished) {
    jsonLd.datePublished = datePublished;
  }

  if (dateModified) {
    jsonLd.dateModified = dateModified;
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        key="webpage-jsonld"
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
        key="breadcrumb-jsonld"
      />
    </Head>
  );
}

// 服務項目的結構化資料
export function ServiceJsonLd({
  name,
  description,
  url,
  provider = 'Ignis Terra AI Solution',
  serviceArea = ['Taiwan', 'Hong Kong', 'Singapore', 'China'],
  serviceType = 'AI Solutions'
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: name,
    description: description,
    url: url,
    provider: {
      '@type': 'Organization',
      name: provider
    },
    areaServed: serviceArea,
    serviceType: serviceType
  };
  
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        key="service-jsonld"
      />
    </Head>
  );
} 