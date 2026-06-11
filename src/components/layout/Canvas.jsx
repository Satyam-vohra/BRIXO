import React, { useContext, useRef, useState } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { BuilderContext } from '../../context/BuilderContext';
import {
  Trash2,
  GripVertical,
  Copy,
  ChevronUp,
  ChevronDown,
  Wifi,
  Battery,
  Signal,
} from 'lucide-react';

// ─── Block Components ────────────────────────────────────────
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
  footer: FooterBlock,
};

// ─── Block Labels for tooltip ────────────────────────────────
const BLOCK_LABELS = {
  navbar: 'Navbar',
  hero: 'Hero',
  products: 'Products',
  features: 'Features',
  testimonials: 'Testimonials',
  gallery: 'Gallery',
  cta: 'CTA',
  footer: 'Footer',
};

// ─── CanvasBlockWrapper ──────────────────────────────────────
function CanvasBlockWrapper({ block, index, totalBlocks }) {
  const {
    selectedBlockId,
    selectBlock,
    removeBlock,
    reorderBlocks,
    duplicateBlock,
  } = useContext(BuilderContext);

  const containerRef = useRef(null);
  const isSelected = selectedBlockId === block.id;

  // ── Drag source (sortable reorder) ──
  const [{ isDragging }, dragRef, dragPreview] = useDrag({
    type: 'SORTABLE_BLOCK',
    item: { id: block.id, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }, [block.id, index]);

  // ── Drop target (sortable reorder) ──
  const [{ isHoveredOver }, dropRef] = useDrop({
    accept: 'SORTABLE_BLOCK',
    hover(item, monitor) {
      if (!containerRef.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const rect = containerRef.current.getBoundingClientRect();
      const midY = (rect.bottom - rect.top) / 2;
      const clientY = monitor.getClientOffset().y - rect.top;

      if (dragIndex < hoverIndex && clientY < midY) return;
      if (dragIndex > hoverIndex && clientY > midY) return;

      reorderBlocks(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({ isHoveredOver: monitor.isOver() }),
  }, [index, reorderBlocks]);

  dragPreview(dropRef(containerRef));

  const SpecificBlock = BLOCK_COMPONENTS[block.type];
  if (!SpecificBlock) return null;

  return (
    <div
      ref={containerRef}
      className="group relative"
      style={{
        opacity: isDragging ? 0.3 : 1,
        transition: 'opacity 0.15s, transform 0.15s',
        outline: isSelected
          ? '2px solid #6c63ff'
          : isHoveredOver
            ? '2px dashed #a5b4fc'
            : '2px solid transparent',
        outlineOffset: '2px',
        borderRadius: 8,
      }}
      onClick={() => selectBlock(block.id)}
    >
      {/* ── Block type label pill (visible on hover/select) ── */}
      <div
        style={{
          position: 'absolute',
          top: -22,
          left: 0,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: isSelected ? '#6c63ff' : '#475569',
          color: '#fff',
          fontSize: 10,
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 4,
          letterSpacing: 0.4,
          opacity: 0,
          pointerEvents: 'none',
          transition: 'opacity 0.15s',
        }}
        className="group-hover:!opacity-100"
      >
        {BLOCK_LABELS[block.type] ?? block.type}
      </div>

      {/* ── Left: Drag grip ── */}
      <div
        ref={dragRef}
        title="Drag to reorder"
        className="group-hover:opacity-100"
        style={{
          position: 'absolute',
          left: -32,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 24,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          background: '#f1f5f9',
          border: '1px solid #e2e8f0',
          cursor: 'grab',
          color: '#94a3b8',
          opacity: 0,
          transition: 'opacity 0.15s, color 0.15s',
          zIndex: 20,
        }}
      >
        <GripVertical size={14} />
      </div>

      {/* ── Right: Action toolbar ── */}
      <div
        className="group-hover:opacity-100"
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 20,
          display: 'flex',
          gap: 4,
          opacity: 0,
          transition: 'opacity 0.15s',
        }}
      >
        {/* Move Up */}
        {index > 0 && (
          <ActionIconBtn
            title="Move up"
            onClick={(e) => { e.stopPropagation(); reorderBlocks(index, index - 1); }}
          >
            <ChevronUp size={13} />
          </ActionIconBtn>
        )}

        {/* Move Down */}
        {index < totalBlocks - 1 && (
          <ActionIconBtn
            title="Move down"
            onClick={(e) => { e.stopPropagation(); reorderBlocks(index, index + 1); }}
          >
            <ChevronDown size={13} />
          </ActionIconBtn>
        )}

        {/* Duplicate — only if context provides it */}
        {duplicateBlock && (
          <ActionIconBtn
            title="Duplicate block"
            onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }}
          >
            <Copy size={13} />
          </ActionIconBtn>
        )}

        {/* Delete */}
        <ActionIconBtn
          title="Delete block"
          danger
          onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
        >
          <Trash2 size={13} />
        </ActionIconBtn>
      </div>

      {/* ── The actual block ── */}
      <SpecificBlock
        content={block.content}
        styles={block.styles}
        isSelected={isSelected}
        onClick={() => selectBlock(block.id)}
      />
    </div>
  );
}

