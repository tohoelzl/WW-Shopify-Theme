# WW Shopify Theme — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready Shopify OS 2.0 custom theme for a premium sustainable furniture brand, with dynamic FAQ system, Ajax Cart Drawer with upselling, optimized PDP, and green Core Web Vitals.

**Architecture:** Hybrid approach — Tailwind CSS compiled globally, Alpine.js + global stores loaded on every page, section-specific JS lazy-loaded per section. Metaobject-based FAQ system. Shopify Sections Everywhere (JSON templates).

**Tech Stack:** Tailwind CSS, Alpine.js, Splide.js, esbuild, Shopify CLI, Liquid

**Spec:** `docs/superpowers/specs/2026-03-31-ww-shopify-theme-design.md`

---

## Phase Overview

| Phase | Tasks | What it builds |
|---|---|---|
| 1 — Foundation | 1-4 | Build pipeline, theme layout, settings, base styles |
| 2 — Navigation & Layout | 5-7 | Header, mega menu, footer, announcement bar |
| 3 — Homepage Sections | 8-11 | Hero banner, category scroller, featured collection, image-with-text |
| 4 — Product Page | 12-16 | PDP gallery, variant swatches, product form, sticky ATC, accordion |
| 5 — Cart System | 17-19 | Alpine cart store, cart drawer, upselling, free shipping bar |
| 6 — FAQ System | 20-21 | Metaobject integration, FAQ section, Schema.org FAQPage |
| 7 — Collection Page | 22-23 | Collection grid, filtering, pagination |
| 8 — SEO & Polish | 24-26 | Schema.org markup, meta tags, performance audit |

---

## File Map

### Config & Build
- Create: `package.json` — npm scripts, dependencies
- Create: `tailwind.config.js` — Tailwind config with CSS custom property references
- Create: `postcss.config.js` — PostCSS with Tailwind plugin
- Create: `src/css/tailwind.css` — Tailwind directives + custom layers
- Create: `src/css/components.css` — Splide overrides, custom component styles
- Create: `.shopifyignore` — Ignore src/, node_modules/, build config
- Create: `shopify.theme.toml` — Shopify CLI store config

### Layout
- Create: `layout/theme.liquid` — Main layout (head, body, scripts, CSS custom props)
- Create: `layout/password.liquid` — Password page layout

### Config
- Create: `config/settings_schema.json` — Theme settings (brand, cart, trust)
- Create: `config/settings_data.json` — Default preset values

### Locales
- Create: `locales/de.default.json` — German translations
- Create: `locales/en.json` — English translations

### Snippets (Reusable)
- Create: `snippets/icon.liquid` — SVG icon system
- Create: `snippets/image.liquid` — Responsive image helper
- Create: `snippets/product-card.liquid` — Product card component
- Create: `snippets/price.liquid` — Price formatting
- Create: `snippets/variant-swatches.liquid` — Color swatch rendering
- Create: `snippets/cart-item.liquid` — Cart line item
- Create: `snippets/free-shipping-bar.liquid` — Progress bar
- Create: `snippets/upsell-products.liquid` — Upsell slider in cart
- Create: `snippets/schema-product.liquid` — Product Schema.org
- Create: `snippets/schema-breadcrumb.liquid` — Breadcrumb Schema.org
- Create: `snippets/schema-faq.liquid` — FAQPage Schema.org
- Create: `snippets/meta-tags.liquid` — SEO meta tags

### Sections
- Create: `sections/announcement-bar.liquid`
- Create: `sections/header.liquid`
- Create: `sections/footer.liquid`
- Create: `sections/hero-banner.liquid`
- Create: `sections/collection-list.liquid`
- Create: `sections/featured-collection.liquid`
- Create: `sections/image-with-text.liquid`
- Create: `sections/cross-selling.liquid`
- Create: `sections/trust-badges.liquid`
- Create: `sections/newsletter.liquid`
- Create: `sections/rich-text.liquid`
- Create: `sections/faq-section.liquid`
- Create: `sections/cart-drawer.liquid`
- Create: `sections/main-product.liquid`
- Create: `sections/main-collection.liquid`

### Templates (JSON)
- Create: `templates/index.json`
- Create: `templates/product.json`
- Create: `templates/collection.json`
- Create: `templates/page.json`
- Create: `templates/page.faq.json`
- Create: `templates/cart.json`
- Create: `templates/blog.json`
- Create: `templates/article.json`
- Create: `templates/404.json`
- Create: `templates/search.json`
- Create: `templates/list-collections.json`

### JavaScript (Source)
- Create: `src/js/base.js` — Alpine.js init, cart store, global utilities
- Create: `src/js/cart-drawer.js` — Cart drawer open/close, upsell fetch
- Create: `src/js/product-gallery.js` — Splide gallery + thumbnail sync
- Create: `src/js/product-form.js` — Variant switcher, add to cart
- Create: `src/js/hero-slider.js` — Hero Splide configuration
- Create: `src/js/mega-menu.js` — Mega menu hover/click interactions
- Create: `src/js/faq-accordion.js` — FAQ accordion toggle

---

## Phase 1 — Foundation

### Task 1: Initialize Project & Build Pipeline

**Files:**
- Create: `package.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `src/css/tailwind.css`
- Create: `src/css/components.css`
- Create: `.shopifyignore`
- Create: `shopify.theme.toml`

- [ ] **Step 1: Create package.json with dependencies and scripts**

```json
{
  "name": "ww-shopify-theme",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:css\" \"npm run dev:js\"",
    "dev:css": "npx tailwindcss -i src/css/tailwind.css -o assets/application.css --watch",
    "dev:js": "npx esbuild src/js/*.js --outdir=assets --bundle --watch --format=esm",
    "build:css": "npx tailwindcss -i src/css/tailwind.css -o assets/application.css --minify",
    "build:js": "npx esbuild src/js/*.js --outdir=assets --bundle --minify --format=esm",
    "build": "npm run build:css && npm run build:js"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "esbuild": "^0.20.0",
    "concurrently": "^8.2.0"
  },
  "dependencies": {
    "alpinejs": "^3.14.0",
    "@splidejs/splide": "^4.1.0"
  }
}
```

- [ ] **Step 2: Create tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layout/**/*.liquid',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
    './templates/**/*.liquid',
    './templates/**/*.json',
  ],
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
      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
      },
      maxWidth: {
        'container': '1280px',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Create postcss.config.js**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 4: Create src/css/tailwind.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    @apply font-body text-primary bg-white;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-heading;
  }
}

@layer components {
  .container {
    @apply mx-auto max-w-container px-4 sm:px-6 lg:px-8;
  }

  .btn-primary {
    @apply inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded transition-colors duration-200 hover:opacity-90;
  }

  .btn-secondary {
    @apply inline-flex items-center justify-center px-6 py-3 border border-primary text-primary font-medium rounded transition-colors duration-200 hover:bg-primary hover:text-white;
  }
}
```

- [ ] **Step 5: Create src/css/components.css (empty placeholder for Splide overrides)**

```css
/* Splide.js custom overrides */
.splide__arrow {
  @apply bg-white shadow-md;
}

.splide__pagination__page.is-active {
  background: var(--color-primary);
}
```

- [ ] **Step 6: Create .shopifyignore**

```
src/
node_modules/
package.json
package-lock.json
tailwind.config.js
postcss.config.js
docs/
.superpowers/
```

- [ ] **Step 7: Create shopify.theme.toml**

```toml
[environments.development]
store = "your-store.myshopify.com"
```

- [ ] **Step 8: Install dependencies and run initial build**

