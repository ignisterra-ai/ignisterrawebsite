import React from 'react';
import Link from 'next/link';
import { Linkedin, Mail } from 'lucide-react';
import { useTranslation } from 'next-i18next';

const Footer = () => {
  const { t, i18n } = useTranslation('common');
  
  return (
    <footer className="bg-gray-100 py-6 mt-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* 品牌信息 */}
          <div>
            <div className="flex items-center">
              <img 
                src="/images/logo.png" 
                alt="Ignis Terra Logo" 
                className="h-20 w-auto mr-1"
              />
              <div>
                <h3 className="font-montserrat font-bold text-xl text-primary-blue">
                  Ignis Terra AI Solution | 晟垚智能科技
                </h3>
                <p className="text-gray-600">
                  {i18n.language === 'en' ? 'Warm Intelligence, Ignited for Reality' : '智能有溫，向實而晟。'}
                </p>
              </div>
            </div>
          </div>
          
          {/* 联系方式 */}
          <div className="md:text-right">
            <div className="flex items-center md:justify-end space-x-4">
              <a 
                href="https://www.linkedin.com/company/ignisterra-ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-primary-blue hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="mailto:hi@ignisterra.ai"
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-primary-blue hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
        
        {/* 版权信息 */}
        <div className="border-t border-gray-200 mt-5 pt-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Ignis Terra AI Solution. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 