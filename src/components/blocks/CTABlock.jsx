import React, { useState, useRef, useEffect } from 'react';

// ─── Utility ────────────────────────────────────────────────────────────────
function hexToRgb(hex = '#534AB7') {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r} ${g} ${b}`;
}

function darken(hex = '#534AB7', pct = 20) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.max(0, Math.floor(r * (1 - pct / 100)));
  g = Math.max(0, Math.floor(g * (1 - pct / 100)));
  b = Math.max(0, Math.floor(b * (1 - pct / 100)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ─── Inline editable text ────────────────────────────────────────────────────
function EditableText({ value, onChange, isEditing, className, placeholder, tag: Tag = 'span', multiline = false }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isEditing && ref.current) ref.current.focus();
  }, [isEditing]);

  if (!isEditing) return <Tag className={className}>{value || placeholder}</Tag>;

  if (multiline) {
    return (
      <textarea
        ref={ref}
        defaultValue={value}
        placeholder={placeholder}
        onBlur={e => onChange(e.target.value)}
        className={`${className} bg-transparent resize-none outline-none border-b-2 border-dashed border-white/60 focus:border-white w-full`}
        rows={3}
      />
    );
  }

  return (
    <input
      ref={ref}
      type="text"
      defaultValue={value}
      placeholder={placeholder}
      onBlur={e => onChange(e.target.value)}
      className={`${className} bg-transparent outline-none border-b-2 border-dashed border-white/60 focus:border-white text-center w-full`}
    />
  );
}

// ─── Variant: GRADIENT (default) ─────────────────────────────────────────────
function GradientVariant({ content, styles, isEditing, onContentChange, animating }) {
  const primary = styles?.primaryColor || '#534AB7';
  const dark = darken(primary, 25);

  return (
    <section
      className={`relative py-24 px-6 md:px-16 text-center overflow-hidden transition-all duration-700 ${animating ? 'scale-[1.01]' : 'scale-100'}`}
      style={{ background: `linear-gradient(135deg, ${primary} 0%, ${dark} 100%)` }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-10 blur-3xl -translate-x-1/2 -translate-y-1/2"
        style={{ background: '#fff' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl translate-x-1/3 translate-y-1/3"
        style={{ background: '#fff' }} />

      {/* Badge */}
      {content.badge && (
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/20">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <EditableText
            value={content.badge}
            onChange={v => onContentChange('badge', v)}
            isEditing={isEditing}
            placeholder="Limited Offer"
            className="text-xs font-semibold text-white"
          />
        </div>
      )}

      <EditableText
        tag="h2"
        value={content.headline}
        onChange={v => onContentChange('headline', v)}
        isEditing={isEditing}
        placeholder="Unlock Your Digital Potential"
        className="text-4xl md:text-6xl font-extrabold text-white max-w-4xl mx-auto mb-5 leading-tight tracking-tight"
      />

      <EditableText
        tag="p"
        value={content.subtext}
        onChange={v => onContentChange('subtext', v)}
        isEditing={isEditing}
        placeholder="Join thousands of businesses already growing with us."
        className="text-white/75 text-lg max-w-xl mx-auto mb-10 leading-relaxed"
        multiline
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          className="group relative bg-white font-bold py-4 px-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 overflow-hidden"
          style={{ color: primary }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <EditableText
              value={content.buttonText}
              onChange={v => onContentChange('buttonText', v)}
              isEditing={isEditing}
              placeholder="Get Started Free"
              className="font-bold"
              style={{ color: primary }}
            />
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        {content.secondaryButton && (
          <button className="text-white/90 font-semibold py-4 px-8 rounded-2xl border border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm">
            <EditableText
              value={content.secondaryButton}
              onChange={v => onContentChange('secondaryButton', v)}
              isEditing={isEditing}
              placeholder="Watch Demo →"
              className="text-white/90 font-semibold"
            />
          </button>
        )}
      </div>

      {content.note && (
        <p className="mt-6 text-white/50 text-sm">
          <EditableText
            value={content.note}
            onChange={v => onContentChange('note', v)}
            isEditing={isEditing}
            placeholder="No credit card required · Free 14-day trial"
            className="text-white/50 text-sm"
          />
        </p>
      )}
    </section>
  );
}

// ─── Variant: SPLIT ───────────────────────────────────────────────────────────
function SplitVariant({ content, styles, isEditing, onContentChange }) {
  const primary = styles?.primaryColor || '#534AB7';
  const dark = darken(primary, 20);

  return (
    <section className="flex flex-col md:flex-row overflow-hidden rounded-none">
      {/* Left: text */}
      <div className="flex-1 py-16 px-10 md:px-14 flex flex-col justify-center"
        style={{ background: `linear-gradient(135deg, ${primary}, ${dark})` }}>
        {content.badge && (
          <span className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4 block">
            <EditableText value={content.badge} onChange={v => onContentChange('badge', v)} isEditing={isEditing} placeholder="Special Offer" className="text-xs font-bold uppercase tracking-widest text-white/60" />
          </span>
        )}
        <EditableText tag="h2" value={content.headline} onChange={v => onContentChange('headline', v)} isEditing={isEditing}
          placeholder="Ready to grow your business?" className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4" />
        <EditableText tag="p" value={content.subtext} onChange={v => onContentChange('subtext', v)} isEditing={isEditing}
          placeholder="Start building today. No technical skills needed." className="text-white/70 text-base leading-relaxed mb-8" multiline />

        {content.stats && (
          <div className="flex gap-8 mb-8">
            {(content.stats || []).map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-extrabold text-white">{s.value}</div>
                <div className="text-xs text-white/50 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: action */}
      <div className="flex-shrink-0 md:w-80 bg-white flex flex-col justify-center items-center p-12 gap-4">
        <button className="w-full font-bold py-4 px-8 rounded-2xl shadow-lg text-white transition-all duration-300 active:scale-95 hover:opacity-90"
          style={{ background: primary }}>
          <EditableText value={content.buttonText} onChange={v => onContentChange('buttonText', v)} isEditing={isEditing}
            placeholder="Get Started Free" className="font-bold text-white" />
        </button>
        {content.secondaryButton && (
          <button className="w-full font-semibold py-3.5 px-8 rounded-2xl border-2 transition-all duration-300 hover:bg-gray-50"
            style={{ color: primary, borderColor: primary }}>
            <EditableText value={content.secondaryButton} onChange={v => onContentChange('secondaryButton', v)} isEditing={isEditing}
              placeholder="Learn More" className="font-semibold" style={{ color: primary }} />
          </button>
        )}
        {content.note && (
          <p className="text-gray-400 text-xs text-center mt-1">
            <EditableText value={content.note} onChange={v => onContentChange('note', v)} isEditing={isEditing}
              placeholder="Free 14-day trial, no card needed" className="text-gray-400 text-xs" />
          </p>
        )}
      </div>
    </section>
  );
}

// ─── Variant: MINIMAL ────────────────────────────────────────────────────────
function MinimalVariant({ content, styles, isEditing, onContentChange }) {
  const primary = styles?.primaryColor || '#534AB7';

  return (
    <section className="py-20 px-6 text-center bg-white border-t border-b border-gray-100">
      <EditableText tag="h2" value={content.headline} onChange={v => onContentChange('headline', v)} isEditing={isEditing}
        placeholder="Ready to get started?" className="text-4xl md:text-5xl font-extrabold text-gray-900 max-w-2xl mx-auto mb-4 leading-tight" />
      <EditableText tag="p" value={content.subtext} onChange={v => onContentChange('subtext', v)} isEditing={isEditing}
        placeholder="Join thousands of businesses already growing with us." className="text-gray-500 text-lg max-w-lg mx-auto mb-10" multiline />
      <button className="inline-flex items-center gap-2 font-bold py-4 px-10 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 hover:opacity-90"
        style={{ background: primary }}>
        <EditableText value={content.buttonText} onChange={v => onContentChange('buttonText', v)} isEditing={isEditing}
          placeholder="Get Started Free" className="font-bold text-white" />
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
      {content.note && (
        <p className="mt-5 text-gray-400 text-sm">
          <EditableText value={content.note} onChange={v => onContentChange('note', v)} isEditing={isEditing}
            placeholder="No credit card required" className="text-gray-400 text-sm" />
        </p>
      )}
    </section>
  );
}

// ─── Variant: DARK ───────────────────────────────────────────────────────────
function DarkVariant({ content, styles, isEditing, onContentChange }) {
  const primary = styles?.primaryColor || '#534AB7';

  return (
    <section className="relative py-24 px-6 text-center bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 opacity-30"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${primary}55 0%, transparent 70%)` }} />
      <div className="relative z-10">
        {content.badge && (
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border"
            style={{ color: primary, borderColor: `${primary}55`, background: `${primary}15` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: primary }} />
            <EditableText value={content.badge} onChange={v => onContentChange('badge', v)} isEditing={isEditing}
              placeholder="Limited Offer" className="text-xs font-bold uppercase tracking-widest" style={{ color: primary }} />
          </div>
        )}
        <EditableText tag="h2" value={content.headline} onChange={v => onContentChange('headline', v)} isEditing={isEditing}
          placeholder="Build something amazing" className="text-4xl md:text-6xl font-extrabold text-white max-w-4xl mx-auto mb-5 leading-tight tracking-tight" />
        <EditableText tag="p" value={content.subtext} onChange={v => onContentChange('subtext', v)} isEditing={isEditing}
          placeholder="Everything you need to launch fast." className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed" multiline />
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="font-bold py-4 px-10 rounded-2xl text-white shadow-2xl transition-all duration-300 active:scale-95 hover:opacity-90"
            style={{ background: primary }}>
            <EditableText value={content.buttonText} onChange={v => onContentChange('buttonText', v)} isEditing={isEditing}
              placeholder="Start Building Free" className="font-bold text-white" />
          </button>
          {content.secondaryButton && (
            <button className="text-gray-400 hover:text-white font-semibold py-4 px-8 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all duration-300">
              <EditableText value={content.secondaryButton} onChange={v => onContentChange('secondaryButton', v)} isEditing={isEditing}
                placeholder="See examples →" className="font-semibold" />
            </button>
          )}
        </div>
        {content.note && (
          <p className="mt-6 text-gray-600 text-sm">
            <EditableText value={content.note} onChange={v => onContentChange('note', v)} isEditing={isEditing}
              placeholder="Free forever plan available" className="text-gray-600 text-sm" />
          </p>
        )}
      </div>
    </section>
  );
}