Run: `cd /Users/tobias/Documents/WW_Shopify_Theme && npm install`
Expected: node_modules/ created, package-lock.json generated

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json tailwind.config.js postcss.config.js src/ .shopifyignore shopify.theme.toml
git commit -m "feat: initialize build pipeline with Tailwind CSS, esbuild, Alpine.js, Splide.js"
```

---

### Task 2: Theme Settings & Locales

**Files:**
- Create: `config/settings_schema.json`
- Create: `config/settings_data.json`
- Create: `locales/de.default.json`
- Create: `locales/en.json`

- [ ] **Step 1: Create config/settings_schema.json**

```json
[
  {
    "name": "theme_info",
    "theme_name": "WW Theme",
    "theme_version": "1.0.0",
    "theme_author": "WW",
    "theme_documentation_url": "",
    "theme_support_url": ""
  },
  {
    "name": "Brand",
    "settings": [
      {
        "type": "image_picker",
        "id": "logo",
        "label": "Logo"
      },
      {
        "type": "range",
        "id": "logo_width",
        "label": "Logo-Breite",
        "min": 50,
        "max": 300,
        "step": 10,
        "default": 120,
        "unit": "px"
      },
      {
        "type": "color",
        "id": "color_primary",
        "label": "Primärfarbe",
        "default": "#1a1a2e"
      },
      {
        "type": "color",
        "id": "color_secondary",
        "label": "Sekundärfarbe",
        "default": "#e2e8f0"
      },
      {
        "type": "color",
        "id": "color_accent",
        "label": "Akzentfarbe",
        "default": "#16a34a"
      },
      {
        "type": "color",
        "id": "color_background",
        "label": "Hintergrundfarbe",
        "default": "#ffffff"
      },
      {
        "type": "color",
        "id": "color_text",
        "label": "Textfarbe",
        "default": "#1a1a2e"
      },
      {
        "type": "font_picker",
        "id": "font_heading",
        "label": "Überschrift-Schriftart",
        "default": "assistant_n4"
      },
      {
        "type": "font_picker",
        "id": "font_body",
        "label": "Text-Schriftart",
        "default": "assistant_n4"
      },
      {
        "type": "range",
        "id": "border_radius",
        "label": "Ecken-Rundung",
        "min": 0,
        "max": 16,
        "step": 2,
        "default": 8,
        "unit": "px"
      }
    ]
  },
  {
    "name": "Warenkorb",
    "settings": [
      {
        "type": "range",
        "id": "free_shipping_threshold",
        "label": "Gratis-Versand ab",
        "min": 0,
        "max": 500,
        "step": 10,
        "default": 150,
        "unit": "€"
      },
      {
        "type": "checkbox",
        "id": "cart_upsell_enabled",
        "label": "Upselling im Warenkorb anzeigen",
        "default": true
      }
    ]
  },
  {
    "name": "Trust & Social Proof",
    "settings": [
      {
        "type": "image_picker",
        "id": "trust_icon_1",
        "label": "Trust Icon 1"
      },
      {
        "type": "text",
        "id": "trust_badge_1",
        "label": "Trust Badge 1",
        "default": "Made in Italy"
      },
      {
        "type": "image_picker",
        "id": "trust_icon_2",
        "label": "Trust Icon 2"
      },
      {
        "type": "text",
        "id": "trust_badge_2",
        "label": "Trust Badge 2",
        "default": "Kostenloser Versand"
      },
      {
        "type": "image_picker",
        "id": "trust_icon_3",
        "label": "Trust Icon 3"
      },
      {
        "type": "text",
        "id": "trust_badge_3",
        "label": "Trust Badge 3",
        "default": "30 Tage Rückgabe"
      }
    ]
  },
  {
    "name": "Social Media",
    "settings": [
      {
        "type": "text",
        "id": "social_instagram",
        "label": "Instagram URL"
      },
      {
        "type": "text",
        "id": "social_pinterest",
        "label": "Pinterest URL"
      },
      {
        "type": "text",
        "id": "social_tiktok",
        "label": "TikTok URL"
      },
      {
        "type": "text",
        "id": "social_youtube",
        "label": "YouTube URL"
      }
    ]
  }
]
```

- [ ] **Step 2: Create config/settings_data.json**

```json
{
  "current": {
    "color_primary": "#1a1a2e",
    "color_secondary": "#e2e8f0",
    "color_accent": "#16a34a",
    "color_background": "#ffffff",
    "color_text": "#1a1a2e",
    "border_radius": 8,
    "free_shipping_threshold": 150,
    "cart_upsell_enabled": true,
    "trust_badge_1": "Made in Italy",
    "trust_badge_2": "Kostenloser Versand",
    "trust_badge_3": "30 Tage Rückgabe",
    "sections": {},
    "content_for_index": []
  },
  "presets": {
    "Default": {
      "color_primary": "#1a1a2e",
      "color_secondary": "#e2e8f0",
      "color_accent": "#16a34a"
    }
  }
}
```

- [ ] **Step 3: Create locales/de.default.json**

```json
{
  "general": {
    "skip_to_content": "Zum Inhalt springen",
    "search": "Suchen",
    "close": "Schließen",
    "menu": "Menü",
    "loading": "Wird geladen..."
  },
  "products": {
    "add_to_cart": "In den Warenkorb",
    "sold_out": "Ausverkauft",
    "unavailable": "Nicht verfügbar",
    "price": "Preis",
    "sale_price": "Angebotspreis",
    "compare_at_price": "Statt",
    "quantity": "Menge",
    "description": "Beschreibung",
    "dimensions": "Abmessungen",
    "materials": "Material & Nachhaltigkeit",
    "shipping": "Versand & Rückgabe",
    "reviews": "Bewertungen",
    "you_may_also_like": "Das könnte dir auch gefallen",
    "recently_viewed": "Zuletzt angesehen",
    "select_color": "Farbe wählen",
    "select_material": "Material wählen",
    "select_size": "Größe wählen"
  },
  "cart": {
    "title": "Warenkorb",
    "empty": "Dein Warenkorb ist leer",
    "continue_shopping": "Weiter einkaufen",
    "checkout": "Zur Kasse",
    "subtotal": "Zwischensumme",
    "shipping_free": "Kostenloser Versand",
    "shipping_remaining": "Noch {{ amount }} bis zum kostenlosen Versand",
    "remove": "Entfernen",
    "recommended": "Empfohlen für dich",
    "item_count": {
      "one": "{{ count }} Artikel",
      "other": "{{ count }} Artikel"
    }
  },
  "sections": {
    "hero": {
      "shop_now": "Jetzt entdecken"
    },
    "newsletter": {
      "title": "Newsletter",
      "subtitle": "Melde dich an und erhalte 10% Rabatt auf deine erste Bestellung",
      "email_placeholder": "Deine E-Mail-Adresse",
      "submit": "Anmelden"
    },
    "trust": {
      "title": "Unsere Versprechen"
    },
    "faq": {
      "title": "Häufige Fragen"
    }
  },
  "accessibility": {
    "close_cart": "Warenkorb schließen",
    "open_cart": "Warenkorb öffnen",
    "previous_slide": "Vorheriges Bild",
    "next_slide": "Nächstes Bild",
    "open_menu": "Menü öffnen",
    "close_menu": "Menü schließen",
    "increase_quantity": "Menge erhöhen",
    "decrease_quantity": "Menge verringern"
  }
}
```

- [ ] **Step 4: Create locales/en.json**

```json
{
  "general": {
    "skip_to_content": "Skip to content",
    "search": "Search",
    "close": "Close",
    "menu": "Menu",
    "loading": "Loading..."
  },
  "products": {
    "add_to_cart": "Add to cart",
    "sold_out": "Sold out",
    "unavailable": "Unavailable",
    "price": "Price",
    "sale_price": "Sale price",
    "compare_at_price": "Was",
    "quantity": "Quantity",
    "description": "Description",
    "dimensions": "Dimensions",
    "materials": "Material & Sustainability",
    "shipping": "Shipping & Returns",
    "reviews": "Reviews",
    "you_may_also_like": "You may also like",
    "recently_viewed": "Recently viewed",
    "select_color": "Select color",
    "select_material": "Select material",
    "select_size": "Select size"
  },
  "cart": {
    "title": "Cart",
    "empty": "Your cart is empty",
    "continue_shopping": "Continue shopping",
    "checkout": "Checkout",
    "subtotal": "Subtotal",
    "shipping_free": "Free shipping",
    "shipping_remaining": "{{ amount }} away from free shipping",
    "remove": "Remove",
    "recommended": "Recommended for you",
    "item_count": {
      "one": "{{ count }} item",
      "other": "{{ count }} items"
    }
  },
  "sections": {
    "hero": {
      "shop_now": "Shop now"
    },
    "newsletter": {
      "title": "Newsletter",
      "subtitle": "Sign up and get 10% off your first order",
      "email_placeholder": "Your email address",
      "submit": "Subscribe"
    },
    "trust": {
      "title": "Our promises"
    },
    "faq": {
      "title": "Frequently asked questions"
    }
  },
  "accessibility": {
    "close_cart": "Close cart",
    "open_cart": "Open cart",
    "previous_slide": "Previous slide",
    "next_slide": "Next slide",
    "open_menu": "Open menu",
    "close_menu": "Close menu",
    "increase_quantity": "Increase quantity",
    "decrease_quantity": "Decrease quantity"
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add config/ locales/
git commit -m "feat: add theme settings schema, presets, and DE/EN translations"
```

---

### Task 3: Theme Layout & Base JavaScript

**Files:**
- Create: `layout/theme.liquid`
- Create: `layout/password.liquid`
- Create: `src/js/base.js`
- Create: `snippets/icon.liquid`
- Create: `snippets/image.liquid`
- Create: `snippets/meta-tags.liquid`

- [ ] **Step 1: Create snippets/icon.liquid**

```liquid
{%- comment -%}
  Renders an SVG icon.
  Usage: {% render 'icon', name: 'cart' %}
  Accepts:
  - name: {String} Icon name
  - size: {Number} Icon size in px (default: 24)
  - class: {String} Additional CSS classes
{%- endcomment -%}

{%- liquid
  assign icon_size = size | default: 24
  assign icon_class = class | default: ''
-%}

{%- case name -%}
  {%- when 'cart' -%}
    <svg class="{{ icon_class }}" width="{{ icon_size }}" height="{{ icon_size }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 01-8 0"></path>
    </svg>
  {%- when 'search' -%}
    <svg class="{{ icon_class }}" width="{{ icon_size }}" height="{{ icon_size }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  {%- when 'menu' -%}
    <svg class="{{ icon_class }}" width="{{ icon_size }}" height="{{ icon_size }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  {%- when 'close' -%}
    <svg class="{{ icon_class }}" width="{{ icon_size }}" height="{{ icon_size }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  {%- when 'chevron-down' -%}
    <svg class="{{ icon_class }}" width="{{ icon_size }}" height="{{ icon_size }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  {%- when 'chevron-right' -%}
    <svg class="{{ icon_class }}" width="{{ icon_size }}" height="{{ icon_size }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  {%- when 'minus' -%}
    <svg class="{{ icon_class }}" width="{{ icon_size }}" height="{{ icon_size }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  {%- when 'plus' -%}
    <svg class="{{ icon_class }}" width="{{ icon_size }}" height="{{ icon_size }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  {%- when 'truck' -%}
    <svg class="{{ icon_class }}" width="{{ icon_size }}" height="{{ icon_size }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="1" y="3" width="15" height="13"></rect>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle>
      <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
  {%- when 'shield' -%}
    <svg class="{{ icon_class }}" width="{{ icon_size }}" height="{{ icon_size }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  {%- when 'lock' -%}
    <svg class="{{ icon_class }}" width="{{ icon_size }}" height="{{ icon_size }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0110 0v4"></path>
    </svg>
  {%- when 'account' -%}
    <svg class="{{ icon_class }}" width="{{ icon_size }}" height="{{ icon_size }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
{%- endcase -%}
```

- [ ] **Step 2: Create snippets/image.liquid**

```liquid
{%- comment -%}
  Renders a responsive image with lazy loading.
  Usage: {% render 'image', image: product.featured_image, alt: product.title, sizes: '(min-width: 1024px) 33vw, 50vw' %}
  Accepts:
  - image: {Image} Shopify image object
  - alt: {String} Alt text
  - sizes: {String} Sizes attribute for srcset
  - width: {Number} Max width (default: 1200)
  - height: {Number} Explicit height
  - class: {String} CSS classes
  - lazy: {Boolean} Lazy load (default: true)
  - priority: {Boolean} High priority (fetchpriority="high", no lazy)
{%- endcomment -%}

{%- liquid
  assign img_alt = alt | default: image.alt | escape
  assign img_sizes = sizes | default: '100vw'
  assign img_width = width | default: 1200
  assign img_class = class | default: ''
  assign img_lazy = lazy | default: true
  assign img_priority = priority | default: false

  if img_priority
    assign img_lazy = false
  endif
-%}

{%- if image != blank -%}
  <img
    src="{{ image | image_url: width: img_width }}"
    srcset="
      {{ image | image_url: width: 375 }} 375w,
      {{ image | image_url: width: 640 }} 640w,
      {{ image | image_url: width: 768 }} 768w,
      {{ image | image_url: width: 1024 }} 1024w,
      {{ image | image_url: width: 1200 }} 1200w,
      {{ image | image_url: width: 1600 }} 1600w
    "
    sizes="{{ img_sizes }}"
    alt="{{ img_alt }}"
    width="{{ image.width }}"
    height="{{ image.height }}"
    class="{{ img_class }}"
    {%- if img_lazy %} loading="lazy" decoding="async"{% endif -%}
    {%- if img_priority %} fetchpriority="high"{% endif -%}
  >
{%- else -%}
  <div class="bg-secondary {{ img_class }}" style="aspect-ratio: 1/1;" role="img" aria-label="{{ img_alt }}"></div>
{%- endif -%}
```

- [ ] **Step 3: Create snippets/meta-tags.liquid**

```liquid
{%- comment -%}
  SEO meta tags. Rendered in theme.liquid <head>.
{%- endcomment -%}

<meta name="viewport" content="width=device-width, initial-scale=1">
<meta charset="utf-8">

{%- if page_title -%}
  <title>{{ page_title }}</title>
{%- endif -%}

{%- if page_description -%}
  <meta name="description" content="{{ page_description | escape }}">
{%- endif -%}

<link rel="canonical" href="{{ canonical_url }}">

{%- if request.page_type == 'index' -%}
  <meta property="og:type" content="website">
{%- elsif request.page_type == 'product' -%}
  <meta property="og:type" content="product">
  <meta property="og:title" content="{{ product.title | escape }}">
  <meta property="og:description" content="{{ product.description | strip_html | truncate: 200 | escape }}">
  <meta property="og:image" content="https:{{ product.featured_image | image_url: width: 1200 }}">
  <meta property="product:price:amount" content="{{ product.price | money_without_currency }}">
  <meta property="product:price:currency" content="{{ cart.currency.iso_code }}">
{%- elsif request.page_type == 'article' -%}
  <meta property="og:type" content="article">
{%- endif -%}
```

- [ ] **Step 4: Create src/js/base.js**

```javascript
import Alpine from 'alpinejs';

// Expose Alpine globally for Liquid inline usage
window.Alpine = Alpine;

// Cart Store — global state for cart across all pages
Alpine.store('cart', {
  items: [],
  isOpen: false,
  isLoading: false,
  total: 0,
  itemCount: 0,
  freeShippingThreshold: window.themeSettings?.freeShippingThreshold || 15000,

  get freeShippingProgress() {
    return Math.min((this.total / (this.freeShippingThreshold / 100)) * 100, 100);
  },

  get freeShippingRemaining() {
    const remaining = (this.freeShippingThreshold - this.total * 100) / 100;
    return Math.max(remaining, 0);
  },

  get hasFreeShipping() {
    return this.total * 100 >= this.freeShippingThreshold;
  },

  async init() {
    try {
      const res = await fetch('/cart.js');
      const cart = await res.json();
      this.syncCart(cart);
    } catch (e) {
      console.error('Failed to fetch cart:', e);
    }
  },

  async addItem(variantId, quantity = 1) {
    this.isLoading = true;
    try {
      await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: variantId, quantity }] }),
      });
      const cart = await fetch('/cart.js').then(r => r.json());
      this.syncCart(cart);
      this.open();
    } catch (e) {
      console.error('Failed to add item:', e);
    } finally {
      this.isLoading = false;
    }
  },

  async updateItem(key, quantity) {
    this.isLoading = true;
    try {
      await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity }),
      });
      const cart = await fetch('/cart.js').then(r => r.json());
      this.syncCart(cart);
    } catch (e) {
      console.error('Failed to update item:', e);
    } finally {
      this.isLoading = false;
    }
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

  open() {
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  },

  close() {
    this.isOpen = false;
    document.body.style.overflow = '';
  },
});

