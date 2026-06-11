import React, { useState } from 'react';

/**
 * ProductsBlock — Advanced Products Grid Component
 *
 * Props:
 *  content {
 *    sectionEyebrow    — small label above title (e.g. "Our Collection")
 *    title             — section heading
 *    subtitle          — supporting paragraph below heading
 *    products          — array of product objects (see below)
 *    ctaText           — grid-level CTA below cards (e.g. "View all products")
 *    ctaHref           — link for grid-level CTA
 *  }
 *
 *  Product object {
 *    id                — unique key
 *    name              — product name
 *    description       — short description (1–2 lines)
 *    price             — display price string (e.g. "₹999")
 *    originalPrice     — strike-through price for discount display
 *    badge             — card badge text (e.g. "Best Seller", "New", "Sale")
 *    badgeColor        — "primary" | "green" | "amber" | "red" (default "primary")
 *    imageSrc          — product image URL
 *    imageAlt          — alt text
 *    category          — filter category string
 *    rating            — number 0–5
 *    reviewCount       — number
 *    isFeatured        — boolean, renders larger "hero" card
 *    ctaLabel          — per-card button text (overrides global)
 *    tags              — array of tag strings (e.g. ["Vegan", "New"])
 *  }
 *
 *  styles {
 *    primaryColor      — accent color
 *    textColor         — body text
 *    bgColor           — section background
 *    cardBg            — card background (default white)
 *    theme             — "light" | "dark"
 *    layout            — "grid" | "list" | "masonry"
 *    columns           — 2 | 3 | 4 (grid columns on desktop)
 *    cardStyle         — "bordered" | "elevated" | "flat"
 *    imageStyle        — "cover" | "contain" | "placeholder"
 *    showRatings       — boolean
 *    showFilters       — boolean
 *    showQuickView     — boolean
 *    ctaStyle          — "pill" | "rounded" | "sharp"
 *    animateCards      — boolean (stagger fade-in on mount)
 *  }
 *
 *  isSelected  — boolean
 *  onClick     — block-select handler
 */

/* ─── defaults ──────────────────────────────────── */

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'Starter Pack',
    description: 'Everything you need to get your first site live in under 10 minutes.',
    price: '₹999',
    originalPrice: '₹1,499',
    badge: 'Best Seller',
    badgeColor: 'primary',
    category: 'Starter',
    rating: 4.8,
    reviewCount: 312,
    isFeatured: false,
    tags: ['Popular'],
  },
  {
    id: 2,
    name: 'Professional Suite',
    description: 'Advanced blocks, AI suggestions, custom domain & priority support.',
    price: '₹2,499',
    badge: 'Most Popular',
    badgeColor: 'green',
    category: 'Pro',
    rating: 4.9,
    reviewCount: 541,
    isFeatured: true,
    tags: ['AI', 'Recommended'],
  },
  {
    id: 3,
    name: 'Enterprise Hub',
    description: 'Unlimited sites, team seats, white-label exports and SLA support.',
    price: '₹7,999',
    badge: 'New',
    badgeColor: 'amber',
    category: 'Enterprise',
    rating: 4.7,
    reviewCount: 88,
    isFeatured: false,
    tags: ['Teams'],
  },
];

const DEFAULT_CONTENT = {
  sectionEyebrow: '✦ Our Plans',
  title: 'Find the right fit',
  subtitle: 'From solo builders to growing teams — pick a plan and go live today.',
  products: DEFAULT_PRODUCTS,
  ctaText: 'Compare all features',
  ctaHref: '#',
};

const DEFAULT_STYLES = {
  primaryColor: '#6C63FF',
  textColor: '#0f0e17',
  bgColor: '#f8f8ff',
  cardBg: '#ffffff',
  theme: 'light',
  layout: 'grid',
  columns: 3,
  cardStyle: 'elevated',
  imageStyle: 'placeholder',
  showRatings: true,
  showFilters: true,
  showQuickView: true,
  ctaStyle: 'pill',
  animateCards: true,
};

/* ─── helpers ───────────────────────────────────── */

