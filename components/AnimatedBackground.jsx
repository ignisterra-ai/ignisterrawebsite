import React, { useRef, useEffect, useState } from "react";

// 适度不规则的3D效果配置
const W = 1000; // 增加画布尺寸，解决切边问题
const H = 1000;
const BLOB_RADIUS = 350; // 略微减小半径，留出更多空间
const ROTATE_SPEED = 0.25;
const LIGHT_DIR = { x: -0.7, y: -1, z: 1.5 };

// 增加45度方向凹凸的blob函数
function getBlobPoint(theta, phi, time) {
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);
  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);
  
  // 基础变形
  const primaryTwist = 0.08 * Math.sin(phi * 2 + time * 0.2) * Math.sin(theta * 2);
  const secondaryTwist = 0.04 * Math.sin(phi * 3 + time * 0.15) * Math.sin(theta * 3);
  
  // 45度方向增加凹凸 (π/4, 3π/4, 5π/4, 7π/4)
  const diagonalBumps = 0.1 * Math.sin(4 * phi + time * 0.1) * Math.cos(theta + time * 0.05);
  
  // 组合变形效果，主要在45度方向
  const r = BLOB_RADIUS * (1 + primaryTwist + secondaryTwist + diagonalBumps);
  
  const x = r * sinTheta * cosPhi;
  const y = r * sinTheta * sinPhi;
  const z = r * cosTheta;
  return { x, y, z };
}

function normalize(v) {
  const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

const normLightDir = normalize(LIGHT_DIR);

// y轴自转
function rotateY(v, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: v.x * cos - v.z * sin,
    y: v.y,
    z: v.x * sin + v.z * cos,
  };
}

