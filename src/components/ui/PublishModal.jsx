import React, { useState, useEffect } from 'react';
import { Check, Copy, Download, X, Globe, FileCode, Sparkles, ExternalLink } from 'lucide-react';

// ─── HTML Generator (unchanged logic, cleaner structure) ──────
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateStaticHTML(canvasBlocks, colorPalette, fontStyle) {
  const fontCSS = {
    Classic: `font-family: Georgia, Cambria, serif;`,
    Elegant: `font-family: Garamond, 'Playfair Display', serif;`,
    Friendly: `font-family: 'Quicksand', 'Comic Sans MS', sans-serif;`,
    Modern: `font-family: 'Inter', system-ui, sans-serif;`,
  }[fontStyle] ?? `font-family: 'Inter', system-ui, sans-serif;`;

  const sectionsHTML = canvasBlocks.map(({ type, content }) => {
    switch (type) {
      case 'navbar': return `
  <nav style="border-bottom:1px solid #f1f5f9;background:var(--site-bg);padding:16px 48px;display:flex;justify-content:space-between;align-items:center;">
    <span style="font-size:20px;font-weight:700;color:var(--site-primary)">${escapeHtml(content.logoText || 'BRIXO')}</span>
    <div style="display:flex;gap:24px;font-size:14px;font-weight:500;color:var(--site-text)">
      <a href="#" style="text-decoration:none;color:inherit">Home</a>
      <a href="#" style="text-decoration:none;color:inherit">Services</a>
      <a href="#" style="text-decoration:none;color:inherit">About</a>
      <a href="#" style="text-decoration:none;color:inherit">Contact</a>
    </div>
    <button style="background:var(--site-primary);color:#fff;padding:10px 20px;border:none;border-radius:8px;font-weight:600;cursor:pointer">${escapeHtml(content.ctaButtonText || 'Get Started')}</button>
  </nav>`;

      case 'hero': return `
  <header style="padding:80px 48px;text-align:center;background:linear-gradient(135deg,rgba(79,110,247,0.08),rgba(124,58,237,0.08))">
    <h1 style="font-size:clamp(32px,5vw,64px);font-weight:800;color:var(--site-text);max-width:800px;margin:0 auto 24px;line-height:1.15">${escapeHtml(content.headline)}</h1>
    <p style="font-size:18px;color:var(--site-text);opacity:0.7;max-width:560px;margin:0 auto 40px;line-height:1.7">${escapeHtml(content.subheadline)}</p>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
      <button style="background:var(--site-primary);color:#fff;padding:14px 28px;border:none;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer">${escapeHtml(content.button1Text)}</button>
      <button style="background:#fff;border:1px solid #e2e8f0;color:var(--site-text);padding:14px 28px;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer">${escapeHtml(content.button2Text)}</button>
    </div>
  </header>`;

      case 'products': return `
  <section style="padding:64px 48px;background:var(--site-bg)">
    <h2 style="text-align:center;font-size:32px;font-weight:700;color:var(--site-text);margin:0 0 48px">${escapeHtml(content.title)}</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;max-width:1100px;margin:0 auto">
      ${[1, 2, 3].map(i => `
      <div style="border:1px solid #f1f5f9;border-radius:16px;background:#fff;padding:24px;display:flex;flex-direction:column;gap:16px">
        <div style="aspect-ratio:16/9;background:#f8fafc;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:13px">Image</div>
        <div>
          <h3 style="font-size:16px;font-weight:700;color:var(--site-text);margin:0 0 4px">${escapeHtml(content[`product${i}Name`])}</h3>
          <p style="font-size:15px;font-weight:700;color:var(--site-primary);margin:0">${escapeHtml(content[`product${i}Price`])}</p>
        </div>
        <button style="background:var(--site-primary);color:#fff;padding:10px;border:none;border-radius:8px;font-weight:600;cursor:pointer;margin-top:auto">Buy Now</button>
      </div>`).join('')}
    </div>
  </section>`;

      case 'features': return `
  <section style="padding:64px 48px;background:#f8fafc">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px;max-width:1100px;margin:0 auto">
      ${[['🎨', 1], ['🖱️', 2], ['🚀', 3]].map(([emoji, i]) => `
      <div style="padding:28px;background:#fff;border:1px solid #f1f5f9;border-radius:16px">
        <span style="font-size:28px;display:block;margin-bottom:14px">${emoji}</span>
        <h3 style="font-size:16px;font-weight:700;color:var(--site-text);margin:0 0 8px">${escapeHtml(content[`feature${i}Title`])}</h3>
        <p style="font-size:14px;color:var(--site-text);opacity:0.65;line-height:1.7;margin:0">${escapeHtml(content[`feature${i}Desc`])}</p>
      </div>`).join('')}
    </div>
  </section>`;

      case 'testimonials': return `
  <section style="padding:64px 48px;background:var(--site-bg)">
    <h2 style="text-align:center;font-size:32px;font-weight:700;color:var(--site-text);margin:0 0 48px">${escapeHtml(content.title || 'What Our Clients Say')}</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;max-width:900px;margin:0 auto">
      ${[1, 2].map(i => `
      <div style="padding:28px;background:#f8fafc;border:1px solid #f1f5f9;border-radius:16px">
        <p style="font-size:15px;color:var(--site-text);opacity:0.8;font-style:italic;line-height:1.7;margin:0 0 20px">"${escapeHtml(content[`testimonial${i}Quote`])}"</p>
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:40px;height:40px;border-radius:50%;background:var(--site-primary);opacity:0.2;display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--site-primary);font-size:16px">${escapeHtml((content[`testimonial${i}Name`] || 'A').charAt(0))}</div>
          <span style="font-size:14px;font-weight:600;color:var(--site-text)">${escapeHtml(content[`testimonial${i}Name`])}</span>
        </div>
      </div>`).join('')}
    </div>
  </section>`;

      case 'gallery': return `
  <section style="padding:64px 48px;background:#f8fafc">
    <h2 style="text-align:center;font-size:32px;font-weight:700;color:var(--site-text);margin:0 0 48px">${escapeHtml(content.title || 'Our Gallery')}</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;max-width:1100px;margin:0 auto">
      ${[1, 2, 3, 4, 5, 6].map(i => `<div style="aspect-ratio:4/3;background:#e2e8f0;border-radius:16px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:13px">Image ${i}</div>`).join('')}
    </div>
  </section>`;

      case 'cta': return `
  <section style="padding:80px 48px;text-align:center;background:var(--site-primary);color:#fff">
    <h2 style="font-size:clamp(28px,4vw,48px);font-weight:800;max-width:700px;margin:0 auto 32px;line-height:1.2">${escapeHtml(content.headline)}</h2>
    <button style="background:#fff;color:var(--site-primary);padding:14px 36px;border:none;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer">${escapeHtml(content.buttonText)}</button>
  </section>`;

      case 'footer': return `
  <footer style="padding:48px;background:#0f172a;color:#94a3b8">
    <div style="max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px;border-bottom:1px solid #1e293b;padding-bottom:32px;margin-bottom:32px">
      <span style="font-size:18px;font-weight:700;color:var(--site-primary)">${escapeHtml(content.companyName)}</span>
      <div style="display:flex;gap:24px;font-size:13px">
        <a href="#" style="color:#94a3b8;text-decoration:none">Privacy</a>
        <a href="#" style="color:#94a3b8;text-decoration:none">Terms</a>
        <a href="#" style="color:#94a3b8;text-decoration:none">Support</a>
      </div>
    </div>
    <div style="max-width:1100px;margin:0 auto;text-align:center;font-size:13px">${escapeHtml(content.copyrightText)}</div>
  </footer>`;

      default: return '';
    }
  }).join('\n');

  const title = escapeHtml(
    canvasBlocks.find((b) => b.type === 'hero')?.content?.headline || 'My BRIXO Website'
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --site-primary:   ${colorPalette.primary};
      --site-secondary: ${colorPalette.secondary};
      --site-accent:    ${colorPalette.accent};
      --site-bg:        ${colorPalette.background};
      --site-text:      ${colorPalette.text};
    }
    *, *::before, *::after { box-sizing: border-box; }
    body { margin:0; padding:0; background:var(--site-bg); color:var(--site-text); ${fontCSS} -webkit-font-smoothing:antialiased; }
    a { color: inherit; }
    button { font-family: inherit; }
  </style>
