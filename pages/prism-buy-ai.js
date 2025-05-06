import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SEO from '../components/SEO';
import { WebpageJsonLd, BreadcrumbJsonLd } from '../components/JsonLd';

const PrismBuyAI = () => {
  const router = useRouter();
  const title = "購會買 | Prism Buy AI - 晟垚智能科技";
  const description = "Prism Buy AI - 智能導購解決方案。美學與數據融合的選購體驗。";
  
  return (
    <>
      <SEO 
        title={title}
        description={description}
        keywords="智能導購, AI購物, 電商AI, 購物體驗, 購會買, Prism Buy AI"
      />
      <WebpageJsonLd 
        title={title}
        description={description}
        url="https://www.ignisterra.ai/prism-buy-ai"
      />
      <BreadcrumbJsonLd 
        items={[
          { name: '首頁', url: 'https://www.ignisterra.ai' },
          { name: '產品服務', url: 'https://www.ignisterra.ai/products' },
          { name: '購會買', url: 'https://www.ignisterra.ai/prism-buy-ai' }
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
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-700/20"></div>
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
            <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-8 shadow-xl border-4 border-white/50">
              <span className="text-white text-3xl font-bold">購</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              購會買 | Prism Buy AI
            </h1>
            
            <div className="w-16 h-1 bg-white/50 mx-auto mb-8"></div>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
              建構中，敬請期待
            </p>
            
            <motion.div 
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="flex items-center justify-center space-x-2 text-white/80"
            >
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="w-2 h-2 bg-white rounded-full"></span>
            </motion.div>
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

export default PrismBuyAI; 