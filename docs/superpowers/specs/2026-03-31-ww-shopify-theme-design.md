# WW Shopify Theme — Design Specification

## 1. Projektübersicht

**Ziel:** High-End Shopify OS 2.0 Custom-Theme für eine nachhaltige Möbelmarke. Kernprodukt: Hochwertige Möbel aus Biokunststoff "Made in Italy". Das Theme muss skalierbar sein für zukünftige Erweiterung auf generische Möbelkategorien.

**Designprinzip:** Premium-Look mit extremer Usability. Inspiriert von Hem.com (minimalistisch, viel Whitespace), mit der Funktionalität von Westwing/Connox (Farbswatches, Accordion, Trust-Badges, Cross-Selling).

---

## 2. Technologie-Stack

| Komponente | Technologie | Begründung |
|---|---|---|
| CSS | Tailwind CSS (mit PurgeCSS) | Schnelle Entwicklung, konsistentes Design-System, minimales Bundle |
| JavaScript | Alpine.js (global) + Section-spezifisches Lazy JS | Deklarativ in HTML, perfekt für Liquid, winziges Bundle (~15kb) |
| Slider | Splide.js | Leichtgewichtig (~28kb), WCAG-konform, Touch-optimiert, Thumbnail-Sync |
| Build | esbuild + Tailwind CLI + Shopify CLI | Schnelles Bundling, paralleler Dev-Modus |
| Deployment | Git → GitHub/Shopify Integration | Automatischer Sync |

**Architektur-Ansatz:** Hybrid — Tailwind CSS global (ein Build-Output), JavaScript per Section lazy-loaded. Alpine.js + globale Stores werden immer geladen, Section-spezifische Logik (Cart Drawer, Galerie, etc.) nur bei Bedarf.

---

## 3. Ordnerstruktur

```
WW_Shopify_Theme/
├── assets/                    # Compiled output + static assets
│   ├── application.css        # Tailwind compiled output
│   ├── base.js                # Alpine.js + global stores (cart, etc.)
│   ├── cart-drawer.js         # Lazy: Cart Drawer logic
│   ├── product-gallery.js     # Lazy: Splide gallery init
│   ├── product-form.js        # Lazy: Variant switcher + ATC
│   ├── hero-slider.js         # Lazy: Hero Splide init
│   ├── mega-menu.js           # Lazy: Mega menu interactions
│   ├── faq-accordion.js       # Lazy: FAQ accordion
│   ├── splide-core.min.js     # Splide.js library
│   └── splide-core.min.css    # Splide base styles
│
├── config/
│   ├── settings_schema.json   # Theme settings definition
│   └── settings_data.json     # Theme preset values
│
├── layout/
│   ├── theme.liquid           # Hauptlayout
│   └── password.liquid        # Passwort-Seite
│
├── locales/
│   ├── de.default.json        # Deutsche Übersetzungen (Default)
│   └── en.json                # Englische Übersetzungen
│
├── sections/
│   ├── header.liquid          # Header + Mega Menu
│   ├── footer.liquid          # Footer + Newsletter
│   ├── hero-banner.liquid     # Hero mit optionalem Slider + Video
│   ├── featured-collection.liquid
│   ├── collection-list.liquid
│   ├── product-recommendations.liquid
│   ├── faq-section.liquid     # FAQ Accordion (Metaobject-basiert)
│   ├── trust-badges.liquid
│   ├── newsletter.liquid
│   ├── rich-text.liquid
│   ├── image-with-text.liquid
│   ├── cart-drawer.liquid     # Ajax Cart Drawer
│   ├── announcement-bar.liquid
│   └── cross-selling.liquid   # Produkt-Slider Component
│
├── snippets/
│   ├── product-card.liquid    # Wiederverwendbare Produktkarte
│   ├── price.liquid           # Preis-Formatierung (inkl. Compare-at)
│   ├── variant-swatches.liquid# Visuelle Farbswatches
│   ├── icon.liquid            # SVG Icon System
│   ├── image.liquid           # Responsive Image Helper (srcset, lazy)
│   ├── schema-product.liquid  # Schema.org Product + Offer
│   ├── schema-breadcrumb.liquid # Schema.org BreadcrumbList
│   ├── schema-faq.liquid      # Schema.org FAQPage
│   ├── meta-tags.liquid       # SEO Meta Tags
│   ├── cart-item.liquid       # Einzelne Warenkorb-Zeile
│   ├── free-shipping-bar.liquid # Progress Bar
│   └── upsell-products.liquid # Upsell im Cart Drawer
│
├── templates/
│   ├── index.json             # Homepage
│   ├── product.json           # Produktseite
│   ├── collection.json        # Kollektionsseite
│   ├── page.json              # Standardseite
│   ├── page.faq.json          # FAQ-Seiten Template
│   ├── cart.json              # Cart Fallback (wenn JS deaktiviert)
│   ├── blog.json
│   ├── article.json
│   ├── 404.json
│   └── search.json
│
├── src/                       # Source files (nicht deployed)
│   ├── css/
│   │   ├── tailwind.css       # @tailwind directives + custom layers
│   │   └── components.css     # Custom component styles (Splide overrides etc.)
│   └── js/
│       ├── base.js            # Alpine.js setup + global stores
│       ├── cart-drawer.js     # Cart Drawer Logik
│       ├── product-gallery.js # Splide Gallery + Thumbnails
│       ├── product-form.js    # Variant Switcher + Add to Cart
│       ├── hero-slider.js     # Hero Splide Konfiguration
│       ├── mega-menu.js       # Mega Menu Interaktionen
│       └── faq-accordion.js   # FAQ Accordion Logik
│
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .gitignore
├── .shopifyignore             # src/, node_modules/ ignorieren
└── shopify.theme.toml
```

