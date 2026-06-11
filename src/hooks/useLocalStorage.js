import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_VERSION = 1;
const DEFAULT_OPTIONS = {
  ttl: null,           // milliseconds — null = no expiry
  encrypt: false,      // XOR-based obfuscation (not cryptographic)
  encryptKey: 'lsk',   // seed string for obfuscation
  serialize: JSON.stringify,
  deserialize: JSON.parse,
  onError: null,       // (err, context) => void
  syncAcrossTabs: true,
};

// ─── Obfuscation (lightweight, not security-grade) ───────────────────────────
function obfuscate(str, seed) {
  return btoa(
    str.split('').map((c, i) =>
      String.fromCharCode(c.charCodeAt(0) ^ seed.charCodeAt(i % seed.length))
    ).join('')
  );
}

function deobfuscate(str, seed) {
  try {
    return atob(str).split('').map((c, i) =>
      String.fromCharCode(c.charCodeAt(0) ^ seed.charCodeAt(i % seed.length))
    ).join('');
  } catch {
    return str; // not obfuscated — return as-is
  }
}

// ─── Storage envelope (wraps value with metadata) ────────────────────────────
function wrap(value, options) {
  return {
    _v: STORAGE_VERSION,
    _t: Date.now(),
    _exp: options.ttl ? Date.now() + options.ttl : null,
    value,
  };
}

function unwrap(envelope) {
  // Legacy: plain value without envelope
  if (!envelope || typeof envelope !== 'object' || !('_v' in envelope)) {
    return { value: envelope, expired: false };
  }
  const expired = envelope._exp !== null && Date.now() > envelope._exp;
  return { value: envelope.value, expired };
}

// ─── Safe storage read/write ──────────────────────────────────────────────────
function readStorage(key, options) {
  const raw = window.localStorage.getItem(key);
  if (raw === null) return { found: false, value: undefined, expired: false };

  let decoded = raw;
  if (options.encrypt) decoded = deobfuscate(raw, options.encryptKey);

  const parsed = options.deserialize(decoded);
  const { value, expired } = unwrap(parsed);
  return { found: true, value, expired };
}

function writeStorage(key, value, options) {
  const envelope = wrap(value, options);
  let serialized = options.serialize(envelope);
  if (options.encrypt) serialized = obfuscate(serialized, options.encryptKey);
  window.localStorage.setItem(key, serialized);
}

function removeStorage(key) {
  window.localStorage.removeItem(key);
}

// ─── Main Hook ────────────────────────────────────────────────────────────────
/**
 * useLocalStorage — advanced localStorage hook
 *
 * @param {string}   key           Storage key
 * @param {*}        initialValue  Default value if key is absent or expired
 * @param {object}   options       See DEFAULT_OPTIONS
 *
 * Returns: [value, setValue, { remove, reset, refresh, isExpired, lastUpdated }]
 */