</head>
<body>
${sectionsHTML}
</body>
</html>`;
}

// ─── Stat pill ────────────────────────────────────────────────
function StatPill({ icon, value, label }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 3,
      padding: '10px 16px',
      background: '#f8fafc',
      borderRadius: 10,
      border: '1px solid rgba(0,0,0,0.07)',
      flex: 1,
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontSize: 16, fontWeight: 800, color: '#1e293b' }}>{value}</span>
      <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
    </div>
  );
}

// ─── PublishModal ─────────────────────────────────────────────
export default function PublishModal({ isOpen, onClose, canvasBlocks, colorPalette, fontStyle }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Animate progress bar on open
  useEffect(() => {
    if (!isOpen) { setProgress(0); return; }
    setProgress(0);
    const t1 = setTimeout(() => setProgress(60), 100);
    const t2 = setTimeout(() => setProgress(85), 400);
    const t3 = setTimeout(() => setProgress(100), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isOpen]);

  if (!isOpen) return null;

  // Build slug from hero headline
  const heroHeadline = canvasBlocks.find((b) => b.type === 'hero')?.content?.headline || 'my-site';
  const slug = heroHeadline
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 30) || 'my-site';
  const fakeUrl = `https://${slug}.brixo.app`;

  const blockCount = canvasBlocks.length;
  const colorCount = Object.keys(colorPalette).filter((k) => k !== 'reasoning' && colorPalette[k]).length;

  const handleCopy = () => {
    navigator.clipboard.writeText(fakeUrl).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloading(true);
    const html = generateStaticHTML(canvasBlocks, colorPalette, fontStyle);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setTimeout(() => { setDownloading(false); setDownloaded(true); }, 800);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      background: 'rgba(15,23,42,0.65)',
      backdropFilter: 'blur(4px)',
    }}>
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />

      {/* Modal card */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 440,
        background: '#fff',
        borderRadius: 20,
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>

        {/* Progress bar */}
        <div style={{ height: 3, background: '#f1f5f9' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #6c63ff, #22c55e)',
            transition: 'width 0.4s ease',
            borderRadius: '0 2px 2px 0',
          }} />
        </div>

        {/* Body */}
        <div style={{ padding: '28px 28px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16, right: 16,
              width: 30, height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              border: '1px solid rgba(0,0,0,0.09)',
              background: '#f8fafc',
              cursor: 'pointer',
              color: '#64748b',
              transition: 'background 0.15s',
            }}
          >
            <X size={15} />
          </button>

          {/* Header */}
          <div style={{ textAlign: 'center', paddingTop: 4 }}>
            <div style={{
              width: 56, height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              fontSize: 26,
            }}>
              🎉
            </div>
            <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
              Your site is live!
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
              Compiled with {blockCount} block{blockCount !== 1 ? 's' : ''}, {colorCount} palette colors, and {fontStyle} typography.
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 8 }}>
            <StatPill icon="🧩" value={blockCount} label="Blocks" />
            <StatPill icon="🎨" value={colorCount} label="Colors" />
            <StatPill icon="✨" value={fontStyle} label="Font" />
          </div>

          {/* URL bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 12px',
            background: '#f8fafc',
            border: '1px solid rgba(0,0,0,0.09)',
            borderRadius: 10,
          }}>
            <Globe size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
            <span style={{
              flex: 1,
              fontSize: 12,
              fontFamily: 'monospace',
              color: '#1e293b',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {fakeUrl}
            </span>
            <button
              onClick={handleCopy}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 10px',
                borderRadius: 7,
                border: '1px solid rgba(0,0,0,0.09)',
                background: copied ? '#dcfce7' : '#fff',
                color: copied ? '#16a34a' : '#475569',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.14s',
                whiteSpace: 'nowrap',
              }}
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={handleDownload}
              disabled={downloading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '13px 16px',
                background: downloaded ? '#dcfce7' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: downloaded ? '#16a34a' : '#fff',
                border: downloaded ? '1px solid #bbf7d0' : 'none',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                cursor: downloading ? 'wait' : 'pointer',
                transition: 'all 0.2s',
                opacity: downloading ? 0.8 : 1,
              }}
            >
              {downloaded
                ? <><Check size={16} /> Downloaded!</>
                : downloading
                  ? <><FileCode size={16} /> Generating HTML…</>
                  : <><Download size={16} /> Download static HTML</>
              }
            </button>

            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '11px 16px',
                background: 'transparent',
                border: '1px solid rgba(0,0,0,0.09)',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600,
                color: '#64748b',
                cursor: 'pointer',
                transition: 'background 0.14s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Close
            </button>
          </div>

          {/* Footer note */}
          <p style={{
            margin: 0,
            textAlign: 'center',
            fontSize: 11,
            color: '#94a3b8',
            lineHeight: 1.6,
          }}>
            Built with <span style={{ color: '#6c63ff', fontWeight: 700 }}>BRIXO</span> — AI-powered website builder
          </p>
        </div>
      </div>
    </div>
  );
}