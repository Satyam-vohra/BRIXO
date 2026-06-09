import React, { createContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const BuilderContext = createContext(null);

const DEFAULT_BLOCK_CONTENT = {
  navbar: {
    logoText: 'BRIXO Inc.',
    ctaButtonText: 'Get Started'
  },
  hero: {
    headline: 'Build Websites in Seconds with AI',
    subheadline: 'Drag blocks, select your business type, and let our intelligent engine suggest the perfect styles.',
    button1Text: 'Build Now',
    button2Text: 'Learn More'
  },
  products: {
    title: 'Featured Products',
    product1Name: 'Starter Pack',
    product1Price: '$19.99',
    product2Name: 'Professional Suite',
    product2Price: '$49.99',
    product3Name: 'Enterprise Hub',
    product3Price: '$99.99'
  },
  features: {
    feature1Title: 'AI-Driven Colors',
    feature1Desc: 'Generate tailored color palettes matching your business sector.',
    feature2Title: 'Flexible Drag & Drop',
    feature2Desc: 'Easily rearrange blocks to build your customized layout.',
    feature3Title: 'Instant Export',
    feature3Desc: 'Download your static website as an HTML file instantly.'
  },
  testimonials: {
    title: 'What Our Clients Say',
    testimonial1Name: 'Sarah Connor',
    testimonial1Quote: 'This builder is incredibly fast. The AI color recommendations fit our aesthetic perfectly!',
    testimonial2Name: 'Marcus Wright',
    testimonial2Quote: 'Drag and drop that actually works smoothly. Highly recommend for landing pages.'
  },
  gallery: {
    title: 'Our Portfolio'
  },
  cta: {
    headline: 'Unlock Your Digital Potential Today',
    buttonText: 'Get Started Free'
  },
  footer: {
    companyName: 'BRIXO Inc.',
    copyrightText: '© 2026 BRIXO. All rights reserved.'
  }
};

export function BuilderProvider({ children }) {
  const [canvasBlocks, setCanvasBlocks] = useLocalStorage('brixo_canvas_blocks', []);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [businessType, setBusinessTypeState] = useState('Tech');
  const [fontStyle, setFontStyle] = useState('Modern');
  const [previewMode, setPreviewModeState] = useState('desktop');

  const [colorPalette, setColorPaletteState] = useState({
    primary: '#4F6EF7',
    secondary: '#7C3AED',
    accent: '#F59E0B',
    background: '#ffffff',
    text: '#1a1a2e',
    reasoning: ''
  });

  // Sync custom CSS properties whenever the colorPalette changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--site-primary', colorPalette.primary);
    root.style.setProperty('--site-secondary', colorPalette.secondary);
    root.style.setProperty('--site-accent', colorPalette.accent);
    root.style.setProperty('--site-bg', colorPalette.background);
    root.style.setProperty('--site-text', colorPalette.text);
  }, [colorPalette]);

  const addBlock = (blockType) => {
    const newBlock = {
      id: Date.now().toString(),
      type: blockType,
      content: { ...DEFAULT_BLOCK_CONTENT[blockType] },
      styles: { ...colorPalette }
    };
    setCanvasBlocks([...canvasBlocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const removeBlock = (id) => {
    setCanvasBlocks(canvasBlocks.filter((block) => block.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  const reorderBlocks = (dragIndex, hoverIndex) => {
    const updatedBlocks = [...canvasBlocks];
    const [removed] = updatedBlocks.splice(dragIndex, 1);
    updatedBlocks.splice(hoverIndex, 0, removed);
    setCanvasBlocks(updatedBlocks);
  };

  const selectBlock = (id) => {
    setSelectedBlockId(id);
  };

  const updateBlockContent = (id, field, value) => {
    setCanvasBlocks(
      canvasBlocks.map((block) => {
        if (block.id === id) {
          return {
            ...block,
            content: {
              ...block.content,
              [field]: value
            }
          };
        }
        return block;
      })
    );
  };

  const setColorPalette = (palette) => {
    setColorPaletteState(palette);
    // Apply primary color and other palette colors to all canvas blocks instantly
    setCanvasBlocks(
      canvasBlocks.map((block) => ({
        ...block,
        styles: { ...palette }
      }))
    );
  };

  const setBusinessType = (type) => {
    setBusinessTypeState(type);
  };

  const setPreviewMode = (mode) => {
    setPreviewModeState(mode);
  };

  return (
    <BuilderContext.Provider
      value={{
        canvasBlocks,
        selectedBlockId,
        businessType,
        fontStyle,
        colorPalette,
        previewMode,
        addBlock,
        removeBlock,
        reorderBlocks,
        selectBlock,
        updateBlockContent,
        setColorPalette,
        setBusinessType,
        setFontStyle,
        setPreviewMode
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}
