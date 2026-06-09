import React from 'react';
import { 
  PanelTop, 
  Sparkles, 
  ShoppingBag, 
  Zap, 
  Users, 
  Image, 
  Megaphone, 
  PanelBottom 
} from 'lucide-react';
import BlockCard from '../ui/BlockCard';

const BLOCKS_LIBRARY = [
  { type: 'navbar', label: 'Navbar', icon: PanelTop },
  { type: 'hero', label: 'Hero Section', icon: Sparkles },
  { type: 'products', label: 'Products Grid', icon: ShoppingBag },
  { type: 'features', label: 'Features Grid', icon: Zap },
  { type: 'testimonials', label: 'Testimonials', icon: Users },
  { type: 'gallery', label: 'Image Gallery', icon: Image },
  { type: 'cta', label: 'CTA Banner', icon: Megaphone },
  { type: 'footer', label: 'Footer', icon: PanelBottom }
];

export default function LeftPanel() {
  return (
    <aside className="w-[240px] bg-brand-dark border-r border-slate-800 flex flex-col h-full flex-shrink-0 select-none">
      <div className="p-5 border-b border-slate-800">
        <h2 className="text-white text-base font-bold tracking-wider uppercase">
          Blocks Library
        </h2>
        <p className="text-[11px] text-slate-400 mt-1">
          Drag these sections onto the canvas area to construct your website.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {BLOCKS_LIBRARY.map((block) => (
          <BlockCard
            key={block.type}
            type={block.type}
            label={block.label}
            icon={block.icon}
          />
        ))}
      </div>
    </aside>
  );
}
