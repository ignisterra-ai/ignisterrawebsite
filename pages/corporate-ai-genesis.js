import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import SEO from '../components/SEO';
import { WebpageJsonLd, BreadcrumbJsonLd } from '../components/JsonLd';

const CorporateAIGenesis = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const title = `${t('corporateAI')} | Corporate AI Genesis - ${t('companyName')}`;
  const description = `${t('corporateAI')} - ${t('corporateAIPosition')}。${t('corporateAIValue')}。`;
  
  return (
    <>
      <SEO 
        title={title}
        description={description}
        keywords="企業AI, 知識傳承, 數位轉型, 決策支持, 創世AI, Corporate AI Genesis"
      />
      <WebpageJsonLd 
        title={title}
        description={description}
        url="https://www.ignisterra.ai/corporate-ai-genesis"
      />
      <BreadcrumbJsonLd 
        items={[
          { name: '首頁', url: 'https://www.ignisterra.ai' },
          { name: '產品服務', url: 'https://www.ignisterra.ai/products' },
          { name: t('corporateAI'), url: 'https://www.ignisterra.ai/corporate-ai-genesis' }
        ]}
      />

      <div className="min-h-screen flex flex-col">
        {/* 頂部導航返回按鈕 */}
        <div className="fixed top-8 left-8 z-50">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full shadow-lg border border-white/30 transition-all hover:bg-white/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>返回首頁</span>
          </button>
        </div>

        {/* 霧化效果的主要內容區域 */}
        <div className="flex-grow flex items-center justify-center relative">
          {/* 背景模糊效果 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-700/20"></div>
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
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-8 shadow-xl border-4 border-white/50">
              <span className="text-white text-3xl font-bold">創</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {t('corporateAI')} | Corporate AI Genesis
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

export default CorporateAIGenesis; 