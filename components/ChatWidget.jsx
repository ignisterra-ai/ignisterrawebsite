import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, ChevronDown, Sparkles } from 'lucide-react';
import { useTranslation } from 'next-i18next';

const ChatWidget = () => {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      content: t('chatWelcomeMessage'), 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // 滾動到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 將來連接到 Google AI API
  const callGoogleAI = async (userMessage) => {
    // 這裡將來會是API調用
    // 示例: const response = await fetch('your-api-endpoint', { method: 'POST', body: JSON.stringify({message: userMessage}) })
    
    // 目前返回模擬數據
    return {
      text: t('chatDefaultResponse'),
      timestamp: new Date().toISOString()
    };
  };

  // 模擬發送消息及接收回复
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // 添加用戶消息
    const userMessage = {
      id: Date.now(),
      content: input,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      // 模擬API調用延遲
      setTimeout(async () => {
        // 調用AI (將來的實際API)
        const response = await callGoogleAI(input);
        
        const botReply = {
          id: Date.now() + 1,
          content: response.text,
          sender: 'bot'
        };
        
        setMessages(prev => [...prev, botReply]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error('Error calling AI service:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        content: t('chatErrorMessage'),
        sender: 'bot'
      }]);
      setIsTyping(false);
    }
  };

  // 監聽Enter鍵
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 聊天按鈕 */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
          isOpen ? 'bg-gray-700 text-white rotate-90' : 'bg-primary-blue text-white'
        }`}
        aria-label={isOpen ? t('chatClose') : t('chatOpen')}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>

      {/* 聊天窗口 */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-fade-in">
          {/* 聊天頭部 */}
          <div className="bg-primary-blue text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">AI</span>
              </div>
              <div>
                <h3 className="font-bold">Ignis Mind</h3>
                <p className="text-xs text-white/80">{t('chatAssistantStatus')}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white"
              aria-label={t('chatMinimize')}
            >
              <ChevronDown size={20} />
            </button>
          </div>
          
          {/* 聊天內容區域 */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map(msg => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender === 'user' 
                        ? 'bg-primary-blue text-white rounded-tr-none' 
                        : 'bg-white text-gray-800 shadow-md rounded-tl-none'
                    }`}
                  >
                    {msg.content.split('\n').map((text, i) => (
                      <React.Fragment key={i}>
                        {text}
                        {i !== msg.content.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 rounded-lg rounded-tl-none p-3 shadow-md max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* 輸入區域 */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center">
              <textarea 
                className="flex-1 border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-blue/30 resize-none"
                placeholder={t('chatInputPlaceholder')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
                aria-label={t('chatInputLabel')}
              />
              <button 
                className="bg-primary-blue text-white p-3 rounded-r-lg hover:bg-primary-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                aria-label={t('chatSendButton')}
              >
                <Send size={20} />
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              {t('chatFooterText')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget; 