// Initialize Alpine
Alpine.start();
```

- [ ] **Step 5: Create layout/theme.liquid**

```liquid
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
<head>
  {% render 'meta-tags' %}

  {{ 'application.css' | asset_url | stylesheet_tag }}

  {%- unless settings.font_heading.system? -%}
    <link rel="preload" as="font" href="{{ settings.font_heading | font_url }}" type="font/woff2" crossorigin>
  {%- endunless -%}

  {{ settings.font_heading | font_face: font_display: 'swap' }}
  {{ settings.font_body | font_face: font_display: 'swap' }}

  <style>
    :root {
      --color-primary: {{ settings.color_primary }};
      --color-secondary: {{ settings.color_secondary }};
      --color-accent: {{ settings.color_accent }};
      --color-background: {{ settings.color_background }};
      --color-text: {{ settings.color_text }};
      --border-radius: {{ settings.border_radius }}px;
      --font-heading: {{ settings.font_heading.family }}, {{ settings.font_heading.fallback_families }};
      --font-body: {{ settings.font_body.family }}, {{ settings.font_body.fallback_families }};
    }
  </style>

  <script>
    window.themeSettings = {
      freeShippingThreshold: {{ settings.free_shipping_threshold | times: 100 }},
      cartUpsellEnabled: {{ settings.cart_upsell_enabled }},
      moneyFormat: {{ shop.money_format | json }}
    };
  </script>

  {{ content_for_header }}
