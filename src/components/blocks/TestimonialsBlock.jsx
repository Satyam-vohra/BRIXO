import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * TestimonialsBlock — Advanced Testimonials Component
 *
 * Props:
 *  content {
 *    sectionEyebrow    — label above title (e.g. "★ Customer Stories")
 *    title             — section heading
 *    subtitle          — supporting paragraph
 *    testimonials      — array of testimonial objects (see below)
 *    trustBadges       — array of { label, value } summary stats (e.g. [{value:"4.9★", label:"Avg rating"}])
 *  }
 *
 *  Testimonial object {
 *    id                — unique key
 *    quote             — full review text
 *    name              — reviewer name
 *    role              — job title / company (e.g. "Founder, Acme")
 *    avatarSrc         — image URL (optional, falls back to initials)
 *    avatarColor       — hex for initials avatar bg (optional)
 *    rating            — number 1–5
 *    platform          — "google" | "twitter" | "producthunt" | "trustpilot" (shows icon)
 *    isHighlighted     — boolean, renders as featured wide card
 *    date              — display date string (e.g. "Mar 2025")
 *  }
 *
 *  styles {
 *    primaryColor      — accent color
 *    textColor         — body text
 *    bgColor           — section background
 *    cardBg            — card background
 *    theme             — "light" | "dark"
 *    layout            — "grid" | "carousel" | "masonry" | "wall"
 *    columns           — 2 | 3 (grid columns)
 *    cardStyle         — "float" | "bordered" | "quote-accent"
 *    showRatings       — boolean
 *    showPlatform      — boolean
 *    showTrustBadges   — boolean
 *    autoPlay          — boolean (carousel auto-advances)
 *    autoPlayInterval  — ms (default 4000)
 *  }
 *
 *  isSelected  — boolean
 *  onClick     — block-select handler
 */

/* ─── defaults ──────────────────────────────────── */

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    quote: "Launched our entire brand site in under an hour. The AI color suggestions matched our vibe instantly — I was genuinely shocked.",
    name: 'Priya Sharma',
    role: 'Founder, Zestify',
    avatarColor: '#6C63FF',
    rating: 5,
    platform: 'producthunt',
    isHighlighted: true,
    date: 'Apr 2025',
  },
  {
    id: 2,
    quote: "Finally a builder that doesn't feel like a toy. The drag-and-drop is smooth and the mobile preview saved us from a disaster.",
    name: 'Rahul Mehra',
    role: 'Product Lead, Shopnest',
    avatarColor: '#FF6584',
    rating: 5,
    platform: 'google',
    date: 'Mar 2025',
  },
  {
    id: 3,
    quote: "Our conversion rate jumped 3× after switching to a site built with this. The block system just makes sense.",
    name: 'Ananya Joshi',
    role: 'CMO, GrowFast',
    avatarColor: '#22c55e',
    rating: 5,
    platform: 'twitter',
    date: 'Feb 2025',
  },
  {
    id: 4,
    quote: "I've tried Wix, Webflow, Squarespace. This is the first one where I didn't need a YouTube tutorial to figure things out.",
    name: 'Dev Kapoor',
    role: 'Freelancer',
    avatarColor: '#f59e0b',
    rating: 4,
    platform: 'trustpilot',
    date: 'Jan 2025',
  },
];

const DEFAULT_CONTENT = {
  sectionEyebrow: '★ Real stories',
  title: 'Builders love it',
  subtitle: "Over 12,000 businesses launched their site with us. Here's what they're saying.",
  testimonials: DEFAULT_TESTIMONIALS,
  trustBadges: [
    { value: '4.9 / 5', label: 'Average rating' },
    { value: '12,000+', label: 'Sites published' },
    { value: '98%', label: 'Would recommend' },
  ],
};

const DEFAULT_STYLES = {
  primaryColor: '#6C63FF',
  textColor: '#0f0e17',
  bgColor: '#f8f8ff',
  cardBg: '#ffffff',
  theme: 'light',
  layout: 'grid',
  columns: 2,
  cardStyle: 'float',
  showRatings: true,
  showPlatform: true,
  showTrustBadges: true,
  autoPlay: true,
  autoPlayInterval: 4500,
};

/* ─── Platform icons (inline SVG paths) ─────────── */

const PLATFORM_META = {
  google: { label: 'Google', color: '#4285F4', icon: 'G' },
  twitter: { label: 'X / Twitter', color: '#000', icon: '𝕏' },
  producthunt: { label: 'Product Hunt', color: '#DA552F', icon: '🔥' },
  trustpilot: { label: 'Trustpilot', color: '#00b67a', icon: '✓' },
};

function PlatformBadge({ platform, textColor }) {
  const meta = PLATFORM_META[platform];
  if (!meta) return null;
  return (
    <span
      title={meta.label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        fontWeight: 700,
        color: meta.color,
        background: `${meta.color}12`,
        borderRadius: 20,
        padding: '3px 8px',
        letterSpacing: '0.02em',
      }}
    >
      <span style={{ fontSize: 13 }}>{meta.icon}</span>
      {meta.label}
    </span>
  );
}

