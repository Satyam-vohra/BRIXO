import React from 'react';

export default function ColorSwatch({ color, label }) {
  return (
    <div className="flex items-center gap-3 p-2 bg-white border border-brand-border rounded-xl shadow-sm hover:shadow transition-shadow">
      <div
        className="w-8 h-8 rounded-full border border-slate-200 flex-shrink-0 bg-[var(--swatch-color)] shadow-inner"
        style={{ '--swatch-color': color }}
      />
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">{label}</span>
        <span className="text-xs font-mono font-semibold text-brand-dark truncate select-all">{color}</span>
      </div>
    </div>
  );
}