</head>

<body class="font-body text-primary bg-[var(--color-background)]">
  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-primary">
    {{ 'general.skip_to_content' | t }}
  </a>

  {% sections 'header-group' %}

  <main id="main-content" role="main">
    {{ content_for_layout }}
  </main>

  {% sections 'footer-group' %}

  {% section 'cart-drawer' %}

  <script src="{{ 'base.js' | asset_url }}" type="module"></script>
  <script src="{{ 'splide-core.min.js' | asset_url }}" defer></script>
</body>
</html>
```

- [ ] **Step 6: Create layout/password.liquid**

```liquid
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
<head>
  {% render 'meta-tags' %}
  {{ 'application.css' | asset_url | stylesheet_tag }}

  <style>
    :root {
      --color-primary: {{ settings.color_primary }};
      --color-secondary: {{ settings.color_secondary }};
      --color-accent: {{ settings.color_accent }};
      --color-background: {{ settings.color_background }};
      --color-text: {{ settings.color_text }};
      --border-radius: {{ settings.border_radius }}px;
      --font-heading: {{ settings.font_heading.family }}, {{ settings.font_heading.fallback_families }};
      --font-body: {{ settings.font_body.family }}, {{ settings.font_body.fallback_families }};
    }
  </style>

  {{ content_for_header }}
</head>
<body class="font-body text-primary bg-[var(--color-background)] flex items-center justify-center min-h-screen">
  <main class="container text-center py-16">
    {{ content_for_layout }}
  </main>
</body>
</html>
```

- [ ] **Step 7: Run build to compile CSS and JS**

Run: `cd /Users/tobias/Documents/WW_Shopify_Theme && npm run build`
Expected: `assets/application.css` and `assets/base.js` created in assets/

- [ ] **Step 8: Commit**

```bash
git add layout/ snippets/icon.liquid snippets/image.liquid snippets/meta-tags.liquid src/js/base.js
git commit -m "feat: add theme layout, base JS with Alpine.js cart store, icon system, image helper"
```

---

### Task 4: Base Templates (JSON)

**Files:**
- Create: `templates/index.json`
- Create: `templates/product.json`
- Create: `templates/collection.json`
- Create: `templates/page.json`
- Create: `templates/page.faq.json`
- Create: `templates/cart.json`
- Create: `templates/blog.json`
- Create: `templates/article.json`
- Create: `templates/404.json`
- Create: `templates/search.json`
- Create: `templates/list-collections.json`

- [ ] **Step 1: Create templates/index.json**

```json
{
  "sections": {
    "hero": {
      "type": "hero-banner",
      "settings": {}
    },
    "collection-list": {
      "type": "collection-list",
      "settings": {}
    },
    "featured-collection": {
      "type": "featured-collection",
      "settings": {}
    },
    "image-with-text": {
      "type": "image-with-text",
      "settings": {}
    },
    "trust-badges": {
      "type": "trust-badges",
      "settings": {}
    },
    "newsletter": {
      "type": "newsletter",
      "settings": {}
    }
  },
  "order": [
    "hero",
    "collection-list",
    "featured-collection",
    "image-with-text",
    "trust-badges",
    "newsletter"
  ]
}
```

- [ ] **Step 2: Create templates/product.json**

```json
{
  "sections": {
    "main-product": {
      "type": "main-product",
      "settings": {}
    },
    "faq": {
      "type": "faq-section",
      "settings": {}
    },
    "cross-selling": {
      "type": "cross-selling",
      "settings": {}
    }
  },
  "order": [
    "main-product",
    "faq",
    "cross-selling"
  ]
}
```

- [ ] **Step 3: Create templates/collection.json**

```json
{
  "sections": {
    "main-collection": {
      "type": "main-collection",
      "settings": {}
    },
    "faq": {
      "type": "faq-section",
      "settings": {}
    }
  },
  "order": [
    "main-collection",
    "faq"
  ]
}
```

- [ ] **Step 4: Create remaining templates (page, cart, blog, article, 404, search, list-collections, page.faq)**

`templates/page.json`:
```json
{
  "sections": {
    "main": {
      "type": "rich-text",
      "settings": {}
    }
  },
  "order": ["main"]
}
```

`templates/page.faq.json`:
```json
{
  "sections": {
    "faq": {
      "type": "faq-section",
      "settings": {}
    }
  },
  "order": ["faq"]
}
```

`templates/cart.json`:
```json
{
  "sections": {
    "main": {
      "type": "rich-text",
      "settings": {
        "heading": "Warenkorb",
        "text": "<p>JavaScript ist erforderlich für den Warenkorb. Bitte aktiviere JavaScript in deinem Browser.</p>"
      }
    }
  },
  "order": ["main"]
}
```

`templates/blog.json`:
```json
{
  "sections": {
    "main": {
      "type": "rich-text",
      "settings": {}
    }
  },
  "order": ["main"]
}
```

`templates/article.json`:
```json
{
  "sections": {
    "main": {
      "type": "rich-text",
      "settings": {}
    }
  },
  "order": ["main"]
}
```

`templates/404.json`:
```json
{
  "sections": {
    "main": {
      "type": "rich-text",
      "settings": {
        "heading": "Seite nicht gefunden",
        "text": "<p>Die gesuchte Seite konnte leider nicht gefunden werden.</p>"
      }
    }
  },
  "order": ["main"]
}
```

`templates/search.json`:
```json
{
  "sections": {
    "main": {
      "type": "rich-text",
      "settings": {}
    }
  },
  "order": ["main"]
}
```

`templates/list-collections.json`:
```json
{
  "sections": {
    "main": {
      "type": "collection-list",
      "settings": {}
    }
  },
  "order": ["main"]
}
```

- [ ] **Step 5: Commit**

```bash
git add templates/
git commit -m "feat: add all JSON templates for Sections Everywhere (OS 2.0)"
```

---

## Phase 2 — Navigation & Layout

### Task 5: Announcement Bar

**Files:**
- Create: `sections/announcement-bar.liquid`

- [ ] **Step 1: Create sections/announcement-bar.liquid**

```liquid
{%- if section.settings.text != blank -%}
<div class="bg-primary text-white text-center py-2 text-sm">
  <div class="container">
    {%- if section.settings.link != blank -%}
      <a href="{{ section.settings.link }}" class="hover:underline">
        {{ section.settings.text }}
      </a>
    {%- else -%}
      <p>{{ section.settings.text }}</p>
    {%- endif -%}
  </div>
</div>
{%- endif -%}