/* ─── Star Row ──────────────────────────────────── */

function Stars({ rating, primaryColor }) {
  return (
    <div style={{ display: 'flex', gap: 2 }} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          style={{ fontSize: 13, color: i < rating ? '#f59e0b' : '#e5e7eb' }}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

/* ─── Avatar ────────────────────────────────────── */

function Avatar({ name, avatarSrc, avatarColor, primaryColor, size = 44 }) {
  const initials = name
    ? name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  const bg = avatarColor || primaryColor;

  if (avatarSrc) {
    return (
      <img
        src={avatarSrc}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
          border: `2px solid ${bg}30`,
        }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `${bg}22`,
        border: `2px solid ${bg}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: size * 0.36,
        color: bg,
        flexShrink: 0,
        letterSpacing: '-0.02em',
      }}
    >
      {initials}
    </div>
  );
}

/* ─── Single card ───────────────────────────────── */

function TestimonialCard({ t, styles, isFeatured }) {
  const { primaryColor, textColor, cardBg, cardStyle, showRatings, showPlatform } = styles;
  const [hovered, setHovered] = useState(false);

  const cardShadow = {
    float: hovered ? '0 16px 48px rgba(0,0,0,0.12)' : '0 2px 16px rgba(0,0,0,0.07)',
    bordered: 'none',
    'quote-accent': '0 2px 12px rgba(0,0,0,0.06)',
  }[cardStyle] || '0 2px 16px rgba(0,0,0,0.07)';

  const cardBorder = {
    float: '1px solid rgba(0,0,0,0.07)',
    bordered: `1.5px solid ${hovered ? primaryColor + '55' : textColor + '13'}`,
    'quote-accent': 'none',
  }[cardStyle] || '1px solid rgba(0,0,0,0.07)';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: cardBg,
        borderRadius: 20,
        padding: isFeatured ? '28px 28px 24px' : '22px 22px 20px',
        border: cardBorder,
        boxShadow: cardShadow,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        gridColumn: isFeatured ? 'span 2' : 'span 1',
      }}
    >
      {/* quote-accent left bar */}
      {cardStyle === 'quote-accent' && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0, top: 20, bottom: 20,
            width: 4,
            borderRadius: 4,
            background: t.avatarColor || primaryColor,
          }}
        />
      )}

      {/* Top row: stars + platform */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        {showRatings && t.rating && <Stars rating={t.rating} primaryColor={primaryColor} />}
        {showPlatform && t.platform && <PlatformBadge platform={t.platform} textColor={textColor} />}
      </div>

      {/* Giant quote mark */}
      <div
        aria-hidden="true"
        style={{
          fontSize: 56,
          lineHeight: 0.6,
          color: primaryColor,
          opacity: 0.15,
          fontFamily: 'Georgia, serif',
          userSelect: 'none',
          marginBottom: -6,
        }}
      >
        "
      </div>

      {/* Quote */}
      <p
        style={{
          fontSize: isFeatured ? 16 : 14,
          lineHeight: 1.75,
          color: textColor,
          opacity: 0.82,
          margin: 0,
          fontStyle: 'italic',
          flex: 1,
        }}
      >
        {t.quote}
      </p>

      {/* Footer: avatar + name + date */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingTop: 10, borderTop: `1px solid ${textColor}10` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={t.name} avatarSrc={t.avatarSrc} avatarColor={t.avatarColor} primaryColor={primaryColor} size={38} />
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: textColor, letterSpacing: '-0.01em' }}>{t.name}</p>
            {t.role && <p style={{ margin: 0, fontSize: 11, color: textColor, opacity: 0.5, fontWeight: 500 }}>{t.role}</p>}
          </div>
        </div>
        {t.date && <span style={{ fontSize: 11, color: textColor, opacity: 0.35, fontWeight: 500, flexShrink: 0 }}>{t.date}</span>}
      </div>
    </div>
  );
}

/* ─── Carousel layout ──────────────────────────── */

function Carousel({ testimonials, styles, autoPlay, interval }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);
  const count = testimonials.length;

  const go = useCallback((dir) => {
    setIdx((prev) => (prev + dir + count) % count);
  }, [count]);

  useEffect(() => {
    if (!autoPlay) return;
    timerRef.current = setInterval(() => go(1), interval);
    return () => clearInterval(timerRef.current);
  }, [autoPlay, interval, go]);

  const t = testimonials[idx];

  return (
    <div style={{ position: 'relative', maxWidth: 620, margin: '0 auto' }}>
      {/* Card */}
      <div style={{ transition: 'opacity 0.3s', opacity: 1 }}>
        <TestimonialCard t={t} styles={styles} isFeatured={false} />
      </div>

      {/* Nav arrows */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 24 }}>
        <button
          onClick={() => go(-1)}
          aria-label="Previous testimonial"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            border: `1.5px solid ${styles.textColor}20`,
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: styles.textColor,
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = styles.primaryColor}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = `${styles.textColor}20`}
        >
          ←
        </button>

        {/* Dots */}
        <div style={{ display: 'flex', gap: 7 }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              style={{
                width: i === idx ? 20 : 7,
                height: 7,
                borderRadius: 99,
                border: 'none',
                background: i === idx ? styles.primaryColor : `${styles.textColor}20`,
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.25s, background 0.2s',
              }}
            />
          ))}
        </div>

        <button
          onClick={() => go(1)}
          aria-label="Next testimonial"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            border: `1.5px solid ${styles.textColor}20`,
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: styles.textColor,
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = styles.primaryColor}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = `${styles.textColor}20`}
        >
          →
        </button>
      </div>
    </div>
  );
}

/* ─── Wall layout (staggered column heights) ───── */

function WallLayout({ testimonials, styles }) {
  const half = Math.ceil(testimonials.length / 2);
  const col1 = testimonials.slice(0, half);
  const col2 = testimonials.slice(half);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 900, margin: '0 auto', alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {col1.map((t) => <TestimonialCard key={t.id} t={t} styles={styles} isFeatured={false} />)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 40 }}>
        {col2.map((t) => <TestimonialCard key={t.id} t={t} styles={styles} isFeatured={false} />)}
      </div>
    </div>
  );
}

/* ─── Trust badges row ──────────────────────────── */

function TrustBadges({ badges, primaryColor, textColor }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 0,
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: 48,
        border: `1px solid ${textColor}10`,
        borderRadius: 16,
        overflow: 'hidden',
        maxWidth: 600,
        margin: '0 auto 52px',
      }}
    >
      {badges.map((b, i) => (
        <div
          key={i}
          style={{
            flex: '1 1 0',
            minWidth: 100,
            padding: '18px 20px',
            textAlign: 'center',
            borderRight: i < badges.length - 1 ? `1px solid ${textColor}10` : 'none',
          }}
        >
          <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: primaryColor, letterSpacing: '-0.02em' }}>{b.value}</p>
          <p style={{ margin: '3px 0 0', fontSize: 11, fontWeight: 600, color: textColor, opacity: 0.45, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{b.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── MAIN COMPONENT ──────────────────────────────── */

export default function TestimonialsBlock({
  content: rawContent,
  styles: rawStyles,
  isSelected,
  onClick,
}) {
  const content = { ...DEFAULT_CONTENT, ...rawContent };
  const styles = { ...DEFAULT_STYLES, ...rawStyles };

  const { primaryColor, textColor, bgColor, theme, layout, columns, showTrustBadges, autoPlay, autoPlayInterval } = styles;

  const isDark = theme === 'dark';
  const resolvedBg = isDark ? '#0f0e17' : bgColor;
  const resolvedText = isDark ? '#fffffe' : textColor;
  const resolvedCardBg = isDark ? '#1a1a2e' : styles.cardBg;

  const testimonials = content.testimonials || DEFAULT_TESTIMONIALS;
  const resolvedStyles = { ...styles, textColor: resolvedText, cardBg: resolvedCardBg };

  const selectionStyle = isSelected
    ? { outline: `2px solid ${primaryColor}`, outlineOffset: 3, boxShadow: `0 0 0 5px ${primaryColor}22` }
    : {};

  return (
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
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 44 }}>
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
            marginBottom: content.subtitle ? 12 : 0,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          {content.title}
        </h2>
        {content.subtitle && (
          <p style={{ fontSize: 16, color: resolvedText, opacity: 0.58, margin: '0 auto', maxWidth: 520, lineHeight: 1.7 }}>
            {content.subtitle}
          </p>
        )}
      </div>

      {/* Trust badges */}
      {showTrustBadges && content.trustBadges?.length > 0 && (
        <TrustBadges badges={content.trustBadges} primaryColor={primaryColor} textColor={resolvedText} />
      )}

      {/* Layout switch */}
      {layout === 'carousel' && (
        <Carousel
          testimonials={testimonials}
          styles={resolvedStyles}
          autoPlay={autoPlay}
          interval={autoPlayInterval}
        />
      )}

      {layout === 'wall' && <WallLayout testimonials={testimonials} styles={resolvedStyles} />}

      {(layout === 'grid' || layout === 'masonry') && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(columns, 2)}, minmax(0, 1fr))`,
            gap: 22,
            maxWidth: 960,
            margin: '0 auto',
            alignItems: 'start',
          }}
        >
          {testimonials.map((t) => (
            <TestimonialCard
              key={t.id}
              t={t}
              styles={resolvedStyles}
              isFeatured={t.isHighlighted && layout === 'grid'}
            />
          ))}
        </div>
      )}
    </section>
  );
}