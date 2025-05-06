import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PainPointCardsSwipeable = () => {
  const { t, i18n } = useTranslation('common');
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const touchStartTimeRef = useRef(0);
  
  // 用于节流触摸移动事件处理的变量
  const lastTouchMoveTime = useRef(0);
  const TOUCH_THROTTLE_MS = 16; // 约60fps
  
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
  
  // 痛点卡片数据
  const painPoints = [
    { 
      id: '01', 
      iconText: t('painPoint1Icon'), 
      title: t('painPoint1Title'), 
      description: t('painPoint1Description'), 
      solution: t('painPoint1Solution'),
      color: 'blue', 
      iconBg: 'bg-blue-600',
      solutionColor: "from-blue-500 to-blue-700"
    },
    { 
      id: '02', 
      iconText: t('painPoint2Icon'), 
      title: t('painPoint2Title'), 
      description: t('painPoint2Description'), 
      solution: t('painPoint2Solution'),
      color: 'red', 
      iconBg: 'bg-red-600',
      solutionColor: "from-red-500 to-red-700"
    },
    { 
      id: '03', 
      iconText: t('painPoint3Icon'), 
      title: t('painPoint3Title'), 
      description: t('painPoint3Description'), 
      solution: t('painPoint3Solution'),
      color: 'amber', 
      iconBg: 'bg-amber-600',
      solutionColor: "from-amber-500 to-amber-700"
    },
    { 
      id: '04', 
      iconText: t('painPoint4Icon'), 
      title: t('painPoint4Title'), 
      description: t('painPoint4Description'), 
      solution: t('painPoint4Solution'),
      color: 'purple', 
      iconBg: 'bg-purple-600',
      solutionColor: "from-purple-500 to-purple-700"
    },
    { 
      id: '05', 
      iconText: t('painPoint5Icon'), 
      title: t('painPoint5Title'), 
      description: t('painPoint5Description'), 
      solution: t('painPoint5Solution'),
      color: 'slate', 
      iconBg: 'bg-slate-600',
      solutionColor: "from-slate-500 to-slate-700"
    },
    { 
      id: '06', 
      iconText: t('painPoint6Icon'), 
      title: t('painPoint6Title'), 
      description: t('painPoint6Description'), 
      solution: t('painPoint6Solution'),
      color: 'emerald', 
      iconBg: 'bg-emerald-600',
      solutionColor: "from-emerald-500 to-emerald-700"
    },
    { 
      id: '07', 
      iconText: t('painPoint7Icon'), 
      title: t('painPoint7Title'), 
      description: t('painPoint7Description'), 
      solution: t('painPoint7Solution'),
      color: 'amber', 
      iconBg: 'bg-amber-600',
      solutionColor: "from-amber-500 to-amber-700"
    },
    { 
      id: '08', 
      iconText: t('painPoint8Icon'), 
      title: t('painPoint8Title'), 
      description: t('painPoint8Description'), 
      solution: t('painPoint8Solution'),
      color: 'rose', 
      iconBg: 'bg-rose-600',
      solutionColor: "from-rose-500 to-rose-700"
    },
    { 
      id: '09', 
      iconText: t('painPoint9Icon'), 
      title: t('painPoint9Title'), 
      description: t('painPoint9Description'), 
      solution: t('painPoint9Solution'),
      color: 'pink', 
      iconBg: 'bg-pink-600',
      solutionColor: "from-pink-500 to-pink-700"
    },
    { 
      id: '10', 
      iconText: t('painPoint10Icon'), 
      title: t('painPoint10Title'), 
      description: t('painPoint10Description'), 
      solution: t('painPoint10Solution'),
      color: 'indigo', 
      iconBg: 'bg-indigo-600',
      solutionColor: "from-indigo-500 to-indigo-700"
    },
    { 
      id: '11', 
      iconText: t('painPoint11Icon'), 
      title: t('painPoint11Title'), 
      description: t('painPoint11Description'), 
      solution: t('painPoint11Solution'),
      color: 'cyan', 
      iconBg: 'bg-cyan-600',
      solutionColor: "from-cyan-500 to-cyan-700"
    },
    { 
      id: '12', 
      iconText: t('painPoint12Icon'), 
      title: t('painPoint12Title'), 
      description: t('painPoint12Description'), 
      solution: t('painPoint12Solution'),
      color: 'teal', 
      iconBg: 'bg-teal-600',
      solutionColor: "from-teal-500 to-teal-700"
    }
  ];

  // 检查滚动位置状态 - 使用防抖处理
  useEffect(() => {
    const checkScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      
      // 计算当前激活的点
      const totalWidth = scrollWidth - clientWidth;
      const currentRatio = totalWidth > 0 ? scrollLeft / totalWidth : 0;
      const dotsCount = 4; // 四个卡片点
      setActiveDot(Math.min(Math.floor(currentRatio * dotsCount), dotsCount - 1));
    };
    
    // 使用requestAnimationFrame进行性能优化
    let scrollTimeout;
    const scrollHandler = () => {
      if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = requestAnimationFrame(checkScroll);
    };
    
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', scrollHandler, { passive: true });
      checkScroll(); // 初始检查
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', scrollHandler);
      }
      if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
      }
    };
  }, []);

  // 处理查看解决方案
  const handleViewSolution = (index) => {
    setActiveCard(index);
    setShowSolution(true);
  };
  
  // 处理返回到问题
  const handleBackToProblem = () => {
    setShowSolution(false);
  };

  // 滑动左右箭头处理函数 - 优化滚动性能
  const scrollLeft20Percent = () => {
    if (!scrollContainerRef.current) return;
    const { clientWidth } = scrollContainerRef.current;
    scrollContainerRef.current.scrollBy({
      left: -clientWidth * 0.8,
      behavior: 'smooth'
    });
  };
  
  const scrollRight20Percent = () => {
    if (!scrollContainerRef.current) return;
    const { clientWidth } = scrollContainerRef.current;
    scrollContainerRef.current.scrollBy({
      left: clientWidth * 0.8,
      behavior: 'smooth'
    });
  };

  // 拖动功能 - 针对移动设备进行性能优化
  const handleMouseDown = (e) => {
    if (!scrollContainerRef.current) return;
    
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    
    // 记录开始时间用于检测是否为点击
    touchStartTimeRef.current = Date.now();
  };
  
  const handleTouchStart = (e) => {
    if (!scrollContainerRef.current) return;
    
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    
    // 记录开始时间用于检测是否为点击
    touchStartTimeRef.current = Date.now();
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // 滚动速度
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };
  
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    // 节流触摸移动事件以减轻性能负担
    const now = Date.now();
    if (now - lastTouchMoveTime.current < TOUCH_THROTTLE_MS) {
      return;
    }
    lastTouchMoveTime.current = now;
    
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };
  
  const handleDragEnd = (e) => {
    setIsDragging(false);
    
    // 检测是否为点击事件 (拖动时间短于200ms视为点击)
    const touchEndTime = Date.now();
    const isTap = touchEndTime - touchStartTimeRef.current < 200;
    
    // 如果是点击事件，并且点击在卡片上，则处理点击事件
    if (isTap && e && e.target && e.target.closest('.card-clickable')) {
      // 查找卡片索引
      const cardElement = e.target.closest('.card-clickable');
      const cardIndex = cardElement ? parseInt(cardElement.dataset.index, 10) : -1;
      
      if (cardIndex >= 0) {
        // 如果已经显示解决方案，点击则返回
        if (showSolution && activeCard === cardIndex) {
          handleBackToProblem();
        } else {
          handleViewSolution(cardIndex);
        }
      }
    }
  };

  // 点击指示点时滚动到相应位置
  const scrollToIndex = (index) => {
    if (!scrollContainerRef.current) return;
    
    const { scrollWidth, clientWidth } = scrollContainerRef.current;
    const totalScrollable = scrollWidth - clientWidth;
    const dotsCount = 4; // 与前面保持一致
    
    const targetScrollLeft = (index / (dotsCount - 1)) * totalScrollable;
    
    scrollContainerRef.current.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative">
      {/* 滑动提示 - 仅在移动设备上显示 */}
      {isMobile && (
        <div className="text-center mb-4 text-gray-500 text-sm animate-pulse">
          {t('swipeToViewMore')}
        </div>
      )}
      
      {/* 左右滑动箭头 - 在桌面设备上显示 */}
      {!isMobile && showLeftArrow && (
        <button 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-all"
          onClick={scrollLeft20Percent}
          aria-label={t('scrollToPrevious')}
        >
          <ChevronLeft size={24} />
        </button>
      )}
      
      {!isMobile && showRightArrow && (
        <button 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-all"
          onClick={scrollRight20Percent}
          aria-label={t('scrollToNext')}
        >
          <ChevronRight size={24} />
        </button>
      )}
      
      {/* 卡片滚动容器 - 优化滚动性能 */}
      <div 
        ref={scrollContainerRef}
        className="grid grid-flow-col auto-cols-[95%] sm:auto-cols-[47%] md:auto-cols-[31%] lg:auto-cols-[23%] gap-4 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          cursor: isDragging ? 'grabbing' : 'grab',
          willChange: 'scroll-position', // 优化滚动性能
          transform: 'translateZ(0)' // 启用GPU加速
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
      >
        {painPoints.map((point, index) => (
          <div 
            key={point.id}
            data-index={index}
            id={`card-container-${index}`}
            className="card-clickable rounded-2xl overflow-hidden shadow-lg border border-white/30 relative snap-start hover:shadow-xl transition-shadow"
            style={{ 
              background: showSolution && activeCard === index 
                ? `linear-gradient(145deg, rgb(90, 60, 40), rgb(40, 25, 15))`
                : 'linear-gradient(145deg, rgb(90, 60, 40), rgb(40, 25, 15))',
              transform: 'translateZ(0)', // 启用GPU加速
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.15)'
            }}
            onClick={() => {
              if (showSolution && activeCard === index) {
                handleBackToProblem();
              } else if (activeCard !== index) {
                handleViewSolution(index);
              }
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
                    className="solution-content cursor-pointer h-full flex flex-col"
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
                    
                    {/* 返回提示 */}
                    <div className="text-center mt-auto pt-3 text-amber-300/70 text-sm">
                      {t('tapToReturn') || "点击返回"}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewSolution(index);
                        }}
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
        ))}
      </div>
      
      {/* 滑动指示器点 - 在移动设备上显示 */}
      {isMobile && (
        <div className="flex justify-center mt-4 space-x-2">
          {[0, 1, 2, 3].map((index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === activeDot ? 'bg-amber-600 w-5' : 'bg-amber-300'
              }`}
              aria-label={t('scrollCardGroup', { number: index + 1 }) || `移动到卡片组${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* 自定义滚动条隐藏CSS */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default PainPointCardsSwipeable; 