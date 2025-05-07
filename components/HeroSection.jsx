import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

// 使用 RAF 節流，更適合動畫
const rafThrottle = (callback) => {
  let requestId = null;
  
  return function(...args) {
    if (requestId === null) {
      requestId = requestAnimationFrame(() => {
        callback.apply(this, args);
        requestId = null;
      });
    }
  };
};

// 線性插值函數，用於平滑過渡
const lerp = (start, end, factor) => {
  return start + (end - start) * factor;
};

// 限制值在一定范围内的函数
const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

// 更平滑的缓动函数
const smoothStep = (x) => {
  return x * x * (3 - 2 * x);
};

const HeroSection = () => {
  const containerRef = useRef(null);
  const glowRef = useRef(null);
  const leftHandRef = useRef(null);
  const rightHandRef = useRef(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const [handsTouching, setHandsTouching] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [exploreHovered, setExploreHovered] = useState(false);
  const { t, i18n } = useTranslation('common');
  
  // 手部位置参数
  const leftHandPos = useRef({ x: 0, y: 0 });
  const rightHandPos = useRef({ x: 0, y: 0 });
  const requestAnimationFrameId = useRef(null);
  
  // 平滑滚动到指定区块的函数
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // 使用更流畅的滚动行为
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  // 初始化和窗口大小监听
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 手部动画核心逻辑
  useEffect(() => {
    const leftHand = leftHandRef.current;
    const rightHand = rightHandRef.current;
    const container = containerRef.current;
    
    if (!leftHand || !rightHand || !container) return;
    
    let currentLeftX = 0;
    let currentLeftY = 0;
    let currentRightX = 0;
    let currentRightY = 0;
    let targetLeftX = 0;
    let targetLeftY = 0;
    let targetRightX = 0;
    let targetRightY = 0;
    
    // 计算手指位置
    const calculateHandPositions = (mouseX, mouseY) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // 鼠标相对于中心的位置
      const relativeX = mouseX - centerX;
      const relativeY = mouseY - centerY;
      
      // 移动范围
      const moveRange = Math.min(275, rect.width / 4);
      
      // 计算水平和垂直移动
      const moveX = (relativeX / centerX) * moveRange;
      const moveY = (relativeY / centerY) * (moveRange / 4);
      
      // 检测是否在中心区域
      const touchThreshold = rect.width * 0.08;
      const isTouching = Math.abs(relativeX) < touchThreshold;
      
      // 更新触摸状态
      if (isTouching !== handsTouching) {
        setHandsTouching(isTouching);
      }
      
      // 设置目标位置
      if (isTouching) {
        targetLeftX = -3;
        targetLeftY = -moveY;
        targetRightX = 3;
        targetRightY = -moveY;
      } else {
        targetLeftX = moveX / 2;
        targetLeftY = -moveY;
        targetRightX = -moveX / 2;
        targetRightY = -moveY;
      }
    };
    
    // 更新手部位置的动画
    const updateHandPositions = () => {
      // 平滑插值
      const smoothFactor = 0.12;
      
      // 左手插值
      currentLeftX = lerp(currentLeftX, targetLeftX, smoothFactor);
      currentLeftY = lerp(currentLeftY, targetLeftY, smoothFactor);
      
      // 右手插值
      currentRightX = lerp(currentRightX, targetRightX, smoothFactor);
      currentRightY = lerp(currentRightY, targetRightY, smoothFactor);
      
      // 应用变换
      leftHand.style.transform = `translate3d(${currentLeftX}px, ${currentLeftY}px, 0)`;
      rightHand.style.transform = `translate3d(${currentRightX}px, ${currentRightY}px, 0)`;
      
      // 继续更新
      requestAnimationFrameId.current = requestAnimationFrame(updateHandPositions);
    };
    
    // 鼠标移动处理
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      calculateHandPositions(mouseX, mouseY);
    };
    
    // 触摸处理
    const handleTouchMove = (e) => {
      // 移除preventDefault，允许默认的滚动行为
      // e.preventDefault();
      
      const touch = e.touches[0];
      if (!touch) return;
      
      const rect = container.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;
      
      calculateHandPositions(touchX, touchY);
    };
    
    // 添加事件监听
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true }); // 设置为passive: true
    
    // 开始动画
    requestAnimationFrameId.current = requestAnimationFrame(updateHandPositions);
    
    // 清理
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
      
      if (requestAnimationFrameId.current) {
        cancelAnimationFrame(requestAnimationFrameId.current);
      }
    };
  }, [handsTouching]);
  
  // 添加用于响应式位置调整的样式效果
  useEffect(() => {
    // 创建样式元素
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @media (min-width: 768px) {
        .hero-content-container {
          transform: translateY(-50px) !important; /* 桌面版上移 */
        }
      }
      
      @media (max-width: 767px) {
        .hero-content-container {
          transform: translateY(50px) !important; /* 移动版下移 */
        }
      }
    `;
    
    // 添加到head
    document.head.appendChild(styleElement);
    
    // 清理函数
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // 获取适合当前语言的标题和副标题
  const getTitle = () => {
    if (i18n.language === 'en') {
      return 'Seamless AI Integration';
    } else if (i18n.language === 'zh-TW') {
      return '一秒上手的智能體驗';
    } else {
      return '一秒上手的智能体验';
    }
  };

  const getSubtitle = () => {
    if (i18n.language === 'en') {
      return "Plug and play intelligence—instantly elevating your team's capabilities";
    } else if (i18n.language === 'zh-TW') {
      return '不用學，開箱即用，讓AI成為團隊的超能力';
    } else {
      return '不用学，开箱即用，让AI成为团队的超能力';
    }
  };
  
  return (
    <div className="relative min-h-[85vh] md:min-h-screen overflow-visible pointer-events-auto" ref={containerRef}>
      {/* 機械手與人手容器 - 调整手部图像大小和位置 */}
      <div className="absolute top-[50%] sm:top-[40%] left-0 w-full flex justify-center items-center pointer-events-none" style={{ zIndex: 5 }}>
        <div className="relative flex justify-center items-center gap-0 h-[75vh] md:h-screen w-full">
          {/* 左側機械手 */}
          <div 
            ref={leftHandRef}
            className="hand-left h-full w-1/2 flex justify-end items-center will-change-transform"
            style={{ 
              transition: 'filter 0.3s ease',
              transform: 'translate3d(0, 0, 0)'
            }}
          >
            <div className="relative h-full w-full">
              <Image
                src="/images/robot-hand.png"
                alt="Robot Hand"
                width={500}
                height={500}
                className="absolute right-[10%] top-[50%] sm:top-[40%] -translate-y-1/2 object-contain"
                style={{ 
                  maxHeight: '100vh',
                  width: 'auto',
                  backgroundColor: 'transparent',
                  willChange: 'transform'
                }}
                unoptimized={true}
                loading="eager"
                priority={true}
              />
            </div>
          </div>
          
          {/* 右側人手 */}
          <div 
            ref={rightHandRef}
            className="hand-right h-full w-1/2 flex justify-start items-center will-change-transform"
            style={{ 
              transition: 'filter 0.3s ease',
              transform: 'translate3d(0, 0, 0)'
            }}
          >
            <div className="relative h-full w-full">
              <Image
                src="/images/human-hand.png"
                alt="Human Hand"
                width={500}
                height={500}
                className="absolute left-[10%] top-[50%] sm:top-[40%] -translate-y-1/2 object-contain"
                style={{ 
                  maxHeight: '100vh',
                  width: 'auto',
                  backgroundColor: 'transparent',
                  willChange: 'transform'
                }}
                unoptimized={true}
                loading="eager"
                priority={true}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* 內容 - 桌面版上移，移动版下移 */}
      <div className="relative z-20 flex flex-col items-center justify-center h-[80vh] md:h-screen text-center px-4 hero-content-container" style={{ marginTop: '-5vh' }}>
        <h1 
          className="text-5xl md:text-7xl font-bold mb-5 gradient-text-title"
          style={{ 
            letterSpacing: '-0.01em',
            overflow: 'visible',
            paddingRight: '5px',
            paddingBottom: '10px'
          }}
        >
          {getTitle()}
        </h1>
        
        <p 
          className="text-lg md:text-xl text-gray-800 mb-4 max-w-2xl"
          style={{ 
            letterSpacing: '0.01em', 
            lineHeight: '1.6',
            overflow: 'visible'
          }}
        >
          {getSubtitle()}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button 
            onClick={() => scrollToSection('contact')}
            className={`text-base py-2.5 px-7 transition-all duration-300 relative overflow-hidden group ${exploreHovered ? 'btn-transparent' : 'btn-gradient'}`}
          >
            <span className="relative z-10 flex items-center justify-center">
              {t('bookConsultation')}
              <ArrowRight 
                className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300 ease-out" 
                style={{
                  verticalAlign: 'middle',
                  display: 'inline-flex',
                  marginTop: '-1px'
                }}
              />
            </span>
            {/* 按钮光效 */}
            <span className="absolute top-0 left-0 w-full h-full bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out"></span>
          </button>
          
          <button 
            onClick={() => scrollToSection('products')}
            className="btn-transparent text-base py-2.5 px-7 relative overflow-hidden group"
            onMouseEnter={() => setExploreHovered(true)}
            onMouseLeave={() => setExploreHovered(false)}
          >
            <span className="relative z-10 flex items-center justify-center">
              {t('exploreSolutions')}
              <svg 
                className="ml-1 h-5 w-5 transform transition-transform duration-300 ease-out group-hover:rotate-45" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  verticalAlign: 'middle',  // 确保垂直居中
                  display: 'inline-flex',   // 使用内联flex布局
                  marginTop: '-1px'        // 微调垂直位置
                }}
              >
                <path 
                  d="M17 8L21 12M21 12L17 16M21 12H3" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {/* 按钮背景动画效果 */}
            <span className="absolute top-0 left-0 w-full h-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" style={{
              background: 'linear-gradient(135deg, #0a1f5c, #243c8c, #6a1a2a, #8a0000)',
              backgroundSize: '300% 300%',
              animation: 'gradientShift 4s ease infinite',
              opacity: 0,
              transition: 'opacity 0.3s ease, transform 0.3s ease'
            }}></span>
          </button>
        </div>
      </div>
      
      {/* 扩展底部空间，并添加过渡元素 - 调整移动端底部空间 */}
      <div className="relative h-32 md:h-10 w-full">
      </div>
    </div>
  );
};

export default HeroSection;