import React, { useState, useRef, useEffect } from 'react';

// ─── Editable Text ────────────────────────────────────────────────────────────
function EditableText({ value, onChange, isEditing, className, placeholder, tag: Tag = 'span', multiline = false }) {
  const ref = useRef(null);
  useEffect(() => { if (isEditing && ref.current) ref.current.focus(); }, [isEditing]);

  if (!isEditing) return <Tag className={className}>{value || placeholder}</Tag>;
  if (multiline) return (
    <textarea ref={ref} defaultValue={value} placeholder={placeholder}
      onBlur={e => onChange(e.target.value)} rows={3}
      className={`${className} bg-transparent resize-none outline-none border-b border-dashed border-current/40 focus:border-current/80 w-full`} />
  );
  return (
    <input ref={ref} type="text" defaultValue={value} placeholder={placeholder}
      onBlur={e => onChange(e.target.value)}
      className={`${className} bg-transparent outline-none border-b border-dashed border-current/40 focus:border-current/80 w-full`} />
  );
}

// ─── Icon Picker ──────────────────────────────────────────────────────────────
const ICONS = ['🎨', '🚀', '⚡', '🎯', '💡', '🔥', '🛡️', '📦', '🌟', '🎪', '🔮', '💎', '🛠️', '📊', '🤖', '🌈', '💫', '🎭', '🔑', '🌍'];

