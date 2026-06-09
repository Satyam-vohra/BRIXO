import React from 'react';

export default function ProductsBlock({ content, styles, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative transition-all duration-200 border-2 rounded-lg overflow-hidden ${
        isSelected ? 'border-brand-primary ring-4 ring-brand-primary/10 shadow-lg' : 'border-transparent hover:border-brand-primary/30'
      }`}
    >
      <section className="py-16 px-6 md:px-12 bg-site-bg transition-colors">
        <h2 className="text-3xl font-bold text-center text-site-text mb-12">
          {content.title || 'Featured Products'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Product 1 */}
          <div className="border border-gray-100 rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="aspect-video bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-slate-400 font-semibold text-xs tracking-wider uppercase">
              Product Image
            </div>
            <div>
              <h3 className="text-lg font-bold text-site-text">{content.product1Name || 'Starter Pack'}</h3>
              <p className="text-site-primary font-bold mt-2">{content.product1Price || '$19.99'}</p>
            </div>
            <button className="w-full mt-6 bg-site-primary text-white py-2.5 px-4 rounded-xl font-bold hover:brightness-115 transition active:scale-95">
              Buy Now
            </button>
          </div>

          {/* Product 2 */}
          <div className="border border-gray-100 rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="aspect-video bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-slate-400 font-semibold text-xs tracking-wider uppercase">
              Product Image
            </div>
            <div>
              <h3 className="text-lg font-bold text-site-text">{content.product2Name || 'Professional Suite'}</h3>
              <p className="text-site-primary font-bold mt-2">{content.product2Price || '$49.99'}</p>
            </div>
            <button className="w-full mt-6 bg-site-primary text-white py-2.5 px-4 rounded-xl font-bold hover:brightness-115 transition active:scale-95">
              Buy Now
            </button>
          </div>

          {/* Product 3 */}
          <div className="border border-gray-100 rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="aspect-video bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-slate-400 font-semibold text-xs tracking-wider uppercase">
              Product Image
            </div>
            <div>
              <h3 className="text-lg font-bold text-site-text">{content.product3Name || 'Enterprise Hub'}</h3>
              <p className="text-site-primary font-bold mt-2">{content.product3Price || '$99.99'}</p>
            </div>
            <button className="w-full mt-6 bg-site-primary text-white py-2.5 px-4 rounded-xl font-bold hover:brightness-115 transition active:scale-95">
              Buy Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
