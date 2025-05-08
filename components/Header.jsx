import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [showBackground, setShowBackground] = useState(true);
  const router = useRouter();
  const { t } = useTranslation('common');
  
  // 初始化背景状态
  useEffect(() => {
    // 从localStorage获取背景设置
    const savedPreference = localStorage.getItem('disableBackground');
    if (savedPreference === 'true') {
      setShowBackground(false);
    } else {
      setShowBackground(true);
    }
  }, []);

  // 保存用户偏好设置并触发自定义事件
  useEffect(() => {
    try {
      localStorage.setItem('disableBackground', String(!showBackground));
      // 触发自定义事件通知其他组件背景状态变化
      const event = new CustomEvent('backgroundToggle', { detail: { showBackground } });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('无法保存背景设置:', error);
    }
  }, [showBackground]);

  // 切换背景显示状态
  const toggleBackground = (e) => {
    e.stopPropagation(); // 防止触发其他点击事件
    setShowBackground(prev => !prev);
  };
  
  // 检测设备是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // 控制滚动位置
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentPosition = window.scrollY;
      setScrollPosition(currentPosition);
      
      // 检测滚动状态
      if (currentPosition > 10) {
        setIsScrolling(true);
        
        // 滚动方向检测 - 向下滚动时隐藏，向上滚动时显示
        if (currentPosition > lastScrollY && currentPosition > 100) {
          setHeaderHidden(true);
        } else {
          setHeaderHidden(false);
        }
      } else {
        // 回到顶部时显示
        setIsScrolling(false);
        setHeaderHidden(false);
      }
      
      lastScrollY = currentPosition;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // 打开菜单时禁止滚动
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  // 语言切换函数
  const changeLanguage = (locale) => {
    setLangMenuOpen(false);
    router.push(router.pathname, router.asPath, { locale });
  };
  
  // 品牌名称样式
  const brandNameStyle = {
    color: '#002366',
    textShadow: '0px 0px 8px rgba(255,255,255,0.7)',
    marginTop: '2px',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 700,
    letterSpacing: '-0.5px',
    zIndex: 40  // 添加z-index确保正确的层级
  };
  
  return (
    <>
      {/* 品牌标志 - 左上角 */}
      <div 
        className={`fixed top-3 left-4 md:top-6 md:left-6 flex items-center z-40 transition-all duration-300 ${
          headerHidden && !menuOpen ? '-translate-y-16' : 'translate-y-0'
        }`}
      >
        <Link href="/" className="flex items-center">
          <span className="text-primary-blue font-bold text-lg md:text-2xl hover:opacity-80 transition-opacity" style={brandNameStyle}>
            {t('brandName')}
          </span>
        </Link>
      </div>

      {/* 语言切换按钮 - 确保z-index高于菜单 */}
      <div 
        className={`fixed top-5 right-16 md:top-7 md:right-20 z-[60] cursor-pointer transition-all duration-300 ${
          (scrollPosition > 100 && !menuOpen) ? 'opacity-0 invisible' : 'opacity-100 visible'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setLangMenuOpen(!langMenuOpen);
        }}
      >
        {/* 更新为更美观的地球图标 */}
        <div className="w-10 h-10 relative flex items-center justify-center text-gray-800 hover:text-gray-600 transition-colors">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            width="24" 
            height="24" 
            fill="none" 
            stroke={menuOpen ? "white" : "currentColor"} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="transform -translate-y-0.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>
        
        {/* 语言下拉菜单 */}
        {langMenuOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md py-2 w-24 z-[70]">
            <button 
              onClick={() => changeLanguage('en')} 
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              EN
            </button>
            <button 
              onClick={() => changeLanguage('zh-TW')} 
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              繁中
            </button>
            <button 
              onClick={() => changeLanguage('zh-CN')} 
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              简中
            </button>
          </div>
        )}
      </div>
    
      {/* 固定在右上角的汉堡菜单按钮 - 始终可见 */}
      <div 
        className={`fixed top-5 right-6 md:top-7 md:right-8 z-50 cursor-pointer transition-opacity duration-300 ${
          scrollPosition > 100 && !menuOpen ? 'opacity-70 hover:opacity-100' : 'opacity-100'
        }`}
        onClick={() => setMenuOpen(true)}
      >
        <div className="flex flex-col items-end space-y-2">
          <div className="bg-gray-800 h-1 w-8 rounded-full"></div>
          <div className="bg-gray-800 h-1 w-6 rounded-full"></div>
          <div className="bg-gray-800 h-1 w-4 rounded-full"></div>
        </div>
      </div>
      
      {/* 全屏导航菜单 - 半透明黑色背景白色文字 */}
      <div 
        className={`fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex flex-col justify-center items-center transition-all duration-500 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* 关闭按钮 */}
        <button 
          className="absolute top-5 right-6 md:top-7 md:right-8 text-white hover:text-gray-300 transition-colors"
          onClick={() => setMenuOpen(false)}
          aria-label="关闭菜单"
        >
          <X size={32} strokeWidth={1.5} />
        </button>
        
        {/* 品牌标志 - 菜单打开时 */}
        <div className="absolute top-5 left-4 md:top-7 md:left-6 flex items-center">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <span className="text-white font-bold text-lg md:text-2xl" style={{
              ...brandNameStyle,
              color: 'white', 
              textShadow: 'none'
            }}>
              {t('brandName')}
            </span>
          </Link>
        </div>
        
        {/* 背景开关按钮 - 仅在菜单打开时显示，在右上角 */}
        <div 
          className="absolute top-5 right-28 md:top-7 md:right-32 z-[60] cursor-pointer transition-opacity duration-300"
          onClick={toggleBackground}
        >
          <div className="w-10 h-10 relative flex items-center justify-center text-white hover:text-gray-300 transition-colors">
            {showBackground ? (
              <EyeOff size={22} strokeWidth={1.5} className="transform -translate-y-0.5" />
            ) : (
              <Eye size={22} strokeWidth={1.5} className="transform -translate-y-0.5" />
            )}
          </div>
        </div>
        
        {/* 移动版语言切换按钮 - 仅在菜单打开时显示 */}
        {isMobile && (
          <div 
            className="absolute top-5 right-16 z-[60] cursor-pointer transition-opacity duration-300"
            onClick={(e) => {
              e.stopPropagation();
              setLangMenuOpen(!langMenuOpen);
            }}
          >
            <div className="w-10 h-10 relative flex items-center justify-center text-white hover:text-gray-300 transition-colors">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                width="24" 
                height="24" 
                fill="none" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="transform -translate-y-0.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
          </div>
        )}
        
        {/* 导航菜单项 */}
        <nav className="text-center">
          <ul className="space-y-12 md:space-y-16">
            <li className="transform transition-transform hover:translate-x-2">
              <Link 
                href="/#products" 
                className="text-white text-4xl md:text-6xl font-bold hover:text-gray-200 transition-colors tracking-wide"
                onClick={() => setMenuOpen(false)}
              >
                {t('Product')}
              </Link>
            </li>
            <li className="transform transition-transform hover:translate-x-2">
              <Link 
                href="/#about" 
                className="text-white text-4xl md:text-6xl font-bold hover:text-gray-200 transition-colors tracking-wide" 
                onClick={() => setMenuOpen(false)}
              >
                {t('aboutUs')}
              </Link>
            </li>
            <li className="transform transition-transform hover:translate-x-2">
              <Link 
                href="/#contact" 
                className="text-white text-4xl md:text-6xl font-bold hover:text-gray-200 transition-colors tracking-wide" 
                onClick={() => setMenuOpen(false)}
              >
                {t('contactUs')}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Header; 