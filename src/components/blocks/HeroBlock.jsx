import React from 'react';

export default function HeroBlock({ content, styles, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative transition-all duration-200 border-2 rounded-lg overflow-hidden ${
        isSelected ? 'border-brand-primary ring-4 ring-brand-primary/10 shadow-lg' : 'border-transparent hover:border-brand-primary/30'
      }`}
    >
      <header className="py-20 px-6 md:px-12 text-center bg-gradient-to-br from-site-primary/10 to-site-secondary/10 flex flex-col items-center justify-center transition-colors">
        <h1 className="text-4xl md:text-6xl font-bold text-site-text max-w-3xl leading-tight mb-6">
          {content.headline || 'Build Websites in Seconds with AI'}
        </h1>
        <p className="text-lg md:text-xl text-site-text/75 max-w-2xl mb-8">
          {content.subheadline || 'Drag blocks, select your business type, and let our intelligent engine suggest the perfect styles.'}
        </p>
        <div className="flex gap-4">
          <button className="bg-site-primary text-white font-bold py-3.5 px-7 rounded-2xl shadow-md hover:brightness-115 transition active:scale-95">
            {content.button1Text || 'Build Now'}
          </button>
          <button className="bg-white border border-gray-200 text-site-text font-bold py-3.5 px-7 rounded-2xl shadow-sm hover:bg-gray-50 transition active:scale-95">
            {content.button2Text || 'Learn More'}
          </button>
        </div>
      </header>
    </div>
  );
}