{% schema %}
{
  "name": "Announcement Bar",
  "settings": [
    {
      "type": "text",
      "id": "text",
      "label": "Text",
      "default": "Kostenloser Versand ab 150€"
    },
    {
      "type": "url",
      "id": "link",
      "label": "Link"
    }
  ]
}
{% endschema %}
```

- [ ] **Step 2: Commit**

```bash
git add sections/announcement-bar.liquid
git commit -m "feat: add announcement bar section"
```

---

### Task 6: Header with Mega Menu

**Files:**
- Create: `sections/header.liquid`
- Create: `src/js/mega-menu.js`

- [ ] **Step 1: Create sections/header.liquid**

```liquid
<header class="sticky top-0 z-40 bg-white border-b border-gray-100" x-data="{ mobileMenuOpen: false }">
  <div class="container">
    <div class="flex items-center justify-between h-16 lg:h-20">

      {%- comment -%} Mobile menu button {%- endcomment -%}
      <button
        class="lg:hidden p-2 -ml-2"
        @click="mobileMenuOpen = !mobileMenuOpen"
        :aria-expanded="mobileMenuOpen"
        aria-label="{{ 'accessibility.open_menu' | t }}"
      >
        <template x-if="!mobileMenuOpen">{% render 'icon', name: 'menu' %}</template>
        <template x-if="mobileMenuOpen">{% render 'icon', name: 'close' %}</template>
      </button>

      {%- comment -%} Logo {%- endcomment -%}
      <a href="/" class="flex-shrink-0">
        {%- if settings.logo != blank -%}
          {% render 'image',
            image: settings.logo,
            alt: shop.name,
            width: settings.logo_width,
            class: 'h-8 lg:h-10 w-auto',
            priority: true
          %}
        {%- else -%}
          <span class="text-xl font-heading font-bold">{{ shop.name }}</span>
        {%- endif -%}
      </a>

      {%- comment -%} Desktop Navigation {%- endcomment -%}
      <nav class="hidden lg:flex items-center gap-8" aria-label="Main navigation">
        {%- for link in section.settings.menu.links -%}
          {%- if link.links.size > 0 -%}
            <div class="relative group" x-data="{ open: false }" @mouseenter="open = true" @mouseleave="open = false">
              <button
                class="flex items-center gap-1 py-2 text-sm font-medium hover:text-accent transition-colors"
                @click="open = !open"
                :aria-expanded="open"
              >
                {{ link.title }}
                {% render 'icon', name: 'chevron-down', size: 16 %}
              </button>

              {%- comment -%} Mega Menu Dropdown {%- endcomment -%}
              <div
                class="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                x-show="open"
                x-transition:enter="transition ease-out duration-200"
                x-transition:enter-start="opacity-0 translate-y-1"
                x-transition:enter-end="opacity-100 translate-y-0"
                x-transition:leave="transition ease-in duration-150"
                x-transition:leave-start="opacity-100 translate-y-0"
                x-transition:leave-end="opacity-0 translate-y-1"
              >
                <div class="bg-white rounded shadow-lg border border-gray-100 p-6 min-w-[200px]">
                  <ul class="space-y-3">
                    {%- for child_link in link.links -%}
                      <li>
                        <a href="{{ child_link.url }}" class="text-sm hover:text-accent transition-colors">
                          {{ child_link.title }}
                        </a>
                      </li>
                    {%- endfor -%}
                  </ul>
                </div>
              </div>
            </div>
          {%- else -%}
            <a href="{{ link.url }}" class="text-sm font-medium hover:text-accent transition-colors py-2">
              {{ link.title }}
            </a>
          {%- endif -%}
        {%- endfor -%}
      </nav>

      {%- comment -%} Right side icons {%- endcomment -%}
      <div class="flex items-center gap-3">
        <a href="{{ routes.account_url }}" class="hidden lg:block p-2" aria-label="Account">
          {% render 'icon', name: 'account' %}
        </a>

        <button
          class="p-2 relative"
          @click="$store.cart.open()"
          aria-label="{{ 'accessibility.open_cart' | t }}"
        >
          {% render 'icon', name: 'cart' %}
          <span
            x-show="$store.cart.itemCount > 0"
            x-text="$store.cart.itemCount"
            class="absolute -top-0.5 -right-0.5 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
            x-cloak
          ></span>
        </button>
      </div>
    </div>
  </div>

  {%- comment -%} Mobile Menu {%- endcomment -%}
  <div
    class="lg:hidden border-t border-gray-100"
    x-show="mobileMenuOpen"
    x-transition:enter="transition ease-out duration-200"
    x-transition:enter-start="opacity-0 -translate-y-2"
    x-transition:enter-end="opacity-100 translate-y-0"
    x-transition:leave="transition ease-in duration-150"
    x-transition:leave-start="opacity-100 translate-y-0"
    x-transition:leave-end="opacity-0 -translate-y-2"
    x-cloak
  >
    <nav class="container py-4" aria-label="Mobile navigation">
      <ul class="space-y-1">
        {%- for link in section.settings.menu.links -%}
          <li>
            {%- if link.links.size > 0 -%}
              <div x-data="{ expanded: false }">
                <button
                  class="flex items-center justify-between w-full py-3 text-sm font-medium"
                  @click="expanded = !expanded"
                  :aria-expanded="expanded"
                >
                  {{ link.title }}
                  <span :class="expanded && 'rotate-180'" class="transition-transform">
                    {% render 'icon', name: 'chevron-down', size: 16 %}
                  </span>
                </button>
                <ul class="pl-4 pb-2 space-y-2" x-show="expanded" x-collapse>
                  {%- for child_link in link.links -%}
                    <li>
                      <a href="{{ child_link.url }}" class="block py-1 text-sm text-gray-600 hover:text-accent">
                        {{ child_link.title }}
                      </a>
                    </li>
                  {%- endfor -%}
                </ul>
              </div>
            {%- else -%}
              <a href="{{ link.url }}" class="block py-3 text-sm font-medium">{{ link.title }}</a>
            {%- endif -%}
          </li>
        {%- endfor -%}
      </ul>
    </nav>
  </div>
</header>

{% schema %}
{
  "name": "Header",
  "settings": [
    {
      "type": "link_list",
      "id": "menu",
      "label": "Hauptmenü",
      "default": "main-menu"
    }
  ]
}
{% endschema %}
```

- [ ] **Step 2: Create src/js/mega-menu.js (lightweight — most logic is Alpine inline)**

```javascript
// Mega menu keyboard navigation and accessibility enhancements
document.addEventListener('alpine:init', () => {
  // Close mega menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('[x-data]').forEach((el) => {
        if (el.__x && el.__x.$data.open) {
          el.__x.$data.open = false;
        }
      });
    }
  });
});
```

- [ ] **Step 3: Build JS**

Run: `cd /Users/tobias/Documents/WW_Shopify_Theme && npm run build:js`
Expected: `assets/mega-menu.js` created

- [ ] **Step 4: Commit**

```bash
git add sections/header.liquid src/js/mega-menu.js
git commit -m "feat: add header section with mega menu and mobile navigation"
```

---

### Task 7: Footer

**Files:**
- Create: `sections/footer.liquid`

- [ ] **Step 1: Create sections/footer.liquid**

```liquid
<footer class="bg-gray-50 border-t border-gray-100">
  <div class="container py-12 lg:py-16">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

      {%- for block in section.blocks -%}
        {%- case block.type -%}
          {%- when 'menu' -%}
            <div {{ block.shopify_attributes }}>
              {%- if block.settings.title != blank -%}
                <h3 class="text-sm font-heading font-bold mb-4">{{ block.settings.title }}</h3>
              {%- endif -%}
              {%- if block.settings.menu != blank -%}
                <ul class="space-y-2">
                  {%- for link in block.settings.menu.links -%}
                    <li>
                      <a href="{{ link.url }}" class="text-sm text-gray-600 hover:text-accent transition-colors">
                        {{ link.title }}
                      </a>
                    </li>
                  {%- endfor -%}
                </ul>
              {%- endif -%}
            </div>

          {%- when 'text' -%}
            <div {{ block.shopify_attributes }}>
              {%- if block.settings.title != blank -%}
                <h3 class="text-sm font-heading font-bold mb-4">{{ block.settings.title }}</h3>
              {%- endif -%}
              {%- if block.settings.text != blank -%}
                <div class="text-sm text-gray-600 leading-relaxed">{{ block.settings.text }}</div>
              {%- endif -%}
            </div>
        {%- endcase -%}
      {%- endfor -%}
    </div>

    {%- comment -%} Social Media & Payment {%- endcomment -%}
    <div class="mt-12 pt-8 border-t border-gray-200 flex flex-col lg:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-4">
        {%- if settings.social_instagram != blank -%}
          <a href="{{ settings.social_instagram }}" target="_blank" rel="noopener" aria-label="Instagram" class="text-gray-400 hover:text-primary transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
        {%- endif -%}
        {%- if settings.social_pinterest != blank -%}
          <a href="{{ settings.social_pinterest }}" target="_blank" rel="noopener" aria-label="Pinterest" class="text-gray-400 hover:text-primary transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
          </a>
        {%- endif -%}
        {%- if settings.social_tiktok != blank -%}
          <a href="{{ settings.social_tiktok }}" target="_blank" rel="noopener" aria-label="TikTok" class="text-gray-400 hover:text-primary transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
          </a>
        {%- endif -%}
      </div>

      <div class="text-sm text-gray-400">
        &copy; {{ 'now' | date: '%Y' }} {{ shop.name }}. Alle Rechte vorbehalten.
      </div>

      <div class="flex items-center gap-2">
        {%- for type in shop.enabled_payment_types -%}
          {{ type | payment_type_svg_tag: class: 'h-6' }}
        {%- endfor -%}
      </div>
    </div>
  </div>
