import { useEffect, useState } from 'react';

const CursorEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // 只创建光标元素，不创建任何光晕效果
    const addCursorElements = () => {
      const cursorEl = document.createElement('div');
      cursorEl.classList.add('cursor-effect');
      
      const cursorDot = document.createElement('div');
      cursorDot.classList.add('cursor-dot');
      
      document.body.appendChild(cursorEl);
      document.body.appendChild(cursorDot);
      
      return { cursorEl, cursorDot };
    };
    
    const { cursorEl, cursorDot } = addCursorElements();
    
    // 仅更新光标位置，不影响其他元素
    const updateCursorPosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // 仅设置光标元素位置
      cursorEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      cursorDot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };
    
    // 处理鼠标点击 - 只影响光标元素
    const handleMouseDown = () => {
      setClicked(true);
      cursorEl.classList.add('active');
    };
    
    // 处理鼠标释放
    const handleMouseUp = () => {
      setClicked(false);
      cursorEl.classList.remove('active');
    };
    
    // 处理鼠标悬停在链接上 - 只影响光标和交互元素
    const handleLinkHoverEvents = () => {
      // 获取所有可交互元素
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select, [tabindex]:not([tabindex="-1"])');
      
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursorEl.classList.add('hover');
          setLinkHovered(true);
          
          // 触发元素缩放动画
          el.style.transition = 'transform 0.2s ease';
          el.style.transform = 'scale(1.03)';
        });
        
        el.addEventListener('mouseleave', () => {
          cursorEl.classList.remove('hover');
          setLinkHovered(false);
          
          // 恢复元素正常状态
          el.style.transform = 'scale(1)';
        });
      });
    };
    
    // 处理鼠标离开页面
    const handleMouseLeave = () => {
      setHidden(true);
      cursorEl.style.opacity = '0';
      cursorDot.style.opacity = '0';
    };
    
    // 处理鼠标进入页面
    const handleMouseEnter = () => {
      setHidden(false);
      cursorEl.style.opacity = '1';
      cursorDot.style.opacity = '1';
    };
    
    // 事件监听
    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    // 链接悬停事件
    handleLinkHoverEvents();
    
    // 初始隐藏鼠标
    cursorEl.style.opacity = '0';
    cursorDot.style.opacity = '0';
    
    // 清理函数
    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      
      // 删除光标元素
      cursorEl.remove();
      cursorDot.remove();
      
      // 删除所有拖尾元素
      document.querySelectorAll('.cursor-trail,.cursor-ripple').forEach(el => el.remove());
    };
  }, []);
  
  // 这个组件不渲染任何可见内容，只添加事件监听器
  return null;
};

export default CursorEffect; 