require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { connectDB, getIsConnected } = require("./config/db");
const Website = require("./models/Website");
const storage = require("./utils/storage");

const authRoutes = require("./routes/authRoutes");
const websiteRoutes = require("./routes/websiteRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// ── CORS ────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));

// ── Rate limiting ────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ── API Routes ───────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/website", websiteRoutes);
app.use("/api/ai", aiRoutes);

// ── Health check ─────────────────────────────────────────────────
app.get("/api/health", (_, res) =>
  res.json({ success: true, message: "BRIXO API running 🚀", db: getIsConnected() })
);

// Public route to view a published website directly in the browser
app.get("/published/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const isDbConnected = getIsConnected();
    let website;

    if (isDbConnected) {
      website = await Website.findById(id);
    } else {
      website = storage.getWebsiteById(id);
    }

    if (!website || !website.isPublished || !website.publishedHtml) {
      res.setHeader("Content-Type", "text/html");
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Website Not Found - BRIXO</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-slate-50 flex items-center justify-center min-h-screen text-slate-800 font-sans">
          <div class="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-center animate-in fade-in zoom-in duration-350">
            <div class="mx-auto w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6 text-4xl shadow-inner">
              ⚠️
            </div>
            <h1 class="text-2xl font-bold text-slate-800">Website Not Found</h1>
            <p class="text-sm text-slate-500 mt-3 leading-relaxed">
              The website you are trying to view does not exist or has not been published yet.
            </p>
            <div class="mt-6 border-t border-slate-100 pt-6">
              <span class="text-xs text-slate-400 font-medium">BRIXO Website Builder Engine</span>
            </div>
          </div>
        </body>
        </html>
      `);
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(website.publishedHtml);
  } catch (error) {
    console.error("Serve published website error:", error);
    res.setHeader("Content-Type", "text/html");
    return res.status(500).send(`<h1>Internal Server Error</h1><p>${error.message}</p>`);
  }
});

app.get("/", (req, res) => {
  res.json({ success: true, message: "BRIXO Backend is running!" });
});

// ── 404 handler ──────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ success: false, message: "Route not found" }));

// ── Global error handler ─────────────────────────────────────────
app.use((err, req, res, _next) =>
  res.status(err.status || 500).json({ success: false, message: err.message || "Server error" })
);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅  BRIXO Server running on port ${PORT}`);
  });
};

startServer();