</footer>

{% schema %}
{
  "name": "Footer",
  "blocks": [
    {
      "type": "menu",
      "name": "Menü-Spalte",
      "settings": [
        {
          "type": "text",
          "id": "title",
          "label": "Titel"
        },
        {
          "type": "link_list",
          "id": "menu",
          "label": "Menü"
        }
      ]
    },
    {
      "type": "text",
      "name": "Text-Spalte",
      "settings": [
        {
          "type": "text",
          "id": "title",
          "label": "Titel"
        },
        {
          "type": "richtext",
          "id": "text",
          "label": "Text"
        }
      ]
    }
  ],
  "max_blocks": 4,
  "default": {
    "blocks": [
      {
        "type": "menu",
        "settings": {
          "title": "Shop",
          "menu": "main-menu"
        }
      },
      {
        "type": "menu",
        "settings": {
          "title": "Hilfe",
          "menu": "footer"
        }
      },
      {
        "type": "text",
        "settings": {
          "title": "Über uns",
          "text": "<p>Hochwertige, nachhaltige Möbel aus Biokunststoff. Made in Italy.</p>"
        }
      }
    ]
  }
}
{% endschema %}
```

- [ ] **Step 2: Commit**

```bash
git add sections/footer.liquid
git commit -m "feat: add footer section with menu blocks, social links, and payment icons"
```

---

## Phase 3 — Homepage Sections

### Task 8: Hero Banner Section

**Files:**
- Create: `sections/hero-banner.liquid`
- Create: `src/js/hero-slider.js`

- [ ] **Step 1: Create src/js/hero-slider.js**

```javascript
import Splide from '@splidejs/splide';

document.addEventListener('DOMContentLoaded', () => {
  const heroEl = document.querySelector('.hero-slider');
  if (!heroEl) return;

  new Splide(heroEl, {
    type: 'fade',
    rewind: true,
    autoplay: true,
    interval: 5000,
    pauseOnHover: false,
    pauseOnFocus: false,
    arrows: heroEl.querySelectorAll('.splide__slide').length > 1,
    pagination: heroEl.querySelectorAll('.splide__slide').length > 1,
    speed: 800,
  }).mount();
});
```

- [ ] **Step 2: Create sections/hero-banner.liquid**

```liquid
{%- if section.blocks.size > 0 -%}
<section class="relative">
  {%- if section.blocks.size == 1 -%}
    {%- assign block = section.blocks.first -%}
    <div class="relative aspect-[16/9] lg:aspect-[21/9] overflow-hidden" {{ block.shopify_attributes }}>
      {%- if block.settings.image != blank -%}
        {% render 'image',
          image: block.settings.image,
          alt: block.settings.heading,
          class: 'w-full h-full object-cover',
          sizes: '100vw',
          priority: true
        %}
      {%- else -%}
        <div class="w-full h-full bg-secondary"></div>
      {%- endif -%}

      {%- if block.settings.heading != blank or block.settings.text != blank -%}
        <div class="absolute inset-0 flex items-center bg-black/20">
          <div class="container">
            <div class="max-w-xl {% if block.settings.text_alignment == 'center' %}mx-auto text-center{% endif %}">
              {%- if block.settings.heading != blank -%}
                <h2 class="text-3xl lg:text-5xl font-heading font-bold text-white mb-4">{{ block.settings.heading }}</h2>
              {%- endif -%}
              {%- if block.settings.text != blank -%}
                <p class="text-lg text-white/90 mb-6">{{ block.settings.text }}</p>
              {%- endif -%}
              {%- if block.settings.button_text != blank -%}
                <a href="{{ block.settings.button_link }}" class="btn-primary bg-white text-primary hover:bg-gray-100">
                  {{ block.settings.button_text }}
                </a>
              {%- endif -%}
            </div>
          </div>
        </div>
      {%- endif -%}
    </div>

  {%- else -%}
    <div class="hero-slider splide" aria-label="Hero Banner">
      <div class="splide__track">
        <div class="splide__list">
          {%- for block in section.blocks -%}
            <div class="splide__slide" {{ block.shopify_attributes }}>
              <div class="relative aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
                {%- if block.settings.image != blank -%}
                  {% render 'image',
                    image: block.settings.image,
                    alt: block.settings.heading,
                    class: 'w-full h-full object-cover',
                    sizes: '100vw',
                    priority: forloop.first
                  %}
                {%- else -%}
                  <div class="w-full h-full bg-secondary"></div>
                {%- endif -%}

                {%- if block.settings.heading != blank or block.settings.text != blank -%}
                  <div class="absolute inset-0 flex items-center bg-black/20">
                    <div class="container">
                      <div class="max-w-xl {% if block.settings.text_alignment == 'center' %}mx-auto text-center{% endif %}">
                        {%- if block.settings.heading != blank -%}
                          <h2 class="text-3xl lg:text-5xl font-heading font-bold text-white mb-4">{{ block.settings.heading }}</h2>
                        {%- endif -%}
                        {%- if block.settings.text != blank -%}
                          <p class="text-lg text-white/90 mb-6">{{ block.settings.text }}</p>
                        {%- endif -%}
                        {%- if block.settings.button_text != blank -%}
                          <a href="{{ block.settings.button_link }}" class="btn-primary bg-white text-primary hover:bg-gray-100">
                            {{ block.settings.button_text }}
                          </a>
                        {%- endif -%}
                      </div>
                    </div>
                  </div>
                {%- endif -%}
              </div>
            </div>
          {%- endfor -%}
        </div>
      </div>
    </div>

    {{ 'splide-core.min.css' | asset_url | stylesheet_tag }}
    <script src="{{ 'hero-slider.js' | asset_url }}" type="module" defer></script>
  {%- endif -%}
</section>
{%- endif -%}

{% schema %}
{
  "name": "Hero Banner",
  "settings": [],
  "blocks": [
    {
      "type": "slide",
      "name": "Slide",
      "settings": [
        {
          "type": "image_picker",
          "id": "image",
          "label": "Bild"
        },
        {
          "type": "text",
          "id": "heading",
          "label": "Überschrift",
          "default": "Nachhaltige Möbel"
        },
        {
          "type": "text",
          "id": "text",
          "label": "Text",
          "default": "Hochwertige Möbel aus Biokunststoff, Made in Italy."
        },
        {
          "type": "text",
          "id": "button_text",
          "label": "Button-Text",
          "default": "Jetzt entdecken"
        },
        {
          "type": "url",
          "id": "button_link",
          "label": "Button-Link"
        },
        {
          "type": "select",
          "id": "text_alignment",
          "label": "Text-Ausrichtung",
          "options": [
            { "value": "left", "label": "Links" },
            { "value": "center", "label": "Zentriert" }
          ],
          "default": "left"
        }
      ]
    }
  ],
  "max_blocks": 5,
  "presets": [
    {
      "name": "Hero Banner",
      "blocks": [
        {
          "type": "slide"
        }
      ]
    }
  ]
}
{% endschema %}
```

- [ ] **Step 3: Build JS**

Run: `npm run build:js`

- [ ] **Step 4: Commit**

```bash
git add sections/hero-banner.liquid src/js/hero-slider.js
git commit -m "feat: add hero banner section with optional Splide slider"
```

---

### Task 9: Collection List, Featured Collection, Product Card

**Files:**
- Create: `snippets/product-card.liquid`
- Create: `snippets/price.liquid`
- Create: `sections/collection-list.liquid`
- Create: `sections/featured-collection.liquid`

- [ ] **Step 1: Create snippets/price.liquid**

```liquid
{%- comment -%}
  Price display component.
  Usage: {% render 'price', product: product %}
{%- endcomment -%}

<div class="flex items-center gap-2">
  {%- if product.compare_at_price > product.price -%}
    <span class="text-red-600 font-medium">{{ product.price | money }}</span>
    <span class="text-gray-400 line-through text-sm">{{ product.compare_at_price | money }}</span>
  {%- else -%}
    <span class="font-medium">{{ product.price | money }}</span>
  {%- endif -%}
</div>
```

- [ ] **Step 2: Create snippets/product-card.liquid**

```liquid
{%- comment -%}
  Product card component.
  Usage: {% render 'product-card', product: product %}
  Accepts:
  - product: {Product} Shopify product object
  - class: {String} Additional CSS classes
{%- endcomment -%}

{%- liquid
  assign card_class = class | default: ''
-%}

