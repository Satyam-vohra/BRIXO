import React, { useState, useRef, useEffect } from 'react';

// ─── Editable Text ────────────────────────────────────────────────────────────
function EditableText({ value, onChange, isEditing, className, placeholder, tag: Tag = 'span', multiline = false }) {
  const ref = useRef(null);
  useEffect(() => { if (isEditing && ref.current) ref.current.focus(); }, [isEditing]);

  if (!isEditing) return <Tag className={className}>{value || placeholder}</Tag>;
  if (multiline) return (
    <textarea ref={ref} defaultValue={value} placeholder={placeholder}
      onBlur={e => onChange(e.target.value)} rows={2}
      className={`${className} bg-transparent resize-none outline-none border-b border-dashed border-current/40 focus:border-current/80 w-full`} />
  );
  return (
    <input ref={ref} type="text" defaultValue={value} placeholder={placeholder}
      onBlur={e => onChange(e.target.value)}
      className={`${className} bg-transparent outline-none border-b border-dashed border-current/40 focus:border-current/80 w-full min-w-0`} />
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function darken(hex = '#534AB7', pct = 25) {
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

// ─── Social Icons (SVG) ───────────────────────────────────────────────────────
const SocialIcons = {
  twitter: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.83L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
  linkedin: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
  instagram: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>,
  github: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>,
  youtube: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>,
};

// ─── Default Data ─────────────────────────────────────────────────────────────
const DEFAULT_LINKS = [
  { group: 'Product', items: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
  { group: 'Company', items: ['About', 'Blog', 'Careers', 'Press'] },
  { group: 'Support', items: ['Docs', 'Help Center', 'Status', 'Contact'] },
];
const DEFAULT_SOCIALS = [
  { key: 'twitter', href: '#' },
  { key: 'linkedin', href: '#' },
  { key: 'instagram', href: '#' },
  { key: 'github', href: '#' },
];

// ─── VARIANT: FULL (4-col mega footer) ───────────────────────────────────────
function FullVariant({ d, isEditing, onChange, primaryColor }) {
  return (
    <footer className="bg-gray-950 text-white pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          {/* Brand col */}
          <div className="col-span-2">
            <div className="text-xl font-extrabold mb-3" style={{ color: primaryColor }}>
              <EditableText value={d.companyName} onChange={v => onChange('companyName', v)} isEditing={isEditing}
                placeholder="BRIXO Inc." className="text-xl font-extrabold" style={{ color: primaryColor }} />
            </div>
            <EditableText tag="p" value={d.tagline} onChange={v => onChange('tagline', v)} isEditing={isEditing}
              placeholder="Build your website in minutes. No code needed." className="text-gray-400 text-sm leading-relaxed mb-6" multiline />
            {/* Social */}
            <div className="flex gap-3">
              {DEFAULT_SOCIALS.map(s => (
                <a key={s.key} href="#" onClick={e => e.preventDefault()}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                  style={{ background: hexAlpha(primaryColor, 0.1) }}>
                  {SocialIcons[s.key]}
                </a>
              ))}
            </div>
          </div>
          {/* Link groups */}
          {DEFAULT_LINKS.map((g, gi) => (
            <div key={gi}>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{g.group}</p>
              <ul className="flex flex-col gap-2.5">
                {g.items.map((item, ii) => (
                  <li key={ii}>
                    <a href="#" onClick={e => e.preventDefault()}
                      className="text-sm text-gray-400 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 text-sm text-gray-500">
          <EditableText value={d.copyrightText} onChange={v => onChange('copyrightText', v)} isEditing={isEditing}
            placeholder="© 2026 BRIXO. All rights reserved." className="text-sm text-gray-500" />
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms', 'Cookies'].map(l => (
              <a key={l} href="#" onClick={e => e.preventDefault()}
                className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── VARIANT: MINIMAL ─────────────────────────────────────────────────────────
function MinimalVariant({ d, isEditing, onChange, primaryColor }) {
  return (
    <footer className="bg-white border-t border-gray-100 py-10 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-extrabold text-lg" style={{ color: primaryColor }}>
          <EditableText value={d.companyName} onChange={v => onChange('companyName', v)} isEditing={isEditing}
            placeholder="BRIXO" className="font-extrabold text-lg" style={{ color: primaryColor }} />
        </div>
        <div className="flex gap-6 text-sm text-gray-400">
          {['Privacy', 'Terms', 'Support', 'Contact'].map(l => (
            <a key={l} href="#" onClick={e => e.preventDefault()}
              className="hover:text-gray-800 transition-colors">{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {DEFAULT_SOCIALS.slice(0, 3).map(s => (
            <a key={s.key} href="#" onClick={e => e.preventDefault()}
              className="text-gray-400 hover:transition-colors"
              style={{ ['--tw-text-opacity']: 1 }}
              onMouseEnter={e => e.currentTarget.style.color = primaryColor}
              onMouseLeave={e => e.currentTarget.style.color = ''}>
              {SocialIcons[s.key]}
            </a>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
        <EditableText value={d.copyrightText} onChange={v => onChange('copyrightText', v)} isEditing={isEditing}
          placeholder="© 2026 BRIXO. All rights reserved." className="text-xs text-gray-400" />
      </div>
    </footer>
  );
}

// ─── VARIANT: NEWSLETTER ──────────────────────────────────────────────────────
function NewsletterVariant({ d, isEditing, onChange, primaryColor }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <footer className="bg-gray-950 text-white px-6 md:px-12">
      {/* Newsletter banner */}
      <div className="max-w-6xl mx-auto py-14 border-b border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <EditableText tag="h3" value={d.newsletterHeading} onChange={v => onChange('newsletterHeading', v)} isEditing={isEditing}
              placeholder="Stay in the loop" className="text-2xl font-extrabold text-white mb-2" />
            <EditableText tag="p" value={d.newsletterSubtext} onChange={v => onChange('newsletterSubtext', v)} isEditing={isEditing}
              placeholder="Get the latest updates, articles and resources." className="text-gray-400 text-sm" />
          </div>
          {submitted ? (
            <div className="flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-2xl"
              style={{ background: hexAlpha(primaryColor, 0.15), color: primaryColor }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              You're subscribed!
            </div>
          ) : (
            <div className="flex gap-2 flex-shrink-0">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm px-4 py-3 rounded-xl outline-none focus:border-gray-500 w-56 transition-colors" />
              <button onClick={() => email && setSubmitted(true)}
                className="px-5 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: primaryColor }}>
                Subscribe
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Bottom */}
      <div className="max-w-6xl mx-auto py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-extrabold text-lg" style={{ color: primaryColor }}>
          <EditableText value={d.companyName} onChange={v => onChange('companyName', v)} isEditing={isEditing}
            placeholder="BRIXO Inc." className="font-extrabold text-lg" style={{ color: primaryColor }} />
        </div>
        <div className="flex gap-6 text-xs text-gray-500">
          {['Privacy', 'Terms', 'Support'].map(l => (
            <a key={l} href="#" onClick={e => e.preventDefault()}
              className="hover:text-white transition-colors">{l}</a>
          ))}
        </div>
        <div className="flex gap-3">
          {DEFAULT_SOCIALS.map(s => (
            <a key={s.key} href="#" onClick={e => e.preventDefault()}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              {SocialIcons[s.key]}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── VARIANT: GRADIENT ────────────────────────────────────────────────────────
function GradientVariant({ d, isEditing, onChange, primaryColor }) {
  return (
    <footer className="relative overflow-hidden text-white px-6 md:px-12 py-14"
      style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${darken(primaryColor, 30)} 100%)` }}>
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl translate-x-1/3 -translate-y-1/3 bg-white" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl -translate-x-1/3 translate-y-1/3 bg-white" />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 pb-10 border-b border-white/20">
          <div className="max-w-xs">
            <div className="font-extrabold text-2xl text-white mb-3">
              <EditableText value={d.companyName} onChange={v => onChange('companyName', v)} isEditing={isEditing}
                placeholder="BRIXO Inc." className="font-extrabold text-2xl text-white" />
            </div>
            <EditableText tag="p" value={d.tagline} onChange={v => onChange('tagline', v)} isEditing={isEditing}
              placeholder="Build your website in minutes." className="text-white/70 text-sm leading-relaxed" multiline />
          </div>
          <div className="flex gap-12">
            {DEFAULT_LINKS.slice(0, 2).map((g, gi) => (
              <div key={gi}>
                <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">{g.group}</p>
                <ul className="flex flex-col gap-2.5">
                  {g.items.map((item, ii) => (
                    <li key={ii}>
                      <a href="#" onClick={e => e.preventDefault()}
                        className="text-sm text-white/70 hover:text-white transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* Socials */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Follow us</p>
            <div className="flex flex-col gap-3">
              {DEFAULT_SOCIALS.map(s => (
                <a key={s.key} href="#" onClick={e => e.preventDefault()}
                  className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors text-sm capitalize">
                  {SocialIcons[s.key]} {s.key}
                </a>
              ))}
            </div>
          </div>
        </div>
        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-white/50">
          <EditableText value={d.copyrightText} onChange={v => onChange('copyrightText', v)} isEditing={isEditing}
            placeholder="© 2026 BRIXO. All rights reserved." className="text-sm text-white/50" />
          <div className="flex gap-5">
            {['Privacy', 'Terms', 'Cookies'].map(l => (
              <a key={l} href="#" onClick={e => e.preventDefault()}
                className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────
function BlockToolbar({ variant, onVariantChange, onMoveUp, onMoveDown, onDelete, isEditing, onToggleEdit, primaryColor, onColorChange }) {
  const variants = ['full', 'minimal', 'newsletter', 'gradient'];
  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-gray-900/95 backdrop-blur-sm text-white rounded-xl px-2 py-1.5 shadow-2xl border border-white/10 whitespace-nowrap">
      <div className="flex gap-1">
        {variants.map(v => (
          <button key={v} onClick={() => onVariantChange(v)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all capitalize ${variant === v ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
            {v}
          </button>
        ))}
      </div>
      <div className="w-px h-5 bg-white/20 mx-1" />
      <button onClick={onToggleEdit}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${isEditing ? 'bg-yellow-400 text-gray-900' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        {isEditing ? 'Done' : 'Edit'}
      </button>
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

// ─── Main FooterBlock ─────────────────────────────────────────────────────────
export default function FooterBlock({
  content: initialContent,
  styles: initialStyles,
  isSelected,
  onClick,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdate,
}) {
  const [variant, setVariant] = useState(initialContent?.variant || 'full');
  const [isEditing, setIsEditing] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [primaryColor, setPrimaryColor] = useState(initialStyles?.primaryColor || '#534AB7');
  const [data, setData] = useState({
    companyName: 'BRIXO Inc.',
    tagline: 'Build your website in minutes. No code needed.',
    copyrightText: '© 2026 BRIXO. All rights reserved.',
    newsletterHeading: 'Stay in the loop',
    newsletterSubtext: 'Get product updates, articles and resources straight to your inbox.',
    ...initialContent,
  });

  function handleChange(key, value) {
    const updated = { ...data, [key]: value };
    setData(updated);
    onUpdate?.(updated, { primaryColor });
  }

  function handleVariantChange(v) {
    setAnimating(true);
    setTimeout(() => { setVariant(v); setAnimating(false); }, 120);
    onUpdate?.({ ...data, variant: v }, { primaryColor });
  }

  function handleColorChange(c) {
    setPrimaryColor(c);
    onUpdate?.(data, { primaryColor: c });
  }

  const sharedProps = { d: data, isEditing, onChange: handleChange, primaryColor };

  return (
    <div
      onClick={onClick}
      className={`relative transition-all duration-200 rounded-xl overflow-visible ${isSelected ? 'ring-2 shadow-2xl shadow-black/20' : 'hover:ring-1 hover:ring-gray-300/50'
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
        />
      )}

      <div className={`transition-all duration-150 overflow-hidden rounded-xl ${animating ? 'opacity-0 scale-[0.99]' : 'opacity-100 scale-100'}`}>
        {variant === 'full' && <FullVariant       {...sharedProps} />}
        {variant === 'minimal' && <MinimalVariant    {...sharedProps} />}
        {variant === 'newsletter' && <NewsletterVariant {...sharedProps} />}
        {variant === 'gradient' && <GradientVariant   {...sharedProps} />}
      </div>

      {isSelected && (
        <div className="absolute inset-0 rounded-xl pointer-events-none ring-2"
          style={{ '--tw-ring-color': `${primaryColor}50` }} />
      )}
    </div>
  );
}