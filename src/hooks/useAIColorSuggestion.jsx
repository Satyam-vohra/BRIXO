import { useState, useCallback, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 800;
const REQUIRED_FIELDS = ["primary", "secondary", "accent", "background", "text", "reasoning"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const isValidHex = (val) => /^#([0-9A-Fa-f]{3}){1,2}$/.test(val);

const validatePalette = (data) => {
  const missing = REQUIRED_FIELDS.filter((f) => !data[f]);
  if (missing.length) throw new Error(`Missing fields: ${missing.join(", ")}`);
  const colorFields = ["primary", "secondary", "accent", "background", "text"];
  const invalid = colorFields.filter((f) => !isValidHex(data[f]));
  if (invalid.length) throw new Error(`Invalid hex values: ${invalid.join(", ")}`);
  return data;
};

const buildPrompt = (businessType, mood = "professional") => `
You are a senior brand color designer with 15+ years of experience.
Design a color palette for a ${businessType} website with a ${mood} mood.

Rules:
- Colors must meet WCAG AA contrast (text on background ≥ 4.5:1)
- Palette must feel cohesive and industry-appropriate
- No two colors should clash

Return ONLY valid JSON, no markdown fences, no extra text:
{
  "primary": "#hexcode",
  "secondary": "#hexcode",
  "accent": "#hexcode",
  "background": "#hexcode",
  "text": "#hexcode",
  "reasoning": "2-3 sentences explaining the palette choices using color psychology and ${businessType} industry standards.",
  "contrastRatio": "estimated contrast ratio of text on background as a string e.g. 7.2:1",
  "tags": ["tag1", "tag2", "tag3"]
}
`.trim();

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAIColorSuggestion() {
  const [state, setState] = useState({
    loading: false,
    error: null,
    palette: null,
    history: [],
    retryCount: 0,
    cached: false,
  });

  const cacheRef = useRef({});
  const abortRef = useRef(null);

  const suggestColors = useCallback(
    async (businessType, mood = "professional", { force = false } = {}) => {
      if (!businessType?.trim()) {
        setState((s) => ({ ...s, error: "Business type is required." }));
        return null;
      }

      const cacheKey = `${businessType.toLowerCase()}::${mood}`;

      // Return cached if fresh and not forced
      if (!force && cacheRef.current[cacheKey]) {
        const { data, timestamp } = cacheRef.current[cacheKey];
        if (Date.now() - timestamp < CACHE_TTL_MS) {
          setState((s) => ({ ...s, palette: data, error: null, cached: true, loading: false }));
          return data;
        }
      }

      // Cancel any in-flight request
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      setState((s) => ({ ...s, loading: true, error: null, cached: false, retryCount: 0 }));

      let attempt = 0;
      while (attempt <= MAX_RETRIES) {
        try {
          const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: abortRef.current.signal,
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 1000,
              messages: [{ role: "user", content: buildPrompt(businessType, mood) }],
            }),
          });

          if (!response.ok) {
            const errBody = await response.json().catch(() => ({}));
            throw new Error(errBody?.error?.message || `API ${response.status}: ${response.statusText}`);
          }

          const json = await response.json();
          const raw = json?.content?.[0]?.text;
          if (!raw) throw new Error("Empty response from API.");

          const clean = raw.replace(/```json|```/gi, "").trim();
          const parsed = JSON.parse(clean);
          const validated = validatePalette(parsed);

          // Write cache
          cacheRef.current[cacheKey] = { data: validated, timestamp: Date.now() };

          setState((s) => ({
            ...s,
            loading: false,
            palette: validated,
            history: [
              { ...validated, businessType, mood, timestamp: Date.now() },
              ...s.history.slice(0, 9), // keep last 10
            ],
            retryCount: attempt,
            cached: false,
          }));

          return validated;
        } catch (err) {
          if (err.name === "AbortError") {
            setState((s) => ({ ...s, loading: false }));
            return null;
          }

          if (attempt < MAX_RETRIES) {
            attempt++;
            setState((s) => ({ ...s, retryCount: attempt }));
            await sleep(RETRY_DELAY_MS * attempt);
            continue;
          }

          const message =
            err instanceof SyntaxError
              ? "AI returned invalid JSON. Please try again."
              : err.message || "Something went wrong.";

          setState((s) => ({ ...s, loading: false, error: message }));
          return null;
        }
      }
    },
    []
  );

  const cancel = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setState((s) => ({ ...s, loading: false }));
  }, []);

  const clearHistory = useCallback(() => {
    setState((s) => ({ ...s, history: [] }));
    cacheRef.current = {};
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, palette: null, history: [], retryCount: 0, cached: false });
    cacheRef.current = {};
  }, []);

  return {
    ...state,
    suggestColors,
    cancel,
    clearHistory,
    reset,
  };
}