// ─── Toolbar (shown when selected) ──────────────────────────────────────────
function BlockToolbar({ variant, onVariantChange, onMoveUp, onMoveDown, onDelete, isEditing, onToggleEdit, primaryColor, onColorChange }) {
  const variants = ['gradient', 'split', 'minimal', 'dark'];

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-gray-900/95 backdrop-blur-sm text-white rounded-xl px-2 py-1.5 shadow-2xl border border-white/10 whitespace-nowrap">
      {/* Variant switcher */}
      <div className="flex gap-1 mr-1">
        {variants.map(v => (
          <button key={v} onClick={() => onVariantChange(v)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${variant === v ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-white/20 mx-1" />

      {/* Edit toggle */}
      <button onClick={onToggleEdit}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${isEditing ? 'bg-yellow-400 text-gray-900' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        {isEditing ? 'Done' : 'Edit'}
      </button>

      {/* Color picker */}
      <label className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer transition-all">
        <div className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ background: primaryColor }} />
        Color
        <input type="color" value={primaryColor} onChange={e => onColorChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
      </label>

      <div className="w-px h-5 bg-white/20 mx-1" />

      {/* Move */}
      <button onClick={onMoveUp} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all" title="Move up">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
      </button>
      <button onClick={onMoveDown} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all" title="Move down">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {/* Delete */}
      <button onClick={onDelete} className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all ml-1" title="Delete">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
      </button>
    </div>
  );
}

// ─── Main CTABlock ────────────────────────────────────────────────────────────
export default function CTABlock({
  content: initialContent,
  styles: initialStyles,
  isSelected,
  onClick,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdate,
}) {
  const [variant, setVariant] = useState(initialContent?.variant || 'gradient');
  const [isEditing, setIsEditing] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [primaryColor, setPrimaryColor] = useState(initialStyles?.primaryColor || '#534AB7');
  const [content, setContent] = useState({
    headline: 'Unlock Your Digital Potential Today',
    subtext: 'Join thousands of businesses already growing with us. No technical skills needed.',
    buttonText: 'Get Started Free',
    secondaryButton: 'Watch Demo →',
    badge: '✨ New Feature',
    note: 'No credit card required · Free 14-day trial',
    stats: [
      { value: '50K+', label: 'Customers' },
      { value: '4.9★', label: 'Rating' },
      { value: '99%', label: 'Uptime' },
    ],
    ...initialContent,
  });

  function handleVariantChange(v) {
    setAnimating(true);
    setTimeout(() => { setVariant(v); setAnimating(false); }, 150);
    onUpdate?.({ ...content, variant: v }, { primaryColor });
  }

  function handleContentChange(key, value) {
    const updated = { ...content, [key]: value };
    setContent(updated);
    onUpdate?.(updated, { primaryColor });
  }

  function handleColorChange(color) {
    setPrimaryColor(color);
    onUpdate?.(content, { primaryColor: color });
  }

  const sharedProps = { content, styles: { primaryColor }, isEditing, onContentChange: handleContentChange, animating };

  return (
    <div
      onClick={onClick}
      className={`relative transition-all duration-200 rounded-xl overflow-visible ${isSelected
        ? 'ring-2 shadow-2xl shadow-black/10'
        : 'hover:ring-1 hover:ring-gray-300/50'
        }`}
      style={isSelected ? { '--tw-ring-color': primaryColor, ringColor: primaryColor } : {}}
    >
      {/* Toolbar */}
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
        />
      )}

      {/* Variant renderer */}
      <div className={`transition-all duration-150 ${animating ? 'opacity-0 scale-[0.99]' : 'opacity-100 scale-100'} overflow-hidden rounded-xl`}>
        {variant === 'gradient' && <GradientVariant {...sharedProps} />}
        {variant === 'split' && <SplitVariant    {...sharedProps} />}
        {variant === 'minimal' && <MinimalVariant  {...sharedProps} />}
        {variant === 'dark' && <DarkVariant      {...sharedProps} />}
      </div>

      {/* Selected border glow */}
      {isSelected && (
        <div className="absolute inset-0 rounded-xl pointer-events-none ring-2"
          style={{ '--tw-ring-color': `${primaryColor}80` }} />
      )}
    </div>
  );
}