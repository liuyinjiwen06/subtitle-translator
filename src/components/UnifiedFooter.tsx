import React from 'react';

interface UnifiedFooterProps {
  translations: any;
}

export default function UnifiedFooter({ translations }: UnifiedFooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold mb-2">
              {translations.footer?.brandName || 'SubTran'}
            </h3>
            <p className="text-gray-300 text-sm">
              {translations.footer?.slogan || 'Bridge Every Subtitle'}
            </p>
          </div>
          
          {/* Contact Section */}
          <div>
            <h4 className="font-semibold mb-2">
              {translations.footer?.contact || 'Contact'}
            </h4>
            <a 
              href="mailto:liukris02@gmail.com"
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              liukris02@gmail.com
            </a>
          </div>
          
          {/* About Section */}
          <div>
            <h4 className="font-semibold mb-2">
              {translations.footer?.aboutUs || 'About Us'}
            </h4>
            <p className="text-gray-300 text-sm">
              {translations.footer?.aboutDescription || 'Professional subtitle translation service'}
            </p>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 {translations.footer?.brandName || 'SubTran'}. {translations.footer?.copyright || 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
}