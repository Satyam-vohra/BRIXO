const Anthropic = require("@anthropic-ai/sdk");

const getClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set in environment variables.");
  }
  return new Anthropic({ apiKey });
};

// ─── POST /api/ai/suggest-colors ─────────────────────────────
const suggestColors = async (req, res) => {
  try {
    const { businessType } = req.body;
    if (!businessType) {
      return res.status(400).json({ success: false, message: "businessType is required" });
    }

    const client = getClient();

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `You are a professional UI/UX color palette designer.
Generate a color palette for a ${businessType} website. Respond ONLY with valid JSON — no markdown, no text outside JSON.
Format:
{
  "primary": "#hexcode",
  "secondary": "#hexcode",
  "accent": "#hexcode",
  "background": "#hexcode",
  "text": "#hexcode",
  "reasoning": "One sentence max 30 words explaining why these colors suit ${businessType}."
}
Rules: all hex codes must be 6-digit starting with #. text must contrast well with background (WCAG AA).`,
        },
      ],
    });

    const raw = message.content[0].text.trim();
    const clean = raw.replace(/```json|```/g, "").trim();

    let palette;
    try {
      palette = JSON.parse(clean);
    } catch {
      return res.status(500).json({ success: false, message: "AI returned invalid JSON." });
    }

    const missing = ["primary", "secondary", "accent", "background", "text", "reasoning"].filter(
      (k) => !palette[k]
    );
    if (missing.length) {
      return res
        .status(500)
        .json({ success: false, message: `Missing fields: ${missing.join(", ")}` });
    }

    res.json({ success: true, data: palette });
  } catch (err) {
    console.error("AI suggestColors error:", err.message);
    res.status(500).json({ success: false, message: err.message || "AI request failed" });
  }
};

// ─── POST /api/ai/generate-content ───────────────────────────
const generateContent = async (req, res) => {
  try {
    const { businessType, blockType } = req.body;
    if (!businessType || !blockType) {
      return res
        .status(400)
        .json({ success: false, message: "businessType and blockType required" });
    }

    const prompts = {
      hero: `Generate hero copy for a ${businessType} website. Return ONLY JSON:
{"headline":"under 10 words","subheadline":"under 25 words","button1Text":"under 4 words","button2Text":"under 4 words"}`,
      cta: `Generate CTA copy for a ${businessType} website. Return ONLY JSON:
{"headline":"under 12 words","buttonText":"under 4 words"}`,
      features: `Generate 3 features for a ${businessType} website. Return ONLY JSON:
{"feature1Title":"","feature1Desc":"under 15 words","feature2Title":"","feature2Desc":"under 15 words","feature3Title":"","feature3Desc":"under 15 words"}`,
    };

    if (!prompts[blockType]) {
      return res
        .status(400)
        .json({ success: false, message: `Unsupported blockType: ${blockType}` });
    }

    const client = getClient();

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 400,
      messages: [{ role: "user", content: prompts[blockType] }],
    });

    const clean = message.content[0].text.trim().replace(/```json|```/g, "").trim();

    let content;
    try {
      content = JSON.parse(clean);
    } catch {
      return res.status(500).json({ success: false, message: "AI returned invalid JSON." });
    }

    res.json({ success: true, data: content });
  } catch (err) {
    console.error("AI generateContent error:", err.message);
    res.status(500).json({ success: false, message: err.message || "AI request failed" });
  }
};

module.exports = { suggestColors, generateContent };
