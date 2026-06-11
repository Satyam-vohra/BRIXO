import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useReducer,
  Component,
} from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BuilderProvider, BuilderContext } from './context/BuilderContext';
import AppHeader from './components/layout/AppHeader';
import LeftPanel from './components/layout/LeftPanel';
import Canvas from './components/layout/Canvas';
import RightPanel from './components/layout/RightPanel';
import PublishModal from './components/ui/PublishModal';

// ══════════════════════════════════════════════════════════════════════════════
// TOAST SYSTEM
// ══════════════════════════════════════════════════════════════════════════════

const ToastContext = createContext(null);

const toastReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: Date.now(), ...action.payload }];
    case 'REMOVE':
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
};

const TOAST_ICONS = { success: '✓', error: '✕', info: 'i', warning: '⚠' };
const TOAST_COLORS = {
  success: '#22c55e',
  error: '#ef4444',
  info: '#6366f1',
  warning: '#f59e0b',
};

function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const addToast = useCallback(({ message, type = 'info', duration = 3500 }) => {
    const id = Date.now();
    dispatch({ type: 'ADD', payload: { id, message, type, duration } });
    if (duration > 0) {
      setTimeout(() => dispatch({ type: 'REMOVE', id }), duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => dispatch({ type: 'REMOVE', id }), []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div
        role="region"
        aria-live="polite"
        aria-label="Notifications"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            onClick={() => removeToast(toast.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 16px',
              borderRadius: 8,
              background: '#1e1e1e',
              border: `1px solid ${TOAST_COLORS[toast.type]}44`,
              color: '#f0f0f0',
              fontSize: 13,
              fontWeight: 450,
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              cursor: 'pointer',
              pointerEvents: 'auto',
              maxWidth: 340,
              animation: 'slideUp 0.25s ease',
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: `${TOAST_COLORS[toast.type]}22`,
                color: TOAST_COLORS[toast.type],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {TOAST_ICONS[toast.type]}
            </span>
            {toast.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};

// ══════════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY
// ══════════════════════════════════════════════════════════════════════════════

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[BuilderApp] Uncaught error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        role="alert"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 16,
          background: '#0f0f0f',
          color: '#f0f0f0',
          fontFamily: 'system-ui, sans-serif',
          padding: 32,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 36 }}>⚠</div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>
          Something broke in the builder
        </h2>
        <p style={{ margin: 0, color: '#888', fontSize: 13, maxWidth: 400 }}>
          {this.state.error?.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={() => {
            this.setState({ hasError: false, error: null, errorInfo: null });
            this.props.onReset?.();
          }}
          style={{
            marginTop: 8,
            padding: '9px 24px',
            borderRadius: 8,
            border: '1px solid #333',
            background: '#1a1a1a',
            color: '#f0f0f0',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          Try again
        </button>
        {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
          <details style={{ marginTop: 12, fontSize: 11, color: '#666', maxWidth: 600, textAlign: 'left' }}>
            <summary style={{ cursor: 'pointer' }}>Stack trace</summary>
            <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>
              {this.state.errorInfo.componentStack}
            </pre>
          </details>
        )}
      </div>
    );
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// UNSAVED CHANGES GUARD
// ══════════════════════════════════════════════════════════════════════════════

function useUnsavedChangesGuard(isDirty) {
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);
}

// ══════════════════════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ══════════════════════════════════════════════════════════════════════════════

function useKeyboardShortcuts(handlers) {
  useEffect(() => {
    const onKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (mod && e.key === 's') { e.preventDefault(); handlers.onSave?.(); }
      if (mod && e.key === 'p') { e.preventDefault(); handlers.onPublish?.(); }
      if (mod && e.shiftKey && e.key === 'Z') { e.preventDefault(); handlers.onRedo?.(); }
      if (mod && !e.shiftKey && e.key === 'z') { e.preventDefault(); handlers.onUndo?.(); }
      if (e.key === 'Escape') { handlers.onEscape?.(); }
      if (mod && e.key === '/') { e.preventDefault(); handlers.onToggleHelp?.(); }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlers]);
}

// ══════════════════════════════════════════════════════════════════════════════
// SHORTCUT HELP OVERLAY
// ══════════════════════════════════════════════════════════════════════════════

const SHORTCUTS = [
  { keys: ['⌘', 'S'], label: 'Save draft' },
  { keys: ['⌘', 'P'], label: 'Publish' },
  { keys: ['⌘', 'Z'], label: 'Undo' },
  { keys: ['⌘', '⇧', 'Z'], label: 'Redo' },
  { keys: ['⌘', '/'], label: 'Keyboard shortcuts' },
  { keys: ['Esc'], label: 'Close modals / deselect' },
];

function ShortcutHelp({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#161616',
          border: '1px solid #2a2a2a',
          borderRadius: 12,
          padding: '24px 28px',
          width: 320,
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 500, color: '#f0f0f0' }}>Shortcuts</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
          >
            ✕
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {SHORTCUTS.map(({ keys, label }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#aaa' }}>{label}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {keys.map((k) => (
                  <kbd
                    key={k}
                    style={{
                      fontSize: 11,
                      padding: '2px 7px',
                      borderRadius: 5,
                      background: '#252525',
                      border: '1px solid #333',
                      color: '#ddd',
                      fontFamily: 'system-ui, sans-serif',
                    }}
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BUILDER APP (inner — has access to context)
// ══════════════════════════════════════════════════════════════════════════════

function BuilderApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const { canvasBlocks, colorPalette, fontStyle, undo, redo, saveToCloud } =
    useContext(BuilderContext);

  const { addToast } = useToast();

  // Track unsaved changes
  useEffect(() => {
    setIsDirty(true);
  }, [canvasBlocks, colorPalette, fontStyle]);

  useUnsavedChangesGuard(isDirty);

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await saveToCloud?.();
      setIsDirty(false);
      addToast({ message: 'Draft saved', type: 'success' });
    } catch (err) {
      addToast({ message: err.message || 'Save failed. Try again.', type: 'error', duration: 5000 });
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, saveToCloud, addToast]);

  // ── Undo / Redo ───────────────────────────────────────────────────────────
  const handleUndo = useCallback(() => {
    const success = undo?.();
    if (success === false) addToast({ message: 'Nothing to undo', type: 'info', duration: 1500 });
  }, [undo, addToast]);

  const handleRedo = useCallback(() => {
    const success = redo?.();
    if (success === false) addToast({ message: 'Nothing to redo', type: 'info', duration: 1500 });
  }, [redo, addToast]);

  // ── Escape priority chain ─────────────────────────────────────────────────
  const handleEscape = useCallback(() => {
    if (isModalOpen) { setIsModalOpen(false); return; }
    if (isHelpOpen) { setIsHelpOpen(false); return; }
    if (selectedBlockId) { setSelectedBlockId(null); }
  }, [isModalOpen, isHelpOpen, selectedBlockId]);

  // ── Keyboard shortcuts (via ref to avoid stale closures) ─────────────────
  const shortcutHandlers = useRef({});
  shortcutHandlers.current = {
    onSave: handleSave,
    onPublish: () => setIsModalOpen(true),
    onUndo: handleUndo,
    onRedo: handleRedo,
    onEscape: handleEscape,
    onToggleHelp: () => setIsHelpOpen((v) => !v),
  };
  useKeyboardShortcuts(shortcutHandlers.current);

  return (
    <div
      className="flex flex-col h-screen w-screen bg-brand-canvas overflow-hidden"
      data-preview-mode={previewMode}
    >
      <AppHeader
        onPublishClick={() => setIsModalOpen(true)}
        onSaveClick={handleSave}
        onUndoClick={handleUndo}
        onRedoClick={handleRedo}
        onHelpClick={() => setIsHelpOpen(true)}
        isSaving={isSaving}
        isDirty={isDirty}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
        blockCount={canvasBlocks?.length ?? 0}
      />

      <div
        className="flex-1 flex min-h-0 overflow-hidden"
        role="main"
        aria-label="Website builder workspace"
      >
        <LeftPanel />

        <Canvas
          previewMode={previewMode}
          selectedBlockId={selectedBlockId}
          onBlockSelect={setSelectedBlockId}
          onBlockChange={() => setIsDirty(true)}
        />

        <RightPanel
          selectedBlockId={selectedBlockId}
          onBlockDeselect={() => setSelectedBlockId(null)}
        />
      </div>

      <PublishModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          setIsDirty(false);
          addToast({ message: 'Site published successfully 🎉', type: 'success', duration: 5000 });
        }}
        onError={(msg) =>
          addToast({ message: msg || 'Publish failed. Try again.', type: 'error', duration: 6000 })
        }
        canvasBlocks={canvasBlocks}
        colorPalette={colorPalette}
        fontStyle={fontStyle}
      />

      <ShortcutHelp isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT — providers + error boundary
// ══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [errorKey, setErrorKey] = useState(0);

  return (
    <ErrorBoundary
      key={errorKey}
      onReset={() => setErrorKey((k) => k + 1)}
    >
      <ToastProvider>
        <BuilderProvider>
          <DndProvider backend={HTML5Backend}>
            <BuilderApp />
          </DndProvider>
        </BuilderProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}