---

## 4. Build Pipeline

### Development

```bash
npm run dev
# Startet parallel:
#   1. shopify theme dev --store=YOUR_STORE (Live Preview)
#   2. npx tailwindcss -i src/css/tailwind.css -o assets/application.css --watch
#   3. npx esbuild src/js/*.js --outdir=assets --bundle --watch
```

### Production

```bash
npm run build
# 1. Tailwind mit PurgeCSS + cssnano Minification
# 2. esbuild Minification + Tree Shaking für alle JS files
# Output → assets/
```

### Deployment

Git Push → GitHub Repository → Shopify GitHub Integration synced automatisch.

---

## 5. Theme Settings Architektur

**Philosophie:** Opinionated mit Smart Defaults. Wenige Kernwerte konfigurierbar, Rest leitet sich ab.

### Global Settings (`settings_schema.json`)

```json
[
  {
    "name": "Brand",
    "settings": [
      { "type": "color", "id": "color_primary", "label": "Primärfarbe", "default": "#1a1a2e" },
      { "type": "color", "id": "color_secondary", "label": "Sekundärfarbe", "default": "#e2e8f0" },
      { "type": "color", "id": "color_accent", "label": "Akzentfarbe", "default": "#16a34a" },
      { "type": "font_picker", "id": "font_heading", "label": "Überschrift-Schriftart", "default": "assistant_n4" },
      { "type": "font_picker", "id": "font_body", "label": "Text-Schriftart", "default": "assistant_n4" },
      { "type": "range", "id": "border_radius", "label": "Ecken-Rundung", "min": 0, "max": 16, "step": 2, "default": 8, "unit": "px" }
    ]
  },
  {
    "name": "Warenkorb",
    "settings": [
      { "type": "range", "id": "free_shipping_threshold", "label": "Gratis-Versand ab", "min": 0, "max": 500, "step": 10, "default": 150, "unit": "€" },
      { "type": "checkbox", "id": "cart_upsell_enabled", "label": "Upselling im Warenkorb", "default": true }
    ]
  },
  {
    "name": "Trust & Social Proof",
    "settings": [
      { "type": "text", "id": "trust_badge_1", "label": "Trust Badge 1", "default": "Made in Italy" },
      { "type": "text", "id": "trust_badge_2", "label": "Trust Badge 2", "default": "Kostenloser Versand" },
      { "type": "text", "id": "trust_badge_3", "label": "Trust Badge 3", "default": "30 Tage Rückgabe" }
    ]
  }
]
```

### Tailwind Integration

Brand-Farben aus Theme Settings werden via Liquid in CSS Custom Properties auf `:root` gesetzt, die Tailwind dann referenziert:

```liquid
<!-- In theme.liquid -->
<style>
  :root {
    --color-primary: {{ settings.color_primary }};
    --color-secondary: {{ settings.color_secondary }};
    --color-accent: {{ settings.color_accent }};
    --border-radius: {{ settings.border_radius }}px;
  }
</style>
```

```javascript
// tailwind.config.js
module.exports = {
  content: ['./**/*.liquid'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
      },
      borderRadius: {
        DEFAULT: 'var(--border-radius)',
      },
    },
  },
}
```

---

## 6. FAQ-System (Metaobjects)

### Datenmodell

**Metaobject: `faq_entry`**

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `question` | single_line_text | Ja | Die Frage |
| `answer` | rich_text | Ja | Die Antwort (kann Links, Listen, Fettdruck enthalten) |

