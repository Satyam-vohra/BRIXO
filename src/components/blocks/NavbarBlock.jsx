import React from 'react';

export default function NavbarBlock({ content, styles, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative transition-all duration-200 border-2 rounded-lg overflow-hidden ${
        isSelected ? 'border-brand-primary ring-4 ring-brand-primary/10 shadow-lg' : 'border-transparent hover:border-brand-primary/30'
      }`}
    >
      <nav className="border-b border-gray-100 bg-site-bg py-4 px-6 md:px-12 flex justify-between items-center transition-colors">
        <span className="text-xl font-bold text-site-primary tracking-tight">
          {content.logoText || 'BRIXO'}
        </span>
        <div className="hidden md:flex gap-6 text-sm font-semibold text-site-text/85">
          <a href="#" className="hover:text-site-primary transition" onClick={e => e.preventDefault()}>Home</a>
          <a href="#" className="hover:text-site-primary transition" onClick={e => e.preventDefault()}>Services</a>
          <a href="#" className="hover:text-site-primary transition" onClick={e => e.preventDefault()}>About</a>
          <a href="#" className="hover:text-site-primary transition" onClick={e => e.preventDefault()}>Contact</a>
        </div>
        <button className="bg-site-primary text-white text-sm font-bold py-2.5 px-5 rounded-xl hover:brightness-115 shadow-sm transition active:scale-95">
          {content.ctaButtonText || 'Get Started'}
        </button>
      </nav>
    </div>
  );
}
