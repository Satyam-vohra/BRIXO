import React, { useState } from 'react';

export default function AppHeader({ onPublishClick, onPreviewClick, onDeviceChange, onUndo, onRedo, canUndo = true, canRedo = false, saveStatus = 'saved' }) {
  const [activeDevice, setActiveDevice] = useState('desktop');
  const [publishing, setPublishing] = useState(false);

  const handleDeviceChange = (device) => {
    setActiveDevice(device);
    if (onDeviceChange) onDeviceChange(device);
  };

  const handlePublish = async () => {
    setPublishing(true);
    if (onPublishClick) await onPublishClick();
    setTimeout(() => setPublishing(false), 2000);
  };

  const devices = [
    { id: 'desktop', icon: '🖥️', label: 'Desktop' },
    { id: 'tablet', icon: '📱', label: 'Tablet' },
    { id: 'mobile', icon: '📲', label: 'Mobile' },
  ];

  const saveLabel = {
    saved: { dot: '#22c55e', text: 'Saved' },
    saving: { dot: '#f59e0b', text: 'Saving…' },
    unsaved: { dot: '#ef4444', text: 'Unsaved' },
  }[saveStatus] ?? { dot: '#22c55e', text: 'Saved' };

  return (
    <header style={styles.header}>

      {/* ── LEFT: Logo ── */}
      <div style={styles.logoGroup}>
        <div style={styles.logoIcon}>Bx</div>
        <span style={styles.logoName}>BRIXO</span>
        <span style={styles.logoBadge}>BUILDER</span>
      </div>

      {/* ── CENTER: Device Toggle ── */}
      <div style={styles.deviceToggle}>
        {devices.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => handleDeviceChange(id)}
            title={label}
            style={{
              ...styles.deviceBtn,
              ...(activeDevice === id ? styles.deviceBtnActive : {}),
            }}
          >
            <span style={{ fontSize: 16 }}>{icon}</span>
            {id === 'desktop' && (
              <span style={styles.deviceLabel}>{label}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── RIGHT: Actions ── */}
      <div style={styles.actions}>

        {/* Save status */}
        <div style={styles.saveStatus}>
          <span style={{ ...styles.saveDot, background: saveLabel.dot }} />
          <span style={styles.saveText}>{saveLabel.text}</span>
        </div>

        <div style={styles.divider} />

        {/* Undo / Redo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
          style={{ ...styles.iconBtn, opacity: canUndo ? 1 : 0.3 }}
        >
          ↩
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
          style={{ ...styles.iconBtn, opacity: canRedo ? 1 : 0.3 }}
        >
          ↪
        </button>

        <div style={styles.divider} />

        {/* Preview */}
        <button onClick={onPreviewClick} style={styles.actionBtn}>
          👁 <span style={styles.btnLabel}>Preview</span>
        </button>

        {/* Share */}
        <button style={styles.actionBtn}>
          🔗 <span style={styles.btnLabel}>Share</span>
        </button>

        {/* Publish */}
        <button
          onClick={handlePublish}
          disabled={publishing}
          style={{
            ...styles.publishBtn,
            background: publishing ? '#16a34a' : '#22c55e',
            cursor: publishing ? 'not-allowed' : 'pointer',
          }}
        >
          {publishing ? '✅ Publishing…' : '🚀 Publish'}
        </button>
      </div>
    </header>
  );
}

/* ─── Styles ─────────────────────────────────────────────── */
const styles = {
  header: {
    height: 60,
    padding: '0 20px',
    background: '#13151f',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    userSelect: 'none',
    flexShrink: 0,
  },

  /* Logo */
  logoGroup: { display: 'flex', alignItems: 'center', gap: 10 },
  logoIcon: {
    width: 32, height: 32,
    borderRadius: 8,
    background: 'linear-gradient(135deg, #6c63ff, #4f46e5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: 13, color: '#fff', letterSpacing: -0.5,
    flexShrink: 0,
  },
  logoName: { fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: -0.3 },
  logoBadge: {
    fontSize: 10, fontWeight: 600, color: '#6c63ff',
    background: 'rgba(108,99,255,0.15)',
    padding: '2px 7px', borderRadius: 20,
    border: '1px solid rgba(108,99,255,0.3)',
    letterSpacing: 0.3,
  },

  /* Device Toggle */
  deviceToggle: {
    display: 'flex', alignItems: 'center',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: 4,
    gap: 2,
  },
  deviceBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '5px 12px',
    borderRadius: 6,
    border: 'none',
    background: 'transparent',
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12, fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  deviceBtnActive: {
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
  },
  deviceLabel: { fontSize: 12 },

  /* Actions */
  actions: { display: 'flex', alignItems: 'center', gap: 8 },

  saveStatus: { display: 'flex', alignItems: 'center', gap: 5 },
  saveDot: { width: 6, height: 6, borderRadius: '50%', display: 'inline-block' },
  saveText: { fontSize: 11, color: 'rgba(255,255,255,0.35)' },

  divider: {
    width: 1, height: 20,
    background: 'rgba(255,255,255,0.08)',
    flexShrink: 0,
  },

  iconBtn: {
    width: 34, height: 34,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 7,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    fontSize: 16,
    transition: 'all 0.15s',
  },

  actionBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    height: 34, padding: '0 12px',
    borderRadius: 7,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12, fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  btnLabel: { fontSize: 12 },

  publishBtn: {
    display: 'flex', alignItems: 'center', gap: 7,
    height: 34, padding: '0 16px',
    borderRadius: 7,
    border: 'none',
    color: '#fff',
    fontSize: 13, fontWeight: 600,
    transition: 'all 0.15s',
    letterSpacing: -0.1,
    whiteSpace: 'nowrap',
  },
};