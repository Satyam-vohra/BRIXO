import React from 'react';

export default function TabBar({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex border-b border-brand-border bg-slate-50/50">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all duration-200 ${
              isActive
                ? 'border-brand-primary text-brand-primary bg-white font-bold'
                : 'border-transparent text-brand-muted hover:text-brand-dark hover:bg-slate-100/50'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
