import React, { useState, useEffect, useRef } from 'react';

/**
 * NavbarBlock — Advanced Navbar Component
 *
 * Props:
 *  content {
 *    logoText         — brand name or text logo
 *    logoIcon         — emoji or character shown before logoText
 *    links            — array of { label, href, isNew? } (up to 6)
 *    ctaButtonText    — primary CTA label
 *    ctaButtonHref    — primary CTA href
 *    secondaryCtaText — optional ghost button label (e.g. "Sign In")
 *    announcementText — optional top banner text (e.g. "🎉 Launch sale — 40% off")
 *    announcementHref — link for announcement banner
 *  }
 *  styles {
 *    primaryColor     — brand accent (buttons, logo, hover)
 *    textColor        — nav link color
 *    bgColor          — navbar background
 *    theme            — "light" | "dark" | "glass"
 *    sticky           — boolean, sticks on scroll
 *    scrollShrink     — boolean, shrinks padding on scroll
 *    showShadowOnScroll — boolean
 *    borderBottom     — boolean
 *    logoStyle        — "text" | "badge" | "wordmark"
 *    ctaStyle         — "pill" | "rounded" | "sharp"
 *  }
 *  isSelected  — boolean, editor selection ring
 *  onClick     — block-select handler
 */

const DEFAULT_CONTENT = {
  logoText: 'BRIXO',
  logoIcon: '⬡',
  links: [
    { label: 'Home', href: '#' },
    { label: 'Services', href: '#' },
    { label: 'Pricing', href: '#', isNew: true },
    { label: 'About', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  ctaButtonText: 'Get Started',
  ctaButtonHref: '#',
  secondaryCtaText: 'Sign In',
  announcementText: '🎉 Limited launch offer — 40% off all plans this week',
  announcementHref: '#',
};

const DEFAULT_STYLES = {
  primaryColor: '#6C63FF',
  textColor: '#0f0e17',
  bgColor: '#ffffff',
  theme: 'light',
  sticky: true,
  scrollShrink: true,
  showShadowOnScroll: true,
  borderBottom: true,
  logoStyle: 'badge',
  ctaStyle: 'pill',
};

/* ─── Logo variants ────────────────────────────────────── */

function Logo({ logoText, logoIcon, logoStyle, primaryColor, textColor }) {
  if (logoStyle === 'badge') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: primaryColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          {logoIcon || '⬡'}
        </div>
        <span style={{ fontWeight: 800, fontSize: 17, color: textColor, letterSpacing: '-0.02em' }}>
          {logoText}
        </span>
      </div>
    );
  }

  if (logoStyle === 'wordmark') {
    return (
      <span
        style={{
          fontWeight: 900,
          fontSize: 20,
          letterSpacing: '-0.04em',
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}99)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {logoText}
      </span>
    );
  }

  // default "text"
  return (
    <span style={{ fontWeight: 800, fontSize: 18, color: primaryColor, letterSpacing: '-0.02em' }}>
      {logoText}
    </span>
  );
}

/* ─── CTA button ────────────────────────────────────────── */

function CtaButton({ text, href, primaryColor, ctaStyle, onClick }) {
  const radius = ctaStyle === 'pill' ? 999 : ctaStyle === 'rounded' ? 10 : 4;
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href || '#'}
      onClick={(e) => { e.preventDefault(); onClick && onClick(e); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '9px 20px',
        background: hovered ? primaryColor : primaryColor,
        color: '#fff',
        fontWeight: 700,
        fontSize: 13,
        borderRadius: radius,
        textDecoration: 'none',
        boxShadow: hovered ? `0 6px 20px ${primaryColor}55` : `0 2px 8px ${primaryColor}30`,
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'transform 0.15s, box-shadow 0.15s',
        whiteSpace: 'nowrap',
        filter: hovered ? 'brightness(1.08)' : 'none',
      }}
    >
      {text}
      <span style={{ fontSize: 14 }}>→</span>
    </a>
  );
}

