require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB, getIsConnected } = require("./config/db");
const Website = require("./models/Website");
const storage = require("./utils/storage");

const authRoutes = require("./routes/authRoutes");
const websiteRoutes = require("./routes/websiteRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/website", websiteRoutes);

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

    // Serve the generated static HTML page
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(website.publishedHtml);
  } catch (error) {
    console.error("Serve published website error:", error);
    res.setHeader("Content-Type", "text/html");
    return res.status(500).send(`<h1>Internal Server Error</h1><p>${error.message}</p>`);
  }
});

const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
  // Try connecting to MongoDB
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();