// ─── Small icon button used in toolbar ───────────────────────
function ActionIconBtn({ children, onClick, title, danger = false }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 26,
        height: 26,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        border: 'none',
        background: hovered
          ? danger ? '#ef4444' : '#334155'
          : 'rgba(15,23,42,0.75)',
        color: '#fff',
        cursor: 'pointer',
        transition: 'background 0.12s, transform 0.1s',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {children}
    </button>
  );
}

// ─── Empty State ─────────────────────────────────────────────
function EmptyState({ isOver }) {
  return (
    <div
      style={{
        padding: '64px 32px',
        border: `2px dashed ${isOver ? '#6c63ff' : '#e2e8f0'}`,
        borderRadius: 16,
        background: isOver ? '#f5f3ff' : '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 12,
        transition: 'all 0.2s',
        userSelect: 'none',
      }}
    >
      <div style={{ fontSize: 40 }}>🧩</div>
      <p style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', margin: 0 }}>
        {isOver ? 'Release to add block' : 'Your canvas is empty'}
      </p>
      <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 260, lineHeight: 1.6, margin: 0 }}>
        Drag sections from the left panel and drop them here to start building.
      </p>
    </div>
  );
}

// ─── Phone Status Bar ─────────────────────────────────────────
function PhoneStatusBar() {
  return (
    <div
      style={{
        height: 28,
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      <span style={{ color: '#fff', fontSize: 11, fontWeight: 600, fontFamily: 'monospace' }}>
        9:41
      </span>
      {/* Dynamic island */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 80,
          height: 20,
          background: '#000',
          borderRadius: '0 0 12px 12px',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#fff' }}>
        <Signal size={11} />
        <Wifi size={11} />
        <Battery size={13} />
      </div>
    </div>
  );
}

// ─── Canvas (main export) ────────────────────────────────────
export default function Canvas() {
  const {
    canvasBlocks,
    addBlock,
    previewMode,
    fontStyle,
  } = useContext(BuilderContext);

  // Drop zone for new blocks dragged from library
  const [{ isOver }, canvasDropRef] = useDrop({
    accept: 'NEW_BLOCK',
    drop: (item) => addBlock(item.blockType),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }, [canvasBlocks, addBlock]);

  const fontClass = {
    Classic: 'font-serif',
    Elegant: 'font-serif tracking-wide',
    Friendly: 'font-sans font-medium',
    Modern: 'font-sans',
  }[fontStyle] ?? 'font-sans';

  const isEmpty = canvasBlocks.length === 0;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#f1f5f9',
        overflow: 'hidden',
      }}
    >
      {/* ── Droppable scroll area ── */}
      <div
        ref={canvasDropRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: previewMode === 'mobile' ? '24px 16px 40px' : '32px 40px 60px',
          transition: 'background 0.2s',
          background: isOver && isEmpty ? '#ede9fe' : 'transparent',
        }}
      >
        {previewMode === 'mobile' ? (
          /* ── Mobile Phone Frame ── */
          <div
            style={{
              width: 390,
              margin: '0 auto',
              border: '10px solid #0f172a',
              borderRadius: 48,
              background: '#fff',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 680,
              boxShadow: '0 0 0 1px #1e293b, 0 32px 64px rgba(0,0,0,0.25)',
              marginBottom: 32,
            }}
          >
            <PhoneStatusBar />

            {/* Side button accents (purely visual) */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                padding: 8,
                background: '#fff',
              }}
              className={fontClass}
            >
              {isEmpty ? (
                <EmptyState isOver={isOver} />
              ) : (
                canvasBlocks.map((block, index) => (
                  <CanvasBlockWrapper
                    key={block.id}
                    block={block}
                    index={index}
                    totalBlocks={canvasBlocks.length}
                  />
                ))
              )}
            </div>
          </div>

        ) : (
          /* ── Desktop View ── */
          <div
            style={{
              width: '100%',
              maxWidth: 1200,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
            className={fontClass}
          >
            {/* Drop target highlight border */}
            <div
              style={{
                border: isOver && !isEmpty ? '2px dashed #6c63ff' : '2px solid transparent',
                borderRadius: 12,
                padding: isOver && !isEmpty ? 8 : 0,
                transition: 'all 0.2s',
              }}
            >
              {isEmpty ? (
                <EmptyState isOver={isOver} />
              ) : (
                canvasBlocks.map((block, index) => (
                  <CanvasBlockWrapper
                    key={block.id}
                    block={block}
                    index={index}
                    totalBlocks={canvasBlocks.length}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}