/* ─── Mobile drawer ─────────────────────────────────────── */

function MobileDrawer({ open, links, ctaButtonText, ctaButtonHref, secondaryCtaText, primaryColor, textColor, bgColor, onClose }) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 998,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          transition: 'opacity 0.2s',
        }}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 280,
          background: bgColor,
          zIndex: 999,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s cubic-bezier(.4,0,.2,1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '1px solid rgba(0,0,0,0.1)',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              color: textColor,
            }}
          >
            ✕
          </button>
        </div>
        <nav style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={(e) => { e.preventDefault(); onClose(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 10,
                textDecoration: 'none',
                color: textColor,
                fontWeight: 600,
                fontSize: 15,
                transition: 'background 0.12s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = `${primaryColor}10`}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {link.label}
              {link.isNew && (
                <span style={{ fontSize: 10, fontWeight: 700, background: primaryColor, color: '#fff', borderRadius: 20, padding: '2px 7px' }}>
                  NEW
                </span>
              )}
            </a>
          ))}
        </nav>
        <div style={{ padding: '20px', borderTop: '1px solid rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {secondaryCtaText && (
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                textAlign: 'center',
                padding: '11px',
                borderRadius: 10,
                border: `1.5px solid ${primaryColor}35`,
                color: primaryColor,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: 'none',
              }}
            >
              {secondaryCtaText}
            </a>
          )}
          <a
            href={ctaButtonHref || '#'}
            onClick={(e) => e.preventDefault()}
            style={{
              textAlign: 'center',
              padding: '12px',
              borderRadius: 10,
              background: primaryColor,
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            {ctaButtonText} →
          </a>
        </div>
      </div>
    </>
  );
}

/* ─── Hamburger icon ─────────────────────────────────────── */

function HamburgerIcon({ open, color }) {
  const barStyle = (deg, y) => ({
    display: 'block',
    width: 20,
    height: 2,
    background: color,
    borderRadius: 2,
    transformOrigin: 'center',
    transition: 'transform 0.2s, opacity 0.2s',
    transform: open
      ? deg !== 0
        ? `translateY(${y}px) rotate(${deg}deg)`
        : 'scaleX(0)'
      : 'none',
    opacity: open && deg === 0 ? 0 : 1,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }} aria-hidden="true">
      <span style={barStyle(45, 7)} />
      <span style={barStyle(0, 0)} />
      <span style={barStyle(-45, -7)} />
    </div>
  );
}

/* ─── MAIN COMPONENT ──────────────────────────────────────── */