**Metaobject: `faq_set`**

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `title` | single_line_text | Ja | Name des FAQ-Sets (z.B. "Biokunststoff FAQ") |
| `entries` | list.metaobject_reference → faq_entry | Ja | Liste der FAQ-Einträge |

**Metafield-Verknüpfung:**

| Resource | Metafield | Typ |
|---|---|---|
| Collection | `custom.faq_set` | metaobject_reference → faq_set |
| Product | `custom.faq_set` | metaobject_reference → faq_set |
| Page | `custom.faq_set` | metaobject_reference → faq_set |

### Schema.org Integration

Wenn ein FAQ-Set auf einer Seite verknüpft ist, wird automatisch `FAQPage` Schema.org Markup generiert:

```liquid
<!-- snippets/schema-faq.liquid -->
{% if faq_set %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {% for entry in faq_set.entries.value %}
    {
      "@type": "Question",
      "name": {{ entry.question | json }},
      "acceptedAnswer": {
        "@type": "Answer",
        "text": {{ entry.answer | strip_html | json }}
      }
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ]
}
</script>
{% endif %}
```

---

## 7. Cart Drawer Architektur

### State Management (Alpine.js Store)

```javascript
// In base.js
Alpine.store('cart', {
  items: [],
  isOpen: false,
  isLoading: false,
  total: 0,
  itemCount: 0,
  freeShippingThreshold: window.themeSettings.freeShippingThreshold,

  get freeShippingProgress() {
    return Math.min((this.total / this.freeShippingThreshold) * 100, 100);
  },

  get freeShippingRemaining() {
    return Math.max(this.freeShippingThreshold - this.total, 0);
  },

  async init() {
    const res = await fetch('/cart.js');
    const cart = await res.json();
    this.syncCart(cart);
  },

  async addItem(variantId, quantity = 1) {
    this.isLoading = true;
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity })
    });
    const cart = await fetch('/cart.js').then(r => r.json());
    this.syncCart(cart);
    this.isOpen = true;
    this.isLoading = false;
  },

  async updateItem(key, quantity) {
    this.isLoading = true;
    await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity })
    });
    const cart = await fetch('/cart.js').then(r => r.json());
    this.syncCart(cart);
    this.isLoading = false;
  },

  async removeItem(key) {
    await this.updateItem(key, 0);
  },

  syncCart(cart) {
    this.items = cart.items;
    this.total = cart.total_price / 100;
    this.itemCount = cart.item_count;
    document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
  },

  open() { this.isOpen = true; document.body.style.overflow = 'hidden'; },
  close() { this.isOpen = false; document.body.style.overflow = ''; }
});
```

### Upselling-Logik (Hybrid)

```javascript
async fetchUpsells(productId) {
  // 1. Prüfe Metafield-basierte Upsells
  const metafieldUpsells = window.productUpsells; // via Liquid injiziert
  if (metafieldUpsells && metafieldUpsells.length > 0) {
    return metafieldUpsells;
  }

  // 2. Fallback: Shopify Recommendations API
  const res = await fetch(
    `/recommendations/products.json?product_id=${productId}&limit=4`
  );
  const data = await res.json();
  return data.products;
}
```

### Cart Drawer Features

- **Free-Shipping-Progress-Bar** — Animierte Fortschrittsleiste, Schwellenwert aus Theme Settings
- **Inline Quantity Selector** — +/- Buttons mit optimistischem UI Update
- **Remove mit Animation** — Slide-out Animation beim Entfernen
- **Upsell-Slider** — Horizontaler Splide Slider mit Quick-Add Buttons
- **Body Scroll Lock** — Verhindert Hintergrund-Scrollen wenn Drawer offen
- **Zahlungsicons** — Konfigurierbar via Theme Settings

---

## 8. Produktseite (PDP) Aufbau

### Section-Reihenfolge (top → bottom)

1. **Breadcrumbs** — `Home > Kollektion > Produkt` mit Schema.org BreadcrumbList
2. **Produkt-Galerie** — Splide Slider mit Thumbnail-Navigation, Zoom on Click, Lazy Loading, Video-Support
3. **Produkt-Info** — Titel, Marke (Vendor), Preis (inkl. Compare-at-Price), Sterne-Rating
4. **Varianten-Auswahl** — Farbswatches als runde Thumbnails + Material/Größe als Buttons
5. **Add to Cart** — Quantity Selector + "In den Warenkorb" Button → öffnet Cart Drawer
6. **Sticky Add-to-Cart** — Erscheint beim Scrollen unter dem Fold (mobile + desktop), zeigt Produktname + Preis + ATC Button
7. **Trust Badges** — "Made in Italy", "Kostenloser Versand", "30 Tage Rückgabe" (aus Theme Settings)
8. **Accordion** — Beschreibung | Abmessungen | Material & Nachhaltigkeit | Versand & Rückgabe | Bewertungen
9. **FAQ Section** — Dynamisch aus Metaobject (wenn `custom.faq_set` verknüpft), automatisches FAQPage Schema
10. **Cross-Selling** — "Das könnte dir auch gefallen" Splide Slider (Shopify Recommendations API)
11. **Recently Viewed** — Zuletzt angesehene Produkte (localStorage-basiert, max 8 Produkte)

