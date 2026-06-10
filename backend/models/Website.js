const mongoose = require("mongoose");

const WebsiteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    title: {
      type: String,
      default: "My BRIXO Website"
    },
    businessType: {
      type: String,
      required: true,
      default: "Tech"
    },
    fontStyle: {
      type: String,
      required: true,
      default: "Modern"
    },
    colorPalette: {
      primary: { type: String, default: "#4F6EF7" },
      secondary: { type: String, default: "#7C3AED" },
      accent: { type: String, default: "#F59E0B" },
      background: { type: String, default: "#ffffff" },
      text: { type: String, default: "#1a1a2e" },
      reasoning: { type: String, default: "" }
    },
    blocks: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    publishedHtml: {
      type: String,
      default: ""
    },
    publishedUrl: {
      type: String,
      default: ""
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Website", WebsiteSchema);
