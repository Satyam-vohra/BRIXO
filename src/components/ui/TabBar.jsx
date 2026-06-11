import React, { useRef, useState, useEffect } from 'react';

/**
 * TabBar — reusable animated tab bar
 *
 * Props:
 *   tabs       — array of { id, label, icon?: LucideComponent, badge?: number | string }
 *   activeTab  — string id of active tab
 *   onTabChange — (id) => void
 *   variant    — 'underline' (default) | 'pill'
 */
export default function TabBar({ tabs, activeTab, onTabChange, variant = 'underline' }) {
  const containerRef = useRef(null);
  const activeRef = useRef(null);
  const [ink, setInk] = useState({ left: 0, width: 0 });

  // Measure active tab for sliding ink indicator
  useEffect(() => {
    if (!activeRef.current || !containerRef.current) return;
    const containerLeft = containerRef.current.getBoundingClientRect().left;
    const { left, width } = activeRef.current.getBoundingClientRect();
    setInk({ left: left - containerLeft, width });
  }, [activeTab, tabs]);

  if (variant === 'pill') {
    return (
      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: '4px',
          background: 'rgba(0,0,0,0.04)',
          borderRadius: 10,
          border: '1px solid rgba(0,0,0,0.07)',
        }}
      >
        {tabs.map(({ id, label, icon: Icon, badge }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                padding: '7px 10px',
                borderRadius: 7,
                border: 'none',
                background: active ? '#fff' : 'transparent',
                color: active ? '#1e293b' : '#94a3b8',
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: active ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                position: 'relative',
                whiteSpace: 'nowrap',
              }}
            >
              {Icon && (
                <Icon
                  size={13}
                  style={{ color: active ? '#6c63ff' : '#94a3b8', transition: 'color 0.15s' }}
                />
              )}
              {label}
              {badge != null && (
                <span style={{
                  minWidth: 16, height: 16,
                  borderRadius: 8,
                  background: active ? '#6c63ff' : '#e2e8f0',
                  color: active ? '#fff' : '#64748b',
                  fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px',
                }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // ── Underline variant (default) ──
  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        position: 'relative',
        background: '#fff',
        flexShrink: 0,
      }}
    >
      {tabs.map(({ id, label, icon: Icon, badge }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            ref={active ? activeRef : null}
            onClick={() => onTabChange(id)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              padding: '11px 8px 12px',
              border: 'none',
              background: 'transparent',
              color: active ? '#6c63ff' : '#94a3b8',
              fontSize: 12,
              fontWeight: active ? 700 : 500,
              cursor: 'pointer',
              transition: 'color 0.15s',
              position: 'relative',
              whiteSpace: 'nowrap',
            }}
          >
            {Icon && (
              <Icon
                size={13}
                style={{ color: active ? '#6c63ff' : '#94a3b8', transition: 'color 0.15s' }}
              />
            )}
            {label}
            {badge != null && (
              <span style={{
                minWidth: 16, height: 16,
                borderRadius: 8,
                background: active ? '#ede9fe' : '#f1f5f9',
                color: active ? '#6c63ff' : '#94a3b8',
                fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 4px',
              }}>
                {badge}
              </span>
            )}
          </button>
        );
      })}

      {/* Sliding ink underline */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          height: 2,
          borderRadius: '2px 2px 0 0',
          background: '#6c63ff',
          left: ink.left,
          width: ink.width,
          transition: 'left 0.22s cubic-bezier(0.4,0,0.2,1), width 0.22s cubic-bezier(0.4,0,0.2,1)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}