<div class="group {{ card_class }}">
  <a href="{{ product.url }}" class="block">
    <div class="relative aspect-square overflow-hidden rounded bg-gray-50 mb-3">
      {%- if product.featured_image -%}
        {% render 'image',
          image: product.featured_image,
          alt: product.title,
          class: 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105',
          sizes: '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw'
        %}

        {%- if product.images.size > 1 -%}
          {% render 'image',
            image: product.images[1],
            alt: product.title,
            class: 'absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500',
            sizes: '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw'
          %}
        {%- endif -%}
      {%- else -%}
        <div class="w-full h-full bg-secondary"></div>
      {%- endif -%}

      {%- if product.compare_at_price > product.price -%}
        {%- assign discount = product.compare_at_price | minus: product.price | times: 100.0 | divided_by: product.compare_at_price | round -%}
        <span class="absolute top-2 left-2 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
          -{{ discount }}%
        </span>
      {%- endif -%}
    </div>

    <div>
      {%- if product.vendor -%}
        <p class="text-xs text-gray-400 mb-1">{{ product.vendor }}</p>
      {%- endif -%}
      <h3 class="text-sm font-medium mb-1 group-hover:text-accent transition-colors line-clamp-2">
        {{ product.title }}
      </h3>
      {% render 'price', product: product %}
    </div>
  </a>
</div>
```

- [ ] **Step 3: Create sections/collection-list.liquid**

```liquid
<section class="py-12 lg:py-16">
  <div class="container">
    {%- if section.settings.heading != blank -%}
      <h2 class="text-2xl lg:text-3xl font-heading font-bold mb-8 {% if section.settings.center_heading %}text-center{% endif %}">
        {{ section.settings.heading }}
      </h2>
    {%- endif -%}

    <div class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
      {%- for block in section.blocks -%}
        {%- assign collection = block.settings.collection -%}
        <a href="{{ collection.url | default: '#' }}" class="flex-shrink-0 snap-start group" {{ block.shopify_attributes }}>
          <div class="w-36 lg:w-44">
            <div class="aspect-square rounded-full overflow-hidden bg-gray-50 mb-3">
              {%- if block.settings.image != blank -%}
                {% render 'image',
                  image: block.settings.image,
                  alt: collection.title,
                  class: 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110',
                  sizes: '180px'
                %}
              {%- elsif collection.image -%}
                {% render 'image',
                  image: collection.image,
                  alt: collection.title,
                  class: 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110',
                  sizes: '180px'
                %}
              {%- else -%}
                <div class="w-full h-full bg-secondary"></div>
              {%- endif -%}
            </div>
            <p class="text-sm font-medium text-center">
              {{ block.settings.label | default: collection.title | default: 'Kollektion' }}
            </p>
          </div>
        </a>
      {%- endfor -%}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Kategorie-Scroller",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Überschrift",
      "default": "Entdecke unsere Kategorien"
    },
    {
      "type": "checkbox",
      "id": "center_heading",
      "label": "Überschrift zentrieren",
      "default": false
    }
  ],
  "blocks": [
    {
      "type": "collection",
      "name": "Kategorie",
      "settings": [
        {
          "type": "collection",
          "id": "collection",
          "label": "Kollektion"
        },
        {
          "type": "image_picker",
          "id": "image",
          "label": "Bild (überschreibt Kollektionsbild)"
        },
        {
          "type": "text",
          "id": "label",
          "label": "Label (überschreibt Kollektionsname)"
        }
      ]
    }
  ],
  "max_blocks": 12,
  "presets": [
    {
      "name": "Kategorie-Scroller",
      "blocks": [
        { "type": "collection" },
        { "type": "collection" },
        { "type": "collection" },
        { "type": "collection" },
        { "type": "collection" }
      ]
    }
  ]
}
{% endschema %}
```

- [ ] **Step 4: Create sections/featured-collection.liquid**

```liquid
{%- assign collection = section.settings.collection -%}

<section class="py-12 lg:py-16">
  <div class="container">
    <div class="flex items-center justify-between mb-8">
      {%- if section.settings.heading != blank -%}
        <h2 class="text-2xl lg:text-3xl font-heading font-bold">{{ section.settings.heading }}</h2>
      {%- elsif collection -%}
        <h2 class="text-2xl lg:text-3xl font-heading font-bold">{{ collection.title }}</h2>
      {%- endif -%}

      {%- if collection and section.settings.show_view_all -%}
        <a href="{{ collection.url }}" class="text-sm font-medium text-accent hover:underline">
          Alle anzeigen
        </a>
      {%- endif -%}
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {%- if collection -%}
        {%- for product in collection.products limit: section.settings.products_count -%}
          {% render 'product-card', product: product %}
        {%- endfor -%}
      {%- else -%}
        {%- for i in (1..4) -%}
          <div class="animate-pulse">
            <div class="aspect-square rounded bg-gray-100 mb-3"></div>
            <div class="h-3 bg-gray-100 rounded w-1/3 mb-2"></div>
            <div class="h-4 bg-gray-100 rounded w-2/3 mb-2"></div>
            <div class="h-4 bg-gray-100 rounded w-1/4"></div>
          </div>
        {%- endfor -%}
      {%- endif -%}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Featured Collection",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Überschrift"
    },
    {
      "type": "collection",
      "id": "collection",
      "label": "Kollektion"
    },
    {
      "type": "range",
      "id": "products_count",
      "label": "Anzahl Produkte",
      "min": 2,
      "max": 12,
      "step": 1,
      "default": 4
    },
    {
      "type": "checkbox",
      "id": "show_view_all",
      "label": "\"Alle anzeigen\" Link",
      "default": true
    }
  ],
  "presets": [
    {
      "name": "Featured Collection"
    }
  ]
}
{% endschema %}
```

- [ ] **Step 5: Commit**

```bash
git add snippets/price.liquid snippets/product-card.liquid sections/collection-list.liquid sections/featured-collection.liquid
git commit -m "feat: add product card, price snippet, collection list, and featured collection sections"
```

---

### Task 10: Image with Text, Trust Badges, Newsletter, Rich Text

**Files:**
- Create: `sections/image-with-text.liquid`
- Create: `sections/trust-badges.liquid`
- Create: `sections/newsletter.liquid`
- Create: `sections/rich-text.liquid`

- [ ] **Step 1: Create sections/image-with-text.liquid**

```liquid
<section class="py-12 lg:py-16 {% if section.settings.background == 'dark' %}bg-primary text-white{% endif %}">
  <div class="container">
    <div class="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      <div class="{% if section.settings.image_position == 'right' %}lg:order-2{% endif %}">
        {%- if section.settings.image != blank -%}
          {% render 'image',
            image: section.settings.image,
            alt: section.settings.heading,
            class: 'w-full rounded',
            sizes: '(min-width: 1024px) 50vw, 100vw'
          %}
        {%- else -%}
          <div class="aspect-[4/3] bg-secondary rounded"></div>
        {%- endif -%}
      </div>

      <div>
        {%- if section.settings.subheading != blank -%}
          <p class="text-sm font-medium text-accent mb-2 uppercase tracking-wider">{{ section.settings.subheading }}</p>
        {%- endif -%}
        {%- if section.settings.heading != blank -%}
          <h2 class="text-2xl lg:text-4xl font-heading font-bold mb-4">{{ section.settings.heading }}</h2>
        {%- endif -%}
        {%- if section.settings.text != blank -%}
          <div class="prose max-w-none {% if section.settings.background == 'dark' %}prose-invert{% endif %}">
            {{ section.settings.text }}
          </div>
        {%- endif -%}
        {%- if section.settings.button_text != blank -%}
          <a href="{{ section.settings.button_link }}" class="btn-primary mt-6 inline-flex">
            {{ section.settings.button_text }}
          </a>
        {%- endif -%}
      </div>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Bild mit Text",
  "settings": [
    {
      "type": "image_picker",
      "id": "image",
      "label": "Bild"
    },
    {
      "type": "select",
      "id": "image_position",
      "label": "Bild-Position",
      "options": [
        { "value": "left", "label": "Links" },
        { "value": "right", "label": "Rechts" }
      ],
      "default": "left"
    },
    {
      "type": "text",
      "id": "subheading",
      "label": "Subheading"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Überschrift",
      "default": "Nachhaltige Möbel aus Biokunststoff"
    },
    {
      "type": "richtext",
      "id": "text",
      "label": "Text",
      "default": "<p>Unsere Möbel werden aus nachhaltigem Biokunststoff in Italien hergestellt. Premium-Qualität trifft auf Umweltbewusstsein.</p>"
    },
    {
      "type": "text",
      "id": "button_text",
      "label": "Button-Text"
    },
    {
      "type": "url",
      "id": "button_link",
      "label": "Button-Link"
    },
    {
      "type": "select",
      "id": "background",
      "label": "Hintergrund",
      "options": [
        { "value": "light", "label": "Hell" },
        { "value": "dark", "label": "Dunkel" }
      ],
      "default": "light"
    }
  ],
  "presets": [
    {
      "name": "Bild mit Text"
    }
  ]
}
{% endschema %}
```

- [ ] **Step 2: Create sections/trust-badges.liquid**

```liquid
<section class="py-12 lg:py-16 border-y border-gray-100">
  <div class="container">
    {%- if section.settings.heading != blank -%}
      <h2 class="text-xl font-heading font-bold text-center mb-8">{{ section.settings.heading }}</h2>
    {%- endif -%}

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
      {%- for i in (1..3) -%}
        {%- assign badge_text = 'trust_badge_' | append: i -%}
        {%- assign badge_icon = 'trust_icon_' | append: i -%}
        {%- if settings[badge_text] != blank -%}
          <div class="flex flex-col items-center gap-3">
            {%- if settings[badge_icon] != blank -%}
              {% render 'image', image: settings[badge_icon], alt: settings[badge_text], class: 'w-10 h-10', width: 40 %}
            {%- else -%}
              {%- case i -%}
                {%- when 1 -%}{% render 'icon', name: 'shield', size: 32 %}
                {%- when 2 -%}{% render 'icon', name: 'truck', size: 32 %}
                {%- when 3 -%}{% render 'icon', name: 'lock', size: 32 %}
              {%- endcase -%}
            {%- endif -%}
            <p class="text-sm font-medium">{{ settings[badge_text] }}</p>
          </div>
        {%- endif -%}
      {%- endfor -%}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Trust Badges",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Überschrift"
    }
  ],
  "presets": [
    {
      "name": "Trust Badges"
    }
  ]
}
{% endschema %}
```

- [ ] **Step 3: Create sections/newsletter.liquid**

```liquid
<section class="py-12 lg:py-16 bg-secondary">
  <div class="container max-w-xl text-center">
    <h2 class="text-2xl font-heading font-bold mb-2">{{ 'sections.newsletter.title' | t }}</h2>
    <p class="text-gray-600 mb-6">{{ 'sections.newsletter.subtitle' | t }}</p>

    {%- form 'customer', class: 'flex gap-2' -%}
      <input type="hidden" name="contact[tags]" value="newsletter">
      <input
        type="email"
        name="contact[email]"
        placeholder="{{ 'sections.newsletter.email_placeholder' | t }}"
        required
        autocomplete="email"
        class="flex-1 px-4 py-3 rounded border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm"
      >
      <button type="submit" class="btn-primary">
        {{ 'sections.newsletter.submit' | t }}
      </button>
    {%- endform -%}
  </div>
