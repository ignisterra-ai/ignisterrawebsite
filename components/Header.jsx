import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('common');
  
  // 控制滚动位置
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
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
    letterSpacing: '-0.5px'
  };
  
  return (
    <>
      {/* 品牌标志 - 左上角 */}
      <div className="absolute top-3 left-4 md:top-6 md:left-6 flex items-center">
        <span className="text-white font-bold text-lg md:text-2xl" style={brandNameStyle}>
          Ignis Terra AI Solution
        </span>
      </div>

      {/* 语言切换按钮 - 确保z-index高于菜单 */}
      <div 
        className={`fixed top-4 right-16 md:top-7 md:right-20 z-[60] cursor-pointer transition-opacity duration-300 ${
          scrollPosition > 100 && !menuOpen ? 'opacity-70 hover:opacity-100' : 'opacity-100'
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
    
      {/* 固定在右上角的汉堡菜单按钮 */}
      <div 
        className={`fixed top-5 right-6 md:top-8 md:right-8 z-50 cursor-pointer transition-opacity duration-300 ${
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
          className="absolute top-6 right-6 md:top-8 md:right-8 text-white hover:text-gray-300 transition-colors"
          onClick={() => setMenuOpen(false)}
          aria-label="关闭菜单"
        >
          <X size={32} strokeWidth={1.5} />
        </button>
        
        {/* 品牌标志 - 左上角 */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center">
          <span className="text-white font-bold text-lg md:text-2xl" style={{
            ...brandNameStyle,
            color: 'white', 
            textShadow: 'none'
          }}>
            Ignis Terra AI Solution
          </span>
        </div>
        
        {/* 导航菜单项 */}
        <nav className="text-center">
          <ul className="space-y-12 md:space-y-16">
            <li className="transform transition-transform hover:translate-x-2">
              <Link href="/#work" className="text-white text-4xl md:text-6xl font-bold hover:text-gray-200 transition-colors tracking-wide" onClick={() => setMenuOpen(false)}>
                {t('Product')}
              </Link>
            </li>
            <li className="transform transition-transform hover:translate-x-2">
              <Link href="/#about" className="text-white text-4xl md:text-6xl font-bold hover:text-gray-200 transition-colors tracking-wide" onClick={() => setMenuOpen(false)}>
                {t('aboutUs')}
              </Link>
            </li>
            <li className="transform transition-transform hover:translate-x-2">
              <Link href="/#contact" className="text-white text-4xl md:text-6xl font-bold hover:text-gray-200 transition-colors tracking-wide" onClick={() => setMenuOpen(false)}>
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