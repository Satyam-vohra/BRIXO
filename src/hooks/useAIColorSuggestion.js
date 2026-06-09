import { useState } from 'react';

export function useAIColorSuggestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const suggestColors = async (businessType) => {
    setLoading(true);
    setError(null);

    try {
      const prompt = `You are a professional color designer.
Suggest a color palette for a ${businessType} website.
Return ONLY a valid JSON object, no markdown, no explanation outside JSON:
{
  "primary": "#hexcode",
  "secondary": "#hexcode",
  "accent": "#hexcode",
  "background": "#hexcode",
  "text": "#hexcode",
  "reasoning": "One paragraph explaining why these colors work for ${businessType} business, referencing color psychology and industry standards."
}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
          // Note: No Authorization header needed — auto-injected by environment
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      
      if (!responseData.content || !responseData.content[0] || !responseData.content[0].text) {
        throw new Error("Invalid response format from AI assistant.");
      }

      const text = responseData.content[0].text;
      const clean = text.replace(/```json|```/g, '').trim();
      const data = JSON.parse(clean);

      // Validate required fields
      const requiredFields = ['primary', 'secondary', 'accent', 'background', 'text', 'reasoning'];
      const missing = requiredFields.filter(field => !data[field]);
      if (missing.length > 0) {
        throw new Error(`AI response is missing fields: ${missing.join(', ')}`);
      }

      return data;
    } catch (err) {
      console.error("AI Color Suggestion error:", err);
      setError(err.message || "Something went wrong while fetching suggestions.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { suggestColors, loading, error };
}
