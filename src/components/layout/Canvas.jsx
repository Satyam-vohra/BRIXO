import React, { useContext, useRef } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { BuilderContext } from '../../context/BuilderContext';
import { Trash2, GripVertical, Laptop, Smartphone, Wifi, Battery } from 'lucide-react';

// Import block components
import NavbarBlock from '../blocks/NavbarBlock';
import HeroBlock from '../blocks/HeroBlock';
import ProductsBlock from '../blocks/ProductsBlock';
import FeaturesBlock from '../blocks/FeaturesBlock';
import TestimonialsBlock from '../blocks/TestimonialsBlock';
import GalleryBlock from '../blocks/GalleryBlock';
import CTABlock from '../blocks/CTABlock';
import FooterBlock from '../blocks/FooterBlock';

const BLOCK_COMPONENTS = {
  navbar: NavbarBlock,
  hero: HeroBlock,
  products: ProductsBlock,
  features: FeaturesBlock,
  testimonials: TestimonialsBlock,
  gallery: GalleryBlock,
  cta: CTABlock,
  footer: FooterBlock
};

function CanvasBlockWrapper({ block, index }) {
  const { 
    selectedBlockId, 
    selectBlock, 
    removeBlock, 
    reorderBlocks 
  } = useContext(BuilderContext);
  
  const containerRef = useRef(null);

  // Drag source for sortable reordering
  const [{ isDragging }, dragRef, dragPreview] = useDrag({
    type: 'SORTABLE_BLOCK',
    item: { id: block.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }, [block.id, index]);

  // Drop target for sortable reordering
  const [, dropRef] = useDrop({
    accept: 'SORTABLE_BLOCK',
    hover(item, monitor) {
      if (!containerRef.current) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = containerRef.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform movement when the cursor has crossed 50% threshold
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      reorderBlocks(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  }, [index, reorderBlocks]);

  // Combine drag preview and drop target onto the outer container,
  // while keeping the actual drag handler on the grip handle only.
  dragPreview(dropRef(containerRef));

  const SpecificBlock = BLOCK_COMPONENTS[block.type];
  if (!SpecificBlock) return null;

  return (
    <div
      ref={containerRef}
      className={`group relative flex items-stretch gap-2 transition-all duration-200 ${
        isDragging ? 'opacity-30 border border-dashed border-brand-primary' : ''
      }`}
    >
      {/* Left Reorder Grip Handle (Only visible on block hover/select) */}
      <div 
        ref={dragRef}
        title="Drag up/down to reorder"
        className="w-8 flex items-center justify-center bg-slate-150 border border-slate-200/50 rounded-xl cursor-grab text-slate-400 hover:text-brand-primary hover:bg-slate-200 transition opacity-0 group-hover:opacity-100 flex-shrink-0"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Actual Block Component */}
      <div className="flex-1 min-w-0">
        <SpecificBlock
          content={block.content}
          styles={block.styles}
          isSelected={selectedBlockId === block.id}
          onClick={() => selectBlock(block.id)}
        />
      </div>

      {/* Delete Button top-right overlay (Visible on hover) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeBlock(block.id);
        }}
        className="absolute top-3 right-3 p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md transition opacity-0 group-hover:opacity-100 z-10 hover:scale-105 active:scale-95"
        title="Delete block"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function Canvas() {
  const { 
    canvasBlocks, 
    addBlock, 
    previewMode, 
    setPreviewMode,
    fontStyle
  } = useContext(BuilderContext);

  // Drop target for library blocks
  const [{ isOver }, canvasDropRef] = useDrop({
    accept: 'NEW_BLOCK',
    drop: (item) => {
      addBlock(item.blockType);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }, [canvasBlocks, addBlock]);

  // Determine font family styling
  const getFontFamilyClass = () => {
    switch(fontStyle) {
      case 'Classic':
        return 'font-serif';
      case 'Elegant':
        return 'font-serif tracking-wide';
      case 'Friendly':
        return 'font-sans tracking-normal font-medium';
      case 'Modern':
      default:
        return 'font-sans';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-brand-canvas overflow-hidden">
      {/* Top bar control containing preview togglers */}
      <div className="h-12 border-b border-brand-border bg-white flex justify-center items-center gap-3 px-4 shadow-sm select-none z-10 flex-shrink-0">
        <button
          onClick={() => setPreviewMode('desktop')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 ${
            previewMode === 'desktop'
              ? 'bg-brand-primary text-white shadow-sm'
              : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Laptop className="w-3.5 h-3.5" />
          Desktop
        </button>
        <button
          onClick={() => setPreviewMode('mobile')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 ${
            previewMode === 'mobile'
              ? 'bg-brand-primary text-white shadow-sm'
              : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          Mobile
        </button>
      </div>

      {/* Droppable Canvas Wrapper */}
      <div 
        ref={canvasDropRef}
        className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${
          isOver ? 'bg-indigo-50/40' : ''
        }`}
      >
        {previewMode === 'mobile' ? (
          /* Premium Simulated Phone Frame */
          <div className="w-[375px] mx-auto border-8 border-slate-900 rounded-[2.5rem] bg-white shadow-2xl overflow-hidden min-h-[600px] flex flex-col relative transition-all duration-300 mb-8 select-none">
            
            {/* Phone Notch/Status Bar */}
            <div className="bg-slate-900 text-white h-7 px-6 flex justify-between items-center text-[10px] font-semibold font-mono tracking-wider flex-shrink-0">
              <span>9:41</span>
              <div className="w-20 h-4 bg-black rounded-b-xl absolute left-1/2 -translate-x-1/2 top-0" />
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>
            
            {/* Simulated Frame Canvas Container */}
            <div className={`flex-1 overflow-y-auto flex flex-col gap-4 p-2 min-h-0 bg-site-bg ${getFontFamilyClass()}`}>
              {canvasBlocks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                  <div className="text-3xl mb-3">✨</div>
                  <p className="text-xs font-semibold text-slate-500">
                    Drag blocks here to start building
                  </p>
                </div>
              ) : (
                canvasBlocks.map((block, index) => (
                  <CanvasBlockWrapper
                    key={block.id}
                    block={block}
                    index={index}
                  />
                ))
              )}
            </div>
          </div>
        ) : (
          /* Desktop View Area */
          <div className={`w-full max-w-6xl mx-auto flex flex-col gap-5 ${getFontFamilyClass()}`}>
            {canvasBlocks.length === 0 ? (
              <div className="py-24 border-2 border-dashed border-slate-200 rounded-3xl bg-white flex flex-col items-center justify-center text-center shadow-sm select-none">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-3xl">
                  🧩
                </div>
                <h3 className="text-base font-bold text-brand-dark">Workspace is empty</h3>
                <p className="text-sm text-brand-muted mt-1 max-w-xs leading-relaxed">
                  Drag sections from the left library panel and drop them here to start building your website.
                </p>
              </div>
            ) : (
              canvasBlocks.map((block, index) => (
                <CanvasBlockWrapper
                  key={block.id}
                  block={block}
                  index={index}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
