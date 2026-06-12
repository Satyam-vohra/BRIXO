import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Hook: useAIColorSuggestion
 * Calls POST /api/ai/suggest-colors with a businessType and returns a color palette.
 */
export function useAIColorSuggestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const suggestColors = async (businessType) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('brixo_token');
      const res = await fetch(`${API_BASE}/ai/suggest-colors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ businessType }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'AI suggestion failed');
      return data.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { suggestColors, loading, error };
}

export default useAIColorSuggestion;