function escapeHtml(str) {
  if (!str) return "";
  return str
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateStaticHTML(canvasBlocks, colorPalette, fontStyle) {
  const sectionsHTML = canvasBlocks.map(block => {
    const { type, content } = block;
    switch(type) {
      case "navbar":
        return `
  <!-- Navbar -->
  <nav class="border-b border-gray-100 bg-site-bg py-4 px-6 md:px-12 flex justify-between items-center transition-colors">
    <span class="text-xl font-bold text-site-primary">${escapeHtml(content.logoText || "BRIXO")}</span>
    <div class="hidden md:flex gap-6 text-sm font-medium text-site-text/80">
      <a href="#" class="hover:text-site-primary transition">Home</a>
      <a href="#" class="hover:text-site-primary transition">Services</a>
      <a href="#" class="hover:text-site-primary transition">About</a>
      <a href="#" class="hover:text-site-primary transition">Contact</a>
    </div>
    <button class="bg-site-primary text-white text-sm font-semibold py-2 px-4 rounded-lg hover:brightness-110 shadow-sm transition">
      ${escapeHtml(content.ctaButtonText || "Get Started")}
    </button>
  </nav>
        `;
      case "hero":
        return `
  <!-- Hero -->
  <header class="py-20 px-6 md:px-12 text-center bg-gradient-to-br from-site-primary/10 to-site-secondary/10 flex flex-col items-center justify-center transition-colors">
    <h1 class="text-4xl md:text-6xl font-bold text-site-text max-w-3xl leading-tight mb-6">${escapeHtml(content.headline)}</h1>
    <p class="text-lg md:text-xl text-site-text/75 max-w-2xl mb-8">${escapeHtml(content.subheadline)}</p>
    <div class="flex gap-4">
      <button class="bg-site-primary text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:brightness-110 transition">${escapeHtml(content.button1Text)}</button>
      <button class="bg-white border border-gray-200 text-site-text font-semibold py-3 px-6 rounded-xl shadow-sm hover:bg-gray-50 transition">${escapeHtml(content.button2Text)}</button>
    </div>
  </header>
        `;
      case "products":
        return `
  <!-- Products Grid -->
  <section class="py-16 px-6 md:px-12 bg-site-bg transition-colors">
    <h2 class="text-3xl font-bold text-center text-site-text mb-12">${escapeHtml(content.title || "Featured Products")}</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div class="border border-gray-100 rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
        <div class="aspect-video bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400 font-medium">Image Placeholder</div>
        <div>
          <h3 class="text-lg font-bold text-site-text">${escapeHtml(content.product1Name || "Product 1")}</h3>
          <p class="text-site-primary font-bold mt-2">${escapeHtml(content.product1Price || "$0.00")}</p>
        </div>
        <button class="w-full mt-6 bg-site-primary text-white py-2 px-4 rounded-lg font-semibold hover:brightness-110 transition">Buy Now</button>
      </div>
      <div class="border border-gray-100 rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
        <div class="aspect-video bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400 font-medium">Image Placeholder</div>
        <div>
          <h3 class="text-lg font-bold text-site-text">${escapeHtml(content.product2Name || "Product 2")}</h3>
          <p class="text-site-primary font-bold mt-2">${escapeHtml(content.product2Price || "$0.00")}</p>
        </div>
        <button class="w-full mt-6 bg-site-primary text-white py-2 px-4 rounded-lg font-semibold hover:brightness-110 transition">Buy Now</button>
      </div>
      <div class="border border-gray-100 rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
        <div class="aspect-video bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400 font-medium">Image Placeholder</div>
        <div>
          <h3 class="text-lg font-bold text-site-text">${escapeHtml(content.product3Name || "Product 3")}</h3>
          <p class="text-site-primary font-bold mt-2">${escapeHtml(content.product3Price || "$0.00")}</p>
        </div>
        <button class="w-full mt-6 bg-site-primary text-white py-2 px-4 rounded-lg font-semibold hover:brightness-110 transition">Buy Now</button>
      </div>
    </div>
  </section>
        `;
      case "features":
        return `
  <!-- Features -->
  <section class="py-16 px-6 md:px-12 bg-gray-50/50 transition-colors">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <span class="text-3xl mb-4 block">🎨</span>
        <h3 class="text-lg font-bold text-site-text mb-2">${escapeHtml(content.feature1Title || "Feature 1")}</h3>
        <p class="text-sm text-site-text/70 leading-relaxed">${escapeHtml(content.feature1Desc || "Description 1")}</p>
      </div>
      <div class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <span class="text-3xl mb-4 block">🖱️</span>
        <h3 class="text-lg font-bold text-site-text mb-2">${escapeHtml(content.feature2Title || "Feature 2")}</h3>
        <p class="text-sm text-site-text/70 leading-relaxed">${escapeHtml(content.feature2Desc || "Description 2")}</p>
      </div>
      <div class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <span class="text-3xl mb-4 block">🚀</span>
        <h3 class="text-lg font-bold text-site-text mb-2">${escapeHtml(content.feature3Title || "Feature 3")}</h3>
        <p class="text-sm text-site-text/70 leading-relaxed">${escapeHtml(content.feature3Desc || "Description 3")}</p>
      </div>
    </div>
  </section>
        `;
      case "testimonials":
        return `
  <!-- Testimonials -->
  <section class="py-16 px-6 md:px-12 bg-site-bg transition-colors">
    <h2 class="text-3xl font-bold text-center text-site-text mb-12">${escapeHtml(content.title || "What Our Clients Say")}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div class="p-6 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm flex flex-col justify-between">
        <p class="text-site-text/80 italic leading-relaxed">"${escapeHtml(content.testimonial1Quote || "")}"</p>
        <div class="flex items-center gap-3 mt-6">
          <div class="w-10 h-10 rounded-full bg-site-primary/20 text-site-primary font-bold flex items-center justify-center">${escapeHtml((content.testimonial1Name || "S").charAt(0))}</div>
          <span class="font-semibold text-site-text text-sm">${escapeHtml(content.testimonial1Name || "Sarah Connor")}</span>
        </div>
      </div>
      <div class="p-6 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm flex flex-col justify-between">
        <p class="text-site-text/80 italic leading-relaxed">"${escapeHtml(content.testimonial2Quote || "")}"</p>
        <div class="flex items-center gap-3 mt-6">
          <div class="w-10 h-10 rounded-full bg-site-primary/20 text-site-primary font-bold flex items-center justify-center">${escapeHtml((content.testimonial2Name || "M").charAt(0))}</div>
          <span class="font-semibold text-site-text text-sm">${escapeHtml(content.testimonial2Name || "Marcus Wright")}</span>
        </div>
      </div>
    </div>
  </section>
        `;
      case "gallery":
        return `
  <!-- Gallery -->
  <section class="py-16 px-6 md:px-12 bg-gray-50/30 transition-colors">
    <h2 class="text-3xl font-bold text-center text-site-text mb-12">${escapeHtml(content.title || "Our Gallery")}</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
      <div class="aspect-[4/3] bg-gray-200/80 rounded-2xl flex items-center justify-center text-gray-400 text-sm font-medium">Image 1</div>
      <div class="aspect-[4/3] bg-gray-200/80 rounded-2xl flex items-center justify-center text-gray-400 text-sm font-medium">Image 2</div>
      <div class="aspect-[4/3] bg-gray-200/80 rounded-2xl flex items-center justify-center text-gray-400 text-sm font-medium">Image 3</div>
      <div class="aspect-[4/3] bg-gray-200/80 rounded-2xl flex items-center justify-center text-gray-400 text-sm font-medium">Image 4</div>
      <div class="aspect-[4/3] bg-gray-200/80 rounded-2xl flex items-center justify-center text-gray-400 text-sm font-medium">Image 5</div>
      <div class="aspect-[4/3] bg-gray-200/80 rounded-2xl flex items-center justify-center text-gray-400 text-sm font-medium">Image 6</div>
    </div>
  </section>
        `;
      case "cta":
        return `
  <!-- CTA Banner -->
  <section class="py-20 px-6 md:px-12 text-center bg-site-primary text-white transition-colors">
    <h2 class="text-3xl md:text-5xl font-bold max-w-3xl mx-auto mb-6 leading-tight">${escapeHtml(content.headline)}</h2>
    <button class="bg-white text-site-primary font-bold py-3 px-8 rounded-xl hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-200">${escapeHtml(content.buttonText)}</button>
  </section>
        `;
      case "footer":
        return `
  <!-- Footer -->
  <footer class="py-12 px-6 md:px-12 bg-slate-900 text-white transition-colors">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-800 pb-8">
      <span class="text-xl font-bold text-site-primary">${escapeHtml(content.companyName || "BRIXO Inc.")}</span>
      <div class="flex gap-6 text-sm text-slate-400">
        <a href="#" class="hover:text-white transition">Privacy Policy</a>
        <a href="#" class="hover:text-white transition">Terms of Service</a>
        <a href="#" class="hover:text-white transition">Support</a>
      </div>
    </div>
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mt-8 text-sm text-slate-400">
      <span>${escapeHtml(content.copyrightText || "© 2026 BRIXO. All rights reserved.")}</span>
      <div class="flex gap-4">
        <a href="#" class="hover:text-white transition">𝕏</a>
        <a href="#" class="hover:text-white transition">🔗</a>
        <a href="#" class="hover:text-white transition">📸</a>
      </div>
    </div>
  </footer>
        `;
      default:
        return "";
    }
  }).join("\n");

  let fontCSS = "";
  switch(fontStyle) {
    case "Classic":
      fontCSS = "font-family: Georgia, Cambria, serif;";
      break;
    case "Elegant":
      fontCSS = "font-family: Garamond, 'Playfair Display', serif;";
      break;
    case "Friendly":
      fontCSS = "font-family: 'Quicksand', 'Comic Sans MS', sans-serif;";
      break;
    case "Modern":
    default:
      fontCSS = "font-family: 'Inter', system-ui, sans-serif;";
      break;
  }

  const primary = colorPalette.primary || "#4F6EF7";
  const secondary = colorPalette.secondary || "#7C3AED";
  const accent = colorPalette.accent || "#F59E0B";
  const background = colorPalette.background || "#ffffff";
  const text = colorPalette.text || "#1a1a2e";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(canvasBlocks.find(b => b.type === "hero")?.content?.headline || "My BRIXO Website")}</title>
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            site: {
              primary: 'var(--site-primary)',
              secondary: 'var(--site-secondary)',
              accent: 'var(--site-accent)',
              bg: 'var(--site-bg)',
              text: 'var(--site-text)',
            }
          }
        }
      }
    }
  </script>
  <style>
    :root {
      --site-primary: ${primary};
      --site-secondary: ${secondary};
      --site-accent: ${accent};
      --site-bg: ${background};
      --site-text: ${text};
    }
    body {
      ${fontCSS}
      background-color: var(--site-bg);
      color: var(--site-text);
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body class="antialiased">
${sectionsHTML}
</body>
</html>`;
}

module.exports = { generateStaticHTML };
