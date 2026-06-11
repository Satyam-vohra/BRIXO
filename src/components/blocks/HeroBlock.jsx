import React, { useEffect, useRef, useState } from 'react';

/**
 * HeroBlock — Advanced Hero Section Component
 *
 * Props:
 *  content {
 *    eyebrow         — small label above headline (e.g. "New Release")
 *    headline        — main heading (supports \n for line breaks)
 *    headlineHighlight — word/phrase to highlight in accent color
 *    subheadline     — supporting paragraph
 *    button1Text     — primary CTA label
 *    button1Href     — primary CTA href
 *    button2Text     — secondary CTA label
 *    button2Href     — secondary CTA href
 *    badge           — floating trust badge text (e.g. "Trusted by 10k+")
 *    stats           — array of { value, label } for stat row
 *    imageSrc        — hero image / illustration URL
 *    imageAlt        — alt text for image
 *    videoSrc        — autoplay background video URL (muted loop)
 *  }
 *  styles {
 *    primaryColor    — CSS color for accents & primary button
 *    secondaryColor  — CSS color for gradient end
 *    textColor       — body text color
 *    bgColor         — section background
 *    layout          — "centered" | "split-left" | "split-right"
 *    theme           — "light" | "dark"
 *    animateIn       — boolean, fade-slide on mount
 *    showParticles   — boolean, subtle floating dots
 *  }
 *  isSelected  — boolean, shows editor selection ring
 *  onClick     — click handler for block selection
 */

const DEFAULT_CONTENT = {
  eyebrow: '✦ Now with AI',
  headline: 'Build websites\nin seconds',
  headlineHighlight: 'seconds',
  subheadline:
    'Drag blocks, pick your business type, and let AI suggest the perfect colors, fonts, and layout — no code needed.',
  button1Text: 'Start building free',
  button1Href: '#',
  button2Text: 'Watch 2-min demo',
  button2Href: '#',
  badge: '⭐ 4.9 · Trusted by 12,000+ businesses',
  stats: [
    { value: '10 min', label: 'avg build time' },
    { value: '3×', label: 'more conversions' },
    { value: '₹0', label: 'to start' },
  ],
  imageSrc: null,
  imageAlt: 'Website builder preview',
};

const DEFAULT_STYLES = {
  primaryColor: '#6C63FF',
  secondaryColor: '#FF6584',
  textColor: '#0f0e17',
  bgColor: '#ffffff',
  layout: 'split-right',
  theme: 'light',
  animateIn: true,
  showParticles: true,
};

/* ─── tiny utility hooks ─────────────────────────────── */

function useMountAnimation(enabled) {
  const [visible, setVisible] = useState(!enabled);
  useEffect(() => {
    if (!enabled) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [enabled]);
  return visible;
}

/* ─── Particle canvas (subtle ambient) ──────────────── */

function Particles({ color }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const dots = Array.from({ length: 28 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.5 + 1,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      o: Math.random() * 0.35 + 0.1,
    }));

    let raf;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      dots.forEach((d) => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.floor(d.o * 255).toString(16).padStart(2, '0');
        ctx.fill();
        d.x = (d.x + d.vx + W) % W;
        d.y = (d.y + d.vy + H) % H;
      });
      raf = requestAnimationFrame(draw);
    }
    draw();

    const ro = new ResizeObserver(() => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

/* ─── Stat pill ──────────────────────────────────────── */

function StatPill({ value, label, primaryColor, textColor, delay }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        animationDelay: delay,
      }}
    >
      <span
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: primaryColor,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: 12,
          color: textColor,
          opacity: 0.55,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── Highlighted headline ───────────────────────────── */

function HighlightedHeadline({ headline, highlight, primaryColor, textColor, isDark }) {
  if (!headline) return null;
  const lines = headline.split('\n');

  return (
    <h1
      style={{
        fontSize: 'clamp(2.2rem, 5vw, 4rem)',
        fontWeight: 900,
        lineHeight: 1.05,
        letterSpacing: '-0.03em',
        color: textColor,
        margin: 0,
        marginBottom: '1.25rem',
      }}
    >
      {lines.map((line, li) => (
        <React.Fragment key={li}>
          {li > 0 && <br />}
          {highlight
            ? line.split(new RegExp(`(${highlight})`, 'i')).map((part, pi) =>
              part.toLowerCase() === highlight.toLowerCase() ? (
                <mark
                  key={pi}
                  style={{
                    background: `linear-gradient(120deg, ${primaryColor}33 0%, ${primaryColor}55 100%)`,
                    color: primaryColor,
                    borderRadius: 6,
                    padding: '0 4px',
                    fontStyle: 'italic',
                  }}
                >
                  {part}
                </mark>
              ) : (
                part
              )
            )
            : line}
        </React.Fragment>
      ))}
    </h1>
  );
}

