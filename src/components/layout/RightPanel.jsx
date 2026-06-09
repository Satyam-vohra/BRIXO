import React, { useContext, useState, useEffect } from 'react';
import { BuilderContext } from '../../context/BuilderContext';
import { useAIColorSuggestion } from '../../hooks/useAIColorSuggestion';
import TabBar from '../ui/TabBar';
import ColorSwatch from '../ui/ColorSwatch';
import { Sparkles, AlertCircle, Loader2 } from 'lucide-react';

const TABS = [
  { id: 'edit', label: 'Edit Block' },
  { id: 'design', label: 'Design' },
  { id: 'ai', label: 'AI' }
];

const BUSINESS_TYPES = ['Food', 'Fashion', 'Tech', 'Health', 'Education', 'Finance'];
const FONT_STYLES = ['Modern', 'Classic', 'Elegant', 'Friendly'];

export default function RightPanel() {
  const {
    canvasBlocks,
    selectedBlockId,
    businessType,
    fontStyle,
    colorPalette,
    addBlock,
    selectBlock,
    updateBlockContent,
    setColorPalette,
    setBusinessType,
    setFontStyle
  } = useContext(BuilderContext);

  const [activeTab, setActiveTab] = useState('design');
  const { suggestColors, loading, error } = useAIColorSuggestion();

  // Find the currently selected block object
  const selectedBlock = canvasBlocks.find((b) => b.id === selectedBlockId);

  // Switch automatically to the 'Edit' tab when a block is selected
  useEffect(() => {
    if (selectedBlockId) {
      setActiveTab('edit');
    }
  }, [selectedBlockId]);

  const handleAISuggest = async () => {
    // Switch to AI tab to show output or loading feedback
    setActiveTab('ai');
    const result = await suggestColors(businessType);
    if (result) {
      setColorPalette(result);
    }
  };

  const renderEditTab = () => {
    if (!selectedBlock) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center select-none text-brand-muted">
          <span className="text-3xl mb-3">✏️</span>
          <p className="text-sm font-semibold">
            Select a block on the canvas to edit its content
          </p>
        </div>
      );
    }

    const { type, content, id } = selectedBlock;

    const handleInputChange = (field, val) => {
      updateBlockContent(id, field, val);
    };

    switch (type) {
      case 'navbar':
        return (
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">Navbar Editor</h3>
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">Logo Text</label>
              <input
                type="text"
                value={content.logoText || ''}
                onChange={(e) => handleInputChange('logoText', e.target.value)}
                className="w-full px-3 py-2 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">CTA Button Text</label>
              <input
                type="text"
                value={content.ctaButtonText || ''}
                onChange={(e) => handleInputChange('ctaButtonText', e.target.value)}
                className="w-full px-3 py-2 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        );
      case 'hero':
        return (
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">Hero Editor</h3>
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">Headline</label>
              <textarea
                value={content.headline || ''}
                onChange={(e) => handleInputChange('headline', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">Subheadline</label>
              <textarea
                value={content.subheadline || ''}
                onChange={(e) => handleInputChange('subheadline', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">Primary Button</label>
              <input
                type="text"
                value={content.button1Text || ''}
                onChange={(e) => handleInputChange('button1Text', e.target.value)}
                className="w-full px-3 py-2 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">Secondary Button</label>
              <input
                type="text"
                value={content.button2Text || ''}
                onChange={(e) => handleInputChange('button2Text', e.target.value)}
                className="w-full px-3 py-2 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        );
      case 'cta':
        return (
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">CTA Editor</h3>
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">Headline</label>
              <textarea
                value={content.headline || ''}
                onChange={(e) => handleInputChange('headline', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">Button Text</label>
              <input
                type="text"
                value={content.buttonText || ''}
                onChange={(e) => handleInputChange('buttonText', e.target.value)}
                className="w-full px-3 py-2 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        );
      case 'features':
        return (
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
            <h3 className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider">Features Editor</h3>
            
            {/* Feature 1 */}
            <div className="border-b border-brand-border pb-3 flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold text-brand-primary">Feature 1</span>
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Title</label>
                <input
                  type="text"
                  value={content.feature1Title || ''}
                  onChange={(e) => handleInputChange('feature1Title', e.target.value)}
                  className="w-full px-3 py-2 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Description</label>
                <textarea
                  value={content.feature1Desc || ''}
                  onChange={(e) => handleInputChange('feature1Desc', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="border-b border-brand-border pb-3 flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold text-brand-primary">Feature 2</span>
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Title</label>
                <input
                  type="text"
                  value={content.feature2Title || ''}
                  onChange={(e) => handleInputChange('feature2Title', e.target.value)}
                  className="w-full px-3 py-2 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Description</label>
                <textarea
                  value={content.feature2Desc || ''}
                  onChange={(e) => handleInputChange('feature2Desc', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold text-brand-primary">Feature 3</span>
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Title</label>
                <input
                  type="text"
                  value={content.feature3Title || ''}
                  onChange={(e) => handleInputChange('feature3Title', e.target.value)}
                  className="w-full px-3 py-2 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Description</label>
                <textarea
                  value={content.feature3Desc || ''}
                  onChange={(e) => handleInputChange('feature3Desc', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>
            </div>
          </div>
        );
      case 'footer':
        return (
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2">Footer Editor</h3>
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">Company Name</label>
              <input
                type="text"
                value={content.companyName || ''}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="w-full px-3 py-2 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">Copyright Text</label>
              <input
                type="text"
                value={content.copyrightText || ''}
                onChange={(e) => handleInputChange('copyrightText', e.target.value)}
                className="w-full px-3 py-2 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center select-none text-brand-muted">
            <span className="text-3xl mb-3">🧩</span>
            <p className="text-sm font-semibold">
              Select a block to edit its content
            </p>
            <p className="text-xs mt-1">
              This block type ("{type}") does not expose text fields for editing.
            </p>
          </div>
        );
    }
  };

  const renderDesignTab = () => {
    return (
      <div className="flex flex-col gap-6">
        {/* Business Type dropdown */}
        <div>
          <label className="block text-xs font-bold text-brand-dark mb-1.5 uppercase tracking-wider">
            Business Type
          </label>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full px-3 py-3 bg-white border border-brand-border rounded-2xl text-sm font-medium focus:outline-none focus:border-brand-primary hover:border-slate-350 transition-colors"
          >
            {BUSINESS_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Font Style Radios */}
        <div>
          <label className="block text-xs font-bold text-brand-dark mb-2 uppercase tracking-wider">
            Typography Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {FONT_STYLES.map((style) => (
              <label
                key={style}
                className={`flex flex-col p-3 border rounded-2xl cursor-pointer hover:bg-slate-50 transition active:scale-95 select-none ${
                  fontStyle === style
                    ? 'border-brand-primary bg-indigo-50/20 text-brand-primary font-bold'
                    : 'border-brand-border bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{style}</span>
                  <input
                    type="radio"
                    name="fontStyle"
                    value={style}
                    checked={fontStyle === style}
                    onChange={() => setFontStyle(style)}
                    className="sr-only"
                  />
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      fontStyle === style ? 'border-brand-primary text-brand-primary' : 'border-slate-300'
                    }`}
                  >
                    {fontStyle === style && <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />}
                  </div>
                </div>
                <span className="text-[10px] text-brand-muted mt-1 font-mono">
                  {style === 'Classic' && 'Aa Serif'}
                  {style === 'Elegant' && 'Aa Editorial'}
                  {style === 'Friendly' && 'Aa Rounded'}
                  {style === 'Modern' && 'Aa Grotesk'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* AI Suggest Colors Button */}
        <div className="border-t border-brand-border pt-6 mt-4">
          <button
            onClick={handleAISuggest}
            className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-brand-dark text-white font-bold rounded-2xl hover:bg-slate-800 transition shadow-md active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-brand-primary fill-brand-primary" />
            AI Suggest Colors
          </button>
        </div>
      </div>
    );
  };

  const renderAITab = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-4" />
          <h3 className="text-sm font-bold text-brand-dark">AI is thinking...</h3>
          <p className="text-xs text-brand-muted mt-1 max-w-[200px] leading-relaxed">
            Curating the perfect palette for {businessType} websites...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
          <h3 className="text-sm font-bold text-brand-dark">Suggestion failed</h3>
          <p className="text-xs text-red-500 mt-1 max-w-[220px] leading-relaxed">
            {error}
          </p>
          <button
            onClick={handleAISuggest}
            className="mt-5 px-4 py-2 border border-slate-350 text-xs font-bold text-brand-dark rounded-xl hover:bg-slate-50 transition active:scale-95"
          >
            Try again
          </button>
        </div>
      );
    }

    // Default view: Show swatches and reasoning
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2 border-b border-brand-border pb-3">
          <Sparkles className="w-4 h-4 text-brand-primary fill-brand-primary" />
          <h3 className="text-xs font-bold text-brand-dark uppercase tracking-wider">
            {businessType} Color Palette
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <ColorSwatch color={colorPalette.primary} label="Primary Color" />
          <ColorSwatch color={colorPalette.secondary} label="Secondary Color" />
          <ColorSwatch color={colorPalette.accent} label="Accent Color" />
          <ColorSwatch color={colorPalette.background} label="Background Color" />
          <ColorSwatch color={colorPalette.text} label="Text Color" />
        </div>

        {colorPalette.reasoning && (
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl mt-1">
            <h4 className="text-[10px] text-brand-muted uppercase font-bold tracking-wider mb-1.5">
              AI Design Reasoning
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {colorPalette.reasoning}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-[300px] bg-brand-panel border-l border-brand-border flex flex-col h-full flex-shrink-0">
      <TabBar
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === 'edit' && renderEditTab()}
        {activeTab === 'design' && renderDesignTab()}
        {activeTab === 'ai' && renderAITab()}
      </div>
    </aside>
  );
}
