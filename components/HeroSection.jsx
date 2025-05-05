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

// 添加弹性缓动函数，使动画更加自然
const elasticOut = (t) => {
  return Math.sin(-13.0 * (t + 1.0) * Math.PI/2) * Math.pow(2.0, -10.0 * t) + 1.0;
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
  
  // 手部運動平滑參數
  const currentLeftHandPosition = useRef({ x: 0, y: 0 });
  const currentRightHandPosition = useRef({ x: 0, y: 0 });
  const targetLeftHandPosition = useRef({ x: 0, y: 0 });
  const targetRightHandPosition = useRef({ x: 0, y: 0 });
  const handAnimationId = useRef(null);
  
  // 光晕位置平滑过渡
  const currentGlowPosition = useRef({ x: 0, y: 0 });
  const targetGlowPosition = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef(null);
  
  // 上一个位置，用于检测突变
  const previousPosition = useRef({ x: 0, y: 0 });
  // 添加光晕旋转呼吸状态
  const breathingState = useRef({ 
    scale: 1, 
    opacity: 0.6, 
    rotation: 0, 
    rotationSpeed: 0.1 
  });
  
  // 添加root变量以存储CSS变量
  useEffect(() => {
    // 设置CSS根变量
    document.documentElement.style.setProperty('--glow-distort-x', '0%');
    document.documentElement.style.setProperty('--glow-distort-y', '0%');
  }, []);
  
  // 初始化和窗口大小监听
  useEffect(() => {
    // 初始化窗口宽度
    setWindowWidth(window.innerWidth);
    
    // 监听窗口大小变化
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 专门处理光晕元素的初始化
  useEffect(() => {
    const glow = glowRef.current;
    if (glow) {
      // 直接设置内联样式确保最高优先级
      glow.style.position = 'fixed';
      glow.style.top = '50%';
      glow.style.left = '50%';
      glow.style.width = '100%';
      glow.style.height = '100%';
      glow.style.zIndex = '3';
      glow.style.pointerEvents = 'none';
      glow.style.opacity = '0.85';
      glow.style.transform = 'translate(-50%, -50%) scale(1)';
      glow.style.display = 'block';
      glow.style.visibility = 'visible';
      
      // 确保CSS变量有合理的初始值
      glow.style.setProperty('--glow-x', '0px');
      glow.style.setProperty('--glow-y', '0px');
      glow.style.setProperty('--glow-size', '1');
      glow.style.setProperty('--glow-opacity', '0.85');
      
      // 添加自定义动画控制
      glow.style.animation = 'glow-breath 15s infinite alternate ease-in-out';
    }
  }, []);
  
  // 手部位置平滑插值动画
  useEffect(() => {
    const leftHand = leftHandRef.current;
    const rightHand = rightHandRef.current;
    
    // 如果手部元素不存在，直接返回
    if (!leftHand || !rightHand) return;
    
    // 更新手部位置的函数
    const updateHandPosition = () => {
      // 左手平滑插值 - 使用更高级的平滑系数
      currentLeftHandPosition.current = {
        x: lerp(currentLeftHandPosition.current.x, targetLeftHandPosition.current.x, 0.1),
        y: lerp(currentLeftHandPosition.current.y, targetLeftHandPosition.current.y, 0.1)
      };
      
      // 右手平滑插值
      currentRightHandPosition.current = {
        x: lerp(currentRightHandPosition.current.x, targetRightHandPosition.current.x, 0.1),
        y: lerp(currentRightHandPosition.current.y, targetRightHandPosition.current.y, 0.1)
      };
      
      // 应用变换 - 使用transform3d提高性能
      leftHand.style.transform = `translate3d(${currentLeftHandPosition.current.x}px, ${currentLeftHandPosition.current.y}px, 0)`;
      rightHand.style.transform = `translate3d(${currentRightHandPosition.current.x}px, ${currentRightHandPosition.current.y}px, 0)`;
      
      // 继续更新
      handAnimationId.current = requestAnimationFrame(updateHandPosition);
    };
    
    // 启动动画
    handAnimationId.current = requestAnimationFrame(updateHandPosition);
    
    // 清理函数
    return () => {
      if (handAnimationId.current) {
        cancelAnimationFrame(handAnimationId.current);
      }
    };
  }, []);
  
  // 光晕位置更新动画帧
  useEffect(() => {
    const glow = glowRef.current;
    
    // 更新光晕位置的函数
    const updateGlowPosition = () => {
      if (glow && targetGlowPosition.current) {
        // 计算目标位置
        const distortX = targetGlowPosition.current.x;
        const distortY = targetGlowPosition.current.y;
        
        // 平滑过渡到目标变形位置
        currentGlowPosition.current = {
          x: lerp(currentGlowPosition.current.x, distortX, 0.07),
          y: lerp(currentGlowPosition.current.y, distortY, 0.07)
        };
        
        // 更新CSS变量
        document.documentElement.style.setProperty('--glow-distort-x', `${currentGlowPosition.current.x}px`);
        document.documentElement.style.setProperty('--glow-distort-y', `${currentGlowPosition.current.y}px`);
        
        // 手指触摸时，强化光晕效果
        if (handsTouching) {
          glow.style.setProperty('--glow-opacity', '1');
          glow.style.opacity = '1';
          
          // 添加特殊的触摸高光滤镜
          glow.style.filter = 'blur(65px) contrast(1.3) saturate(1.3) brightness(1.08)';
        } else {
          // 恢复正常滤镜
          glow.style.filter = '';
        }
        
        // 继续更新
        animationFrameId.current = requestAnimationFrame(updateGlowPosition);
      }
    };
    
    // 开始位置更新
    animationFrameId.current = requestAnimationFrame(updateGlowPosition);
    
    // 清理函数
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [handsTouching]);
  
  // 计算手指位置
  const calculateHandPositions = (x, y, rect) => {
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const relativeX = x - centerX;
    const relativeY = y - centerY;
    
    // 调整移动参数
    const baseMaxMove = 168;
    const screenWidthFactor = rect.width / 1920;
    const maxMove = baseMaxMove * screenWidthFactor;
    
    let moveMultiplier = 2.2;
    if (rect.width < 768) {
      moveMultiplier = 1.6;
    }
    
    const moveDistance = (relativeX / centerX) * maxMove * moveMultiplier;
    const maxVerticalMove = rect.height * 0.05;
    // 反转垂直移动方向，让手随鼠标向上移动
    const verticalMoveDistance = -(relativeY / centerY) * maxVerticalMove;
    
    // 检测是否触摸，稍微增大触摸区域
    const centerRegionSize = rect.width * 0.1; // 增加中心区域大小至10%宽度
    const isTouching = Math.abs(relativeX) < centerRegionSize;
    
    // 如果状态发生变化，更新它
    if (isTouching !== handsTouching) {
      setHandsTouching(isTouching);
    }
    
    // 计算手指目标位置
    if (isTouching) {
      // 触摸状态时，手指回到中心
      return {
        leftHand: { x: 0, y: verticalMoveDistance },
        rightHand: { x: 0, y: verticalMoveDistance },
        isTouching
      };
    } else {
      // 非触摸状态时，手指跟随鼠标
      return {
        leftHand: { x: moveDistance / 2, y: verticalMoveDistance },
        rightHand: { x: -moveDistance / 2, y: verticalMoveDistance },
        isTouching
      };
    }
  };
  
  // 主要交互逻辑
  useEffect(() => {
    const container = containerRef.current;
    const glow = glowRef.current;
    const leftHand = leftHandRef.current;
    const rightHand = rightHandRef.current;
    
    // 创建能量脉冲的函数 - 增强版，但强度降低到20%
    const createEnergyPulse = (centerX, centerY) => {
      // 创建主要脉冲光晕
      const createMainPulse = () => {
        // 主要能量脉冲
        const energyPulse = document.createElement('div');
        energyPulse.classList.add('energy-pulse');
        energyPulse.style.position = 'absolute';
        energyPulse.style.top = `${centerY}px`;
        energyPulse.style.left = `${centerX}px`;
        
        // 橙金色能量脉冲样式 - 降低强度到20%
        energyPulse.style.background = 'radial-gradient(circle, rgba(255, 255, 235, 0.19) 0%, rgba(255, 215, 130, 0.15) 25%, rgba(255, 160, 60, 0.11) 50%, rgba(200, 80, 0, 0.07) 75%, rgba(0, 0, 0, 0) 90%)';
        energyPulse.style.filter = 'blur(8px)';
        energyPulse.style.width = '80px';
        energyPulse.style.height = '80px';
        energyPulse.style.zIndex = '15';
        energyPulse.style.transform = 'translate(-50%, -50%) scale(0)';
        energyPulse.style.animation = 'pulse-out 2.2s ease-out forwards';
        energyPulse.style.opacity = '0.19'; // 降低到20%原来的强度
        
        container.appendChild(energyPulse);
        
        // 自动清理能量脉冲元素
        setTimeout(() => {
          if (energyPulse.parentNode) {
            energyPulse.remove();
          }
        }, 2500);
      };
      
      // 创建二次脉冲，增加层次感，但强度降低
      const createSecondaryPulse = () => {
        const secondaryPulse = document.createElement('div');
        secondaryPulse.classList.add('energy-pulse');
        secondaryPulse.style.position = 'absolute';
        secondaryPulse.style.top = `${centerY}px`;
        secondaryPulse.style.left = `${centerX}px`;
        
        // 更淡的颜色，降低强度
        secondaryPulse.style.background = 'radial-gradient(circle, rgba(255, 255, 245, 0.18) 0%, rgba(255, 225, 150, 0.13) 35%, rgba(255, 180, 80, 0.09) 60%, rgba(0, 0, 0, 0) 85%)';
        secondaryPulse.style.filter = 'blur(12px)';
        secondaryPulse.style.width = '100px';
        secondaryPulse.style.height = '100px';
        secondaryPulse.style.zIndex = '14';
        secondaryPulse.style.transform = 'translate(-50%, -50%) scale(0)';
        secondaryPulse.style.animation = 'pulse-out 2.6s ease-out forwards 0.1s';
        secondaryPulse.style.opacity = '0.17'; // 降低到20%原来的强度
        
        container.appendChild(secondaryPulse);
        
        setTimeout(() => {
          if (secondaryPulse.parentNode) {
            secondaryPulse.remove();
          }
        }, 2800);
      };
      
      // 创建小型辅助光斑 - 更丰富的粒子效果，但强度降低
      const createParticles = () => {
        // 创建更多的粒子，增加丰富感
        for (let i = 0; i < 8; i++) {
          const smallPulse = document.createElement('div');
          smallPulse.classList.add('energy-particle');
          
          // 随机位置偏移 - 更大范围
          const distance = 30 + Math.random() * 40; // 30-70px 范围
          const angle = Math.random() * Math.PI * 2; // 0-360度
          const offsetX = Math.cos(angle) * distance;
          const offsetY = Math.sin(angle) * distance;
          
          smallPulse.style.position = 'absolute';
          smallPulse.style.top = `${centerY + offsetY}px`;
          smallPulse.style.left = `${centerX + offsetX}px`;
          
          // 随机颜色 - 金色、橙色、淡红色 三种选择，但降低强度
          const colorType = Math.floor(Math.random() * 3);
          if (colorType === 0) {
            // 金色
            smallPulse.style.background = 'radial-gradient(circle, rgba(255, 245, 200, 0.19) 0%, rgba(255, 215, 0, 0.14) 50%, rgba(0, 0, 0, 0) 100%)';
          } else if (colorType === 1) {
            // 橙色
            smallPulse.style.background = 'radial-gradient(circle, rgba(255, 235, 180, 0.19) 0%, rgba(255, 140, 0, 0.14) 50%, rgba(0, 0, 0, 0) 100%)';
          } else {
            // 淡红色
            smallPulse.style.background = 'radial-gradient(circle, rgba(255, 220, 180, 0.19) 0%, rgba(200, 80, 0, 0.14) 50%, rgba(0, 0, 0, 0) 100%)';
          }
          
          // 随机大小
          const size = 10 + Math.random() * 20;
          smallPulse.style.width = `${size}px`;
          smallPulse.style.height = smallPulse.style.width;
          smallPulse.style.borderRadius = '50%';
          smallPulse.style.transform = 'translate(-50%, -50%) scale(0)';
          
          // 随机动画时长
          const duration = 1 + Math.random() * 1.5;
          smallPulse.style.animation = `pulse-out ${duration}s ease-out forwards ${Math.random() * 0.5}s`;
          smallPulse.style.opacity = '0.18'; // 降低到20%原来的强度
          smallPulse.style.filter = `blur(${3 + Math.random() * 2}px)`;
          
          container.appendChild(smallPulse);
          
          // 延迟清理
          setTimeout(() => {
            if (smallPulse.parentNode) {
              smallPulse.remove();
            }
          }, duration * 1000 + 500);
        }
      };
      
      // 执行所有效果创建
      createMainPulse();
      createSecondaryPulse();
      createParticles();
    };
    
    // 使用 RAF 优化的鼠标事件处理器
    const handleMouseMove = rafThrottle((e) => {
      if (!container || !leftHand || !rightHand) return;
      
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // 保存鼠标位置到引用中
      mousePositionRef.current = { x, y };
      
      // 计算手指位置
      const { leftHand: leftPos, rightHand: rightPos, isTouching } = calculateHandPositions(x, y, rect);
      
      // 更新手指目标位置
      targetLeftHandPosition.current = leftPos;
      targetRightHandPosition.current = rightPos;
      
      // 触摸状态变化时的特效
      if (isTouching && !handsTouching) {
        // 触摸开始
        leftHand.classList.add('hand-touching');
        rightHand.classList.add('hand-touching');
        
        // 创建能量脉冲
        createEnergyPulse(rect.width / 2, rect.height / 2);
      } else if (!isTouching && handsTouching) {
        // 触摸结束
        leftHand.classList.remove('hand-touching');
        rightHand.classList.remove('hand-touching');
      }
      
      // 光晕效果计算
      if (glow) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // 计算相对中心的位置
        const relativeX = x - centerX;
        const relativeY = y - centerY;
        
        // 使用更平滑的响应曲线
        const normalizedX = relativeX / centerX;
        const normalizedY = relativeY / centerY;
        
        // 应用平滑函数来创建更自然的移动
        const smoothX = smoothStep(Math.abs(normalizedX)) * Math.sign(normalizedX) * 1.9; // 增加拉伸系数
        const smoothY = smoothStep(Math.abs(normalizedY)) * Math.sign(normalizedY) * 1.9; // 增加拉伸系数
        
        // 设置移动系数
        const moveFactorX = 0.3; // 增加横向拉伸系数
        const moveFactorY = 0.25; // 增加纵向拉伸系数
        
        // 使用屏幕尺寸调整移动距离
        const screenAdjustment = Math.min(rect.width / 1920, 1);
        const maxOffset = 120 * screenAdjustment;
        
        // 计算目标位置
        const targetX = smoothX * centerX * moveFactorX;
        const targetY = smoothY * centerY * moveFactorY;
        
        // 限制移动范围
        const clampedX = clamp(targetX, -maxOffset, maxOffset);
        const clampedY = clamp(targetY, -maxOffset, maxOffset);
        
        // 更新目标位置，用于拉扯外围色彩
        targetGlowPosition.current = {
          x: clampedX,
          y: clampedY
        };
        
        // 根据距离增强光晕效果
        if (!isTouching) {
          const distanceFromCenter = Math.sqrt(
            Math.pow(normalizedX, 2) + Math.pow(normalizedY, 2)
          );
          
          const saturationFactor = clamp(distanceFromCenter * 1.8, 0.9, 1.5);
          const opacityValue = clamp(0.7 + distanceFromCenter * 0.3, 0.7, 0.9);
          
          // 减少滤镜复杂度，只在变化明显时更新
          if (Math.abs(parseFloat(glow.style.filter.match(/saturate\(([^)]+)\)/)?.[1] || 1) - saturationFactor) > 0.1) {
            glow.style.filter = `blur(90px) saturate(${saturationFactor})`;
          }
          
          // 只有当不透明度变化较大时才更新
          if (Math.abs(parseFloat(glow.style.opacity) - opacityValue) > 0.05) {
            glow.style.opacity = opacityValue.toString();
          }
        }
      }
    });
    
    // 添加鼠标移动事件监听器
    container.addEventListener('mousemove', handleMouseMove);
    
    // 清理函数
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handsTouching, windowWidth]);
  
  return (
    <div className="relative min-h-screen overflow-visible gravity-field" ref={containerRef}>
      {/* 背景光晕效果 */}
      <div 
        ref={glowRef} 
        className="background-glow"
        aria-hidden="true"
      />
      
      {/* 機械手與人手容器 */}
      <div className="absolute top-[45%] left-0 w-full flex justify-center items-center pointer-events-none" style={{ zIndex: 30 }}>
        <div className="relative flex justify-center items-center gap-0 h-screen w-full">
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
                className="absolute right-[10%] top-[45%] -translate-y-1/2 object-contain"
                style={{ 
                  maxHeight: '110vh',
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
                className="absolute left-[10%] top-[45%] -translate-y-1/2 object-contain"
                style={{ 
                  maxHeight: '110vh',
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
      
      {/* 內容 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen text-center px-4" style={{ marginTop: '-12vh' }}>
        <h1 
          className="text-5xl md:text-7xl font-bold mb-5 gradient-text-title"
          style={{ 
            letterSpacing: '-0.01em',
            overflow: 'visible',
            paddingRight: '5px', // 确保文字不被遮挡
            paddingBottom: '10px' // 增加底部填充，确保字母g等不被裁剪
          }}
        >
          {i18n.language === 'en' ? 'Seamless AI Integration' : t('heroTitle')}
        </h1>
        
        <p 
          className="text-lg md:text-xl text-gray-800 mb-6 max-w-2xl"
          style={{ 
            letterSpacing: '0.01em', 
            lineHeight: '1.6',
            overflow: 'visible'
          }}
        >
          {i18n.language === 'en' ? 'Plug and play intelligence—instantly elevating your team\'s capabilities' : t('heroSubtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <a 
            href="#contact"
            className={`text-base py-2.5 px-7 transition-all duration-300 relative overflow-hidden group ${exploreHovered ? 'btn-transparent' : 'btn-gradient'}`}
          >
            <span className="relative z-10 flex items-center justify-center">
              {t('bookConsultation')}
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300 ease-out" />
            </span>
            {/* 按钮光效 */}
            <span className="absolute top-0 left-0 w-full h-full bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out"></span>
          </a>
          
          <a 
            href="#work"
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
          </a>
        </div>
      </div>
      
      {/* 扩展底部空间，并添加过渡元素 */}
      <div className="relative h-40 w-full">
      </div>
    </div>
  );
};

export default HeroSection;