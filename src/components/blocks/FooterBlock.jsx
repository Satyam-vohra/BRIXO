import React from 'react';

export default function FooterBlock({ content, styles, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative transition-all duration-200 border-2 rounded-lg overflow-hidden ${
        isSelected ? 'border-brand-primary ring-4 ring-brand-primary/10 shadow-lg' : 'border-transparent hover:border-brand-primary/30'
      }`}
    >
      <footer className="py-12 px-6 md:px-12 bg-slate-900 text-white transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-800 pb-8">
          <span className="text-xl font-bold text-site-primary">
            {content.companyName || 'BRIXO Inc.'}
          </span>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition" onClick={e => e.preventDefault()}>Privacy Policy</a>
            <a href="#" className="hover:text-white transition" onClick={e => e.preventDefault()}>Terms of Service</a>
            <a href="#" className="hover:text-white transition" onClick={e => e.preventDefault()}>Support</a>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mt-8 text-sm text-slate-400">
          <span>{content.copyrightText || '© 2026 BRIXO. All rights reserved.'}</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition" onClick={e => e.preventDefault()}>𝕏</a>
            <a href="#" className="hover:text-white transition" onClick={e => e.preventDefault()}>🔗</a>
            <a href="#" className="hover:text-white transition" onClick={e => e.preventDefault()}>📸</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
