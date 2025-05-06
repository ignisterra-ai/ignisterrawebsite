import React, { useEffect, useRef, useState } from 'react';
import throttle from 'lodash.throttle';
import { ArrowRight } from 'lucide-react';
import PainPointCards from './PainPointCards';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const Sections = () => {
  const sectionsRef = useRef(null);
  const solutionsSectionRef = useRef(null);
  const solutionsCardRefs = useRef([]);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const featureCardsRef = useRef(null);
  const cardsRefs = useRef([]);
  const [cardsAnimated, setCardsAnimated] = useState(false);
  const [animationSequence, setAnimationSequence] = useState(Array(6).fill(false));
  const { t, i18n } = useTranslation('common');
  
  // 优化滚动动画监听
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 使用更短的延迟
          setTimeout(() => {
            setCardsAnimated(true);
          }, 200);
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionsRef.current) {
      observer.observe(sectionsRef.current);
    }
    
    return () => {
      if (sectionsRef.current) {
        observer.unobserve(sectionsRef.current);
      }
    };
  }, []);
  
  // 在可见性检测的useEffect中添加序列动画逻辑
  useEffect(() => {
    if (isVisible) {
      // 按顺序播放动画
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          setAnimationSequence(prev => {
            const newState = [...prev];
            newState[i] = true;
            return newState;
          });
        }, 300 * i + 800); // 延迟时间随索引增加，实现序列效果
      }
    }
  }, [isVisible]);
  
  // 优化玻璃卡片的倾斜效果
  useEffect(() => {
    if (!solutionsSectionRef.current) return;

    // 使用节流函数处理鼠标移动事件
    const handleMouseMove = throttle((e) => {
      const solutionActive = document.querySelector('.solution-active');
      if (solutionActive) return;

      const section = solutionsSectionRef.current;
      const rect = section.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      solutionsCardRefs.current.forEach((card, index) => {
        if (!card) return;

        // 简化变换计算
        const tiltX = Math.min(Math.max(y * 2, -2), 2);
        const tiltY = Math.min(Math.max(x * -2, -2), 2);

        card.style.transform = `translateX(${tiltY}px) translateY(${tiltX}px)`;
        card.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.5)';
        card.style.transition = 'transform 0.1s ease';
      });
    }, 16); // 60fps

    const handleMouseLeave = () => {
      solutionsCardRefs.current.forEach(card => {
        if (!card) return;
        card.style.transform = 'translateX(0) translateY(0)';
        card.style.transition = 'transform 0.1s ease';
      });
    };

    const solutionsSection = solutionsSectionRef.current;
    solutionsSection.addEventListener('mousemove', handleMouseMove);
    solutionsSection.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (solutionsSection) {
        solutionsSection.removeEventListener('mousemove', handleMouseMove);
        solutionsSection.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);
  
  // 初始化卡片引用数组
  const setCardRef = (element, index) => {
    solutionsCardRefs.current[index] = element;
  };
  
  // 设置功能卡片引用
  const setFeatureCardRef = (element, index) => {
    cardsRefs.current[index] = element;
  };
  
  return (
    <div className="content-container" ref={sectionsRef}>
      {/* ===== 痛点与解决方案卡片区块 ===== */}
      <section className="py-24 bg-transparent relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 relative z-50">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-title" style={{ lineHeight: 1.2 }}>
              {t('commonPainPoints')}
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-tight py-1">
              {t('painPointsDescription')}
            </p>
          </div>
          
          {/* 痛点卡片区域 */}
          <PainPointCards />
        </div>
      </section>

      {/* ===== 解决方案區塊 ===== */}
      <section className="py-24 bg-transparent relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="rounded-3xl p-6 md:p-8 shadow-lg border border-white/30 relative overflow-hidden my-8" 
            ref={solutionsSectionRef}
            style={{ 
              background: 'linear-gradient(145deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.4), inset 0 0 20px rgba(255,255,255,0.1)'
            }}
          >
            {/* 添加光晕背景效果 */}
            <div className="absolute top-1/4 -left-40 w-80 h-80 bg-blue-300/20 rounded-full filter blur-[100px] -z-5"></div>
            <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-purple-300/20 rounded-full filter blur-[100px] -z-5"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-200/10 rounded-full filter blur-[80px] -z-5"></div>
            
            {/* 添加背景渐变效果 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-neutral-50/60 to-rose-50/60 -z-10"></div>
            
            <div className="text-center mb-16 relative z-50">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-title" style={{ lineHeight: 1.2 }}>
                {t('beyondTools')}
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-tight py-1">
                {t('solutionDescription')}
              </p>
            </div>
            
            {/* 解决方案卡片 - 第一排 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-10 relative z-10">
              {/* 解决方案1 */}
              <div 
                className="bg-white/40 rounded-2xl p-7 shadow-md transition-all hover:shadow-xl hover:-translate-y-2 border border-white/50 relative overflow-hidden" 
                style={{ 
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(255,255,255,0.3))',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}>
                
                <div className="w-14 h-14 bg-amber-600/40 rounded-2xl flex items-center justify-center mb-5"
                  style={{ 
                    boxShadow: 'inset 0 0 10px rgba(255,255,255,0.8)'
                  }}>
                  <svg className="w-7 h-7 text-amber-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{t('intelligentPartner')}</h3>
                <p className="text-gray-600">
                  {t('intelligentPartnerDesc')}
                </p>
              </div>
              
              {/* 解决方案2 */}
              <div 
                className="bg-white/40 rounded-2xl p-7 shadow-md transition-all hover:shadow-xl hover:-translate-y-2 border border-white/50 relative overflow-hidden" 
                style={{ 
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(255,255,255,0.3))',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}>
                
                <div className="w-14 h-14 bg-amber-600/40 rounded-2xl flex items-center justify-center mb-5"
                  style={{ 
                    boxShadow: 'inset 0 0 10px rgba(255,255,255,0.8)'
                  }}>
                  <svg className="w-7 h-7 text-amber-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{t('dataInsight')}</h3>
                <p className="text-gray-600">
                  {t('dataInsightDesc')}
                </p>
              </div>
              
              {/* 解决方案3 */}
              <div 
                className="bg-white/40 rounded-2xl p-7 shadow-md transition-all hover:shadow-xl hover:-translate-y-2 border border-white/50 relative overflow-hidden" 
                style={{ 
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(255,255,255,0.3))',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}>
                
                <div className="w-14 h-14 bg-amber-600/40 rounded-2xl flex items-center justify-center mb-5"
                  style={{ 
                    boxShadow: 'inset 0 0 10px rgba(255,255,255,0.8)'
                  }}>
                  <svg className="w-7 h-7 text-amber-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{t('riskOpportunity')}</h3>
                <p className="text-gray-600">
                  {t('riskOpportunityDesc')}
                </p>
              </div>
            </div>

            {/* 解决方案卡片 - 第二排 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-6 lg:mt-8 relative z-10">
              {/* 解决方案4 */}
              <div 
                className="bg-white/40 rounded-2xl p-7 shadow-md transition-all hover:shadow-xl hover:-translate-y-2 border border-white/50 relative overflow-hidden" 
                style={{ 
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(255,255,255,0.3))',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}>
                
                <div className="w-14 h-14 bg-amber-600/40 rounded-2xl flex items-center justify-center mb-5"
                  style={{ 
                    boxShadow: 'inset 0 0 10px rgba(255,255,255,0.8)'
                  }}>
                  <svg className="w-7 h-7 text-amber-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{t('noPersonnelConflicts')}</h3>
                <p className="text-gray-600">
                  {t('noPersonnelConflictsDesc')}
                </p>
              </div>
              
              {/* 解决方案5 */}
              <div 
                className="bg-white/40 rounded-2xl p-7 shadow-md transition-all hover:shadow-xl hover:-translate-y-2 border border-white/50 relative overflow-hidden" 
                style={{ 
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(255,255,255,0.3))',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}>
                
                <div className="w-14 h-14 bg-amber-600/40 rounded-2xl flex items-center justify-center mb-5"
                  style={{ 
                    boxShadow: 'inset 0 0 10px rgba(255,255,255,0.8)'
                  }}>
                  <svg className="w-7 h-7 text-amber-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{t('maximumScaleEffect')}</h3>
                <p className="text-gray-600">
                  {t('maximumScaleEffectDesc')}
                </p>
              </div>
              
              {/* 解决方案6 */}
              <div 
                className="bg-white/40 rounded-2xl p-7 shadow-md transition-all hover:shadow-xl hover:-translate-y-2 border border-white/50 relative overflow-hidden" 
                style={{ 
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(255,255,255,0.3))',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}>
                
                <div className="w-14 h-14 bg-amber-600/40 rounded-2xl flex items-center justify-center mb-5"
                  style={{ 
                    boxShadow: 'inset 0 0 10px rgba(255,255,255,0.8)'
                  }}>
                  <svg className="w-7 h-7 text-amber-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{t('barrierFreeGlobalization')}</h3>
                <p className="text-gray-600">
                  {t('barrierFreeGlobalizationDesc')}
                </p>
              </div>
            </div>
            
            {/* 行动呼吁 */}
            <div className="mt-16 text-center relative z-10">
              <button className="btn-gradient px-8 py-4 text-lg relative overflow-hidden group mx-auto" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
                <span className="relative z-10 flex items-center">
                  {t('bookDemo')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 解決方案展示區塊 ===== */}
      <section className="py-24 bg-transparent relative overflow-hidden" id="work">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 relative z-50">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-title" style={{ lineHeight: 1.2 }}>
              {t('fourProductLines')}
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-tight py-1">
              {t('productLinesDescription')}
            </p>
          </div>
          
          {/* 產品線卡片 */}
          <div className="rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden my-8" 
            style={{ 
              background: 'linear-gradient(145deg, rgb(120, 80, 60), rgb(70, 40, 20))', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.1)'
            }}>
            
            {/* 移除半透明背景效果 */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-800 to-amber-950 -z-10"></div>
            
            {/* 调整光晕效果 - 增强中心点光晕 */}
            <div className="absolute top-1/4 -left-40 w-80 h-80 rounded-full filter blur-[100px] opacity-50 -z-5" style={{ backgroundColor: 'rgb(217, 119, 6)' }}></div>
            <div className="absolute bottom-1/4 -right-40 w-80 h-80 rounded-full filter blur-[100px] opacity-50 -z-5" style={{ backgroundColor: 'rgb(217, 119, 6)' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full filter blur-[80px] opacity-50 -z-5" style={{ backgroundColor: 'rgb(217, 119, 6)' }}></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10">
              {/* 創世AI */}
              <div className="rounded-2xl p-7 shadow-md transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-white/50 group relative overflow-hidden bg-gradient-to-br from-amber-600 to-amber-700" 
                style={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.2)',
                  transformStyle: 'preserve-3d'
                }}>
                
                <div className="w-12 h-12 rounded-2xl bg-amber-600/60 flex items-center justify-center mb-4 text-amber-50 font-bold text-lg shadow-md border border-amber-300/60"
                  style={{ 
                    boxShadow: 'inset 0 0 10px rgba(255,255,255,0.8)'
                  }}>
                  <span>創</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-amber-50">
                  {t('corporateAI')}
                </h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex">
                    <span className="text-amber-50 font-bold w-[90px] flex-shrink-0">{t('positioning')}</span>
                    <span className="text-amber-50/90">{t('corporateAIPosition')}</span>
                  </li>
                  <li className="flex">
                    <span className="text-amber-50 font-bold w-[90px] flex-shrink-0">{t('coreValue')}</span>
                    <span className="text-amber-50/90">{t('corporateAIValue')}</span>
                  </li>
                  <li className="flex">
                    <span className="text-amber-50 font-bold w-[90px] flex-shrink-0">{t('targetScenario')}</span>
                    <span className="text-amber-50/90">{t('corporateAITarget')}</span>
                  </li>
                  <li className="flex">
                    <span className="text-amber-50 font-bold w-[90px] flex-shrink-0">{t('features')}</span>
                    <span className="text-amber-50/90">{t('corporateAIFeatures')}</span>
                  </li>
                </ul>
                <Link href={`/${i18n.language}/corporate-ai-genesis`} className="w-full py-2 mt-2 block text-gray-800 bg-white/90 border border-white/40 rounded-2xl hover:bg-white transition-all shadow-glow-sm relative overflow-hidden group">
                  <span className="relative z-10 flex items-center justify-center">
                    {t('learnMore')} <span className="font-bold ml-1">{t('corporateAI')}</span> <span className="ml-1">{t('solution')}</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
              
              {/* Prism Buy AI */}
              <div className="rounded-2xl p-7 shadow-md transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-white/50 group relative overflow-hidden bg-gradient-to-br from-amber-700 to-amber-800" 
                style={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.2)',
                  transformStyle: 'preserve-3d'
                }}>
                
                <div className="w-12 h-12 rounded-2xl bg-amber-600/60 flex items-center justify-center mb-4 text-amber-50 font-bold text-lg shadow-md border border-amber-300/60"
                  style={{ 
                    boxShadow: 'inset 0 0 10px rgba(255,255,255,0.8)'
                  }}>
                  <span>購</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-amber-50">
                  {t('prismBuyAI')}
                </h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex">
                    <span className="text-amber-50 font-bold w-[90px] flex-shrink-0">{t('positioning')}</span>
                    <span className="text-amber-50/90">{t('prismBuyPosition')}</span>
                  </li>
                  <li className="flex">
                    <span className="text-amber-50 font-bold w-[90px] flex-shrink-0">{t('coreValue')}</span>
                    <span className="text-amber-50/90">{t('prismBuyValue')}</span>
                  </li>
                  <li className="flex">
                    <span className="text-amber-50 font-bold w-[90px] flex-shrink-0">{t('targetScenario')}</span>
                    <span className="text-amber-50/90">{t('prismBuyTarget')}</span>
                  </li>
                  <li className="flex">
                    <span className="text-amber-50 font-bold w-[90px] flex-shrink-0">{t('features')}</span>
                    <span className="text-amber-50/90">{t('prismBuyFeatures')}</span>
                  </li>
                </ul>
                <Link href={`/${i18n.language}/prism-buy-ai`} className="w-full py-2 mt-2 block text-gray-800 bg-white/90 border border-white/40 rounded-2xl hover:bg-white transition-all shadow-glow-sm relative overflow-hidden group">
                  <span className="relative z-10 flex items-center justify-center">
                    {t('learnMore')} <span className="font-bold ml-1">{t('prismBuyAI')}</span> <span className="ml-1">{t('solution')}</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
              
              {/* BlazeCipher */}
              <div className="rounded-2xl p-7 shadow-md transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-white/50 group relative overflow-hidden bg-gradient-to-br from-amber-800 to-amber-900" 
                style={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.2)',
                  transformStyle: 'preserve-3d'
                }}>
                
                <div className="w-12 h-12 rounded-2xl bg-amber-600/60 flex items-center justify-center mb-4 text-amber-50 font-bold text-lg shadow-md border border-amber-300/60"
                  style={{ 
                    boxShadow: 'inset 0 0 10px rgba(255,255,255,0.8)'
                  }}>
                  <span>探</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-amber-50">
                  {t('blazeCipher')}
                </h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex">
                    <span className="text-amber-50 font-bold w-[90px] flex-shrink-0">{t('positioning')}</span>
                    <span className="text-amber-50/90">{t('blazeCipherPosition')}</span>
                  </li>
                  <li className="flex">
                    <span className="text-amber-50 font-bold w-[90px] flex-shrink-0">{t('coreValue')}</span>
                    <span className="text-amber-50/90">{t('blazeCipherValue')}</span>
                  </li>
                  <li className="flex">
                    <span className="text-amber-50 font-bold w-[90px] flex-shrink-0">{t('targetScenario')}</span>
                    <span className="text-amber-50/90">{t('blazeCipherTarget')}</span>
                  </li>
                  <li className="flex">
                    <span className="text-amber-50 font-bold w-[90px] flex-shrink-0">{t('features')}</span>
                    <span className="text-amber-50/90">{t('blazeCipherFeatures')}</span>
                  </li>
                </ul>
                <Link href={`/${i18n.language}/blazecipher`} className="w-full py-2 mt-2 block text-gray-800 bg-white/90 border border-white/40 rounded-2xl hover:bg-white transition-all shadow-glow-sm relative overflow-hidden group">
                  <span className="relative z-10 flex items-center justify-center">
                    {t('learnMore')} <span className="font-bold ml-1">{t('blazeCipher')}</span> <span className="ml-1">{t('solution')}</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
              
              {/* Prism Travel */}
              <div className="rounded-2xl p-7 shadow-md transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-white/50 group relative overflow-hidden bg-gradient-to-br from-amber-900 to-amber-950" 
                style={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.2)',
                  transformStyle: 'preserve-3d'
                }}>
                
                <div className="w-12 h-12 rounded-2xl bg-amber-600/60 flex items-center justify-center mb-4 text-amber-50 font-bold text-lg shadow-md border border-amber-300/60"
                  style={{ 
                    boxShadow: 'inset 0 0 10px rgba(255,255,255,0.8)'
                  }}>
                  <span>遊</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-amber-50">
                  {t('prismTravel')}
                </h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex">
                    <span className="text-amber-50 font-bold w-[90px] flex-shrink-0">{t('positioning')}</span>
                    <span className="text-amber-50/90">{t('prismTravelPosition')}</span>
                  </li>
                  <li className="flex">
                    <span className="text-amber-50 font-bold w-[90px] flex-shrink-0">{t('coreValue')}</span>
                    <span className="text-amber-50/90">{t('prismTravelValue')}</span>
                  </li>
                  <li className="flex">
                    <span className="text-amber-50 font-bold w-[90px] flex-shrink-0">{t('targetScenario')}</span>
                    <span className="text-amber-50/90">{t('prismTravelTarget')}</span>
                  </li>
                  <li className="flex">
                    <span className="text-amber-50 font-bold w-[90px] flex-shrink-0">{t('features')}</span>
                    <span className="text-amber-50/90">{t('prismTravelFeatures')}</span>
                  </li>
                </ul>
                <Link href={`/${i18n.language}/prism-travel`} className="w-full py-2 mt-2 block text-gray-800 bg-white/90 border border-white/40 rounded-2xl hover:bg-white transition-all shadow-glow-sm relative overflow-hidden group">
                  <span className="relative z-10 flex items-center justify-center">
                    {t('learnMore')} <span className="font-bold ml-1">{t('prismTravel')}</span> <span className="ml-1">{t('solution')}</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 核心功能區塊 ===== */}
      <section className="py-24 bg-neutral-light-gray relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 relative z-50">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-title" style={{ lineHeight: 1.2 }}>
              {t('intelligentExperienceTitle')}
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-tight py-1">
              {t('intelligentExperienceDesc')}
            </p>
          </div>
          
          {/* 技術亮點卡片 - 静态布局 */}
          <div className="mb-12 bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-primary-blue/10 rounded-t-2xl overflow-hidden">
              <div className="h-full bg-primary-blue rounded-full w-1/5 mx-auto"></div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center gradient-text-title" style={{ lineHeight: 1.2 }}>{t('technicalHighlights')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:px-4">
              <div className="text-center bg-white rounded-xl p-6 hover:shadow-md transition-all border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
                  <svg className="w-8 h-8 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path>
                  </svg>
                </div>
                <h4 className="font-bold text-lg mb-2">{t('intuitiveInteraction')}</h4>
                <p className="text-gray-600 text-sm">{t('intuitiveInteractionDesc')}</p>
              </div>
              
              <div className="text-center bg-white rounded-xl p-6 hover:shadow-md transition-all border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                <div className="w-16 h-16 mx-auto bg-red-50 rounded-2xl flex items-center justify-center mb-4 border border-red-100">
                  <svg className="w-8 h-8 text-primary-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h4 className="font-bold text-lg mb-2">{t('multimodalInfoProcessing')}</h4>
                <p className="text-gray-600 text-sm">{t('multimodalInfoProcessingDesc')}</p>
              </div>
              
              <div className="text-center bg-white rounded-xl p-6 hover:shadow-md transition-all border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                <div className="w-16 h-16 mx-auto bg-orange-50 rounded-2xl flex items-center justify-center mb-4 border border-orange-100">
                  <svg className="w-8 h-8 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2M7 7h10"></path>
                  </svg>
                </div>
                <h4 className="font-bold text-lg mb-2">{t('knowledgeSystem')}</h4>
                <p className="text-gray-600 text-sm">{t('knowledgeSystemDesc')}</p>
              </div>
              
              <div className="text-center bg-white rounded-xl p-6 hover:shadow-md transition-all border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
                  <svg className="w-8 h-8 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
                <h4 className="font-bold text-lg mb-2">{t('valueOrientedImplementation')}</h4>
                <p className="text-gray-600 text-sm">{t('valueOrientedImplementationDesc')}</p>
              </div>
            </div>
          </div>
          
          {/* 小步快跑卡片 - 静态布局 */}
          <div className="mb-12 bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-teal-400/10 rounded-t-2xl overflow-hidden">
              <div className="h-full bg-teal-400 rounded-full w-1/5 mx-auto"></div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center gradient-text-title" style={{ lineHeight: 1.2 }}>{t('quickSmallSteps')}</h3>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* 漏斗图 */}
              <div className="md:w-1/2 flex justify-center">
                <div className="w-full max-w-sm mx-auto transition-transform duration-300">
                  <img 
                    src="/images/ai-implementation-funnel.png" 
                    alt="AI Implementation Funnel" 
                    className="w-full h-auto object-contain"
                    style={{ 
                      imageRendering: 'high-quality'
                    }}
                  />
                </div>
              </div>
              
              {/* 右侧说明 */}
              <div className="md:w-1/2">
                <div className="space-y-6">
                  {/* 探索階段 */}
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <h4 className="font-bold text-blue-700 mb-1">{t('explorationPhase')}</h4>
                    <p className="text-gray-600">{t('explorationPhaseDesc')}</p>
                  </div>
                  
                  {/* 啟動階段 */}
                  <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-400">
                    <h4 className="font-bold text-teal-700 mb-1">{t('launchPhase')}</h4>
                    <p className="text-gray-600">{t('launchPhaseDesc')}</p>
                  </div>
                  
                  {/* 成長階段 */}
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <h4 className="font-bold text-green-700 mb-1">{t('growthPhase')}</h4>
                    <p className="text-gray-600">{t('growthPhaseDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 合理投資卡片 - 静态布局 */}
          <div className="mb-12 bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-primary-red/10 rounded-t-2xl overflow-hidden">
              <div className="h-full bg-primary-red rounded-full w-1/5 mx-auto"></div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center gradient-text-title" style={{ lineHeight: 1.2 }}>{t('reasonableInvestment')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 低門檻起步 */}
              <div className="bg-gradient-to-b from-blue-50 to-white rounded-xl p-6 shadow-md border border-blue-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                    </svg>
                  </div>
                </div>
                <h4 className="font-bold text-lg mb-2 text-center text-gray-800">{t('lowThresholdStart')}</h4>
                <p className="text-gray-600 text-center">{t('lowThresholdStartDesc')}</p>
              </div>
              
              {/* 按需擴展 */}
              <div className="bg-gradient-to-b from-purple-50 to-white rounded-xl p-6 shadow-md border border-purple-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                <h4 className="font-bold text-lg mb-2 text-center text-gray-800">{t('scaleAsNeeded')}</h4>
                <p className="text-gray-600 text-center">{t('scaleAsNeededDesc')}</p>
              </div>
              
              {/* 持續優化價值 */}
              <div className="bg-gradient-to-b from-green-50 to-white rounded-xl p-6 shadow-md border border-green-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                    </svg>
                  </div>
                </div>
                <h4 className="font-bold text-lg mb-2 text-center text-gray-800">{t('continuousValueOptimization')}</h4>
                <p className="text-gray-600 text-center">{t('continuousValueOptimizationDesc')}</p>
              </div>
              
              {/* 長期合作關係 */}
              <div className="bg-gradient-to-b from-rose-50 to-white rounded-xl p-6 shadow-md border border-rose-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <h4 className="font-bold text-lg mb-2 text-center text-gray-800">{t('longTermPartnership')}</h4>
                <p className="text-gray-600 text-center">{t('longTermPartnershipDesc')}</p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <button className="btn-gradient px-8 py-3 text-base flex items-center justify-center mx-auto" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
                {t('arrangeDemo')}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 創辦人介紹區塊 ===== */}
      <section className="py-24 bg-neutral-light-gray relative overflow-hidden" id="about">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 relative z-50">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-title flex items-center justify-center" style={{ lineHeight: 1.2 }}>
              {t('greetingFounder')}
              <span className="ml-2 inline-block animate-wave origin-bottom-right text-4xl">👋🏻</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-tight py-1">
              {t('founderSubtitle')}
            </p>
          </div>
          
          {/* 創辦人介紹卡片 - 新的信件格式 */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 lg:p-10">
              <div className="flex items-center mb-6">
                <div className="mr-4 w-12 h-12 rounded-2xl bg-green-500/40 flex items-center justify-center border border-green-300/60 shadow-md"
                  style={{ 
                    boxShadow: 'inset 0 0 10px rgba(255,255,255,0.8)'
                  }}>
                  <span className="text-green-50 font-bold">KL</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl">Kelly Liu</h3>
                  <p className="text-gray-600">Founder & Chief Innovation Officer | Cross-national Business Development Expert</p>
                </div>
              </div>
            
              <div className="text-gray-600 space-y-4">
                <p className="text-lg font-medium text-gray-800">{t('dearVisitor')}</p>
                
                <p>
                  {t('founderIntro1')}
                </p>
                
                <p>
                  {t('founderIntro2')}
                </p>
                
                <p>
                  {t('founderIntro3')}
                </p>
                
                <p>
                  {t('founderIntro4')}
                </p>
                
                <p>
                  {t('founderIntro5')}
                </p>
                
                <p>
                  {t('founderIntro6')}
                </p>
                
                <div className="mt-6">
                  <p className="mb-1">{t('sincerely')}</p>
                  <p className="font-medium text-gray-800">Kelly Liu</p>
                  <p className="text-gray-600">Founder & Chief Innovation Officer</p>
                  <p className="text-gray-600">Ignis Terra AI Solution</p>
                </div>
                
                <div className="mt-8 bg-gradient-to-br from-blue-50/70 to-rose-50/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 relative overflow-hidden transform transition-all hover:shadow-xl" 
                  style={{ 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(255,255,255,0.4), inset 0 0 10px rgba(255,255,255,0.2)',
                    transformStyle: 'preserve-3d'
                  }}>
                  
                  <div className="text-gray-700 italic relative z-10 text-lg font-medium px-8 text-center" style={{ transform: 'translateZ(15px)' }}>
                    <p className="mb-3">{t('founderQuote1')}</p>
                    <p>{t('founderQuote2')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 願景理念卡片 */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-sky-400/40 rounded-2xl flex items-center justify-center mb-4 border border-sky-300/60 shadow-md"
                style={{ 
                  boxShadow: 'inset 0 0 10px rgba(255,255,255,0.8)'
                }}>
                <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                </svg>
              </div>
              <h4 className="font-bold text-lg mb-2">{t('diverseGlobalVision')}</h4>
              <p className="text-gray-600">{t('diverseGlobalVisionDesc')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-yellow-400/40 rounded-2xl flex items-center justify-center mb-4 border border-yellow-300/60 shadow-md"
                style={{ 
                  boxShadow: 'inset 0 0 10px rgba(255,255,255,0.8)'
                }}>
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h4 className="font-bold text-lg mb-2">{t('fromConceptToRealization')}</h4>
              <p className="text-gray-600">{t('fromConceptToRealizationDesc')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-red-500/40 rounded-2xl flex items-center justify-center mb-4 border border-red-300/60 shadow-md"
                style={{ 
                  boxShadow: 'inset 0 0 10px rgba(255,255,255,0.8)'
                }}>
                <svg className="w-6 h-6 text-red-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h4 className="font-bold text-lg mb-2">{t('intelligenceWithWarmth')}</h4>
              <p className="text-gray-600">{t('intelligenceWithWarmthDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 联系我们區塊 ===== */}
      <section className="py-24 bg-transparent relative overflow-hidden" id="contact">
        {/* 添加光晕背景效果 */}
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-blue-300/20 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-purple-300/20 rounded-full filter blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-200/10 rounded-full filter blur-[80px]"></div>
        
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="backdrop-blur-md bg-white/20 rounded-3xl p-8 md:p-12 shadow-lg border border-white/30 relative overflow-hidden" 
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.4), inset 0 0 20px rgba(255,255,255,0.1)'
            }}>
            
            {/* 添加背景渐变效果 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-neutral-50/60 to-rose-50/60 -z-10"></div>
            
            <div className="text-center mb-12 relative z-50">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text-title" style={{ lineHeight: 1.2 }}>
                {t('readyForChange')}
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-tight py-1">
                {t('contactUsSubtitle')}
              </p>
            </div>
            
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-7 shadow-md border border-white/50 relative z-10 max-w-4xl mx-auto"
              style={{ 
                background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(255,255,255,0.3))',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(255,255,255,0.4)',
                transformStyle: 'preserve-3d'
              }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">{t('freeConsultation')}</h3>
                  <p className="text-gray-600 mb-6">
                    {t('freeConsultationDesc')}
                  </p>
                  
                  <div className="space-y-2 text-gray-700">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-primary-blue mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      <span>hi@ignisterra.ai</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <form className="space-y-4">
                    <div>
                      <input 
                        type="text" 
                        placeholder={t('name')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
                      />
                    </div>
                    <div>
                      <input 
                        type="email" 
                        placeholder={t('email')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        placeholder={t('companyName')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
                      />
                    </div>
                    <div>
                      <textarea 
                        placeholder={t('yourNeeds')}
                        rows="4" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
                      ></textarea>
                    </div>
                    <button type="submit" className="btn-gradient w-full py-3 relative overflow-hidden group">
                      <span className="relative z-10 flex items-center justify-center">
                        {t('submit')}
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sections; 