import React from 'react';

export default function AppHeader({ onPublishClick }) {
  return (
    <header className="h-16 px-6 bg-brand-dark border-b border-slate-800 flex justify-between items-center text-white select-none">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-primary to-indigo-500 flex items-center justify-center font-bold text-sm text-white shadow-md shadow-brand-primary/20">
          A
        </div>
        <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          BRIXO Builder
        </span>
      </div>

      <button
        onClick={onPublishClick}
        className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold shadow-md hover:shadow-emerald-500/20 active:scale-95 transition-all duration-150"
      >
        <span>🚀</span>
        <span>Publish</span>
      </button>
    </header>
  );
}