export default function NavbarBlock({
  content: rawContent,
  styles: rawStyles,
  isSelected,
  onClick,
}) {
  const content = { ...DEFAULT_CONTENT, ...rawContent };
  const styles = { ...DEFAULT_STYLES, ...rawStyles };

  const {
    primaryColor, textColor, bgColor,
    theme, sticky, scrollShrink, showShadowOnScroll,
    borderBottom, logoStyle, ctaStyle,
  } = styles;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);

  /* Resolve theme colors */
  const isDark = theme === 'dark';
  const isGlass = theme === 'glass';
  const resolvedBg = isDark ? '#0f0e17' : isGlass ? 'rgba(255,255,255,0.75)' : bgColor;
  const resolvedText = isDark ? '#fffffe' : textColor;

  /* Scroll listener */
  useEffect(() => {
    if (!sticky && !scrollShrink && !showShadowOnScroll) return;
    const el = navRef.current?.closest('[data-scroll-root]') || window;
    const handler = () => {
      const y = el === window ? window.scrollY : el.scrollTop;
      setScrolled(y > 12);
    };
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, [sticky, scrollShrink, showShadowOnScroll]);

  const selectionStyle = isSelected
    ? { outline: `2px solid ${primaryColor}`, outlineOffset: 3, boxShadow: `0 0 0 5px ${primaryColor}22` }
    : {};

  const navPadding = scrollShrink && scrolled ? '10px 32px' : '14px 32px';

  return (
    <div
      ref={navRef}
      onClick={onClick}
      style={{
        position: sticky ? 'sticky' : 'relative',
        top: 0,
        zIndex: 100,
        borderRadius: 12,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        ...selectionStyle,
      }}
    >
      {/* ── Announcement Banner ── */}
      {content.announcementText && (
        <a
          href={content.announcementHref || '#'}
          onClick={(e) => e.preventDefault()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '8px 16px',
            background: primaryColor,
            color: '#fff',
            fontSize: 12,
            fontWeight: 600,
            textDecoration: 'none',
            letterSpacing: '0.01em',
            textAlign: 'center',
          }}
        >
          {content.announcementText}
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 20,
              padding: '2px 8px',
              flexShrink: 0,
            }}
          >
            Learn more →
          </span>
        </a>
      )}

      {/* ── Main Nav ── */}
      <nav
        style={{
          background: isGlass ? resolvedBg : resolvedBg,
          backdropFilter: isGlass ? 'blur(16px) saturate(180%)' : 'none',
          WebkitBackdropFilter: isGlass ? 'blur(16px) saturate(180%)' : 'none',
          borderBottom: borderBottom ? `1px solid ${resolvedText}10` : 'none',
          boxShadow: showShadowOnScroll && scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
          padding: navPadding,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          transition: 'padding 0.25s, box-shadow 0.25s',
        }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a href="#" onClick={(e) => e.preventDefault()} style={{ textDecoration: 'none', flexShrink: 0 }}>
          <Logo
            logoText={content.logoText}
            logoIcon={content.logoIcon}
            logoStyle={logoStyle}
            primaryColor={primaryColor}
            textColor={resolvedText}
          />
        </a>

        {/* Desktop links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {(content.links || []).map((link, i) => (
            <NavLink key={i} link={link} primaryColor={primaryColor} textColor={resolvedText} />
          ))}
        </div>

        {/* Right side CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {content.secondaryCtaText && (
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                padding: '9px 16px',
                color: resolvedText,
                fontWeight: 600,
                fontSize: 13,
                textDecoration: 'none',
                opacity: 0.7,
                borderRadius: 8,
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
            >
              {content.secondaryCtaText}
            </a>
          )}
          <CtaButton
            text={content.ctaButtonText}
            href={content.ctaButtonHref}
            primaryColor={primaryColor}
            ctaStyle={ctaStyle}
            onClick={onClick}
          />

          {/* Hamburger (mobile) */}
          <button
            onClick={(e) => { e.stopPropagation(); setMobileOpen(true); }}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            style={{
              display: 'none', // shown via media query in real app; shown always here for demo
              width: 36,
              height: 36,
              borderRadius: 8,
              border: `1px solid ${resolvedText}15`,
              background: 'transparent',
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <HamburgerIcon open={mobileOpen} color={resolvedText} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <MobileDrawer
        open={mobileOpen}
        links={content.links || []}
        ctaButtonText={content.ctaButtonText}
        ctaButtonHref={content.ctaButtonHref}
        secondaryCtaText={content.secondaryCtaText}
        primaryColor={primaryColor}
        textColor={resolvedText}
        bgColor={resolvedBg}
        onClose={() => setMobileOpen(false)}
      />
    </div>
  );
}

/* ─── Nav link with active indicator ──────────────────────── */

function NavLink({ link, primaryColor, textColor }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={link.href || '#'}
      onClick={(e) => e.preventDefault()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '7px 12px',
        borderRadius: 8,
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: 13,
        color: hovered ? primaryColor : textColor,
        background: hovered ? `${primaryColor}0f` : 'transparent',
        transition: 'color 0.15s, background 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      {link.label}
      {link.isNew && (
        <span
          style={{
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            background: primaryColor,
            color: '#fff',
            borderRadius: 20,
            padding: '2px 6px',
            lineHeight: 1.4,
          }}
        >
          NEW
        </span>
      )}
    </a>
  );
}