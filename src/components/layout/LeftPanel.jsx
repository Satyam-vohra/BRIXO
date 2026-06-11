import React, { useState } from 'react';
import {
  PanelTop,
  Sparkles,
  ShoppingBag,
  Zap,
  Users,
  Image,
  Megaphone,
  PanelBottom,
  Search,
  Layout,
  ChevronDown,
} from 'lucide-react';
import BlockCard from '../ui/BlockCard';

// ─── Block Library Data ───────────────────────────────────────
const BLOCKS_LIBRARY = [
  {
    category: 'Structure',
    items: [
      { type: 'navbar', label: 'Navbar', icon: PanelTop, desc: 'Top navigation bar' },
      { type: 'footer', label: 'Footer', icon: PanelBottom, desc: 'Page footer with links' },
    ],
  },
  {
    category: 'Sections',
    items: [
      { type: 'hero', label: 'Hero Section', icon: Sparkles, desc: 'Big headline + CTA' },
      { type: 'features', label: 'Features', icon: Zap, desc: 'Feature highlights grid' },
      { type: 'cta', label: 'CTA Banner', icon: Megaphone, desc: 'Call to action strip' },
    ],
  },
  {
    category: 'Content',
    items: [
      { type: 'products', label: 'Products Grid', icon: ShoppingBag, desc: 'Product cards layout' },
      { type: 'testimonials', label: 'Testimonials', icon: Users, desc: 'Customer reviews' },
      { type: 'gallery', label: 'Image Gallery', icon: Image, desc: 'Photo grid / lightbox' },
    ],
  },
];

// ─── Category Section ─────────────────────────────────────────
function CategorySection({ category, items, searchQuery }) {
  const [collapsed, setCollapsed] = useState(false);

  const filtered = items.filter(
    (b) =>
      !searchQuery ||
      b.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filtered.length === 0) return null;

  return (
    <div style={{ marginBottom: 4 }}>
      {/* Category header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 4px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.35)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          userSelect: 'none',
          borderRadius: 4,
          transition: 'color 0.15s',
        }}
      >
        <span>{category}</span>
        <ChevronDown
          size={12}
          style={{
            transition: 'transform 0.2s',
            transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* Block cards */}
      {!collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 2 }}>
          {filtered.map((block) => (
            <BlockCard
              key={block.type}
              type={block.type}
              label={block.label}
              icon={block.icon}
              desc={block.desc}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── LeftPanel (main export) ──────────────────────────────────
export default function LeftPanel() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('blocks'); // 'blocks' | 'pages'

  const allItems = BLOCKS_LIBRARY.flatMap((c) => c.items);
  const blockCount = allItems.length;

  return (
    <aside
      style={{
        width: 248,
        background: '#13151f',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexShrink: 0,
        userSelect: 'none',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: '16px 16px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: 'rgba(108,99,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8b5cf6',
              flexShrink: 0,
            }}
          >
            <Layout size={14} />
          </div>
          <div>
            <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, margin: 0, letterSpacing: -0.2 }}>
              Blocks
            </p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, margin: 0 }}>
              {blockCount} components
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: '7px 10px',
          }}
        >
          <Search size={13} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search blocks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: 12,
              placeholder: 'rgba(255,255,255,0.3)',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                padding: 0,
                fontSize: 14,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* ── Scrollable block list ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 12px 20px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.1) transparent',
        }}
      >
        {search ? (
          /* Flat search results */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {allItems
              .filter(
                (b) =>
                  b.label.toLowerCase().includes(search.toLowerCase()) ||
                  b.desc.toLowerCase().includes(search.toLowerCase())
              )
              .map((block) => (
                <BlockCard
                  key={block.type}
                  type={block.type}
                  label={block.label}
                  icon={block.icon}
                  desc={block.desc}
                />
              ))}
            {allItems.filter(
              (b) =>
                b.label.toLowerCase().includes(search.toLowerCase()) ||
                b.desc.toLowerCase().includes(search.toLowerCase())
            ).length === 0 && (
                <div
                  style={{
                    padding: '32px 16px',
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.25)',
                    fontSize: 12,
                  }}
                >
                  No blocks match "{search}"
                </div>
              )}
          </div>
        ) : (
          /* Categorized view */
          BLOCKS_LIBRARY.map((cat) => (
            <CategorySection
              key={cat.category}
              category={cat.category}
              items={cat.items}
              searchQuery={search}
            />
          ))
        )}
      </div>

      {/* ── Bottom tip ── */}
      <div
        style={{
          padding: '10px 14px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 5,
            background: 'rgba(34,197,94,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 10 }}>💡</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, margin: 0, lineHeight: 1.5 }}>
          Drag any block onto the canvas to add it
        </p>
      </div>
    </aside>
  );
}