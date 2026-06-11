import React, { useContext, useState, useEffect, useRef } from 'react';
import { BuilderContext } from '../../context/BuilderContext';
import { useAIColorSuggestion } from '../../hooks/useAIColorSuggestion';
import ColorSwatch from '../ui/ColorSwatch';
import {
  Sparkles,
  AlertCircle,
  Loader2,
  Pencil,
  Palette,
  Bot,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Check,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────
const BUSINESS_TYPES = [
  { value: 'Food', emoji: '🍔' },
  { value: 'Fashion', emoji: '👗' },
  { value: 'Tech', emoji: '💻' },
  { value: 'Health', emoji: '💊' },
  { value: 'Education', emoji: '📚' },
  { value: 'Finance', emoji: '💰' },
];

const FONT_STYLES = [
  { id: 'Modern', sample: 'Grotesk', hint: 'Clean & minimal' },
  { id: 'Classic', sample: 'Serif', hint: 'Traditional feel' },
  { id: 'Elegant', sample: 'Editorial', hint: 'Luxury & editorial' },
  { id: 'Friendly', sample: 'Rounded', hint: 'Warm & approachable' },
];

const TABS = [
  { id: 'edit', icon: Pencil, label: 'Edit' },
  { id: 'design', icon: Palette, label: 'Design' },
  { id: 'ai', icon: Bot, label: 'AI' },
];

// ─── Reusable field components ────────────────────────────────
function FieldInput({ label, value, onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={s.label}>{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={s.input}
        onFocus={(e) => (e.target.style.borderColor = '#6c63ff')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(0,0,0,0.12)')}
      />
    </div>
  );
}

function FieldTextarea({ label, value, onChange, rows = 3, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={s.label}>{label}</label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        style={{ ...s.input, resize: 'none', lineHeight: 1.6 }}
        onFocus={(e) => (e.target.style.borderColor = '#6c63ff')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(0,0,0,0.12)')}
      />
    </div>
  );
}

function SectionHeader({ title, color = '#6c63ff' }) {
  return (
    <p style={{
      fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
      textTransform: 'uppercase', color, margin: '0 0 10px',
    }}>
      {title}
    </p>
  );
}

// ─── Collapsible feature group ────────────────────────────────
function FeatureGroup({ label, index, content, onChange }) {
  const [open, setOpen] = useState(index === 0);
  const titleKey = `feature${index}Title`;
  const descKey = `feature${index}Desc`;

  return (
    <div style={{
      border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '9px 12px',
          background: open ? '#f5f3ff' : '#fafafa',
          border: 'none', cursor: 'pointer',
          fontSize: 12, fontWeight: 600,
          color: open ? '#6c63ff' : '#475569',
          transition: 'background 0.15s',
        }}
      >
        <span>Feature {index}</span>
        {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
      </button>
      {open && (
        <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 10, background: '#fff' }}>
          <FieldInput
            label="Title"
            value={content[titleKey]}
            onChange={(v) => onChange(titleKey, v)}
          />
          <FieldTextarea
            label="Description"
            value={content[descKey]}
            onChange={(v) => onChange(descKey, v)}
            rows={2}
          />
        </div>
      )}
    </div>
  );
}

// ─── Edit Tab ─────────────────────────────────────────────────
function EditTab({ selectedBlock, updateBlockContent }) {
  if (!selectedBlock) {
    return (
      <div style={{ ...s.emptyState }}>
        <div style={s.emptyIcon}>✏️</div>
        <p style={s.emptyTitle}>No block selected</p>
        <p style={s.emptyDesc}>Click any block on the canvas to edit its content here.</p>
      </div>
    );
  }

  const { type, content, id } = selectedBlock;
  const set = (field, val) => updateBlockContent(id, field, val);

  const blockEditors = {
    navbar: () => (
      <>
        <SectionHeader title="Navbar" />
        <FieldInput label="Logo Text" value={content.logoText} onChange={(v) => set('logoText', v)} />
        <FieldInput label="CTA Button Text" value={content.ctaButtonText} onChange={(v) => set('ctaButtonText', v)} />
      </>
    ),
    hero: () => (
      <>
        <SectionHeader title="Hero Section" />
        <FieldTextarea label="Headline" value={content.headline} onChange={(v) => set('headline', v)} rows={2} />
        <FieldTextarea label="Subheadline" value={content.subheadline} onChange={(v) => set('subheadline', v)} rows={3} />
        <FieldInput label="Primary Button" value={content.button1Text} onChange={(v) => set('button1Text', v)} />
        <FieldInput label="Secondary Button" value={content.button2Text} onChange={(v) => set('button2Text', v)} />
      </>
    ),
    cta: () => (
      <>
        <SectionHeader title="CTA Banner" />
        <FieldTextarea label="Headline" value={content.headline} onChange={(v) => set('headline', v)} rows={2} />
        <FieldInput label="Button Text" value={content.buttonText} onChange={(v) => set('buttonText', v)} />
      </>
    ),
    features: () => (
      <>
        <SectionHeader title="Features" />
        {[1, 2, 3].map((i) => (
          <FeatureGroup
            key={i}
            index={i}
            content={content}
            onChange={set}
          />
        ))}
      </>
    ),
    footer: () => (
      <>
        <SectionHeader title="Footer" />
        <FieldInput label="Company Name" value={content.companyName} onChange={(v) => set('companyName', v)} />
        <FieldInput label="Copyright Text" value={content.copyrightText} onChange={(v) => set('copyrightText', v)} />
      </>
    ),
  };

  const Editor = blockEditors[type];
  if (!Editor) {
    return (
      <div style={s.emptyState}>
        <div style={s.emptyIcon}>🧩</div>
        <p style={s.emptyTitle}>No editable fields</p>
        <p style={s.emptyDesc}>This block type ("{type}") doesn't have text fields to edit.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Block type badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: '#f5f3ff', borderRadius: 6, padding: '4px 10px',
        alignSelf: 'flex-start',
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6c63ff' }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#6c63ff', letterSpacing: 0.3 }}>
          {type.charAt(0).toUpperCase() + type.slice(1)} Block
        </span>
      </div>

      <Editor />
    </div>
  );
}

// ─── Design Tab ───────────────────────────────────────────────
function DesignTab({ businessType, setBusinessType, fontStyle, setFontStyle, onAISuggest }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Business Type */}
      <div>
        <SectionHeader title="Business Type" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {BUSINESS_TYPES.map(({ value, emoji }) => {
            const active = businessType === value;
            return (
              <button
                key={value}
                onClick={() => setBusinessType(value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '8px 10px',
                  borderRadius: 9,
                  border: active ? '1.5px solid #6c63ff' : '1px solid rgba(0,0,0,0.1)',
                  background: active ? '#f5f3ff' : '#fafafa',
                  color: active ? '#6c63ff' : '#475569',
                  fontSize: 12,
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.12s',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 15 }}>{emoji}</span>
                {value}
                {active && <Check size={11} style={{ marginLeft: 'auto' }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Style */}
      <div>
        <SectionHeader title="Typography" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {FONT_STYLES.map(({ id, sample, hint }) => {
            const active = fontStyle === id;
            return (
              <button
                key={id}
                onClick={() => setFontStyle(id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 9,
                  border: active ? '1.5px solid #6c63ff' : '1px solid rgba(0,0,0,0.1)',
                  background: active ? '#f5f3ff' : '#fafafa',
                  cursor: 'pointer',
                  transition: 'all 0.12s',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: active ? '#6c63ff' : '#1e293b' }}>
                    {id}
                  </span>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>{hint}</span>
                </div>
                <span style={{
                  fontSize: 11, fontFamily: id === 'Classic' || id === 'Elegant' ? 'Georgia, serif' : 'sans-serif',
                  color: active ? '#6c63ff' : '#94a3b8', fontWeight: 600,
                }}>
                  Aa {sample}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Suggest button */}
      <button
        onClick={onAISuggest}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '13px 16px',
          background: 'linear-gradient(135deg, #6c63ff, #4f46e5)',
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          letterSpacing: -0.2,
          transition: 'opacity 0.15s, transform 0.1s',
          marginTop: 4,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <Sparkles size={15} />
        AI Suggest Colors
      </button>
    </div>
  );
}

// ─── AI Tab ───────────────────────────────────────────────────
function AITab({ loading, error, colorPalette, businessType, onRetry }) {
  if (loading) {
    return (
      <div style={{ ...s.emptyState, gap: 14 }}>
        <Loader2 size={36} color="#6c63ff" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={s.emptyTitle}>AI is thinking…</p>
        <p style={s.emptyDesc}>
          Curating the perfect palette for {businessType} websites…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...s.emptyState, gap: 10 }}>
        <AlertCircle size={32} color="#ef4444" />
        <p style={{ ...s.emptyTitle, color: '#ef4444' }}>Suggestion failed</p>
        <p style={{ ...s.emptyDesc, color: '#f87171' }}>{error}</p>
        <button
          onClick={onRetry}
          style={{
            marginTop: 8, display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 8,
            border: '1px solid rgba(0,0,0,0.1)',
            background: '#fff', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, color: '#475569',
          }}
        >
          <RotateCcw size={13} /> Try again
        </button>
      </div>
    );
  }

  const swatches = [
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'accent', label: 'Accent' },
    { key: 'background', label: 'Background' },
    { key: 'text', label: 'Text' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: 'linear-gradient(135deg, #6c63ff, #4f46e5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={13} color="#fff" />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
            {businessType} Palette
          </p>
          <p style={{ margin: 0, fontSize: 10, color: '#94a3b8' }}>AI-generated color scheme</p>
        </div>
      </div>

      {/* Color swatches */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {swatches.map(({ key, label }) => (
          colorPalette[key] && (
            <ColorSwatch key={key} color={colorPalette[key]} label={label} />
          )
        ))}
      </div>

      {/* Reasoning */}
      {colorPalette.reasoning && (
        <div style={{
          background: '#f8fafc', border: '1px solid rgba(0,0,0,0.07)',
          borderRadius: 10, padding: '12px 14px',
        }}>
          <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: 1, textTransform: 'uppercase' }}>
            AI Reasoning
          </p>
          <p style={{ margin: 0, fontSize: 12, color: '#475569', lineHeight: 1.7 }}>
            {colorPalette.reasoning}
          </p>
        </div>
      )}

      {/* Regenerate */}
      <button
        onClick={onRetry}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '10px', borderRadius: 9,
          border: '1px solid rgba(108,99,255,0.25)',
          background: '#f5f3ff', color: '#6c63ff',
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        <RotateCcw size={13} /> Regenerate Palette
      </button>
    </div>
  );
}

// ─── RightPanel (main export) ─────────────────────────────────
export default function RightPanel() {
  const {
    canvasBlocks,
    selectedBlockId,
    businessType,
    fontStyle,
    colorPalette,
    updateBlockContent,
    setColorPalette,
    setBusinessType,
    setFontStyle,
  } = useContext(BuilderContext);

  const [activeTab, setActiveTab] = useState('design');
  const { suggestColors, loading, error } = useAIColorSuggestion();

  const selectedBlock = canvasBlocks.find((b) => b.id === selectedBlockId);

  useEffect(() => {
    if (selectedBlockId) setActiveTab('edit');
  }, [selectedBlockId]);

  const handleAISuggest = async () => {
    setActiveTab('ai');
    const result = await suggestColors(businessType);
    if (result) setColorPalette(result);
  };

  return (
    <aside style={{
      width: 300,
      background: '#fff',
      borderLeft: '1px solid rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      flexShrink: 0,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>

      {/* ── Tab Bar ── */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        flexShrink: 0,
        padding: '6px 8px 0',
        gap: 2,
      }}>
        {TABS.map(({ id, icon: Icon, label }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                padding: '8px 4px 10px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                color: active ? '#6c63ff' : '#94a3b8',
                borderBottom: active ? '2px solid #6c63ff' : '2px solid transparent',
                transition: 'all 0.15s',
                borderRadius: '4px 4px 0 0',
              }}
            >
              <Icon size={13} />
              {label}
              {id === 'edit' && selectedBlock && (
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#6c63ff', marginLeft: 1,
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '18px 16px 32px',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(0,0,0,0.1) transparent',
      }}>
        {activeTab === 'edit' && (
          <EditTab
            selectedBlock={selectedBlock}
            updateBlockContent={updateBlockContent}
          />
        )}
        {activeTab === 'design' && (
          <DesignTab
            businessType={businessType}
            setBusinessType={setBusinessType}
            fontStyle={fontStyle}
            setFontStyle={setFontStyle}
            onAISuggest={handleAISuggest}
          />
        )}
        {activeTab === 'ai' && (
          <AITab
            loading={loading}
            error={error}
            colorPalette={colorPalette}
            businessType={businessType}
            onRetry={handleAISuggest}
          />
        )}
      </div>
    </aside>
  );
}

// ─── Shared Styles ────────────────────────────────────────────
const s = {
  label: {
    fontSize: 11, fontWeight: 700, color: '#64748b',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 0,
  },
  input: {
    width: '100%', padding: '8px 11px',
    border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8,
    fontSize: 13, color: '#1e293b', background: '#fafafa',
    outline: 'none', transition: 'border-color 0.15s',
    fontFamily: 'inherit', boxSizing: 'border-box',
  },
  emptyState: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '48px 16px', textAlign: 'center', gap: 8,
  },
  emptyIcon: { fontSize: 32, marginBottom: 4 },
  emptyTitle: { fontSize: 13, fontWeight: 700, color: '#1e293b', margin: 0 },
  emptyDesc: { fontSize: 12, color: '#94a3b8', lineHeight: 1.6, margin: 0, maxWidth: 220 },
};