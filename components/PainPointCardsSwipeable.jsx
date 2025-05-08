import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PainPointCardsSwipeable = () => {
  const { t, i18n } = useTranslation('common');
  const scrollContainerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  
  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // 痛点卡片数据 - 8张卡片
  const painPoints = [
    { 
      id: '01', 
      iconText: '信', 
      title: '信任危機，獨自承擔',
      description: t('painPoint1Description'), 
      solution: t('painPoint1Solution'),
      color: 'blue', 
      iconBg: 'bg-blue-600',
      solutionColor: "from-blue-500 to-blue-700"
    },
    { 
      id: '02', 
      iconText: '表', 
      title: '表面風光，暗流洶湧',
      description: t('painPoint2Description'), 
      solution: t('painPoint2Solution'),
      color: 'red', 
      iconBg: 'bg-red-600',
      solutionColor: "from-red-500 to-red-700"
    },
    { 
      id: '03', 
      iconText: '知', 
      title: '知識流失，無法傳承',
      description: t('painPoint3Description'), 
      solution: t('painPoint3Solution'),
      color: 'amber', 
      iconBg: 'bg-amber-600',
      solutionColor: "from-amber-500 to-amber-700"
    },
    { 
      id: '04', 
      iconText: '閒', 
      title: '花錢養閒人，效率難測',
      description: t('painPoint4Description'), 
      solution: t('painPoint4Solution'),
      color: 'purple', 
      iconBg: 'bg-purple-600',
      solutionColor: "from-purple-500 to-purple-700"
    },
    { 
      id: '05', 
      iconText: '選', 
      title: '選擇過多，決策癱瘓',
      description: t('painPoint5Description'), 
      solution: t('painPoint5Solution'),
      color: 'slate', 
      iconBg: 'bg-slate-600',
      solutionColor: "from-slate-500 to-slate-700"
    },
    { 
      id: '06', 
      iconText: '溝', 
      title: '溝通斷層，效率崩潰',
      description: t('painPoint6Description'), 
      solution: t('painPoint6Solution'),
      color: 'emerald', 
      iconBg: 'bg-emerald-600',
      solutionColor: "from-emerald-500 to-emerald-700"
    },
    { 
      id: '07', 
      iconText: '購', 
      title: '購物體驗，千篇一律',
      description: t('painPoint7Description'), 
      solution: t('painPoint7Solution'),
      color: 'pink', 
      iconBg: 'bg-pink-600',
      solutionColor: "from-pink-500 to-pink-700"
    },
    { 
      id: '08', 
      iconText: '轉', 
      title: '轉型高牆，躊躇不前',
      description: t('painPoint8Description'), 
      solution: t('painPoint8Solution'),
      color: 'indigo', 
      iconBg: 'bg-indigo-600',
      solutionColor: "from-indigo-500 to-indigo-700"
    }
  ];

  // 处理查看解决方案
  const handleViewSolution = (index) => {
    setActiveCard(index);
    setShowSolution(true);
  };
  
  // 处理返回到问题
  const handleBackToProblem = () => {
    setShowSolution(false);
  };

  // 简单的滑动函数
  const goToNext = () => {
    setActiveIndex((prev) => (prev === painPoints.length - 1 ? 0 : prev + 1));
  };
  
  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? painPoints.length - 1 : prev - 1));
  };
  
  // 跳转到指定索引
  const goToIndex = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="relative">
      {/* 滑动提示 - 仅在移动设备上显示 */}
      {isMobile && (
        <div className="text-center mb-4 text-gray-500 text-sm animate-pulse">
          {t('swipeToViewMore')}
        </div>
      )}
      
      {/* 左右滑动按钮 */}
      <button 
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-all`}
        onClick={goToPrev}
        aria-label={t('scrollToPrevious')}
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-all`}
        onClick={goToNext}
        aria-label={t('scrollToNext')}
      >
        <ChevronRight size={24} />
      </button>
      
      {/* 卡片容器 */}
      <div className="overflow-hidden pb-6">
        <div 
          className="transition-transform duration-300 ease-in-out flex"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {painPoints.map((point, index) => (
            <div 
              key={point.id}
              className="w-full flex-shrink-0 px-2"
            >
              <div 
                className="rounded-2xl overflow-hidden shadow-lg border border-white/30 relative hover:shadow-xl transition-shadow"
                style={{ 
                  background: showSolution && activeCard === index 
                    ? `linear-gradient(145deg, rgb(90, 60, 40), rgb(40, 25, 15))`
                    : 'linear-gradient(145deg, rgb(90, 60, 40), rgb(40, 25, 15))',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.15)',
                }}
              >
                <div className="h-full flex flex-col relative overflow-hidden">
                  {/* 金属感背景层 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-800 to-amber-950 -z-10"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/20 -z-5"></div>
                  
                  {/* 金属质感纹理 */}
                  <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                    backgroundSize: '150px 150px'
                  }}></div>
                  
                  {/* 微光边缘效果 */}
                  <div className="absolute inset-0 opacity-20" style={{
                    background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, 0.1) 100%)'
                  }}></div>
                  
                  {/* 光晕效果 */}
                  <div 
                    className="absolute top-1/4 -left-20 w-40 h-40 rounded-full filter blur-[50px] opacity-20 -z-5"
                    style={{ 
                      backgroundColor: showSolution && activeCard === index
                        ? `rgb(var(--color-${point.color}-600))`
                        : `rgb(var(--color-${point.color}-600))` 
                    }}
                  ></div>
                  <div 
                    className="absolute bottom-1/4 -right-20 w-40 h-40 rounded-full filter blur-[50px] opacity-20 -z-5"
                    style={{ 
                      backgroundColor: showSolution && activeCard === index
                        ? `rgb(var(--color-${point.color}-600))`
                        : `rgb(var(--color-${point.color}-600))` 
                    }}
                  ></div>
                  
                  {/* 卡片ID和标题 */}
                  <div className="py-3 px-4 flex justify-between items-center border-b border-white/20">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full ${point.iconBg} flex items-center justify-center mr-3 text-white font-bold text-base shadow-md`}
                          style={{
                            boxShadow: '0 2px 6px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.4)'
                          }}
                      >
                        {point.iconText}
                      </div>
                      <h3 className="text-xl font-bold text-white">{point.title}</h3>
                    </div>
                    <div className="text-white/90 text-xs">
                      ID: {point.id}IGNIS{(index + 1) * 1234}
                    </div>
                  </div>
                  
                  {/* 卡片内容区域 */}
                  <div className="flex-grow p-4 pb-3 flex flex-col justify-between relative">
                    {showSolution && activeCard === index ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="solution-content h-full flex flex-col"
                      >
                        <div className="flex items-center mb-3">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center mr-3 shadow-md"
                            style={{ 
                              backgroundColor: `rgb(251, 191, 36)`,
                              boxShadow: '0 2px 6px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.4)'
                            }}
                          >
                            <span className="text-gray-800 font-semibold text-lg">{t('solutionIcon')}</span>
                          </div>
                          <h4 
                            className="text-lg font-bold"
                            style={{ color: `rgb(251, 191, 36)` }}
                          >{t('solutionTitle')}</h4>
                        </div>
                        
                        <div className="flex-grow">
                          <p className="text-white text-base leading-relaxed">{point.solution}</p>
                        </div>
                        
                        {/* 返回按钮 */}
                        <div className="text-center mt-auto pt-3">
                          <button 
                            className="inline-block text-gray-800 font-semibold bg-gradient-to-b from-amber-400 to-amber-500 border border-amber-500/50 rounded-full px-6 py-2 hover:from-amber-300 hover:to-amber-400 transition-all duration-300 text-base shadow-lg"
                            style={{
                              boxShadow: '0 2px 6px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.4)'
                            }}
                            onClick={handleBackToProblem}
                          >
                            {t('back') || "Back"}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="problem-content flex flex-col h-full">
                        <div className="flex-grow">
                          <p className="text-white/90 text-base leading-relaxed">{point.description}</p>
                        </div>
                        
                        <div className="text-center mt-auto pt-3 w-full">
                          <button 
                            className="inline-block text-gray-800 font-semibold bg-gradient-to-b from-amber-400 to-amber-500 border border-amber-500/50 rounded-full px-6 py-2 hover:from-amber-300 hover:to-amber-400 transition-all duration-300 text-base shadow-lg"
                            style={{
                              boxShadow: '0 2px 6px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.4)'
                            }}
                            onClick={() => handleViewSolution(index)}
                          >
                            {t('viewSolution')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* 卡片底部 */}
                  <div className="py-3 px-4 mt-auto border-t border-white/20 flex justify-between items-center">
                    <div className="text-white/90 text-xs">Ignis Terra AI Solution | 晟垚智能科技</div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 指示器点 */}
      <div className="flex justify-center mt-4 space-x-2">
        {painPoints.map((_, index) => (
          <button
            key={index}
            onClick={() => goToIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex ? 'bg-amber-600 w-4' : 'bg-amber-300/70'
            }`}
            aria-label={t('scrollToCard', { number: index + 1 }) || `移动到卡片${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PainPointCardsSwipeable; 