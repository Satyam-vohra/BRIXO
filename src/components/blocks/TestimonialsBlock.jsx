import React from 'react';

export default function TestimonialsBlock({ content, styles, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative transition-all duration-200 border-2 rounded-lg overflow-hidden ${
        isSelected ? 'border-brand-primary ring-4 ring-brand-primary/10 shadow-lg' : 'border-transparent hover:border-brand-primary/30'
      }`}
    >
      <section className="py-16 px-6 md:px-12 bg-site-bg transition-colors">
        <h2 className="text-3xl font-bold text-center text-site-text mb-12">
          {content.title || 'What Our Clients Say'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Testimonial 1 */}
          <div className="p-8 bg-gray-50 border border-gray-100 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow transition">
            <p className="text-site-text/80 italic leading-relaxed text-base">
              "{content.testimonial1Quote || 'This builder is incredibly fast. The AI color recommendations fit our aesthetic perfectly!'}"
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="w-10 h-10 rounded-full bg-site-primary/20 text-site-primary font-bold flex items-center justify-center text-sm shadow-inner uppercase">
                {(content.testimonial1Name || 'S').charAt(0)}
              </div>
              <span className="font-semibold text-site-text text-sm">
                {content.testimonial1Name || 'Sarah Connor'}
              </span>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="p-8 bg-gray-50 border border-gray-100 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow transition">
            <p className="text-site-text/80 italic leading-relaxed text-base">
              "{content.testimonial2Quote || 'Drag and drop that actually works smoothly. Highly recommend for landing pages.'}"
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="w-10 h-10 rounded-full bg-site-primary/20 text-site-primary font-bold flex items-center justify-center text-sm shadow-inner uppercase">
                {(content.testimonial2Name || 'M').charAt(0)}
              </div>
              <span className="font-semibold text-site-text text-sm">
                {content.testimonial2Name || 'Marcus Wright'}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
