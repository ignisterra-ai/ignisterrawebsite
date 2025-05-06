import Head from 'next/head'
import { useRouter } from 'next/router'

export default function SEO({ 
  title = 'Ignis Terra - AI解決方案專家 | 企業智能化轉型夥伴', 
  description = 'Ignis Terra提供專業AI解決方案，助力企業實現智能化轉型。我們的專家團隊為您打造定制化AI工具，提升效率、優化流程、創造價值。', 
  image = '/images/ai-implementation-funnel.png?v=2',
  keywords = 'AI解决方案,人工智能,企业AI,AI工具,AI优化,商业智能,Ignis Terra,企业转型,AI咨询',
  author = 'Ignis Terra AI Solution Team'
}) {
  const router = useRouter()
  const siteUrl = 'https://www.ignisterra.ai'
  const canonicalUrl = `${siteUrl}${router.asPath}`
  const ogImage = `${siteUrl}${image}`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {/* 额外的SEO标签 */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="Chinese" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="zh_TW" />
      <meta property="og:site_name" content="Ignis Terra AI" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content="@ignisterraai" />

      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  )
} 