// 光晕效果
function drawGlow(ctx, time) {
  ctx.save();
  const gradientSize = BLOB_RADIUS * 1.6;
  const g = ctx.createRadialGradient(0, 0, BLOB_RADIUS * 0.5, 0, 0, gradientSize);
  g.addColorStop(0, "rgba(250, 180, 150, 0.08)");
  g.addColorStop(0.5, "rgba(255, 190, 160, 0.05)");
  g.addColorStop(1, "rgba(255, 220, 190, 0)");
  
  ctx.beginPath();
  ctx.arc(0, 0, gradientSize, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.filter = "blur(30px)";
  ctx.globalAlpha = 0.6;
  ctx.fill();
  ctx.filter = "none";
  ctx.restore();
}

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const frameRef = useRef(null);
  const runningRef = useRef(true);
  const [renderCount, setRenderCount] = useState(0);
  // 添加是否在hero section内的状态
  const [isInHeroSection, setIsInHeroSection] = useState(true);
  // 添加一个状态来控制是否显示球体
  const [showSphere, setShowSphere] = useState(true);

  // 检测设备类型
  useEffect(() => {
    console.log('AnimatedBackground组件已加载');
    
    const checkDevice = () => {
      const mobile = window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      
      // 简化低功耗检测
      const lowPower = mobile;
      setLowPowerMode(lowPower);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // 滚动监听 - 决定是否显示3D球体
  useEffect(() => {
    const heroSection = document.querySelector('.relative.min-h-\\[85vh\\].md\\:min-h-screen');
    
    const checkScrollPosition = () => {
      if (!heroSection) return;
      
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;
      
      // 当hero section的底部还在视窗内时显示3D球体
      if (heroBottom > 0) {
        setShowSphere(true);
        setIsInHeroSection(true);
      } else {
        // 当滚动超出hero section时隐藏3D球体
        setShowSphere(false);
        setIsInHeroSection(false);
      }
    };
    
    // 初始检查
    checkScrollPosition();
    
    // 添加滚动监听
    window.addEventListener('scroll', checkScrollPosition, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);

  // 主要渲染逻辑
  useEffect(() => {
    console.log('AnimatedBackground渲染次数:', renderCount);
    setRenderCount(count => count + 1);
    
    // 如果不在hero section，不启动动画
    if (!showSphere) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      return;
    }
    
    runningRef.current = true;
    let lastTime = 0;
    const fpsInterval = lowPowerMode ? 1000/15 : (isMobile ? 1000/20 : 1000/30);
    
    function render(now) {
      if (!runningRef.current || !canvasRef.current) return;
      
      // 限制帧率
      const elapsed = now - lastTime;
      if (elapsed < fpsInterval) {
        frameRef.current = requestAnimationFrame(render);
        return;
      }
      
      lastTime = now - (elapsed % fpsInterval);
      
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      
      const t = (now / 1000) * ROTATE_SPEED;

      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(W / 2, H / 2);

      // 光晕效果
      if (!lowPowerMode) {
        drawGlow(ctx, t);
      }
      
      // 分辨率
      const res = lowPowerMode ? 30 : (isMobile ? 40 : 65); // 适当增加分辨率以更好地显示细节
      
      // 优化循环
      const step = lowPowerMode ? 3 : (isMobile ? 2 : 1);
      for (let i = 0; i < res; i += step) {
        const theta = (i / (res - 1)) * Math.PI;
        ctx.beginPath();
        let started = false;
        
        for (let j = 0; j <= res; j += step) {
          const phi = (j / res) * Math.PI * 2 + t;
          const { x, y, z } = getBlobPoint(theta, phi, t);
          const rotated = rotateY({ x, y, z }, t);
          const px = rotated.x;
          const py = rotated.y * 0.92 - rotated.z * 0.045;
          if (!started) {
            ctx.moveTo(px, py);
            started = true;
          } else {
            ctx.lineTo(px, py);
          }
        }
        
        // 计算法向量，用于光照效果
        const phiMid = Math.PI + t;
        const ptMid = getBlobPoint(theta, phiMid, t);
        const norm = normalize(rotateY(ptMid, t));
        
        // 基本光照计算 - 确定漫反射强度
        let diffuse = dot(norm, normLightDir);
        diffuse = Math.max(diffuse, 0.2);  // 保持最低亮度
        
        // 高光计算 - 确定反射强度
        const viewDir = normalize({ x: 0, y: 0, z: 1 });
        const halfway = normalize({
          x: normLightDir.x + viewDir.x,
          y: normLightDir.y + viewDir.y,
          z: normLightDir.z + viewDir.z,
        });
        let spec = Math.max(dot(norm, halfway), 0);
        spec = Math.pow(spec, 20) * 0.4;  // 适度的高光
        
        // 渲染风格
        const lineOpacity = 0.45 + 0.15 * diffuse;
        
        ctx.strokeStyle = `rgba(245, 155, 120, ${lineOpacity})`;
        ctx.lineWidth = 3.5 + 1.5 * diffuse;
        ctx.shadowBlur = 12 + 8 * diffuse;
        ctx.shadowColor = "rgba(250, 175, 140, 0.3)";
        ctx.globalAlpha = 0.5 + 0.1 * diffuse;
        ctx.stroke();
        
        // 添加高光效果 - 仅当高光值足够大并且不在低功耗模式时
        if (spec > 0.15 && !lowPowerMode) {
          ctx.save();
          ctx.strokeStyle = `rgba(255, 210, 180, ${spec * 0.8})`;
          ctx.lineWidth = 2 + 8 * spec;
          ctx.shadowBlur = 15 * spec;
          ctx.shadowColor = "rgba(255, 220, 190, 0.4)";
          ctx.globalAlpha = 0.3 * spec;
          ctx.stroke();
          ctx.restore();
        }
      }
      
      ctx.restore();
      frameRef.current = requestAnimationFrame(render);
    }
    
    // 启动动画
    console.log('启动AnimatedBackground动画');
    frameRef.current = requestAnimationFrame(render);
    
    // 清理函数
    return () => {
      console.log('AnimatedBackground组件卸载');
      runningRef.current = false;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isMobile, lowPowerMode, renderCount, showSphere]);

  return (
    <div
      style={{
        position: "fixed",
        width: "100vw", // 使用视口宽度
        height: "100vh", // 使用视口高度
        inset: 0,
        zIndex: 5,
        overflow: "visible", // 改为visible，避免切边
        pointerEvents: "none",
      }}
    >
      {/* 背景光晕 - 始终显示 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "60vmin",
          height: "60vmin",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(200,100,60,0.15) 0%, rgba(220,120,80,0.1) 40%, rgba(240,160,120,0.05) 70%, rgba(255,200,160,0) 85%)",
          filter: "blur(35px)",
          opacity: 0.75,
          zIndex: 1,
        }}
      />
      {/* 只在hero section内显示3D球体 */}
      {showSphere && (
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "135vmin", // 使用更大的尺寸，防止切边
            height: "135vmin", // 使用更大的尺寸，防止切边
            background: "transparent",
            display: "block",
            zIndex: 2,
            willChange: "transform",
            imageRendering: lowPowerMode ? "optimizeSpeed" : "auto",
            opacity: showSphere ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />
      )}
    </div>
  );
};

export default AnimatedBackground; 