/* ─── MockUI preview (shown when no image) ───────────── */

function MockSitePreview({ primaryColor, secondaryColor }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        maxWidth: 440,
        borderRadius: 16,
        overflow: 'hidden',
        border: '1.5px solid rgba(0,0,0,0.08)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.12)',
        background: '#fff',
        transform: 'perspective(900px) rotateY(-6deg) rotateX(2deg)',
        transformOrigin: 'right center',
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          background: '#f5f5f7',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: '1px solid rgba(0,0,0,0.07)',
        }}
      >
        {['#ff5f57', '#ffbd2e', '#28c840'].map((c) => (
          <div
            key={c}
            style={{ width: 10, height: 10, borderRadius: '50%', background: c }}
          />
        ))}
        <div
          style={{
            flex: 1,
            background: '#e8e8ed',
            borderRadius: 6,
            height: 18,
            marginLeft: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 10, color: '#888', fontFamily: 'monospace' }}>
            mybrand.site
          </span>
        </div>
      </div>
      {/* Mock navbar */}
      <div
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <div
          style={{
            width: 72,
            height: 8,
            borderRadius: 4,
            background: primaryColor,
            opacity: 0.85,
          }}
        />
        <div style={{ display: 'flex', gap: 12 }}>
          {[40, 48, 36].map((w, i) => (
            <div
              key={i}
              style={{ width: w, height: 6, borderRadius: 3, background: '#e5e5e5' }}
            />
          ))}
        </div>
        <div
          style={{
            width: 64,
            height: 24,
            borderRadius: 20,
            background: primaryColor,
            opacity: 0.9,
          }}
        />
      </div>
      {/* Mock hero mini */}
      <div
        style={{
          padding: '24px 16px',
          background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}08)`,
        }}
      >
        {[85, 65, 45].map((w, i) => (
          <div
            key={i}
            style={{
              width: `${w}%`,
              height: i === 0 ? 12 : 8,
              borderRadius: 6,
              background: i === 0 ? primaryColor : '#e5e5e5',
              opacity: i === 0 ? 0.7 : 1,
              margin: '0 auto',
              marginBottom: 10,
            }}
          />
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          <div
            style={{
              width: 80,
              height: 28,
              borderRadius: 14,
              background: primaryColor,
              opacity: 0.9,
            }}
          />
          <div
            style={{
              width: 72,
              height: 28,
              borderRadius: 14,
              border: '1.5px solid #e5e5e5',
            }}
          />
        </div>
      </div>
      {/* Mock product cards */}
      <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[primaryColor, secondaryColor, '#888'].map((c, i) => (
          <div
            key={i}
            style={{
              borderRadius: 8,
              overflow: 'hidden',
              border: '1px solid #f0f0f0',
            }}
          >
            <div style={{ height: 40, background: c, opacity: 0.15 }} />
            <div style={{ padding: '6px 8px' }}>
              <div
                style={{ width: '80%', height: 6, borderRadius: 3, background: '#e5e5e5', marginBottom: 4 }}
              />
              <div
                style={{ width: '50%', height: 6, borderRadius: 3, background: c, opacity: 0.5 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────── */

export default function HeroBlock({
  content: rawContent,
  styles: rawStyles,
  isSelected,
  onClick,
}) {
  const content = { ...DEFAULT_CONTENT, ...rawContent };
  const styles = { ...DEFAULT_STYLES, ...rawStyles };

  const {
    primaryColor,
    secondaryColor,
    textColor,
    bgColor,
    layout,
    theme,
    animateIn,
    showParticles,
  } = styles;

  const isDark = theme === 'dark';
  const resolvedBg = isDark ? '#0f0e17' : bgColor;
  const resolvedText = isDark ? '#fffffe' : textColor;

  const isCentered = layout === 'centered';
  const isSplitLeft = layout === 'split-left';

  const mounted = useMountAnimation(animateIn);

  const fadeStyle = animateIn
    ? {
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
    }
    : {};

  /* ── selection ring ── */
  const selectionStyle = isSelected
    ? {
      outline: `2px solid ${primaryColor}`,
      outlineOffset: 3,
      boxShadow: `0 0 0 5px ${primaryColor}22`,
    }
    : {};

  /* ── grid layout ── */
  const isGrid = !isCentered;
  const gridStyle = isGrid
    ? {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
      alignItems: 'center',
      gap: 48,
    }
    : {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    };

  const textOrder = isSplitLeft ? 2 : 1;
  const imageOrder = isSplitLeft ? 1 : 2;

  return (
    <section
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      aria-pressed={onClick ? isSelected : undefined}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: resolvedBg,
        borderRadius: 12,
        cursor: onClick ? 'pointer' : 'default',
        padding: isCentered ? '80px 48px' : '64px 48px',
        ...selectionStyle,
        ...fadeStyle,
      }}
    >
      {/* Gradient wash */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${primaryColor}18, transparent 70%), radial-gradient(ellipse 40% 40% at 90% 90%, ${secondaryColor}12, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Particles */}
      {showParticles && <Particles color={primaryColor} />}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, ...gridStyle }}>
        {/* ── Text column ── */}
        <div style={{ order: textOrder, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Eyebrow */}
          {content.eyebrow && (
            <div style={{ display: 'flex', justifyContent: isCentered ? 'center' : 'flex-start' }}>
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
                  background: `${primaryColor}15`,
                  border: `1px solid ${primaryColor}35`,
                  borderRadius: 20,
                  padding: '5px 12px',
                }}
              >
                {content.eyebrow}
              </span>
            </div>
          )}

          {/* Headline */}
          <HighlightedHeadline
            headline={content.headline}
            highlight={content.headlineHighlight}
            primaryColor={primaryColor}
            textColor={resolvedText}
            isDark={isDark}
          />

          {/* Subheadline */}
          {content.subheadline && (
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.7,
                color: resolvedText,
                opacity: 0.68,
                margin: 0,
                maxWidth: isCentered ? 560 : 480,
              }}
            >
              {content.subheadline}
            </p>
          )}

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              justifyContent: isCentered ? 'center' : 'flex-start',
              marginTop: 4,
            }}
          >
            {content.button1Text && (
              <a
                href={content.button1Href || '#'}
                onClick={(e) => { if (onClick) { e.preventDefault(); onClick(e); } }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '13px 28px',
                  background: primaryColor,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 15,
                  borderRadius: 28,
                  textDecoration: 'none',
                  boxShadow: `0 4px 20px ${primaryColor}55`,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 28px ${primaryColor}70`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 20px ${primaryColor}55`;
                }}
              >
                {content.button1Text}
                <span style={{ fontSize: 18, lineHeight: 1 }}>→</span>
              </a>
            )}

            {content.button2Text && (
              <a
                href={content.button2Href || '#'}
                onClick={(e) => { if (onClick) { e.preventDefault(); onClick(e); } }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '13px 28px',
                  background: 'transparent',
                  color: resolvedText,
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 28,
                  textDecoration: 'none',
                  border: `1.5px solid ${resolvedText}25`,
                  transition: 'border-color 0.15s, background 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${resolvedText}55`;
                  e.currentTarget.style.background = `${resolvedText}08`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${resolvedText}25`;
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: primaryColor,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  ▶
                </span>
                {content.button2Text}
              </a>
            )}
          </div>

          {/* Stats row */}
          {content.stats?.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: 28,
                marginTop: 12,
                paddingTop: 24,
                borderTop: `1px solid ${resolvedText}12`,
                justifyContent: isCentered ? 'center' : 'flex-start',
              }}
            >
              {content.stats.map((stat, i) => (
                <StatPill
                  key={i}
                  value={stat.value}
                  label={stat.label}
                  primaryColor={primaryColor}
                  textColor={resolvedText}
                  delay={`${i * 0.1}s`}
                />
              ))}
            </div>
          )}

          {/* Badge */}
          {content.badge && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                color: resolvedText,
                opacity: 0.55,
                marginTop: 4,
                justifyContent: isCentered ? 'center' : 'flex-start',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#22c55e',
                  flexShrink: 0,
                  boxShadow: '0 0 0 3px #22c55e33',
                }}
              />
              {content.badge}
            </div>
          )}
        </div>

        {/* ── Visual column ── */}
        {isGrid && (
          <div
            style={{
              order: imageOrder,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Glow blob behind image */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                width: '75%',
                height: '75%',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${primaryColor}30, transparent 70%)`,
                filter: 'blur(32px)',
                zIndex: 0,
              }}
            />
            <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
              {content.imageSrc ? (
                <img
                  src={content.imageSrc}
                  alt={content.imageAlt || ''}
                  style={{
                    width: '100%',
                    borderRadius: 16,
                    boxShadow: `0 24px 64px ${primaryColor}30`,
                    display: 'block',
                  }}
                />
              ) : (
                <MockSitePreview
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Background video (optional) */}
      {content.videoSrc && (
        <video
          src={content.videoSrc}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.06,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}
    </section>
  );
}