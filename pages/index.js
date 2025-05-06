import SEO from '../components/SEO'
import { CompanyJsonLd, WebpageJsonLd } from '../components/JsonLd'
import HeroSection from '../components/HeroSection'
import Sections from '../components/Sections'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

export default function Home() {
  const { t } = useTranslation('common');
  
  return (
    <div className="bg-transparent">
      <SEO 
        title="Seamless AI Integration | Ignis Terra AI"
        description="Plug and play intelligence—instantly elevating your team's capabilities with our enterprise AI solutions."
        keywords="AI solution, enterprise AI, business AI, seamless integration"
      />
      <CompanyJsonLd />
      <WebpageJsonLd 
        title="Seamless AI Integration | Ignis Terra AI"
        description="Plug and play intelligence—instantly elevating your team's capabilities."
        url="https://www.ignisterra.ai/"
      />

      <Header />
      
      <main className="bg-transparent">
        <HeroSection />
        <Sections />
      </main>

      <Footer />
    </div>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 