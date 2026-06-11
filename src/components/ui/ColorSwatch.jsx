import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

// ── Hex → relative luminance → contrast ratio vs white/black ──
function getLuminance(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastLabel(hex) {
  if (!hex || hex.length < 7) return null;
  try {
    const lum = getLuminance(hex);
    const white = (1.05) / (lum + 0.05);
    const black = (lum + 0.05) / 0.05;
    const ratio = Math.max(white, black);
    if (ratio >= 7) return { text: 'AAA', color: '#16a34a', bg: '#dcfce7' };
    if (ratio >= 4.5) return { text: 'AA', color: '#ca8a04', bg: '#fef9c3' };
    return { text: 'Low', color: '#dc2626', bg: '#fee2e2' };
  } catch {
    return null;
  }
}

export default function ColorSwatch({ color, label }) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const contrast = getContrastLabel(color);

  // Text on swatch circle — white or black based on luminance
  const textOnSwatch = (() => {
    if (!color || color.length < 7) return '#000';
    try {
      return getLuminance(color) > 0.35 ? '#000000' : '#ffffff';
    } catch { return '#000'; }
  })();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(color);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback silent fail
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        borderRadius: 10,
        border: hovered ? '1px solid rgba(0,0,0,0.14)' : '1px solid rgba(0,0,0,0.08)',
        background: hovered ? '#f8fafc' : '#fff',
        transition: 'all 0.14s',
        cursor: 'default',
      }}
    >
      {/* Color circle */}
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: color || '#e2e8f0',
        border: '1px solid rgba(0,0,0,0.1)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 9,
        fontWeight: 800,
        color: textOnSwatch,
        letterSpacing: 0.3,
        transition: 'transform 0.14s',
        transform: hovered ? 'scale(1.07)' : 'scale(1)',
      }}>
        {label.slice(0, 2).toUpperCase()}
      </div>

      {/* Label + hex */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0, fontSize: 10, fontWeight: 700,
          color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8,
        }}>
          {label}
        </p>
        <p style={{
          margin: 0, fontSize: 12, fontWeight: 600,
          color: '#1e293b', fontFamily: 'monospace',
          letterSpacing: 0.5,
        }}>
          {color || '—'}
        </p>
      </div>

      {/* Contrast badge */}
      {contrast && (
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          color: contrast.color,
          background: contrast.bg,
          padding: '2px 6px',
          borderRadius: 5,
          flexShrink: 0,
          letterSpacing: 0.3,
        }}>
          {contrast.text}
        </span>
      )}

      {/* Copy button */}
      <button
        onClick={handleCopy}
        title="Copy hex"
        style={{
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 7,
          border: '1px solid rgba(0,0,0,0.09)',
          background: copied ? '#dcfce7' : hovered ? '#f1f5f9' : 'transparent',
          color: copied ? '#16a34a' : '#94a3b8',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 0.14s',
          opacity: hovered || copied ? 1 : 0,
        }}
      >
        {copied
          ? <Check size={12} />
          : <Copy size={12} />
        }
      </button>
    </div>
  );
}