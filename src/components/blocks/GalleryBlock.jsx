import React from 'react';

export default function GalleryBlock({ content, styles, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative transition-all duration-200 border-2 rounded-lg overflow-hidden ${
        isSelected ? 'border-brand-primary ring-4 ring-brand-primary/10 shadow-lg' : 'border-transparent hover:border-brand-primary/30'
      }`}
    >
      <section className="py-16 px-6 md:px-12 bg-gray-50/30 transition-colors">
        <h2 className="text-3xl font-bold text-center text-site-text mb-12">
          {content.title || 'Our Portfolio'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className="aspect-[4/3] bg-slate-200 border border-slate-300/60 rounded-2xl flex items-center justify-center text-slate-400 text-sm font-semibold tracking-wider uppercase hover:bg-slate-300/60 transition"
            >
              Image {num}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