// ─── Demo UI ──────────────────────────────────────────────────────────────────
const BUSINESS_TYPES = [
  "Food & Restaurant", "Fashion & Apparel", "Tech Startup", "Healthcare",
  "Real Estate", "Fitness & Wellness", "Education", "Finance & Banking",
];
const MOODS = ["professional", "playful", "luxurious", "minimalist", "bold"];

function ColorSwatch({ label, hex }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(hex).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div onClick={copy} style={{ cursor: "pointer", userSelect: "none" }}>
      <div
        style={{
          width: "100%", height: 72,
          background: hex,
          borderRadius: 10,
          border: "1px solid rgba(0,0,0,0.08)",
          transition: "transform 0.15s",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <span style={{ fontSize: 12, fontFamily: "monospace", background: "rgba(255,255,255,0.85)", padding: "2px 7px", borderRadius: 6, color: "#111", fontWeight: 600 }}>
          {copied ? "✓ Copied" : hex}
        </span>
      </div>
      <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--color-text-secondary)", textTransform: "capitalize" }}>{label}</p>
    </div>
  );
}

function PalettePreviewer({ palette }) {
  if (!palette) return null;
  const { primary, secondary, accent, background, text, reasoning, contrastRatio, tags } = palette;
  return (
    <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(0,0,0,0.09)", marginTop: 24 }}>
      {/* Live preview bar */}
      <div style={{ background: background, padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: primary }} />
          <span style={{ color: text, fontWeight: 600, fontSize: 15 }}>Brand Preview</span>
        </div>
        <p style={{ color: text, fontSize: 13, opacity: 0.75, margin: "0 0 16px" }}>
          This is how your body text will look against the background.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={{ background: primary, color: background, border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            Primary CTA
          </button>
          <button style={{ background: "transparent", color: primary, border: `2px solid ${primary}`, borderRadius: 8, padding: "8px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            Secondary
          </button>
          <span style={{ background: accent, color: background, borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700 }}>Badge</span>
        </div>
      </div>

      {/* Swatches */}
      <div style={{ padding: "20px 24px", background: "var(--color-background-primary)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
          {[["primary", primary], ["secondary", secondary], ["accent", accent], ["background", background], ["text", text]].map(([l, h]) => (
            <ColorSwatch key={l} label={l} hex={h} />
          ))}
        </div>

        {/* Meta */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {tags?.map((t) => (
            <span key={t} style={{ fontSize: 11, background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border-tertiary)", borderRadius: 20, padding: "3px 10px" }}>{t}</span>
          ))}
          {contrastRatio && (
            <span style={{ fontSize: 11, background: "#d1fae5", color: "#065f46", borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}>
              ✓ Contrast {contrastRatio}
            </span>
          )}
        </div>

        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.65, margin: 0 }}>{reasoning}</p>
      </div>
    </div>
  );
}

export default function AIColorDemo() {
  const [businessType, setBusinessType] = useState("");
  const [mood, setMood] = useState("professional");
  const [showHistory, setShowHistory] = useState(false);
  const { suggestColors, cancel, clearHistory, loading, error, palette, history, retryCount, cached } = useAIColorSuggestion();

  const handleSubmit = () => {
    if (businessType.trim()) suggestColors(businessType, mood);
  };

  return (
    <div style={{ fontFamily: "var(--font-sans)", padding: "28px 24px", maxWidth: 680, margin: "0 auto" }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 4px" }}>AI Color Palette Generator</h2>
      <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: "0 0 24px" }}>
        Powered by Claude — picks industry-appropriate colors with reasoning
      </p>

      {/* Preset chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        {BUSINESS_TYPES.map((b) => (
          <button
            key={b}
            onClick={() => setBusinessType(b)}
            style={{
              fontSize: 12, padding: "5px 12px", borderRadius: 20,
              border: businessType === b ? "1.5px solid var(--color-border-info)" : "1px solid var(--color-border-tertiary)",
              background: businessType === b ? "var(--color-background-info)" : "var(--color-background-secondary)",
              color: businessType === b ? "var(--color-text-info)" : "var(--color-text-secondary)",
              cursor: "pointer", fontWeight: businessType === b ? 600 : 400,
              transition: "all 0.15s",
            }}
          >{b}</button>
        ))}
      </div>

      {/* Inputs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <input
          type="text"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Or type your business type…"
          style={{ flex: 1, borderRadius: 10, padding: "10px 14px", fontSize: 14, border: "1px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", outline: "none" }}
        />
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          style={{ borderRadius: 10, padding: "10px 12px", fontSize: 13, border: "1px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", cursor: "pointer" }}
        >
          {MOODS.map((m) => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
        </select>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={handleSubmit}
          disabled={loading || !businessType.trim()}
          style={{
            flex: 1, padding: "11px 20px", borderRadius: 10, fontWeight: 600, fontSize: 14,
            border: "none", cursor: loading || !businessType.trim() ? "not-allowed" : "pointer",
            background: loading || !businessType.trim() ? "var(--color-border-secondary)" : "#6366f1",
            color: "#fff", transition: "all 0.15s",
          }}
        >
          {loading
            ? retryCount > 0 ? `Retrying… (${retryCount}/${2})` : "Generating…"
            : cached ? "✓ Cached — Regenerate" : "✨ Suggest Colors"}
        </button>
        {loading && (
          <button onClick={cancel} style={{ padding: "11px 16px", borderRadius: 10, border: "1px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", cursor: "pointer", fontSize: 13 }}>
            Cancel
          </button>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div style={{ marginTop: 24, borderRadius: 16, overflow: "hidden", border: "1px solid var(--color-border-tertiary)" }}>
          {[80, 72, 40, 60].map((w, i) => (
            <div key={i} style={{ height: i === 0 ? 100 : 20, margin: i === 0 ? 0 : "12px 24px", width: `${w}%`, borderRadius: 8, background: "var(--color-background-secondary)", animation: "pulse 1.4s ease-in-out infinite" }} />
          ))}
          <div style={{ height: 24 }} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10, background: "var(--color-background-danger)", border: "1px solid var(--color-border-danger)", color: "var(--color-text-danger)", fontSize: 13 }}>
          ⚠ {error}
        </div>
      )}

      {/* Result */}
      {!loading && palette && <PalettePreviewer palette={palette} />}

      {/* History */}
      {history.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <button onClick={() => setShowHistory((v) => !v)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)" }}>
              {showHistory ? "▾" : "▸"} History ({history.length})
            </button>
            <button onClick={clearHistory} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--color-text-tertiary)" }}>Clear</button>
          </div>
          {showHistory && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {history.map((h, i) => (
                <div key={i} onClick={() => suggestColors(h.businessType, h.mood, { force: false })} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, border: "1px solid var(--color-border-tertiary)", cursor: "pointer", background: "var(--color-background-secondary)" }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {[h.primary, h.secondary, h.accent, h.background, h.text].map((c, j) => (
                      <div key={j} style={{ width: 20, height: 20, borderRadius: 5, background: c, border: "1px solid rgba(0,0,0,0.08)" }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 13, color: "var(--color-text-primary)", fontWeight: 500 }}>{h.businessType}</span>
                  <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginLeft: "auto" }}>{h.mood}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>
    </div>
  );
}