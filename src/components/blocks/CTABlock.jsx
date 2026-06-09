import React from 'react';

export default function CTABlock({ content, styles, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative transition-all duration-200 border-2 rounded-lg overflow-hidden ${
        isSelected ? 'border-brand-primary ring-4 ring-brand-primary/10 shadow-lg' : 'border-transparent hover:border-brand-primary/30'
      }`}
    >
      <section className="py-20 px-6 md:px-12 text-center bg-site-primary text-white transition-colors">
        <h2 className="text-3xl md:text-5xl font-bold max-w-3xl mx-auto mb-8 leading-tight">
          {content.headline || 'Unlock Your Digital Potential Today'}
        </h2>
        <button className="bg-white text-site-primary font-bold py-3.5 px-8 rounded-2xl hover:bg-gray-50 shadow-lg hover:shadow-xl transition active:scale-95">
          {content.buttonText || 'Get Started Free'}
        </button>
      </section>
    </div>
  );
}