### Schema.org Markup

```liquid
<!-- Auf jeder Produktseite -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": {{ product.title | json }},
  "description": {{ product.description | strip_html | json }},
  "brand": { "@type": "Brand", "name": {{ product.vendor | json }} },
  "image": {{ product.featured_image | image_url: width: 1200 | json }},
  "offers": {
    "@type": "Offer",
    "price": {{ product.price | money_without_currency | json }},
    "priceCurrency": "EUR",
    "availability": "https://schema.org/{% if product.available %}InStock{% else %}OutOfStock{% endif %}",
    "url": {{ request.origin | append: product.url | json }}
  }
}
</script>
```

---

## 9. SEO & Performance

### Core Web Vitals Strategie

- **LCP (Largest Contentful Paint):** Hero-Bild mit `fetchpriority="high"`, kein Lazy Loading. Responsive `srcset` für optimale Bildgröße.
- **CLS (Cumulative Layout Shift):** Feste Aspect-Ratios auf allen Bildern via Tailwind `aspect-*`. Font-Display: swap mit Size-Adjust.
- **INP (Interaction to Next Paint):** Alpine.js ist inherent schnell. Lazy-loaded JS verhindert Main-Thread-Blocking.

### Asset-Optimierung

- Tailwind PurgeCSS entfernt ungenutzte Klassen (~95% Reduktion)
- JS Section-Splitting: nur geladene Sections laden ihr JS
- Bilder: Shopify CDN + responsive `srcset` + Lazy Loading (native `loading="lazy"`)
- Fonts: `font-display: swap` + Preload für Heading-Font

### Semantisches HTML

- Korrekte Heading-Hierarchie (H1 → H6)
- `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>` Landmarks
- ARIA-Labels auf interaktiven Elementen (Cart Drawer, Mega Menu, Accordion)
- Skip-to-Content Link

---

## 10. Homepage-Aufbau (Default Sections)

1. **Announcement Bar** — Konfigurierbarer Text (z.B. "Kostenloser Versand ab 150€")
2. **Header** — Logo + Mega Menu + Suche + Account + Cart Badge
3. **Hero Banner** — Fullscreen Bild/Video mit Overlay-Text + CTA (optional Slider via Splide)
4. **Kategorie-Scroller** — Horizontaler Scroll mit Lifestyle-Bildern pro Kategorie
5. **Featured Collection** — Produkt-Grid einer ausgewählten Kollektion
6. **Image with Text** — 2-spaltig, Bild + Text Block (für Markengeschichte/Nachhaltigkeit)
7. **Cross-Selling Slider** — "Bestseller" oder "Neu eingetroffen" als Splide Slider
8. **Trust Badges** — Icons + Text in 3-4 Spalten
9. **Newsletter** — E-Mail Signup mit Incentive-Text
10. **Footer** — Multi-Column Links + Social Media + Payment Icons + Legallinks

---

## 11. Kollektionsseite

- **Filter-Sidebar** — Farbe, Material, Preis (Shopify native Filtering API)
- **Sort-Dropdown** — Preis aufsteigend/absteigend, Neu, Bestseller
- **Produkt-Grid** — 2-4 Spalten (responsive), Produktkarte mit Hover-Effekt (zweites Bild)
- **Pagination** — Infinite Scroll oder "Mehr laden" Button
- **FAQ Section** — Wenn `custom.faq_set` auf Collection gesetzt, wird FAQ am Ende angezeigt
- **SEO-Text** — Rich Text Section am Ende (für Category SEO)

---

## 12. Mobile-First Breakpoints

| Breakpoint | Tailwind | Beschreibung |
|---|---|---|
| Default | `<640px` | Mobile (1 Spalte Produkt-Grid, Hamburger Menu, Full-width Cart Drawer) |
| `sm` | `≥640px` | Kleine Tablets (2 Spalten Grid) |
| `md` | `≥768px` | Tablets (Sidebar-Filter sichtbar) |
| `lg` | `≥1024px` | Desktop (Mega Menu, 3-4 Spalten Grid, Cart Drawer 400px breit) |
| `xl` | `≥1280px` | Großer Desktop (max-width Container) |
