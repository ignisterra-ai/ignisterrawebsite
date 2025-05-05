import Head from 'next/head'
import { useRouter } from 'next/router'

export default function SEO({ 
  title = 'Ignis Terra AI Solution - 人機協作的藝術', 
  description = '沒有學習曲線，只有上升曲線。讓AI成為團隊的超能力。', 
  image = '/images/og-image.jpg',
  keywords = 'AI解决方案,人工智能,企业AI,AI工具,AI优化,商业智能'
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
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  )
} 