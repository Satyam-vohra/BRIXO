import React, { useState, useRef, useEffect, useCallback } from 'react';

// ─── Editable Text ────────────────────────────────────────────────────────────
function EditableText({ value, onChange, isEditing, className, placeholder, tag: Tag = 'span' }) {
  const ref = useRef(null);
  useEffect(() => { if (isEditing && ref.current) ref.current.focus(); }, [isEditing]);
  if (!isEditing) return <Tag className={className}>{value || placeholder}</Tag>;
  return (
    <input ref={ref} type="text" defaultValue={value} placeholder={placeholder}
      onBlur={e => onChange(e.target.value)}
      className={`${className} bg-transparent outline-none border-b border-dashed border-current/40 focus:border-current/80 w-full text-center`} />
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function hexAlpha(hex = '#534AB7', a) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}
function darken(hex = '#534AB7', pct = 25) {
  let r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  r = Math.max(0, Math.floor(r * (1 - pct / 100)));
  g = Math.max(0, Math.floor(g * (1 - pct / 100)));
  b = Math.max(0, Math.floor(b * (1 - pct / 100)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ─── Placeholder colours for demo tiles ──────────────────────────────────────
const TILE_COLORS = [
  '#E8E0F5', '#D6EAF8', '#D5F5E3', '#FDEBD0', '#FADBD8', '#D7DBDD',
  '#EBF5FB', '#E8F8F5', '#FEF9E7', '#F9EBEA', '#F4ECF7', '#EAFAF1',
];

// ─── Image Tile (placeholder + real upload) ───────────────────────────────────
function ImageTile({ tile, index, isEditing, onUpload, onRemove, onCaptionChange, onClick, primaryColor, showCaption }) {
  const inputRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onUpload(index, url, file.name.replace(/\.[^.]+$/, ''));
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl cursor-pointer"
      style={{ background: tile.url ? 'transparent' : TILE_COLORS[index % TILE_COLORS.length] }}
      onClick={() => !isEditing && onClick(index)}>

      {/* Image or placeholder */}
      {tile.url ? (
        <img src={tile.url} alt={tile.caption || `Image ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 min-h-[140px]"
          style={{ color: hexAlpha(primaryColor, 0.5) }}>
          <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-wider opacity-50">Image {index + 1}</span>
        </div>
      )}

      {/* Hover overlay (view mode) */}
      {!isEditing && tile.url && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Caption */}
      {showCaption && tile.caption && !isEditing && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
          <p className="text-white text-xs font-medium truncate">{tile.caption}</p>
        </div>
      )}

      {/* Edit overlay */}
      {isEditing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload
          </button>
          {tile.url && (
            <button onClick={e => { e.stopPropagation(); onRemove(index); }}
              className="flex items-center gap-1 text-xs font-semibold text-red-300 hover:text-red-200 transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove
            </button>
          )}
        </div>
      )}

      {isEditing && showCaption && (
        <div className="absolute bottom-0 inset-x-0 px-2 py-1.5 bg-black/50">
          <input type="text" defaultValue={tile.caption} placeholder="Caption..."
            onBlur={e => onCaptionChange(index, e.target.value)}
            onClick={e => e.stopPropagation()}
            className="w-full text-xs text-white bg-transparent outline-none border-b border-white/30 focus:border-white placeholder-white/40" />
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ tiles, activeIndex, onClose, primaryColor }) {
  const [idx, setIdx] = useState(activeIndex);
  const tile = tiles[idx];

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx(i => Math.min(i + 1, tiles.length - 1));
      if (e.key === 'ArrowLeft') setIdx(i => Math.max(i - 1, 0));
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tiles, onClose]);

  if (!tile?.url) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}>
      <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        onClick={onClose}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {idx > 0 && (
        <button className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          onClick={e => { e.stopPropagation(); setIdx(i => i - 1); }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {idx < tiles.length - 1 && (
        <button className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          onClick={e => { e.stopPropagation(); setIdx(i => i + 1); }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <div className="max-w-4xl max-h-[85vh] px-16" onClick={e => e.stopPropagation()}>
        <img src={tile.url} alt={tile.caption} className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl" />
        {tile.caption && (
          <p className="text-center text-white/70 text-sm mt-4">{tile.caption}</p>
        )}
        <p className="text-center text-white/30 text-xs mt-2">{idx + 1} / {tiles.filter(t => t.url).length}</p>
      </div>
    </div>
  );
}

// ─── VARIANT: GRID ────────────────────────────────────────────────────────────
function GridVariant({ title, subtext, tiles, isEditing, onUpload, onRemove, onCaptionChange, onTileClick, primaryColor, showCaption, cols }) {
  const colClass = cols === 2 ? 'grid-cols-2' : cols === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3';
  return (
    <section className="py-16 px-6 md:px-12 bg-gray-50/40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <EditableText tag="h2" value={title} onChange={() => { }} isEditing={false}
            placeholder="Our Gallery" className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3" />
          {subtext && <p className="text-gray-500 text-lg max-w-lg mx-auto">{subtext}</p>}
        </div>
        <div className={`grid ${colClass} gap-4`}>
          {tiles.map((tile, i) => (
            <div key={i} className="aspect-[4/3]">
              <ImageTile tile={tile} index={i} isEditing={isEditing} onUpload={onUpload}
                onRemove={onRemove} onCaptionChange={onCaptionChange} onClick={onTileClick}
                primaryColor={primaryColor} showCaption={showCaption} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── VARIANT: MASONRY ─────────────────────────────────────────────────────────
function MasonryVariant({ title, subtext, tiles, isEditing, onUpload, onRemove, onCaptionChange, onTileClick, primaryColor, showCaption }) {
  const heights = ['aspect-[4/3]', 'aspect-[3/4]', 'aspect-square', 'aspect-[4/3]', 'aspect-[3/4]', 'aspect-square',
    'aspect-[4/3]', 'aspect-square', 'aspect-[3/4]'];
  return (
    <section className="py-16 px-6 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <EditableText tag="h2" value={title} onChange={() => { }} isEditing={false}
            placeholder="Our Work" className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3" />
          {subtext && <p className="text-gray-500 text-base max-w-lg mx-auto">{subtext}</p>}
        </div>
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {tiles.map((tile, i) => (
            <div key={i} className={`break-inside-avoid ${heights[i % heights.length]} mb-4`}>
              <ImageTile tile={tile} index={i} isEditing={isEditing} onUpload={onUpload}
                onRemove={onRemove} onCaptionChange={onCaptionChange} onClick={onTileClick}
                primaryColor={primaryColor} showCaption={showCaption} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── VARIANT: FEATURED (1 big + side grid) ───────────────────────────────────
function FeaturedVariant({ title, subtext, tiles, isEditing, onUpload, onRemove, onCaptionChange, onTileClick, primaryColor, showCaption }) {
  const [featured, ...rest] = tiles;
  return (
    <section className="py-16 px-6 md:px-12 bg-gray-50/40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <EditableText tag="h2" value={title} onChange={() => { }} isEditing={false}
            placeholder="Portfolio" className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3" />
          {subtext && <p className="text-gray-500 text-base max-w-lg mx-auto">{subtext}</p>}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Big featured tile */}
          <div className="aspect-[4/3] md:aspect-auto md:row-span-2 rounded-2xl overflow-hidden">
            <div className="h-full min-h-[280px]">
              <ImageTile tile={featured} index={0} isEditing={isEditing} onUpload={onUpload}
                onRemove={onRemove} onCaptionChange={onCaptionChange} onClick={onTileClick}
                primaryColor={primaryColor} showCaption={showCaption} />
            </div>
          </div>
          {/* Side small tiles */}
          {rest.slice(0, 4).map((tile, i) => (
            <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden">
              <ImageTile tile={tile} index={i + 1} isEditing={isEditing} onUpload={onUpload}
                onRemove={onRemove} onCaptionChange={onCaptionChange} onClick={onTileClick}
                primaryColor={primaryColor} showCaption={showCaption} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── VARIANT: DARK SHOWCASE ───────────────────────────────────────────────────
function DarkVariant({ title, subtext, tiles, isEditing, onUpload, onRemove, onCaptionChange, onTileClick, primaryColor, showCaption, cols }) {
  const colClass = cols === 2 ? 'grid-cols-2' : cols === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3';
  return (
    <section className="py-16 px-6 md:px-12 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20"
        style={{ background: `radial-gradient(ellipse at 60% 0%, ${primaryColor}55, transparent 60%)` }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">{title || 'Our Showcase'}</h2>
          {subtext && <p className="text-gray-400 text-base max-w-lg mx-auto">{subtext}</p>}
        </div>
        <div className={`grid ${colClass} gap-3`}>
          {tiles.map((tile, i) => (
            <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-white/5">
              <ImageTile tile={tile} index={i} isEditing={isEditing} onUpload={onUpload}
                onRemove={onRemove} onCaptionChange={onCaptionChange} onClick={onTileClick}
                primaryColor={primaryColor} showCaption={showCaption} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────
function BlockToolbar({ variant, onVariantChange, onMoveUp, onMoveDown, onDelete,
  isEditing, onToggleEdit, primaryColor, onColorChange,
  tileCount, onTileCountChange, cols, onColsChange, showCaption, onToggleCaption }) {

  const variants = ['grid', 'masonry', 'featured', 'dark'];
  const counts = [4, 6, 8, 9];
  const colOpts = [2, 3, 4];

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex flex-wrap items-center justify-center gap-1 bg-gray-900/95 backdrop-blur-sm text-white rounded-xl px-2 py-1.5 shadow-2xl border border-white/10 whitespace-nowrap max-w-[98vw]">

      {/* Variants */}
      <div className="flex gap-1">
        {variants.map(v => (
          <button key={v} onClick={() => onVariantChange(v)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all capitalize ${variant === v ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
            {v}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-white/20 mx-0.5" />

      {/* Tile count (only grid/dark) */}
      {['grid', 'dark'].includes(variant) && (
        <>
          <div className="flex items-center gap-1">
            <span className="text-gray-500 text-xs">Tiles:</span>
            {counts.map(n => (
              <button key={n} onClick={() => onTileCountChange(n)}
                className={`w-6 h-6 rounded-md text-xs font-medium transition-all ${tileCount === n ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                {n}
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-white/20 mx-0.5" />
          <div className="flex items-center gap-1">
            <span className="text-gray-500 text-xs">Cols:</span>
            {colOpts.map(n => (
              <button key={n} onClick={() => onColsChange(n)}
                className={`w-6 h-6 rounded-md text-xs font-medium transition-all ${cols === n ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                {n}
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-white/20 mx-0.5" />
        </>
      )}

      {/* Caption toggle */}
      <button onClick={onToggleCaption}
        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${showCaption ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
        Captions
      </button>

      <div className="w-px h-5 bg-white/20 mx-0.5" />

      {/* Edit */}
      <button onClick={onToggleEdit}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${isEditing ? 'bg-yellow-400 text-gray-900' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        {isEditing ? 'Done' : 'Edit'}
      </button>

      {/* Color */}
      <label className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer transition-all">
        <div className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ background: primaryColor }} />
        Color
        <input type="color" value={primaryColor} onChange={e => onColorChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
      </label>

      <div className="w-px h-5 bg-white/20 mx-0.5" />

      <button onClick={onMoveUp} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
      </button>
      <button onClick={onMoveDown} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      <button onClick={onDelete} className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all ml-1">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
      </button>
    </div>
  );
}

// ─── Main GalleryBlock ────────────────────────────────────────────────────────
export default function GalleryBlock({
  content: initialContent,
  styles: initialStyles,
  isSelected,
  onClick,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdate,
}) {
  const [variant, setVariant] = useState(initialContent?.variant || 'grid');
  const [isEditing, setIsEditing] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [primaryColor, setPrimaryColor] = useState(initialStyles?.primaryColor || '#534AB7');
  const [tileCount, setTileCount] = useState(initialContent?.tileCount || 6);
  const [cols, setCols] = useState(initialContent?.cols || 3);
  const [showCaption, setShowCaption] = useState(initialContent?.showCaption ?? false);
  const [title, setTitle] = useState(initialContent?.title || 'Our Gallery');
  const [subtext, setSubtext] = useState(initialContent?.subtext || '');
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const [tiles, setTiles] = useState(() => {
    const base = initialContent?.tiles || [];
    return Array.from({ length: 9 }, (_, i) => base[i] || { url: '', caption: '' });
  });

  function handleUpload(index, url, name) {
    setTiles(prev => prev.map((t, i) => i === index ? { ...t, url, caption: t.caption || name } : t));
  }
  function handleRemove(index) {
    setTiles(prev => prev.map((t, i) => i === index ? { url: '', caption: '' } : t));
  }
  function handleCaption(index, caption) {
    setTiles(prev => prev.map((t, i) => i === index ? { ...t, caption } : t));
  }
  function handleTileClick(index) {
    if (tiles[index]?.url) setLightboxIdx(index);
  }

  function handleVariantChange(v) {
    setAnimating(true);
    setTimeout(() => { setVariant(v); setAnimating(false); }, 120);
  }

  const sharedProps = {
    title, subtext, tiles: tiles.slice(0, tileCount),
    isEditing, onUpload: handleUpload, onRemove: handleRemove,
    onCaptionChange: handleCaption, onTileClick: handleTileClick,
    primaryColor, showCaption, cols,
  };

  const filledTiles = tiles.filter(t => t.url);

  return (
    <>
      <div
        onClick={onClick}
        className={`relative transition-all duration-200 rounded-xl overflow-visible ${isSelected ? 'ring-2 shadow-2xl shadow-black/10' : 'hover:ring-1 hover:ring-gray-300/50'
          }`}
        style={isSelected ? { '--tw-ring-color': primaryColor } : {}}
      >
        {isSelected && (
          <BlockToolbar
            variant={variant} onVariantChange={handleVariantChange}
            onMoveUp={onMoveUp} onMoveDown={onMoveDown} onDelete={onDelete}
            isEditing={isEditing} onToggleEdit={() => setIsEditing(e => !e)}
            primaryColor={primaryColor} onColorChange={setPrimaryColor}
            tileCount={tileCount} onTileCountChange={setTileCount}
            cols={cols} onColsChange={setCols}
            showCaption={showCaption} onToggleCaption={() => setShowCaption(s => !s)}
          />
        )}

        <div className={`transition-all duration-150 overflow-hidden rounded-xl ${animating ? 'opacity-0 scale-[0.99]' : 'opacity-100 scale-100'}`}>
          {variant === 'grid' && <GridVariant     {...sharedProps} />}
          {variant === 'masonry' && <MasonryVariant  {...sharedProps} />}
          {variant === 'featured' && <FeaturedVariant {...sharedProps} />}
          {variant === 'dark' && <DarkVariant     {...sharedProps} />}
        </div>

        {/* Upload hint when editing */}
        {isEditing && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-gray-900/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg pointer-events-none">
            <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tile pe hover karke image upload karo
          </div>
        )}

        {isSelected && (
          <div className="absolute inset-0 rounded-xl pointer-events-none ring-2"
            style={{ '--tw-ring-color': `${primaryColor}50` }} />
        )}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox tiles={filledTiles} activeIndex={filledTiles.findIndex((_, i) => tiles.indexOf(filledTiles[i]) === lightboxIdx)}
          onClose={() => setLightboxIdx(null)} primaryColor={primaryColor} />
      )}
    </>
  );
}