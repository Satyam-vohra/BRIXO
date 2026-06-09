import React from 'react';
import { useDrag } from 'react-dnd';

export default function BlockCard({ type, label, icon: Icon }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'NEW_BLOCK',
    item: { blockType: type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), [type]);

  return (
    <div
      ref={dragRef}
      style={{ cursor: 'grab' }}
      className={`flex items-center gap-3 p-4 rounded-xl bg-slate-800 border border-slate-700 text-white transition-all duration-200 select-none hover:-translate-y-1 hover:shadow-md hover:border-brand-primary/50 active:cursor-grabbing ${
        isDragging ? 'opacity-40 border-dashed border-brand-primary' : ''
      }`}
    >
      <div className="p-2 rounded-lg bg-slate-700 text-brand-primary">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </div>
  );
}