const BADGE_COLORS = {
  primary: { bg: null, text: '#fff' },        // filled with primaryColor
  green: { bg: '#22c55e', text: '#fff' },
  amber: { bg: '#f59e0b', text: '#fff' },
  red: { bg: '#ef4444', text: '#fff' },
};

function StarRating({ rating, reviewCount, primaryColor, textColor }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ display: 'flex', gap: 1 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            style={{
              fontSize: 13,
              color: i < full || (i === full && half) ? '#f59e0b' : `${textColor}20`,
            }}
          >
            {i === full && half ? '½' : '★'}
          </span>
        ))}
      </div>
      <span style={{ fontSize: 12, color: textColor, opacity: 0.5, fontWeight: 500 }}>
        {rating.toFixed(1)} ({reviewCount.toLocaleString()})
      </span>
    </div>
  );
}

function Badge({ text, color, primaryColor }) {
  const cfg = BADGE_COLORS[color] || BADGE_COLORS.primary;
  const bg = cfg.bg || primaryColor;
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        background: bg,
        color: cfg.text,
        borderRadius: 20,
        padding: '3px 9px',
        lineHeight: 1.5,
      }}
    >
      {text}
    </span>
  );
}

function ProductImage({ imageSrc, imageAlt, imageStyle, primaryColor, isFeatured }) {
  const height = isFeatured ? 200 : 160;
  if (imageSrc && imageStyle !== 'placeholder') {
    return (
      <div
        style={{
          width: '100%',
          height,
          borderRadius: 12,
          overflow: 'hidden',
          background: `${primaryColor}10`,
          marginBottom: 16,
          flexShrink: 0,
        }}
      >
        <img
          src={imageSrc}
          alt={imageAlt || ''}
          style={{
            width: '100%',
            height: '100%',
            objectFit: imageStyle === 'contain' ? 'contain' : 'cover',
            display: 'block',
          }}
        />
      </div>
    );
  }

  // Illustrated placeholder
  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        height,
        borderRadius: 12,
        background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}07)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* decorative circles */}
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `${primaryColor}12` }} />
      <div style={{ position: 'absolute', bottom: -10, left: -10, width: 50, height: 50, borderRadius: '50%', background: `${primaryColor}10` }} />
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: `${primaryColor}22`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          position: 'relative',
          zIndex: 1,
        }}
      >
        📦
      </div>
    </div>
  );
}

/* ─── Product Card ───────────────────────────────── */