function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="text-2xl hover:scale-110 transition-transform cursor-pointer select-none" title="Change icon">
        {value}
      </button>
      {open && (
        <div className="absolute top-8 left-0 z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl p-3 grid grid-cols-5 gap-1 w-44">
          {ICONS.map(ic => (
            <button key={ic} onClick={() => { onChange(ic); setOpen(false); }}
              className={`text-xl p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${ic === value ? 'bg-gray-100 ring-2 ring-blue-400' : ''}`}>
              {ic}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function darken(hex = '#534AB7', pct = 20) {
  let r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  r = Math.max(0, Math.floor(r * (1 - pct / 100)));
  g = Math.max(0, Math.floor(g * (1 - pct / 100)));
  b = Math.max(0, Math.floor(b * (1 - pct / 100)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
function hexAlpha(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// ─── Default Features Data ────────────────────────────────────────────────────
const DEFAULT_FEATURES = [
  { id: 1, icon: '🎨', title: 'AI-Driven Colors', desc: 'Generate tailored color palettes that perfectly match your business sector and audience.' },
  { id: 2, icon: '🖱️', title: 'Drag & Drop Editor', desc: 'Rearrange blocks effortlessly to craft a unique layout without writing a single line of code.' },
  { id: 3, icon: '🚀', title: 'Instant Export', desc: 'Download your complete website as a clean HTML/ZIP file and host it anywhere.' },
  { id: 4, icon: '🤖', title: 'AI Content Writer', desc: 'Let AI generate headlines, descriptions and CTAs perfectly tuned to your brand voice.' },
  { id: 5, icon: '📊', title: 'Analytics Built-in', desc: 'Track visitors, clicks and conversions right from your dashboard in real time.' },
  { id: 6, icon: '🛡️', title: 'Secure & Fast', desc: 'SSL, CDN and auto-backups included. Your site stays online and loads in under a second.' },
];

// ─── VARIANT: CARDS (default) ─────────────────────────────────────────────────
function CardsVariant({ features, heading, subheading, primaryColor, isEditing, onFeatureChange, onHeadingChange, onSubheadingChange, visibleCount }) {
  const shown = features.slice(0, visibleCount);
  const cols = visibleCount <= 3 ? 'md:grid-cols-3' : visibleCount === 4 ? 'md:grid-cols-4' : visibleCount === 5 ? 'md:grid-cols-3' : 'md:grid-cols-3';

  return (
    <section className="py-20 px-6 md:px-12 bg-gray-50/60">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <EditableText tag="h2" value={heading} onChange={onHeadingChange} isEditing={isEditing}
            placeholder="Everything you need" className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3" />
          <EditableText tag="p" value={subheading} onChange={onSubheadingChange} isEditing={isEditing}
            placeholder="Powerful features to build, launch and grow." className="text-gray-500 text-lg max-w-xl mx-auto" />
        </div>
        <div className={`grid grid-cols-1 ${cols} gap-6`}>
          {shown.map((f, i) => (
            <div key={f.id}
              className="group p-7 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-13 h-13 rounded-2xl flex items-center justify-center mb-5 text-2xl transition-transform group-hover:scale-110"
                style={{ background: hexAlpha(primaryColor, 0.1) }}>
                {isEditing
                  ? <IconPicker value={f.icon} onChange={v => onFeatureChange(i, 'icon', v)} />
                  : <span>{f.icon}</span>}
              </div>
              <EditableText tag="h3" value={f.title} onChange={v => onFeatureChange(i, 'title', v)} isEditing={isEditing}
                placeholder={`Feature ${i + 1}`} className="text-base font-bold text-gray-900 mb-2" />
              <EditableText tag="p" value={f.desc} onChange={v => onFeatureChange(i, 'desc', v)} isEditing={isEditing}
                placeholder="Describe this feature..." className="text-sm text-gray-500 leading-relaxed" multiline />
              <div className="mt-4 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                style={{ background: primaryColor }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── VARIANT: HIGHLIGHT (big left card + grid right) ─────────────────────────
function HighlightVariant({ features, heading, subheading, primaryColor, isEditing, onFeatureChange, onHeadingChange, onSubheadingChange }) {
  const [main, ...rest] = features.slice(0, 4);

  return (
    <section className="py-20 px-6 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <EditableText tag="h2" value={heading} onChange={onHeadingChange} isEditing={isEditing}
            placeholder="Why choose us?" className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3" />
          <EditableText tag="p" value={subheading} onChange={onSubheadingChange} isEditing={isEditing}
            placeholder="Built for modern businesses." className="text-gray-500 text-lg max-w-xl mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Main big card */}
          <div className="p-10 rounded-3xl text-white flex flex-col justify-between min-h-64 row-span-2"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${darken(primaryColor, 25)})` }}>
            <div>
              <div className="text-4xl mb-6">
                {isEditing ? <IconPicker value={main.icon} onChange={v => onFeatureChange(0, 'icon', v)} /> : main.icon}
              </div>
              <EditableText tag="h3" value={main.title} onChange={v => onFeatureChange(0, 'title', v)} isEditing={isEditing}
                placeholder="Main Feature" className="text-2xl font-extrabold text-white mb-3" />
              <EditableText tag="p" value={main.desc} onChange={v => onFeatureChange(0, 'desc', v)} isEditing={isEditing}
                placeholder="Describe your main feature..." className="text-white/75 leading-relaxed" multiline />
            </div>
            <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white cursor-pointer group">
              Learn more
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
          {/* Small cards */}
          {rest.map((f, i) => (
            <div key={f.id} className="group p-7 bg-gray-50 rounded-3xl hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                  style={{ background: hexAlpha(primaryColor, 0.1) }}>
                  {isEditing ? <IconPicker value={f.icon} onChange={v => onFeatureChange(i + 1, 'icon', v)} /> : f.icon}
                </div>
                <div>
                  <EditableText tag="h3" value={f.title} onChange={v => onFeatureChange(i + 1, 'title', v)} isEditing={isEditing}
                    placeholder={`Feature ${i + 2}`} className="text-sm font-bold text-gray-900 mb-1" />
                  <EditableText tag="p" value={f.desc} onChange={v => onFeatureChange(i + 1, 'desc', v)} isEditing={isEditing}
                    placeholder="Short description..." className="text-xs text-gray-500 leading-relaxed" multiline />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── VARIANT: LIST (horizontal rows with numbers) ─────────────────────────────
function ListVariant({ features, heading, subheading, primaryColor, isEditing, onFeatureChange, onHeadingChange, onSubheadingChange, visibleCount }) {
  const shown = features.slice(0, visibleCount);
  return (
    <section className="py-20 px-6 md:px-12 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-14">
          <EditableText tag="h2" value={heading} onChange={onHeadingChange} isEditing={isEditing}
            placeholder="How it works" className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3" />
          <EditableText tag="p" value={subheading} onChange={onSubheadingChange} isEditing={isEditing}
            placeholder="Simple, powerful, and fast." className="text-gray-500 text-lg" />
        </div>
        <div className="flex flex-col gap-0">
          {shown.map((f, i) => (
            <div key={f.id} className="group flex items-start gap-6 py-7 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 -mx-4 px-4 rounded-2xl transition-colors">
              <div className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-sm"
                style={{ background: hexAlpha(primaryColor, 0.1), color: primaryColor }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <EditableText tag="h3" value={f.title} onChange={v => onFeatureChange(i, 'title', v)} isEditing={isEditing}
                  placeholder={`Step ${i + 1}`} className="text-base font-bold text-gray-900 mb-1" />
                <EditableText tag="p" value={f.desc} onChange={v => onFeatureChange(i, 'desc', v)} isEditing={isEditing}
                  placeholder="What happens in this step..." className="text-sm text-gray-500 leading-relaxed" multiline />
              </div>
              <div className="flex-shrink-0 text-2xl opacity-60 group-hover:opacity-100 transition-opacity">
                {isEditing ? <IconPicker value={f.icon} onChange={v => onFeatureChange(i, 'icon', v)} /> : f.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── VARIANT: DARK GRID ───────────────────────────────────────────────────────
function DarkGridVariant({ features, heading, subheading, primaryColor, isEditing, onFeatureChange, onHeadingChange, onSubheadingChange, visibleCount }) {
  const shown = features.slice(0, visibleCount);
  const cols = visibleCount <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-3';

  return (
    <section className="py-20 px-6 md:px-12 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20"
        style={{ background: `radial-gradient(ellipse at 30% 50%, ${primaryColor}44 0%, transparent 60%)` }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <EditableText tag="h2" value={heading} onChange={onHeadingChange} isEditing={isEditing}
            placeholder="Powerful features" className="text-3xl md:text-4xl font-extrabold text-white mb-3" />
          <EditableText tag="p" value={subheading} onChange={onSubheadingChange} isEditing={isEditing}
            placeholder="Everything in one place." className="text-gray-400 text-lg max-w-xl mx-auto" />
        </div>
        <div className={`grid grid-cols-1 ${cols} gap-px bg-gray-800/50 rounded-3xl overflow-hidden border border-gray-800`}>
          {shown.map((f, i) => (
            <div key={f.id}
              className="group p-8 bg-gray-950 hover:bg-gray-900 transition-colors duration-300 relative">
              <div className="absolute top-0 left-0 w-full h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)` }} />
              <div className="text-3xl mb-5 transition-transform group-hover:scale-110 duration-300 inline-block">
                {isEditing ? <IconPicker value={f.icon} onChange={v => onFeatureChange(i, 'icon', v)} /> : f.icon}
              </div>
              <EditableText tag="h3" value={f.title} onChange={v => onFeatureChange(i, 'title', v)} isEditing={isEditing}
                placeholder={`Feature ${i + 1}`} className="text-sm font-bold text-white mb-2" />
              <EditableText tag="p" value={f.desc} onChange={v => onFeatureChange(i, 'desc', v)} isEditing={isEditing}
                placeholder="Describe this feature..." className="text-xs text-gray-400 leading-relaxed" multiline />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────
function BlockToolbar({ variant, onVariantChange, onMoveUp, onMoveDown, onDelete, isEditing, onToggleEdit, primaryColor, onColorChange, visibleCount, onCountChange }) {
  const variants = ['cards', 'highlight', 'list', 'dark'];
  const counts = [3, 4, 5, 6];

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-gray-900/95 backdrop-blur-sm text-white rounded-xl px-2 py-1.5 shadow-2xl border border-white/10 whitespace-nowrap flex-wrap justify-center">
      {/* Variants */}
      <div className="flex gap-1">
        {variants.map(v => (
          <button key={v} onClick={() => onVariantChange(v)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all capitalize ${variant === v ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
            {v}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-white/20 mx-1" />

      {/* Count (not for highlight) */}
      {variant !== 'highlight' && (
        <>
          <div className="flex items-center gap-1">
            <span className="text-gray-500 text-xs">Count:</span>
            {counts.map(n => (
              <button key={n} onClick={() => onCountChange(n)}
                className={`w-6 h-6 rounded-md text-xs font-medium transition-all ${visibleCount === n ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                {n}
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-white/20 mx-1" />
        </>
      )}

      {/* Edit */}
      <button onClick={onToggleEdit}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${isEditing ? 'bg-yellow-400 text-gray-900' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        {isEditing ? 'Done' : 'Edit text'}
      </button>

      {/* Color */}
      <label className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer transition-all">
        <div className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ background: primaryColor }} />
        Color
        <input type="color" value={primaryColor} onChange={e => onColorChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
      </label>

      <div className="w-px h-5 bg-white/20 mx-1" />

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

// ─── Main FeaturesBlock ───────────────────────────────────────────────────────
export default function FeaturesBlock({
  content: initialContent,
  styles: initialStyles,
  isSelected,
  onClick,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdate,
}) {
  const [variant, setVariant] = useState(initialContent?.variant || 'cards');
  const [isEditing, setIsEditing] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [primaryColor, setPrimaryColor] = useState(initialStyles?.primaryColor || '#534AB7');
  const [visibleCount, setVisibleCount] = useState(initialContent?.visibleCount || 3);

  const [heading, setHeading] = useState(initialContent?.heading || 'Everything you need');
  const [subheading, setSubheading] = useState(initialContent?.subheading || 'Powerful features to build, launch and grow your business.');
  const [features, setFeatures] = useState(
    initialContent?.features?.length ? initialContent.features : DEFAULT_FEATURES
  );

  function handleVariantChange(v) {
    setAnimating(true);
    setTimeout(() => { setVariant(v); setAnimating(false); }, 120);
    onUpdate?.({ heading, subheading, features, variant: v, visibleCount }, { primaryColor });
  }

  function handleFeatureChange(idx, key, value) {
    const updated = features.map((f, i) => i === idx ? { ...f, [key]: value } : f);
    setFeatures(updated);
    onUpdate?.({ heading, subheading, features: updated, variant, visibleCount }, { primaryColor });
  }

  function handleHeadingChange(v) { setHeading(v); onUpdate?.({ heading: v, subheading, features, variant, visibleCount }, { primaryColor }); }
  function handleSubheadingChange(v) { setSubheading(v); onUpdate?.({ heading, subheading: v, features, variant, visibleCount }, { primaryColor }); }
  function handleColorChange(c) { setPrimaryColor(c); onUpdate?.({ heading, subheading, features, variant, visibleCount }, { primaryColor: c }); }
  function handleCountChange(n) { setVisibleCount(n); onUpdate?.({ heading, subheading, features, variant, visibleCount: n }, { primaryColor }); }

  const sharedProps = {
    features, heading, subheading, primaryColor, isEditing,
    onFeatureChange: handleFeatureChange,
    onHeadingChange: handleHeadingChange,
    onSubheadingChange: handleSubheadingChange,
    visibleCount,
  };

  return (
    <div
      onClick={onClick}
      className={`relative transition-all duration-200 rounded-xl overflow-visible ${isSelected ? 'ring-2 shadow-2xl shadow-black/10' : 'hover:ring-1 hover:ring-gray-300/50'
        }`}
      style={isSelected ? { '--tw-ring-color': primaryColor } : {}}
    >
      {isSelected && (
        <BlockToolbar
          variant={variant}
          onVariantChange={handleVariantChange}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDelete={onDelete}
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(e => !e)}
          primaryColor={primaryColor}
          onColorChange={handleColorChange}
          visibleCount={visibleCount}
          onCountChange={handleCountChange}
        />
      )}

      <div className={`transition-all duration-150 overflow-hidden rounded-xl ${animating ? 'opacity-0 scale-[0.99]' : 'opacity-100 scale-100'}`}>
        {variant === 'cards' && <CardsVariant     {...sharedProps} />}
        {variant === 'highlight' && <HighlightVariant {...sharedProps} />}
        {variant === 'list' && <ListVariant      {...sharedProps} />}
        {variant === 'dark' && <DarkGridVariant  {...sharedProps} />}
      </div>

      {isSelected && (
        <div className="absolute inset-0 rounded-xl pointer-events-none ring-2"
          style={{ '--tw-ring-color': `${primaryColor}60` }} />
      )}
    </div>
  );
}