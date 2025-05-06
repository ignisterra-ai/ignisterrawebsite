import '../styles/globals.css'
import '../utils/i18n' // 导入i18n初始化文件
import Head from 'next/head'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import PageTransition from '../components/PageTransition'
import { appWithTranslation, useTranslation } from 'next-i18next'

// 动态导入光标特效组件，确保只在客户端渲染
const CursorEffect = dynamic(() => import('../components/CursorEffect'), {
  ssr: false
})

// 动态导入聊天组件，确保只在客户端渲染
const ChatWidget = dynamic(() => import('../components/ChatWidget'), {
  ssr: false
})

function MyApp({ Component, pageProps }) {
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const { t } = useTranslation('common')

  useEffect(() => {
    // 检测是否为移动设备，在移动设备上不显示鼠标特效
    const checkMobile = () => {
      const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent
      const mobile = Boolean(
        userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)
      )
      setIsMobile(mobile)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#000000" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Ignis Terra AI Solution" />
        <meta property="og:locale" content={router.locale === 'zh-TW' ? 'zh_TW' : router.locale === 'zh-CN' ? 'zh_CN' : 'en_US'} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={`https://www.ignisterra.ai${router.asPath}`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <title>{t('brandName')} - {t('tagline')}</title>
        <style jsx global>{`
          html, body {
            background-color: transparent !important;
            background-image: none !important;
            font-family: 'Montserrat', sans-serif;
            height: auto;
            overflow-x: hidden;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }
          #__next {
            background-color: transparent !important;
            height: auto;
            overflow-y: auto;
            overflow-x: hidden;
          }
          /* 强制所有Next.js图片容器透明 */
          span[style="box-sizing"] {
            background-color: transparent !important;
            background-image: none !important;
          }
          /* 修复Image组件可能出现的背景 */
          img, [role="img"] {
            background-color: transparent !important;
            background-image: none !important;
          }
        `}</style>
      </Head>
      
      {/* 全局静态光晕背景 - 完全没有动画效果 */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: -1,
          background: isMobile 
            ? 'radial-gradient(circle at center, rgba(255, 200, 140, 1) 0%, rgba(255, 243, 224, 0.97) 10%, rgba(255, 226, 186, 0.93) 20%, rgba(255, 204, 136, 0.88) 30%, rgba(255, 180, 90, 0.77) 45%, rgba(250, 160, 70, 0.61) 60%, rgba(0, 0, 0, 0) 80%)'
            : 'radial-gradient(circle at center, rgba(255, 160, 80, 1) 0%, rgba(255, 160, 80, 0.9) 15%, rgba(255, 160, 80, 0.7) 30%, rgba(255, 160, 80, 0.5) 45%, rgba(255, 160, 80, 0.3) 60%, rgba(255, 160, 80, 0.15) 75%, rgba(255, 160, 80, 0.05) 100%)',
          filter: isMobile ? 'blur(30px)' : 'blur(35px)',
          opacity: isMobile ? 0.94 : 0.95,
          backgroundColor: 'rgba(255, 248, 240, 0.2)'  // 添加一个非常淡的暖色底色
        }}
        aria-hidden="true"
      />
      
      {!isMobile && <CursorEffect />}
      <ChatWidget />
      <PageTransition>
        <Component {...pageProps} />
      </PageTransition>
    </>
  )
}

export default appWithTranslation(MyApp)