function ProductCard({ product, styles, onQuickView, animDelay }) {
  const { primaryColor, textColor, cardBg, cardStyle, imageStyle, showRatings, showQuickView, ctaStyle } = styles;
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const shadow = {
    bordered: 'none',
    elevated: hovered ? '0 12px 40px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.06)',
    flat: 'none',
  }[cardStyle] || 'none';

  const border = {
    bordered: `1.5px solid ${hovered ? primaryColor + '55' : textColor + '12'}`,
    elevated: '1px solid rgba(0,0,0,0.06)',
    flat: 'none',
  }[cardStyle] || '1px solid rgba(0,0,0,0.06)';

  const ctaRadius = { pill: 999, rounded: 10, sharp: 4 }[ctaStyle] || 10;

  const discount = product.originalPrice
    ? Math.round((1 - parseFloat(product.price.replace(/[^\d.]/g, '')) / parseFloat(product.originalPrice.replace(/[^\d.]/g, ''))) * 100)
    : null;

  function handleAdd(e) {
    e.stopPropagation();
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: cardBg,
        borderRadius: 16,
        border,
        boxShadow: shadow,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        animationDelay: animDelay,
        overflow: 'hidden',
      }}
    >
      {/* Featured glow accent */}
      {product.isFeatured && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}88)`,
            borderRadius: '16px 16px 0 0',
          }}
        />
      )}

      {/* Top row: badge + quick-view */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 8 }}>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {product.badge && <Badge text={product.badge} color={product.badgeColor} primaryColor={primaryColor} />}
          {discount && <Badge text={`-${discount}%`} color="red" primaryColor={primaryColor} />}
        </div>
        {showQuickView && (
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView && onQuickView(product); }}
            title="Quick view"
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: `1px solid ${textColor}15`,
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.15s',
              flexShrink: 0,
            }}
            aria-label={`Quick view ${product.name}`}
          >
            👁
          </button>
        )}
      </div>

      {/* Image */}
      <ProductImage
        imageSrc={product.imageSrc}
        imageAlt={product.imageAlt || product.name}
        imageStyle={imageStyle}
        primaryColor={primaryColor}
        isFeatured={product.isFeatured}
      />

      {/* Tags */}
      {product.tags?.length > 0 && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
          {product.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: primaryColor,
                background: `${primaryColor}12`,
                borderRadius: 20,
                padding: '2px 8px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Name */}
      <h3
        style={{
          fontSize: product.isFeatured ? 18 : 15,
          fontWeight: 700,
          color: textColor,
          margin: 0,
          marginBottom: 6,
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
        }}
      >
        {product.name}
      </h3>

      {/* Description */}
      {product.description && (
        <p
          style={{
            fontSize: 13,
            color: textColor,
            opacity: 0.58,
            margin: 0,
            marginBottom: 10,
            lineHeight: 1.6,
            flex: 1,
          }}
        >
          {product.description}
        </p>
      )}

      {/* Rating */}
      {showRatings && product.rating && (
        <div style={{ marginBottom: 12 }}>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} primaryColor={primaryColor} textColor={textColor} />
        </div>
      )}

      {/* Price row */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: primaryColor, letterSpacing: '-0.02em' }}>
          {product.price}
        </span>
        {product.originalPrice && (
          <span style={{ fontSize: 13, color: textColor, opacity: 0.4, textDecoration: 'line-through' }}>
            {product.originalPrice}
          </span>
        )}
      </div>

      {/* CTA Button */}
      <button
        onClick={handleAdd}
        style={{
          width: '100%',
          padding: '11px 16px',
          background: added ? '#22c55e' : primaryColor,
          color: '#fff',
          fontWeight: 700,
          fontSize: 13,
          borderRadius: ctaRadius,
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.2s, transform 0.1s',
          transform: added ? 'scale(0.98)' : 'scale(1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        {added ? '✓ Added to cart' : (product.ctaLabel || 'Add to Cart')}
      </button>
    </div>
  );
}

/* ─── Quick View Modal ───────────────────────────── */

function QuickViewModal({ product, styles, onClose }) {
  const { primaryColor, textColor, cardBg } = styles;
  if (!product) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: cardBg,
          borderRadius: 20,
          padding: 28,
          width: '100%',
          maxWidth: 460,
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 14, right: 14,
            width: 30, height: 30,
            borderRadius: 8,
            border: `1px solid ${textColor}15`,
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 16,
            color: textColor,
          }}
        >
          ✕
        </button>
        <ProductImage imageSrc={product.imageSrc} imageAlt={product.name} imageStyle="placeholder" primaryColor={primaryColor} isFeatured />
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          {product.badge && <Badge text={product.badge} color={product.badgeColor} primaryColor={primaryColor} />}
          {product.tags?.map(t => (
            <span key={t} style={{ fontSize: 10, fontWeight: 600, color: primaryColor, background: `${primaryColor}12`, borderRadius: 20, padding: '2px 8px' }}>{t}</span>
          ))}
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: textColor, margin: '0 0 8px', letterSpacing: '-0.02em' }}>{product.name}</h3>
        <p style={{ fontSize: 14, color: textColor, opacity: 0.6, margin: '0 0 14px', lineHeight: 1.6 }}>{product.description}</p>
        {product.rating && <div style={{ marginBottom: 14 }}><StarRating rating={product.rating} reviewCount={product.reviewCount} primaryColor={primaryColor} textColor={textColor} /></div>}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 18 }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: primaryColor }}>{product.price}</span>
          {product.originalPrice && <span style={{ fontSize: 14, color: textColor, opacity: 0.4, textDecoration: 'line-through' }}>{product.originalPrice}</span>}
        </div>
        <button
          style={{ width: '100%', padding: 13, background: primaryColor, color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 12, border: 'none', cursor: 'pointer' }}
          onClick={onClose}
        >
          {product.ctaLabel || 'Add to Cart'} →
        </button>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ──────────────────────────────── */

export default function ProductsBlock({
  content: rawContent,
  styles: rawStyles,
  isSelected,
  onClick,
}) {
  const content = { ...DEFAULT_CONTENT, ...rawContent };
  const styles = { ...DEFAULT_STYLES, ...rawStyles };

  const {
    primaryColor, textColor, bgColor,
    theme, layout, columns, showFilters, animateCards,
  } = styles;

  const isDark = theme === 'dark';
  const resolvedBg = isDark ? '#0f0e17' : bgColor;
  const resolvedText = isDark ? '#fffffe' : textColor;

  const products = content.products || DEFAULT_PRODUCTS;

  /* category filters */
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];
  const [activeFilter, setActiveFilter] = useState('All');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const filtered = activeFilter === 'All' ? products : products.filter((p) => p.category === activeFilter);

  const cols = Math.min(Math.max(columns, 2), 4);
  const gridCols = layout === 'list' ? 1 : `repeat(${cols}, minmax(0, 1fr))`;

  const selectionStyle = isSelected
    ? { outline: `2px solid ${primaryColor}`, outlineOffset: 3, boxShadow: `0 0 0 5px ${primaryColor}22` }
    : {};

  const stylesWithResolvedText = { ...styles, textColor: resolvedText };

  return (
    <>
      <section
        onClick={onClick}
        style={{
          padding: '72px 48px',
          background: resolvedBg,
          borderRadius: 12,
          cursor: onClick ? 'pointer' : 'default',
          ...selectionStyle,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48, maxWidth: 640, margin: '0 auto 48px' }}>
          {content.sectionEyebrow && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: primaryColor,
                background: `${primaryColor}12`,
                border: `1px solid ${primaryColor}30`,
                borderRadius: 20,
                padding: '5px 12px',
                marginBottom: 16,
              }}
            >
              {content.sectionEyebrow}
            </span>
          )}
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 900,
              color: resolvedText,
              margin: 0,
              marginBottom: content.subtitle ? 14 : 0,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            {content.title}
          </h2>
          {content.subtitle && (
            <p style={{ fontSize: 16, color: resolvedText, opacity: 0.6, margin: 0, lineHeight: 1.7 }}>
              {content.subtitle}
            </p>
          )}
        </div>

        {/* Category filters */}
        {showFilters && categories.length > 1 && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: 36,
            }}
            role="group"
            aria-label="Filter by category"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={(e) => { e.stopPropagation(); setActiveFilter(cat); }}
                style={{
                  padding: '7px 18px',
                  borderRadius: 999,
                  border: `1.5px solid ${activeFilter === cat ? primaryColor : resolvedText + '15'}`,
                  background: activeFilter === cat ? primaryColor : 'transparent',
                  color: activeFilter === cat ? '#fff' : resolvedText,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  opacity: activeFilter === cat ? 1 : 0.7,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Product grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: gridCols,
            gap: layout === 'list' ? 16 : 24,
            maxWidth: 1100,
            margin: '0 auto',
          }}
        >
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id || i}
              product={product}
              styles={stylesWithResolvedText}
              onQuickView={setQuickViewProduct}
              animDelay={animateCards ? `${i * 0.07}s` : '0s'}
            />
          ))}
        </div>

        {/* Grid-level CTA */}
        {content.ctaText && (
          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <a
              href={content.ctaHref || '#'}
              onClick={(e) => e.preventDefault()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 28px',
                borderRadius: 999,
                border: `1.5px solid ${primaryColor}40`,
                color: primaryColor,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: 'none',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = `${primaryColor}0f`; e.currentTarget.style.borderColor = primaryColor; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = `${primaryColor}40`; }}
            >
              {content.ctaText}
              <span>→</span>
            </a>
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          styles={stylesWithResolvedText}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}