export function useLocalStorage(key, initialValue, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const optsRef = useRef(opts);
  optsRef.current = opts;

  const handleError = useCallback((err, context) => {
    console.error(`[useLocalStorage] ${context} — key: "${key}"`, err);
    optsRef.current.onError?.(err, context);
  }, [key]);

  // ── Initial state ──────────────────────────────────────────────────────────
  const [state, setState] = useState(() => {
    try {
      const { found, value, expired } = readStorage(key, opts);
      if (!found || expired) {
        if (expired) removeStorage(key);
        return { value: initialValue, lastUpdated: null, isExpired: expired };
      }
      return { value, lastUpdated: Date.now(), isExpired: false };
    } catch (err) {
      handleError(err, 'init');
      return { value: initialValue, lastUpdated: null, isExpired: false };
    }
  });

  // ── setValue ───────────────────────────────────────────────────────────────
  const setValue = useCallback((valueOrUpdater) => {
    try {
      setState((prev) => {
        const next = valueOrUpdater instanceof Function
          ? valueOrUpdater(prev.value)
          : valueOrUpdater;

        writeStorage(key, next, optsRef.current);
        return { value: next, lastUpdated: Date.now(), isExpired: false };
      });
    } catch (err) {
      handleError(err, 'set');
    }
  }, [key, handleError]);

  // ── remove ─────────────────────────────────────────────────────────────────
  const remove = useCallback(() => {
    try {
      removeStorage(key);
      setState({ value: initialValue, lastUpdated: null, isExpired: false });
    } catch (err) {
      handleError(err, 'remove');
    }
  }, [key, initialValue, handleError]);

  // ── reset (back to initialValue, also writes it) ───────────────────────────
  const reset = useCallback(() => {
    setValue(initialValue);
  }, [setValue, initialValue]);

  // ── refresh (re-read from storage, e.g. after manual external write) ───────
  const refresh = useCallback(() => {
    try {
      const { found, value, expired } = readStorage(key, optsRef.current);
      if (!found || expired) {
        if (expired) removeStorage(key);
        setState({ value: initialValue, lastUpdated: null, isExpired: expired });
      } else {
        setState({ value, lastUpdated: Date.now(), isExpired: false });
      }
    } catch (err) {
      handleError(err, 'refresh');
    }
  }, [key, initialValue, handleError]);

  // ── Cross-tab sync via storage event ──────────────────────────────────────
  useEffect(() => {
    if (!opts.syncAcrossTabs) return;

    const handler = (event) => {
      if (event.key !== key) return;

      if (event.newValue === null) {
        // Another tab removed the key
        setState({ value: initialValue, lastUpdated: null, isExpired: false });
        return;
      }

      try {
        let decoded = event.newValue;
        if (optsRef.current.encrypt) decoded = deobfuscate(decoded, optsRef.current.encryptKey);
        const parsed = optsRef.current.deserialize(decoded);
        const { value, expired } = unwrap(parsed);
        if (!expired) {
          setState({ value, lastUpdated: Date.now(), isExpired: false });
        }
      } catch (err) {
        handleError(err, 'cross-tab sync');
      }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key, initialValue, opts.syncAcrossTabs, handleError]);

  // ── TTL expiry watcher ────────────────────────────────────────────────────
  useEffect(() => {
    if (!opts.ttl || state.isExpired || state.lastUpdated === null) return;

    const remaining = opts.ttl - (Date.now() - state.lastUpdated);
    if (remaining <= 0) {
      removeStorage(key);
      setState({ value: initialValue, lastUpdated: null, isExpired: true });
      return;
    }

    const timer = setTimeout(() => {
      removeStorage(key);
      setState({ value: initialValue, lastUpdated: null, isExpired: true });
    }, remaining);

    return () => clearTimeout(timer);
  }, [key, opts.ttl, state.lastUpdated, state.isExpired, initialValue]);

  return [
    state.value,
    setValue,
    {
      remove,
      reset,
      refresh,
      isExpired: state.isExpired,
      lastUpdated: state.lastUpdated,
    },
  ];
}

// ─── Utility: bulk-read multiple keys ─────────────────────────────────────────
/**
 * readAllStorageKeys()
 * Returns all localStorage keys with their parsed envelopes (metadata visible).
 * Useful for debugging or building a storage inspector.
 */
export function readAllStorageKeys() {
  const result = {};
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    try {
      const raw = window.localStorage.getItem(key);
      result[key] = JSON.parse(raw);
    } catch {
      result[key] = window.localStorage.getItem(key);
    }
  }
  return result;
}

// ─── Utility: storage quota estimate ─────────────────────────────────────────
export async function estimateStorageUsage() {
  if (!navigator.storage?.estimate) return null;
  const { usage, quota } = await navigator.storage.estimate();
  return {
    usedMB: +(usage / 1024 / 1024).toFixed(2),
    quotaMB: +(quota / 1024 / 1024).toFixed(2),
    percentUsed: +((usage / quota) * 100).toFixed(1),
  };
}