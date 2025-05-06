import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SEO from '../components/SEO';
import { WebpageJsonLd, BreadcrumbJsonLd } from '../components/JsonLd';
import { useTranslation } from 'react-i18next';

const PrismTravel = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const title = "AI旅遊解決方案 | Prism Travel - 晟垚智能科技";
  const description = "Prism Travel - 個人專屬旅遊規劃師。如指紋般獨一無二的旅程體驗。";
  
  return (
    <>
      <SEO 
        title={title}
        description={description}
        keywords="AI旅遊, 智能旅遊規劃, 旅程體驗, 個性化旅遊, Prism Travel, 旅遊解決方案"
      />
      <WebpageJsonLd 
        title={title}
        description={description}
        url="https://www.ignisterra.ai/prism-travel"
      />
      <BreadcrumbJsonLd 
        items={[
          { name: '首頁', url: 'https://www.ignisterra.ai' },
          { name: '產品服務', url: 'https://www.ignisterra.ai/products' },
          { name: 'AI旅遊解決方案', url: 'https://www.ignisterra.ai/prism-travel' }
        ]}
      />

      <div className="min-h-screen flex flex-col">
        {/* 頂部導航返回按鈕 */}
        <div className="fixed top-8 left-8 z-50">
          <button
            onClick={() => router.push('/#work')}
            className="flex items-center space-x-2 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full shadow-lg border border-white/30 transition-all hover:bg-white/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>{t('back')}</span>
          </button>
        </div>

        {/* 霧化效果的主要內容區域 */}
        <div className="flex-grow flex items-center justify-center relative">
          {/* 背景模糊效果 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-teal-700/20"></div>
          </div>

          {/* 霧化內容框 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 backdrop-blur-xl bg-white/10 rounded-3xl p-12 md:p-16 shadow-2xl border border-white/30 max-w-2xl mx-auto text-center"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.4), inset 0 0 20px rgba(255,255,255,0.1)'
            }}
          >
            <div className="w-20 h-20 rounded-full bg-teal-600 flex items-center justify-center mx-auto mb-8 shadow-xl border-4 border-white/50">
              <span className="text-white text-3xl font-bold">遊</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Prism Travel | AI Travel Solution
            </h1>
            
            <div className="w-16 h-1 bg-white/50 mx-auto mb-8"></div>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
              建構中，敬請期待
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-white/80">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="w-2 h-2 bg-white rounded-full"></span>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default PrismTravel; 