</section>

{% schema %}
{
  "name": "Newsletter",
  "settings": [],
  "presets": [
    {
      "name": "Newsletter"
    }
  ]
}
{% endschema %}
```

- [ ] **Step 4: Create sections/rich-text.liquid**

```liquid
<section class="py-12 lg:py-16">
  <div class="container max-w-3xl">
    {%- if section.settings.heading != blank -%}
      <h2 class="text-2xl lg:text-3xl font-heading font-bold mb-6 {% if section.settings.center %}text-center{% endif %}">
        {{ section.settings.heading }}
      </h2>
    {%- endif -%}

    {%- if section.settings.text != blank -%}
      <div class="prose max-w-none {% if section.settings.center %}text-center{% endif %}">
        {{ section.settings.text }}
      </div>
    {%- endif -%}
  </div>
</section>

{% schema %}
{
  "name": "Rich Text",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Überschrift"
    },
    {
      "type": "richtext",
      "id": "text",
      "label": "Text",
      "default": "<p>Inhalt hier einfügen.</p>"
    },
    {
      "type": "checkbox",
      "id": "center",
      "label": "Zentrieren",
      "default": false
    }
  ],
  "presets": [
    {
      "name": "Rich Text"
    }
  ]
}
{% endschema %}
```

- [ ] **Step 5: Commit**

```bash
git add sections/image-with-text.liquid sections/trust-badges.liquid sections/newsletter.liquid sections/rich-text.liquid
git commit -m "feat: add image-with-text, trust badges, newsletter, and rich text sections"
```

---

## Phases 4-8: Remaining Tasks (Summary)

The remaining phases follow the same pattern. For brevity, here are the task outlines — each task follows the same step structure (write code → build → commit):

### Task 11: Cross-Selling Slider Section
- Create `sections/cross-selling.liquid` with Splide product slider
- Create `snippets/upsell-products.liquid`

### Task 12: Product Gallery (Splide + Thumbnails)
- Create `src/js/product-gallery.js` — Splide main + thumbnail sync
- Gallery markup in main-product section

### Task 13: Variant Swatches
- Create `snippets/variant-swatches.liquid` — Color/material swatch rendering
- Create `src/js/product-form.js` — Variant switcher + URL update + image sync

### Task 14: Main Product Section
- Create `sections/main-product.liquid` — Full PDP with gallery, info, variants, ATC, accordion, trust badges
- Create `snippets/schema-product.liquid` — Product Schema.org
- Create `snippets/schema-breadcrumb.liquid` — Breadcrumb Schema.org

### Task 15: Sticky Add-to-Cart
- Add sticky ATC bar in main-product.liquid — appears on scroll past main ATC button
- IntersectionObserver in product-form.js

### Task 16: Product Accordion (Description, Dimensions, Materials, Shipping)
- Create `src/js/faq-accordion.js` — Reusable accordion component
- Accordion blocks in main-product section schema

### Task 17: Cart Drawer Section
- Create `sections/cart-drawer.liquid` — Slide-out drawer with items, upsell, shipping bar
- Create `snippets/cart-item.liquid` — Single cart line
- Create `snippets/free-shipping-bar.liquid` — Animated progress bar
- Create `src/js/cart-drawer.js` — Drawer open/close, upsell fetch

### Task 18: Cart Upselling (Hybrid)
- Upsell logic in cart-drawer.js — Metafield check → API fallback
- Liquid injection of metafield upsells via `window.productUpsells`

### Task 19: Cart Drawer Animations & Polish
- Slide-in/out transitions, item remove animation, loading states
- Body scroll lock, backdrop overlay, keyboard trap (Escape to close)

### Task 20: FAQ Section (Metaobject Integration)
- Create `sections/faq-section.liquid` — Reads `custom.faq_set` metafield, renders accordion
- Create `snippets/schema-faq.liquid` — FAQPage Schema.org

### Task 21: FAQ Accordion Interactivity
- Accordion open/close with Alpine.js x-data
- Smooth height transitions with x-collapse

### Task 22: Main Collection Section
- Create `sections/main-collection.liquid` — Product grid with filters, sort, pagination
- Shopify Filtering API integration

### Task 23: Collection Pagination (Load More)
- "Mehr laden" button with fetch-based pagination
- URL state management for filter persistence

### Task 24: Schema.org Markup (Product, Breadcrumb, FAQ)
- Finalize all Schema.org snippets
- Test with Google Rich Results Test

### Task 25: SEO Meta Tags & Performance
- Open Graph meta tags for all page types
- Canonical URLs, hreflang tags
- Image preloading for LCP elements

### Task 26: Final Build & .gitignore Audit
- Run full production build
- Verify .shopifyignore excludes src/, node_modules/
- Audit all assets for size
- Final commit

---

## Notes for the Implementing Engineer

1. **Shopify CLI:** Run `shopify theme dev --store=YOUR_STORE` alongside `npm run dev` for live preview
2. **Tailwind PurgeCSS:** If a class isn't working, check that the file is in `tailwind.config.js` content array
3. **Alpine.js x-cloak:** Add `[x-cloak] { display: none !important; }` to tailwind.css base layer to prevent FOUC
4. **Splide.js:** Download `splide-core.min.js` and `splide-core.min.css` from the Splide CDN and place in `assets/`
5. **Metaobjects:** The FAQ metaobject types must be created manually in Shopify Admin → Settings → Custom data before the FAQ section will work
6. **Testing:** Use Shopify Theme Inspector Chrome extension to verify Liquid rendering and identify slow sections
