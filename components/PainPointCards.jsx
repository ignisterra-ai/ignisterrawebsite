import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'next-i18next';

const PainPointCards = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const cardsRef = useRef([]);
  const containerRef = useRef(null);
  const { t, i18n } = useTranslation('common');

  // 痛点和解决方案数据
  const painPoints = [
    {
      id: 1,
      title: t('painPoint1Title'),
      description: t('painPoint1Description'),
      solution: t('painPoint1Solution'),
      color: "blue",
      solutionColor: "from-blue-500 to-blue-700",
      iconBg: "bg-blue-600",
      iconText: t('painPoint1Icon')
    },
    {
      id: 2,
      title: t('painPoint2Title'),
      description: t('painPoint2Description'),
      solution: t('painPoint2Solution'),
      color: "red",
      solutionColor: "from-red-500 to-red-700",
      iconBg: "bg-red-600",
      iconText: t('painPoint2Icon')
    },
    {
      id: 3,
      title: t('painPoint3Title'),
      description: t('painPoint3Description'),
      solution: t('painPoint3Solution'),
      color: "amber",
      solutionColor: "from-amber-500 to-amber-700",
      iconBg: "bg-amber-600",
      iconText: t('painPoint3Icon')
    },
    {
      id: 4,
      title: t('painPoint4Title'),
      description: t('painPoint4Description'),
      solution: t('painPoint4Solution'),
      color: "purple",
      solutionColor: "from-purple-500 to-purple-700",
      iconBg: "bg-purple-600",
      iconText: t('painPoint4Icon')
    },
    {
      id: 5,
      title: t('painPoint5Title'),
      description: t('painPoint5Description'),
      solution: t('painPoint5Solution'),
      color: "slate",
      solutionColor: "from-slate-500 to-slate-700",
      iconBg: "bg-slate-600",
      iconText: t('painPoint5Icon')
    },
    {
      id: 6,
      title: t('painPoint6Title'),
      description: t('painPoint6Description'),
      solution: t('painPoint6Solution'),
      color: "emerald",
      solutionColor: "from-emerald-500 to-emerald-700",
      iconBg: "bg-emerald-600",
      iconText: t('painPoint6Icon')
    },
    {
      id: 7,
      title: t('painPoint7Title'),
      description: t('painPoint7Description'),
      solution: t('painPoint7Solution'),
      color: "amber",
      solutionColor: "from-amber-500 to-amber-700",
      iconBg: "bg-amber-600",
      iconText: t('painPoint7Icon')
    },
    {
      id: 8,
      title: t('painPoint8Title'),
      description: t('painPoint8Description'),
      solution: t('painPoint8Solution'),
      color: "rose",
      solutionColor: "from-rose-500 to-rose-700",
      iconBg: "bg-rose-600",
      iconText: t('painPoint8Icon')
    },
    {
      id: 9,
      title: t('painPoint9Title'),
      description: t('painPoint9Description'),
      solution: t('painPoint9Solution'),
      color: "pink",
      solutionColor: "from-pink-500 to-pink-700",
      iconBg: "bg-pink-600",
      iconText: t('painPoint9Icon')
    },
    {
      id: 10,
      title: t('painPoint10Title'),
      description: t('painPoint10Description'),
      solution: t('painPoint10Solution'),
      color: "indigo",
      solutionColor: "from-indigo-500 to-indigo-700",
      iconBg: "bg-indigo-600",
      iconText: t('painPoint10Icon')
    },
    {
      id: 11,
      title: t('painPoint11Title'),
      description: t('painPoint11Description'),
      solution: t('painPoint11Solution'),
      color: "cyan",
      solutionColor: "from-cyan-500 to-cyan-700",
      iconBg: "bg-cyan-600",
      iconText: t('painPoint11Icon')
    },
    {
      id: 12,
      title: t('painPoint12Title'),
      description: t('painPoint12Description'),
      solution: t('painPoint12Solution'),
      color: "teal",
      solutionColor: "from-teal-500 to-teal-700",
      iconBg: "bg-teal-600",
      iconText: t('painPoint12Icon')
    }
  ];

  // 处理卡片点击事件
  const handleCardClick = (index) => {
    if (activeCard === index) {
      // 显示解决方案
      setShowSolution(true);
    } else {
      setActiveCard(index);
      setShowSolution(false);
    }
  };

  // 当用户从解决方案返回时，重新启用亮点效果
  useEffect(() => {
    if (!showSolution && activeCard === null) {
      // 等待一小段时间后才重新显示亮点，确保用户已经完成视图切换
      setTimeout(() => {
        // 获取所有闪光元素并重新显示
        const shineElements = document.querySelectorAll('.card-silver-shine');
        shineElements.forEach(element => {
          if (element) {
            element.style.display = 'block';
          }
        });
        
        // 移除解决方案视图类
        document.querySelectorAll('.card-wrapper').forEach(card => {
          card.classList.remove('view-solution');
          card.classList.remove('solution-active');
        });
      }, 500);
    }
  }, [showSolution, activeCard]);

  // 处理中央卡片点击
  const handleCenterCardClick = () => {
    if (isFlipping) return;
    
    // 当前中央卡片的索引
    const centerIndex = currentCardIndex;
    
    // 如果已激活，切换解决方案显示
    if (activeCard === centerIndex) {
      setShowSolution(!showSolution);
      
      // 如果要显示解决方案，隐藏闪光效果
      if (!showSolution) {
        // 隐藏所有闪光元素
        const shineElements = document.querySelectorAll('.card-silver-shine');
        shineElements.forEach(element => {
          if (element) {
            element.style.display = 'none';
          }
        });
        
        // 添加解决方案视图类
        const activeCardElement = cardsRef.current[centerIndex];
        if (activeCardElement) {
          activeCardElement.classList.add('view-solution');
          activeCardElement.classList.add('solution-active');
        }
      }
    } else {
      // 如果未激活，激活卡片
      setActiveCard(centerIndex);
      setShowSolution(false);
    }
  };

  // 返回到问题描述
  const handleBackToProblem = (index) => {
    setShowSolution(false);
  };

  // 切换到下一张或上一张卡片
  const changeCard = (direction) => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setShowSolution(false);
    setActiveCard(null);
    
    // 设置翻页方向和目标
    const newIndex = direction === 'next'
      ? (currentCardIndex + 1) % painPoints.length
      : (currentCardIndex - 1 + painPoints.length) % painPoints.length;
      
    setCurrentCardIndex(newIndex);
    
    // 翻页动画完成后重置状态
    setTimeout(() => {
      setIsFlipping(false);
    }, 500);
  };

  // 创建能量粒子效果 - 修改粒子效果以解决白点问题
  const createEnergyParticles = (x, y) => {
    const container = document.querySelector('.pain-point-container');
    if (!container) return;
    
    // 创建少量粒子，避免中心出现白点
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.classList.add('energy-particle');
      
      // 使用更深的半透明颜色
      const colors = [
        'rgba(220, 180, 120, 0.6)', 
        'rgba(200, 150, 100, 0.6)', 
        'rgba(180, 120, 80, 0.6)'
      ];
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // 设置粒子位置，避免在正中央位置
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;
      particle.style.left = `${x + offsetX}px`;
      particle.style.top = `${y + offsetY}px`;
      
      // 粒子大小较小
      const size = 3 + Math.random() * 8;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // 设置粒子动画
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 80;
      const duration = 0.4 + Math.random() * 0.6;
      
      particle.style.transform = `translate(0, 0)`;
      particle.style.animation = `particleFly ${duration}s ease-out forwards`;
      
      // 设置粒子终点位置
      particle.style.setProperty('--end-x', `${Math.cos(angle) * distance}`);
      particle.style.setProperty('--end-y', `${Math.sin(angle) * distance}`);
      
      container.appendChild(particle);
      
      // 自动移除粒子
      setTimeout(() => {
        if (particle.parentNode) {
          particle.remove();
        }
      }, duration * 1000 + 100);
    }
  };

  // 当显示解决方案时，在卡片中心创建粒子效果
  useEffect(() => {
    if (showSolution && activeCard !== null && cardsRef.current[activeCard]) {
      const card = cardsRef.current[activeCard];
      const rect = card.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // 计算卡片中心相对于容器的位置
      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;
      
      createEnergyParticles(x, y);
    }
  }, [showSolution, activeCard]);

  // 计算卡片位置的偏移量
  const getCardOffset = (index) => {
    // 中心卡片是当前索引
    const centerIndex = currentCardIndex;
    // 计算相对位置（负数表示左边，正数表示右边）
    const relativePosition = index - centerIndex;
    
    // 处理循环（最后一个卡片和第一个卡片的关系）
    if (relativePosition > painPoints.length / 2) return relativePosition - painPoints.length;
    if (relativePosition < -painPoints.length / 2) return relativePosition + painPoints.length;
    
    return relativePosition;
  };

  // 组件挂载时添加全局事件监听器
  useEffect(() => {
    // 防止任何3D旋转
    const preventRotation = (e) => {
      const cards = document.querySelectorAll('.card-wrapper');
      cards.forEach(card => {
        // 重置所有可能的3D变换
        if (card.style.transform && (
            card.style.transform.includes('rotateX') || 
            card.style.transform.includes('rotateY') || 
            card.style.transform.includes('rotate3d')
          )) {
          card.style.transform = 'rotateY(0deg)';
        }
      });
    };

    // 监听动画帧以防止旋转
    let rafId;
    const checkRotation = () => {
      preventRotation();
      rafId = requestAnimationFrame(checkRotation);
    };
    
    // 启动监视
    checkRotation();
    
    // 监听鼠标移动和滚动事件
    window.addEventListener('mousemove', preventRotation);
    window.addEventListener('scroll', preventRotation);
    document.addEventListener('click', (e) => {
      // 如果点击了"查看解决方案"按钮
      if (e.target.closest('button') && 
          e.target.textContent.includes(t('viewSolution'))) {
        // 找到所有亮点并隐藏
        const shineElements = document.querySelectorAll('.card-silver-shine');
        shineElements.forEach(element => {
          if (element) {
            element.style.display = 'none';
          }
        });
      }
    });

    return () => {
      // 清理
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', preventRotation);
      window.removeEventListener('scroll', preventRotation);
    };
  }, [t]);

  return (
    <div className="pain-point-container relative w-full min-h-[600px] overflow-hidden py-8" ref={containerRef}>
      <div className="relative w-full h-full flex justify-center items-center">
        {/* 堆叠卡片区域 */}
        <div className="relative w-[520px] h-[450px]">
          {painPoints.map((point, index) => {
            const offset = getCardOffset(index);
            return (
              <div 
                key={point.id}
                className={`absolute top-0 left-0 w-full h-full transition-all duration-500 ease-out
                           ${offset === 0 ? 'z-50' : offset === 1 ? 'z-40' : offset === -1 ? 'z-30' : 'z-10'}
                           ${showSolution && activeCard === index ? 'rotating-disabled' : ''}`}
                style={{
                  transform: `translateX(${offset * 70}px) scale(${1 - Math.abs(offset) * 0.07}) 
                             ${Math.abs(offset) <= 1 ? '' : 'translateZ(-50px)'}`,
                  opacity: Math.abs(offset) <= 2 ? 1 - Math.abs(offset) * 0.2 : 0,
                  filter: `blur(${Math.abs(offset) * 1}px)`,
                  transition: 'transform 0.5s ease-out, opacity 0.5s ease-out, filter 0.5s ease-out',
                  // 确保卡片不会自己旋转，只有水平移动和缩放
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  perspective: '1000px'
                }}
                onClick={() => offset !== 0 && changeCard(offset > 0 ? 'next' : 'prev')}
              >
                <motion.div
                  ref={(el) => (cardsRef.current[index] = el)}
                  className={`card-wrapper cursor-pointer w-full h-full rounded-2xl overflow-hidden
                    shadow-lg hover:shadow-xl transition-all duration-500 border border-white/30
                    ${activeCard === index ? 'scale-105' : ''} 
                    ${showSolution && activeCard === index ? 'view-solution solution-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (offset === 0) {
                      handleCenterCardClick();
                    }
                  }}
                  whileHover={offset === 0 ? { scale: 1.02 } : {}}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  // 移除任何可能导致3D翻转的运动属性
                  style={{
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)', // 强制保持正面朝向
                    willChange: 'transform', // 提高渲染性能
                    background: showSolution && activeCard === index 
                      ? `linear-gradient(145deg, rgb(120, 80, 60), rgb(70, 40, 20))` 
                      : 'linear-gradient(145deg, rgb(120, 80, 60), rgb(70, 40, 20))', 
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.1)'
                  }}
                >
                  <div className={`h-full flex flex-col relative overflow-hidden`}>
                    {/* 移除半透明背景，使用纯色背景 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-800 to-amber-950 -z-10"></div>
                    
                    {/* 使用样式对象替代动态Tailwind类名，但确保光晕效果不会影响文字可读性 */}
                    <div 
                      className="absolute top-1/4 -left-20 w-40 h-40 rounded-full filter blur-[50px] opacity-30 -z-5"
                      style={{ 
                        backgroundColor: showSolution && activeCard === index
                          ? `rgb(var(--color-${point.color}-600))`
                          : `rgb(var(--color-${point.color}-600))` 
                      }}
                    ></div>
                    <div 
                      className="absolute bottom-1/4 -right-20 w-40 h-40 rounded-full filter blur-[50px] opacity-30 -z-5"
                      style={{ 
                        backgroundColor: showSolution && activeCard === index
                          ? `rgb(var(--color-${point.color}-600))`
                          : `rgb(var(--color-${point.color}-600))` 
                      }}
                    ></div>
                    
                    {/* 卡片ID和标题 */}
                    <div className="py-4 px-5 flex justify-between items-center border-b border-white/20">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-full ${point.iconBg} flex items-center justify-center mr-3 text-white font-bold text-lg shadow-md`}>
                          {point.iconText}
                        </div>
                        <h3 className="text-2xl font-bold text-white">{point.title}</h3>
                      </div>
                      <div className="text-white/90 text-sm">
                        ID: {point.id.toString().padStart(2, '0')}IGNIS{(index + 1) * 1234}
                      </div>
                    </div>
                    
                    {/* 卡片内容区域 */}
                    <div className="flex-grow p-6 pb-4 flex flex-col justify-between relative">
                      {showSolution && activeCard === index ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          className="solution-content cursor-pointer h-full flex flex-col"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBackToProblem(index);
                          }}
                        >
                          <div className="flex items-center mb-5">
                            <div 
                              className="w-14 h-14 rounded-full flex items-center justify-center mr-4 shadow-glow-sm"
                              style={{ backgroundColor: `rgb(251, 191, 36)` }}
                            >
                              <span className="text-gray-800 font-semibold text-xl">{t('solutionIcon')}</span>
                            </div>
                            <h4 
                              className="text-xl font-bold"
                              style={{ color: `rgb(251, 191, 36)` }}
                            >{t('solutionTitle')}</h4>
                          </div>
                          
                          <div className="flex-grow">
                            <p className="text-white text-lg leading-relaxed">{point.solution}</p>
                          </div>
                          
                          {/* 返回提示 */}
                          <div className="text-center mt-auto pt-4 text-amber-300/70 text-sm">
                            {t('tapToReturn') || "点击返回"}
                          </div>
                        </motion.div>
                      ) : (
                        <div className="problem-content flex flex-col h-full">
                          <div className="flex-grow">
                            <p className="text-white/90 text-lg leading-relaxed">{point.description}</p>
                          </div>
                          
                          {offset === 0 && (
                            <div className="text-center mt-auto pt-4 w-full">
                              <button 
                                className="inline-block text-gray-800 font-semibold bg-amber-400 border border-amber-500 rounded-full px-8 py-3 hover:bg-amber-300 transition-all text-lg shadow-lg"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveCard(index);
                                  setShowSolution(true);
                                  
                                  // 隐藏所有闪光元素
                                  const shineElements = document.querySelectorAll('.card-silver-shine');
                                  shineElements.forEach(element => {
                                    if (element) {
                                      element.style.display = 'none';
                                    }
                                  });
                                  
                                  // 添加解决方案视图类到当前卡片
                                  const currentCard = e.currentTarget.closest('.card-wrapper');
                                  if (currentCard) {
                                    currentCard.classList.add('view-solution');
                                    currentCard.classList.add('solution-active');
                                  }
                                }}
                              >
                                {t('viewSolution')}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* 卡片底部 */}
                    <div className="py-5 px-5 mt-auto border-t border-white/20 flex justify-between items-center">
                      <div className="text-white/90 text-sm">Ignis Terra AI Solution | 晟垚智能科技</div>
                      <div className="flex items-center">
                        <svg className="w-6 h-6 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                      </div>
                    </div>
                    
                    {/* 添加银色闪光效果 */}
                    <div className="card-silver-shine absolute inset-0 pointer-events-none"></div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
        
        {/* 左右导航按钮 */}
        <div className="absolute -left-12 md:left-0 top-1/2 transform -translate-y-1/2 z-50">
          <motion.button
            className="w-16 h-16 bg-white/20 rounded-full border border-white/40 flex items-center justify-center shadow-lg hover:bg-white/30 transition-all"
            onClick={() => changeCard('prev')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
            </svg>
          </motion.button>
        </div>
        
        <div className="absolute -right-12 md:right-0 top-1/2 transform -translate-y-1/2 z-50">
          <motion.button
            className="w-16 h-16 bg-white/20 rounded-full border border-white/40 flex items-center justify-center shadow-lg hover:bg-white/30 transition-all"
            onClick={() => changeCard('next')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
            </svg>
          </motion.button>
        </div>
      </div>
      
      {/* 卡片指示器 - 仅作为指示器使用，不触发切换 */}
      <div className="flex justify-center mt-12 space-x-4">
        {painPoints.map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full transition-colors duration-300 ${
              currentCardIndex === index ? 'bg-white shadow-glow' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
      
      {/* 添加粒子动画CSS */}
      <style jsx>{`
        @keyframes particleFly {
          to {
            transform: translate(var(--end-x), var(--end-y));
            opacity: 0;
            scale: 0.3;
          }
        }
        
        .energy-particle {
          position: absolute;
          border-radius: 50%;
          z-index: 60;
          opacity: 0.7;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default PainPointCards; 