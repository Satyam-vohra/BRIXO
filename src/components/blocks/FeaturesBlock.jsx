import React from 'react';

export default function FeaturesBlock({ content, styles, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative transition-all duration-200 border-2 rounded-lg overflow-hidden ${
        isSelected ? 'border-brand-primary ring-4 ring-brand-primary/10 shadow-lg' : 'border-transparent hover:border-brand-primary/30'
      }`}
    >
      <section className="py-16 px-6 md:px-12 bg-gray-50/50 transition-colors">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-site-primary/10 text-site-primary text-2xl flex items-center justify-center mb-6">
              🎨
            </div>
            <h3 className="text-lg font-bold text-site-text mb-2">
              {content.feature1Title || 'AI-Driven Colors'}
            </h3>
            <p className="text-sm text-site-text/70 leading-relaxed">
              {content.feature1Desc || 'Generate tailored color palettes matching your business sector.'}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-site-primary/10 text-site-primary text-2xl flex items-center justify-center mb-6">
              🖱️
            </div>
            <h3 className="text-lg font-bold text-site-text mb-2">
              {content.feature2Title || 'Flexible Drag & Drop'}
            </h3>
            <p className="text-sm text-site-text/70 leading-relaxed">
              {content.feature2Desc || 'Easily rearrange blocks to build your customized layout.'}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-site-primary/10 text-site-primary text-2xl flex items-center justify-center mb-6">
              🚀
            </div>
            <h3 className="text-lg font-bold text-site-text mb-2">
              {content.feature3Title || 'Instant Export'}
            </h3>
            <p className="text-sm text-site-text/70 leading-relaxed">
              {content.feature3Desc || 'Download your static website as an HTML file instantly.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
