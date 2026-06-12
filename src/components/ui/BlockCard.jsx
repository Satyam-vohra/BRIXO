import React, { useState, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { GripVertical } from 'lucide-react';
import AntiGravity from '../../lib/AntiGravity';

export default function BlockCard({ type, label, icon: Icon, desc = '' }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const wiggleRef = useRef(null);

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: 'NEW_BLOCK',
      item: { blockType: type },
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    }),
    [type]
  );

  // ── 3E: Wobble on hover ──
  const handleMouseEnter = () => {
    setHovered(true);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !cardRef.current) return;
    wiggleRef.current = new AntiGravity(cardRef.current, {
      mode: 'wobble',
      intensity: 0.25,
      frequency: 14,
      duration: 380,
      onComplete: () => wiggleRef.current?.destroy(),
    });
    wiggleRef.current.play();
  };

  const handleMouseLeave = () => {
    setHovered(false);
    wiggleRef.current?.stop();
    wiggleRef.current?.destroy();
    wiggleRef.current = null;
  };

  // Merge dragRef and cardRef into one callback ref
  const setRef = (el) => {
    cardRef.current = el;
    dragRef(el);
  };

  return (
    <div
      ref={setRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 10px',
        borderRadius: 10,
        border: isDragging
          ? '1.5px dashed #6c63ff'
          : hovered
            ? '1px solid rgba(108,99,255,0.45)'
            : '1px solid rgba(255,255,255,0.07)',
        background: isDragging
          ? 'rgba(108,99,255,0.08)'
          : hovered
            ? 'rgba(108,99,255,0.1)'
            : 'rgba(255,255,255,0.04)',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        opacity: isDragging ? 0.45 : 1,
        transform: hovered && !isDragging ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'all 0.14s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left accent bar on hover */}
      <div style={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: 3,
        borderRadius: '10px 0 0 10px',
        background: '#6c63ff',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.14s',
      }} />

      {/* Icon box */}
      <div style={{
        width: 34,
        height: 34,
        borderRadius: 8,
        background: hovered ? 'rgba(108,99,255,0.22)' : 'rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'background 0.14s',
      }}>
        <Icon
          size={16}
          style={{ color: hovered ? '#a78bfa' : 'rgba(255,255,255,0.5)', transition: 'color 0.14s' }}
        />
      </div>

      {/* Label + desc */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0,
          fontSize: 12,
          fontWeight: 600,
          color: hovered ? '#fff' : 'rgba(255,255,255,0.75)',
          transition: 'color 0.14s',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {label}
        </p>
        {desc && (
          <p style={{
            margin: 0,
            fontSize: 10,
            color: 'rgba(255,255,255,0.28)',
            marginTop: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {desc}
          </p>
        )}
      </div>

      {/* Drag grip — visible on hover */}
      <GripVertical
        size={13}
        style={{
          color: 'rgba(255,255,255,0.2)',
          flexShrink: 0,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.14s',
        }}
      />
    </div>
  );
}
