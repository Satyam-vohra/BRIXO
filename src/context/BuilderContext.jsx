import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const BuilderContext = createContext(null);

// ─── Default block content ────────────────────────────────────
export const DEFAULT_BLOCK_CONTENT = {
  navbar: {
    logoText: 'BRIXO Inc.',
    ctaButtonText: 'Get Started',
  },
  hero: {
    headline: 'Build Websites in Seconds with AI',
    subheadline:
      'Drag blocks, select your business type, and let our intelligent engine suggest the perfect styles.',
    button1Text: 'Build Now',
    button2Text: 'Learn More',
  },
  products: {
    title: 'Featured Products',
    product1Name: 'Starter Pack',
    product1Price: '$19.99',
    product2Name: 'Professional Suite',
    product2Price: '$49.99',
    product3Name: 'Enterprise Hub',
    product3Price: '$99.99',
  },
  features: {
    feature1Title: 'AI-Driven Colors',
    feature1Desc: 'Generate tailored color palettes matching your business sector.',
    feature2Title: 'Flexible Drag & Drop',
    feature2Desc: 'Easily rearrange blocks to build your customized layout.',
    feature3Title: 'Instant Export',
    feature3Desc: 'Download your static website as an HTML file instantly.',
  },
  testimonials: {
    title: 'What Our Clients Say',
    testimonial1Name: 'Sarah Connor',
    testimonial1Quote:
      'This builder is incredibly fast. The AI color recommendations fit our aesthetic perfectly!',
    testimonial2Name: 'Marcus Wright',
    testimonial2Quote:
      'Drag and drop that actually works smoothly. Highly recommend for landing pages.',
  },
  gallery: { title: 'Our Portfolio' },
  cta: {
    headline: 'Unlock Your Digital Potential Today',
    buttonText: 'Get Started Free',
  },
  footer: {
    companyName: 'BRIXO Inc.',
    copyrightText: '© 2026 BRIXO. All rights reserved.',
  },
};

const DEFAULT_PALETTE = {
  primary: '#4F6EF7',
  secondary: '#7C3AED',
  accent: '#F59E0B',
  background: '#ffffff',
  text: '#1a1a2e',
  reasoning: '',
};

const MAX_HISTORY = 50;

// ─── History hook ─────────────────────────────────────────────
function useHistory(initial) {
  const [past, setPast] = useState([]);
  const [present, setPresent] = useState(initial);
  const [future, setFuture] = useState([]);

  const set = useCallback((newState) => {
    setPast((p) => [...p.slice(-MAX_HISTORY), present]);
    setPresent(newState);
    setFuture([]);
  }, [present]);

  const undo = useCallback(() => {
    if (!past.length) return;
    const prev = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [present, ...f]);
    setPresent(prev);
  }, [past, present]);

  const redo = useCallback(() => {
    if (!future.length) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, present]);
    setPresent(next);
  }, [future, present]);

  return {
    blocks: present,
    setBlocks: set,
    setBlocksSilent: setPresent, // for internal mutations that shouldn't push history
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}

// ─── Provider ─────────────────────────────────────────────────
export function BuilderProvider({ children }) {
  const [savedBlocks, setSavedBlocks] = useLocalStorage('brixo_canvas_blocks', []);

  const {
    blocks: canvasBlocks,
    setBlocks,
    setBlocksSilent,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory(savedBlocks);

  // Persist to localStorage whenever canvasBlocks changes
  useEffect(() => {
    setSavedBlocks(canvasBlocks);
  }, [canvasBlocks]);

  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [businessType, setBusinessTypeState] = useState('Tech');
  const [fontStyle, setFontStyle] = useState('Modern');
  const [previewMode, setPreviewModeState] = useState('desktop');
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'unsaved'

  const [colorPalette, setColorPaletteState] = useState(DEFAULT_PALETTE);

  // Debounced save indicator
  const saveTimer = useRef(null);
  const markDirty = useCallback(() => {
    setSaveStatus('saving');
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaveStatus('saved'), 1200);
  }, []);

  // Apply CSS variables whenever palette changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--site-primary', colorPalette.primary);
    root.style.setProperty('--site-secondary', colorPalette.secondary);
    root.style.setProperty('--site-accent', colorPalette.accent);
    root.style.setProperty('--site-bg', colorPalette.background);
    root.style.setProperty('--site-text', colorPalette.text);
  }, [colorPalette]);

  // ── Block mutations ────────────────────────────────────────
  const addBlock = useCallback((blockType) => {
    const newBlock = {
      id: Date.now().toString(),
      type: blockType,
      content: { ...DEFAULT_BLOCK_CONTENT[blockType] },
      styles: { ...colorPalette },
    };
    setBlocks([...canvasBlocks, newBlock]);
    setSelectedBlockId(newBlock.id);
    markDirty();
  }, [canvasBlocks, colorPalette, setBlocks, markDirty]);

  const removeBlock = useCallback((id) => {
    setBlocks(canvasBlocks.filter((b) => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
    markDirty();
  }, [canvasBlocks, selectedBlockId, setBlocks, markDirty]);

  const duplicateBlock = useCallback((id) => {
    const idx = canvasBlocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const clone = {
      ...canvasBlocks[idx],
      id: `${Date.now()}`,
      content: { ...canvasBlocks[idx].content },
      styles: { ...canvasBlocks[idx].styles },
    };
    const updated = [...canvasBlocks];
    updated.splice(idx + 1, 0, clone);
    setBlocks(updated);
    setSelectedBlockId(clone.id);
    markDirty();
  }, [canvasBlocks, setBlocks, markDirty]);

  const reorderBlocks = useCallback((dragIndex, hoverIndex) => {
    const updated = [...canvasBlocks];
    const [removed] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, removed);
    // Use silent so rapid hover events don't flood history
    setBlocksSilent(updated);
    markDirty();
  }, [canvasBlocks, setBlocksSilent, markDirty]);

  // Call this once drag ends to commit to history
  const commitReorder = useCallback(() => {
    setBlocks(canvasBlocks);
  }, [canvasBlocks, setBlocks]);

  const selectBlock = useCallback((id) => {
    setSelectedBlockId(id);
  }, []);

  const updateBlockContent = useCallback((id, field, value) => {
    setBlocks(
      canvasBlocks.map((block) =>
        block.id === id
          ? { ...block, content: { ...block.content, [field]: value } }
          : block
      )
    );
    markDirty();
  }, [canvasBlocks, setBlocks, markDirty]);

  const setColorPalette = useCallback((palette) => {
    setColorPaletteState(palette);
    setBlocks(canvasBlocks.map((b) => ({ ...b, styles: { ...palette } })));
    markDirty();
  }, [canvasBlocks, setBlocks, markDirty]);

  const resetCanvas = useCallback(() => {
    setBlocks([]);
    setSelectedBlockId(null);
    setSaveStatus('saved');
  }, [setBlocks]);

  const setBusinessType = useCallback((t) => setBusinessTypeState(t), []);
  const setPreviewMode = useCallback((m) => setPreviewModeState(m), []);

  return (
    <BuilderContext.Provider
      value={{
        // State
        canvasBlocks,
        selectedBlockId,
        businessType,
        fontStyle,
        colorPalette,
        previewMode,
        saveStatus,
        canUndo,
        canRedo,

        // Block actions
        addBlock,
        removeBlock,
        duplicateBlock,
        reorderBlocks,
        commitReorder,
        selectBlock,
        updateBlockContent,
        resetCanvas,

        // Design actions
        setColorPalette,
        setBusinessType,
        setFontStyle,
        setPreviewMode,

        // History
        undo,
        redo,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}