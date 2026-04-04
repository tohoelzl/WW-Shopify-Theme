# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current 11-section homepage with 8 conversion-focused sections, adding SEO improvements (H1, structured data, SEO text block) and moving trust signals above the fold.

**Architecture:** Rewrite/replace existing Shopify Liquid section files. New sections: trust-bar, category-grid, brand-story, seo-text. Modify: hero-banner (simplify), featured-collection (add subtitle), testimonials (grid instead of carousel), newsletter (dark styling). Update index.json template and meta-tags snippet.

**Tech Stack:** Shopify Liquid, Tailwind CSS, Alpine.js (existing), Shopify Section Settings, JSON-LD structured data

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Modify | `sections/hero-banner.liquid` | Simplify: remove multi-slide/video/parallax, static image only |
| Create | `sections/trust-bar.liquid` | 4 USPs with SVG icons in a horizontal bar |
| Create | `sections/category-grid.liquid` | 3 collection tiles with image + overlay text |
| Modify | `sections/featured-collection.liquid` | Add subtitle setting, "Alle ansehen" link text |
| Create | `sections/brand-story.liquid` | Split layout: image left, text + USP icons right |
| Modify | `sections/testimonials.liquid` | Replace Splide carousel with static 3-column grid |
| Modify | `sections/newsletter.liquid` | Dark design with settings for heading/subtitle |
| Create | `sections/seo-text.liquid` | 2-column rich text block for SEO content |
| Modify | `templates/index.json` | New section order and settings |
| Modify | `snippets/meta-tags.liquid` | Add Twitter Card tags |
| Create | `snippets/schema-organization.liquid` | Organization JSON-LD |
| Create | `snippets/schema-website.liquid` | WebSite JSON-LD with SearchAction |
| Modify | `snippets/icon.liquid` | Add new icons: leaf, recycle, palette, sun, italy, return-arrow |
| Modify | `layout/theme.liquid` | Include Organization + WebSite schemas |

---

### Task 1: Add new SVG icons to icon.liquid

**Files:**
- Modify: `snippets/icon.liquid:80` (before closing `endcase`)

- [ ] **Step 1: Add 6 new icon cases to icon.liquid**

Add these cases before the `{%- endcase -%}` at line 80 in `snippets/icon.liquid`:

```liquid
  {%- when 'leaf' -%}
    <svg xmlns="http://www.w3.org/2000/svg" width="{{ size }}" height="{{ size }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="{{ icon_class }}" aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.5 10-10 10Z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>

  {%- when 'recycle' -%}
    <svg xmlns="http://www.w3.org/2000/svg" width="{{ size }}" height="{{ size }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="{{ icon_class }}" aria-hidden="true">
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/>
      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/>
      <path d="m14 16-3 3 3 3"/>
      <path d="M8.293 13.596 7.196 9.5 3.1 10.598"/>
      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 12.013 3a1.784 1.784 0 0 1 1.575.887l3.974 6.89"/>
      <path d="m20.898 13.408-1.098-4.096-4.096 1.098"/>
    </svg>

  {%- when 'palette' -%}
    <svg xmlns="http://www.w3.org/2000/svg" width="{{ size }}" height="{{ size }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="{{ icon_class }}" aria-hidden="true">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>

  {%- when 'sun' -%}
    <svg xmlns="http://www.w3.org/2000/svg" width="{{ size }}" height="{{ size }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="{{ icon_class }}" aria-hidden="true">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
    </svg>

  {%- when 'italy' -%}
    <svg xmlns="http://www.w3.org/2000/svg" width="{{ size }}" height="{{ size }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="{{ icon_class }}" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <line x1="8.67" y1="4" x2="8.67" y2="20"/>
      <line x1="15.33" y1="4" x2="15.33" y2="20"/>
    </svg>

  {%- when 'return-arrow' -%}
    <svg xmlns="http://www.w3.org/2000/svg" width="{{ size }}" height="{{ size }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="{{ icon_class }}" aria-hidden="true">
      <path d="m9 14-4-4 4-4"/>
      <path d="M5 10h11a4 4 0 1 1 0 8h-1"/>
    </svg>
```

- [ ] **Step 2: Verify icons render**

Open Shopify theme editor or check that file has no Liquid syntax errors:

```bash
cd /Users/tobias/Documents/WW_Shopify_Theme && grep -c "when '" snippets/icon.liquid
```

Expected: 17 (11 existing + 6 new)

- [ ] **Step 3: Commit**

```bash
git add snippets/icon.liquid
git commit -m "feat: add leaf, recycle, palette, sun, italy, return-arrow icons for homepage redesign"
```

---

### Task 2: Create trust-bar section

**Files:**
- Create: `sections/trust-bar.liquid`

- [ ] **Step 1: Create trust-bar.liquid**

```liquid
<section class="py-4 lg:py-5 bg-[#f8faf8] border-y border-gray-100">
  <div class="container">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
      {%- for block in section.blocks -%}
        <div class="flex items-center gap-3 justify-center" {{ block.shopify_attributes }}>
          <div class="text-accent shrink-0">
            {% render 'icon', name: block.settings.icon, size: 28 %}
          </div>
          <div>
            <p class="text-sm font-semibold leading-tight">{{ block.settings.title }}</p>
            {%- if block.settings.subtitle != blank -%}
              <p class="text-xs text-gray-500 mt-0.5">{{ block.settings.subtitle }}</p>
            {%- endif -%}
          </div>
        </div>
      {%- endfor -%}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Trust Bar",
  "settings": [],
  "blocks": [
    {
      "type": "trust_item",
      "name": "Trust Item",
      "settings": [
        {
          "type": "select",
          "id": "icon",
          "label": "Icon",
          "options": [
            { "value": "italy", "label": "Italien-Flagge" },
            { "value": "recycle", "label": "Recycling" },
            { "value": "truck", "label": "Lieferung" },
            { "value": "return-arrow", "label": "Rückgabe" },
            { "value": "shield", "label": "Schutz" },
            { "value": "leaf", "label": "Blatt/Bio" },
            { "value": "lock", "label": "Schloss" }
          ],
          "default": "shield"
        },
        { "type": "text", "id": "title", "label": "Titel", "default": "Trust Feature" },
        { "type": "text", "id": "subtitle", "label": "Untertitel" }
      ]
    }
  ],
  "max_blocks": 5,
  "presets": [
    {
      "name": "Trust Bar",
      "blocks": [
        { "type": "trust_item", "settings": { "icon": "italy", "title": "Made in Italy", "subtitle": "Fabrik in Mailand" } },
        { "type": "trust_item", "settings": { "icon": "recycle", "title": "100% Recycelbar", "subtitle": "Bio-Polyethylen" } },
        { "type": "trust_item", "settings": { "icon": "truck", "title": "Kostenloser Versand", "subtitle": "Ab 150€ Bestellwert" } },
        { "type": "trust_item", "settings": { "icon": "return-arrow", "title": "30 Tage Rückgabe", "subtitle": "Kostenlos & einfach" } }
      ]
    }
  ]
}
{% endschema %}
```

- [ ] **Step 2: Commit**

```bash
git add sections/trust-bar.liquid
git commit -m "feat: add trust-bar section with 4 configurable USPs"
```

---

### Task 3: Create category-grid section

**Files:**
- Create: `sections/category-grid.liquid`

- [ ] **Step 1: Create category-grid.liquid**

```liquid
<section class="py-12 lg:py-16">
  <div class="container">
    {%- if section.settings.subheading != blank -%}
      <p class="text-sm font-medium text-accent uppercase tracking-[0.2em] mb-2 text-center">
        {{ section.settings.subheading }}
      </p>
    {%- endif -%}
    {%- if section.settings.heading != blank -%}
      <h2 class="text-2xl lg:text-3xl font-heading font-bold text-center mb-8 lg:mb-10">
        {{ section.settings.heading }}
      </h2>
    {%- endif -%}

    <div class="grid grid-cols-3 gap-3 lg:gap-5">
      {%- for block in section.blocks -%}
        {%- assign collection = block.settings.collection -%}
        {%- liquid
          assign grid_image = block.settings.image
          unless grid_image
            assign grid_image = collection.image
          endunless
          unless grid_image
            if collection.products.size > 0
              assign grid_image = collection.products.first.featured_image
            endif
          endunless
        -%}

        <a href="{{ collection.url | default: '#' }}"
           class="group relative rounded-xl overflow-hidden aspect-[4/3]"
           {{ block.shopify_attributes }}>
          {%- if grid_image -%}
            {% render 'image',
              image: grid_image,
              alt: block.settings.label | default: collection.title,
              class: 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-105',
              sizes: '(min-width: 1024px) 33vw, 33vw'
            %}
          {%- else -%}
            <div class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
          {%- endif -%}

          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent">
            <div class="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
              <h3 class="text-white font-heading font-bold text-lg lg:text-xl">
                {{ block.settings.label | default: collection.title | default: 'Kategorie' }}
              </h3>
              {%- if block.settings.subtitle != blank -%}
                <p class="text-white/75 text-xs lg:text-sm mt-1">{{ block.settings.subtitle }}</p>
              {%- endif -%}
            </div>
          </div>
        </a>
      {%- endfor -%}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Kategorie Grid",
  "settings": [
    { "type": "text", "id": "subheading", "label": "Subheading" },
    { "type": "text", "id": "heading", "label": "Überschrift", "default": "Unsere Kategorien" }
  ],
  "blocks": [
    {
      "type": "category",
      "name": "Kategorie",
      "settings": [
        { "type": "collection", "id": "collection", "label": "Kollektion" },
        { "type": "image_picker", "id": "image", "label": "Bild (überschreibt Kollektionsbild)" },
        { "type": "text", "id": "label", "label": "Label (überschreibt Kollektionsname)" },
        { "type": "text", "id": "subtitle", "label": "Untertitel", "info": "z.B. 'Stühle, Sessel & Hocker'" }
      ]
    }
  ],
  "max_blocks": 6,
  "presets": [
    {
      "name": "Kategorie Grid",
      "blocks": [
        { "type": "category", "settings": { "label": "Sitzmöbel", "subtitle": "Stühle, Sessel & Hocker" } },
        { "type": "category", "settings": { "label": "Tische", "subtitle": "Esstische, Couchtische & Beistelltische" } },
        { "type": "category", "settings": { "label": "Leuchten", "subtitle": "Steh-, Tisch- & Hängeleuchten" } }
      ]
    }
  ]
}
{% endschema %}
```

- [ ] **Step 2: Commit**

```bash
git add sections/category-grid.liquid
git commit -m "feat: add category-grid section with 3 collection tiles"
```

---

### Task 4: Update featured-collection section

**Files:**
- Modify: `sections/featured-collection.liquid`

- [ ] **Step 1: Add subtitle setting and update heading markup**

Replace the entire content of `sections/featured-collection.liquid` with:

```liquid
{%- assign collection = section.settings.collection -%}

<section class="py-12 lg:py-16">
  <div class="container">
    <div class="flex items-end justify-between mb-8">
      <div>
        {%- if section.settings.heading != blank -%}
          <h2 class="text-2xl lg:text-3xl font-heading font-bold">{{ section.settings.heading }}</h2>
        {%- elsif collection -%}
          <h2 class="text-2xl lg:text-3xl font-heading font-bold">{{ collection.title }}</h2>
        {%- endif -%}
        {%- if section.settings.subtitle != blank -%}
          <p class="text-gray-500 text-sm mt-1">{{ section.settings.subtitle }}</p>
        {%- endif -%}
      </div>

      {%- if collection and section.settings.show_view_all -%}
        <a href="{{ collection.url }}" class="text-sm font-medium text-accent hover:underline shrink-0">
          {{ section.settings.view_all_text | default: 'Alle anzeigen' }} →
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
    { "type": "text", "id": "heading", "label": "Überschrift" },
    { "type": "text", "id": "subtitle", "label": "Untertitel", "default": "Die beliebtesten Designs unserer Kunden" },
    { "type": "collection", "id": "collection", "label": "Kollektion" },
    { "type": "range", "id": "products_count", "label": "Anzahl Produkte", "min": 2, "max": 12, "step": 1, "default": 4 },
    { "type": "checkbox", "id": "show_view_all", "label": "\"Alle anzeigen\" Link", "default": true },
    { "type": "text", "id": "view_all_text", "label": "\"Alle anzeigen\" Text", "default": "Alle ansehen" }
  ],
  "presets": [
    { "name": "Featured Collection" }
  ]
}
{% endschema %}
```

- [ ] **Step 2: Commit**

```bash
git add sections/featured-collection.liquid
git commit -m "feat: add subtitle and custom view-all text to featured-collection"
```

---

### Task 5: Create brand-story section

**Files:**
- Create: `sections/brand-story.liquid`

- [ ] **Step 1: Create brand-story.liquid**

```liquid
<section class="py-12 lg:py-20 {{ section.settings.background }}">
  <div class="container">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {%- comment -%} Image {%- endcomment -%}
      <div class="relative rounded-xl overflow-hidden aspect-[4/3]">
        {%- if section.settings.image != blank -%}
          {% render 'image',
            image: section.settings.image,
            alt: section.settings.heading,
            class: 'w-full h-full object-cover',
            sizes: '(min-width: 1024px) 50vw, 100vw'
          %}
        {%- else -%}
          <div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 text-sm">
            Bild hinzufügen
          </div>
        {%- endif -%}
      </div>

      {%- comment -%} Content {%- endcomment -%}
      <div>
        {%- if section.settings.subheading != blank -%}
          <p class="text-sm font-semibold text-accent uppercase tracking-[0.15em] mb-3">
            {{ section.settings.subheading }}
          </p>
        {%- endif -%}

        {%- if section.settings.heading != blank -%}
          <h2 class="text-2xl lg:text-3xl font-heading font-bold leading-snug mb-4">
            {{ section.settings.heading }}
          </h2>
        {%- endif -%}

        {%- if section.settings.text != blank -%}
          <div class="text-gray-600 leading-relaxed mb-6">
            {{ section.settings.text }}
          </div>
        {%- endif -%}

        {%- if section.blocks.size > 0 -%}
          <div class="grid grid-cols-2 gap-4 mb-6">
            {%- for block in section.blocks -%}
              <div class="flex items-start gap-3" {{ block.shopify_attributes }}>
                <div class="text-accent shrink-0 mt-0.5">
                  {% render 'icon', name: block.settings.icon, size: 22 %}
                </div>
                <div>
                  <p class="text-sm font-semibold leading-tight">{{ block.settings.title }}</p>
                  {%- if block.settings.subtitle != blank -%}
                    <p class="text-xs text-gray-500 mt-0.5">{{ block.settings.subtitle }}</p>
                  {%- endif -%}
                </div>
              </div>
            {%- endfor -%}
          </div>
        {%- endif -%}

        {%- if section.settings.button_text != blank -%}
          <a href="{{ section.settings.button_link }}" class="inline-flex items-center gap-1 text-accent font-semibold text-sm hover:underline">
            {{ section.settings.button_text }} →
          </a>
        {%- endif -%}
      </div>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Brand Story",
  "settings": [
    { "type": "image_picker", "id": "image", "label": "Bild" },
    { "type": "text", "id": "subheading", "label": "Subheading", "default": "Über die Marke" },
    { "type": "text", "id": "heading", "label": "Überschrift", "default": "Slide Design — Seit 2002 aus Mailand" },
    { "type": "richtext", "id": "text", "label": "Text", "default": "<p>Gegründet von Giò Colonna Romano, verbindet Slide Design italienische Handwerkskunst mit nachhaltiger Innovation. Jedes Möbelstück wird in der eigenen Fabrik in Buccinasco gefertigt.</p>" },
    { "type": "text", "id": "button_text", "label": "Link Text", "default": "Mehr über Slide Design" },
    { "type": "url", "id": "button_link", "label": "Link URL" },
    {
      "type": "select",
      "id": "background",
      "label": "Hintergrund",
      "options": [
        { "value": "", "label": "Weiß" },
        { "value": "bg-gray-50", "label": "Hellgrau" }
      ],
      "default": ""
    }
  ],
  "blocks": [
    {
      "type": "usp",
      "name": "USP",
      "settings": [
        {
          "type": "select",
          "id": "icon",
          "label": "Icon",
          "options": [
            { "value": "leaf", "label": "Blatt/Bio" },
            { "value": "recycle", "label": "Recycling" },
            { "value": "palette", "label": "Design/Palette" },
            { "value": "sun", "label": "Sonne/Outdoor" },
            { "value": "italy", "label": "Italien" },
            { "value": "shield", "label": "Qualität" },
            { "value": "truck", "label": "Lieferung" }
          ],
          "default": "leaf"
        },
        { "type": "text", "id": "title", "label": "Titel", "default": "USP Titel" },
        { "type": "text", "id": "subtitle", "label": "Untertitel" }
      ]
    }
  ],
  "max_blocks": 6,
  "presets": [
    {
      "name": "Brand Story",
      "blocks": [
        { "type": "usp", "settings": { "icon": "leaf", "title": "Bio-Polyethylen", "subtitle": "Aus Zuckerrohr gewonnen" } },
        { "type": "usp", "settings": { "icon": "recycle", "title": "100% Recycelbar", "subtitle": "Null Schadstoffemissionen" } },
        { "type": "usp", "settings": { "icon": "palette", "title": "Star-Designer", "subtitle": "Karim Rashid, Marcel Wanders" } },
        { "type": "usp", "settings": { "icon": "sun", "title": "Indoor & Outdoor", "subtitle": "Wetterfest & UV-beständig" } }
      ]
    }
  ]
}
{% endschema %}
```

- [ ] **Step 2: Commit**

```bash
git add sections/brand-story.liquid
git commit -m "feat: add brand-story section with split layout and USP icons"
```

---

### Task 6: Rewrite testimonials section (grid instead of carousel)

**Files:**
- Modify: `sections/testimonials.liquid`

- [ ] **Step 1: Replace testimonials.liquid with grid layout**

Replace the entire content of `sections/testimonials.liquid` with:

```liquid
{%- if section.blocks.size > 0 -%}
<section class="py-12 lg:py-16 bg-gray-50">
  <div class="container">
    {%- if section.settings.subheading != blank -%}
      <p class="text-sm font-medium text-accent uppercase tracking-[0.2em] mb-2 text-center">{{ section.settings.subheading }}</p>
    {%- endif -%}
    {%- if section.settings.heading != blank -%}
      <h2 class="text-2xl lg:text-3xl font-heading font-bold text-center mb-3">{{ section.settings.heading }}</h2>
    {%- endif -%}
    {%- if section.settings.subtitle != blank -%}
      <p class="text-gray-500 text-sm text-center mb-10">{{ section.settings.subtitle }}</p>
    {%- endif -%}

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
      {%- for block in section.blocks limit: 3 -%}
        <div class="bg-white rounded-xl p-6 lg:p-8 shadow-sm" {{ block.shopify_attributes }}>
          {%- comment -%} Stars {%- endcomment -%}
          <div class="flex items-center gap-1 mb-4">
            {%- for i in (1..5) -%}
              <svg class="w-4 h-4 {% if i <= block.settings.rating %}text-yellow-400{% else %}text-gray-200{% endif %}" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            {%- endfor -%}
          </div>

          {%- if block.settings.text != blank -%}
            <blockquote class="text-sm lg:text-base leading-relaxed text-gray-700 mb-5">
              "{{ block.settings.text }}"
            </blockquote>
          {%- endif -%}

          <div class="flex items-center gap-3">
            {%- if block.settings.avatar != blank -%}
              {% render 'image',
                image: block.settings.avatar,
                alt: block.settings.author,
                class: 'w-10 h-10 rounded-full object-cover',
                width: 40
              %}
            {%- else -%}
              <div class="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                {{ block.settings.author | slice: 0 }}
              </div>
            {%- endif -%}
            <div>
              {%- if block.settings.author != blank -%}
                <p class="font-semibold text-sm">{{ block.settings.author }}</p>
              {%- endif -%}
              {%- if block.settings.location != blank -%}
                <p class="text-xs text-gray-400">{{ block.settings.location }}</p>
              {%- endif -%}
            </div>
          </div>
        </div>
      {%- endfor -%}
    </div>
  </div>
</section>
{%- endif -%}

{% schema %}
{
  "name": "Testimonials",
  "settings": [
    { "type": "text", "id": "subheading", "label": "Subheading", "default": "Kundenstimmen" },
    { "type": "text", "id": "heading", "label": "Überschrift", "default": "Das sagen unsere Kunden" },
    { "type": "text", "id": "subtitle", "label": "Untertitel" }
  ],
  "blocks": [
    {
      "type": "testimonial",
      "name": "Bewertung",
      "settings": [
        { "type": "range", "id": "rating", "label": "Sterne", "min": 1, "max": 5, "default": 5 },
        { "type": "textarea", "id": "text", "label": "Text", "default": "Die Qualität ist herausragend. Man merkt sofort, dass hier mit Liebe zum Detail gearbeitet wird. Und das Beste: nachhaltig produziert!" },
        { "type": "text", "id": "author", "label": "Name", "default": "Maria S." },
        { "type": "text", "id": "location", "label": "Ort", "default": "München" },
        { "type": "image_picker", "id": "avatar", "label": "Avatar" }
      ]
    }
  ],
  "max_blocks": 10,
  "presets": [
    {
      "name": "Testimonials",
      "blocks": [
        { "type": "testimonial" },
        { "type": "testimonial", "settings": { "text": "Endlich Möbel, bei denen man kein schlechtes Gewissen haben muss. Das Design ist zeitlos und die Verarbeitung erstklassig.", "author": "Thomas K.", "location": "Berlin" } },
        { "type": "testimonial", "settings": { "text": "Made in Italy — das spürt man. Wir haben unser komplettes Wohnzimmer damit eingerichtet und sind begeistert.", "author": "Sarah L.", "location": "Hamburg" } }
      ]
    }
  ]
}
{% endschema %}
```

- [ ] **Step 2: Commit**

```bash
git add sections/testimonials.liquid
git commit -m "refactor: replace testimonials carousel with static 3-column grid"
```

---

### Task 7: Restyle newsletter section (dark design)

**Files:**
- Modify: `sections/newsletter.liquid`

- [ ] **Step 1: Replace newsletter.liquid with dark design and settings**

Replace the entire content of `sections/newsletter.liquid` with:

```liquid
<section class="py-12 lg:py-16 bg-primary text-white">
  <div class="container max-w-xl text-center">
    {%- if section.settings.heading != blank -%}
      <h2 class="text-2xl font-heading font-bold mb-2">{{ section.settings.heading }}</h2>
    {%- else -%}
      <h2 class="text-2xl font-heading font-bold mb-2">{{ 'sections.newsletter.title' | t }}</h2>
    {%- endif -%}

    {%- if section.settings.subtitle != blank -%}
      <p class="text-white/70 mb-6">{{ section.settings.subtitle }}</p>
    {%- else -%}
      <p class="text-white/70 mb-6">{{ 'sections.newsletter.subtitle' | t }}</p>
    {%- endif -%}

    {%- form 'customer', class: 'flex gap-2' -%}
      <input type="hidden" name="contact[tags]" value="newsletter">
      <input
        type="email"
        name="contact[email]"
        placeholder="{{ 'sections.newsletter.email_placeholder' | t }}"
        required
        autocomplete="email"
        class="flex-1 px-4 py-3 rounded border border-white/20 bg-white/10 text-white placeholder-white/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm"
      >
      <button type="submit" class="px-6 py-3 bg-accent text-white font-semibold rounded hover:bg-accent/90 transition-colors text-sm">
        {{ 'sections.newsletter.submit' | t }}
      </button>
    {%- endform -%}

    <p class="text-white/40 text-xs mt-4">{{ section.settings.disclaimer | default: 'Kein Spam. Jederzeit abbestellbar.' }}</p>
  </div>
</section>

{% schema %}
{
  "name": "Newsletter",
  "settings": [
    { "type": "text", "id": "heading", "label": "Überschrift", "default": "10% Rabatt auf deine erste Bestellung" },
    { "type": "text", "id": "subtitle", "label": "Untertitel", "default": "Melde dich an und erhalte exklusive Angebote, neue Designs und Einrichtungstipps." },
    { "type": "text", "id": "disclaimer", "label": "Hinweis", "default": "Kein Spam. Jederzeit abbestellbar." }
  ],
  "presets": [{ "name": "Newsletter" }]
}
{% endschema %}
```

- [ ] **Step 2: Commit**

```bash
git add sections/newsletter.liquid
git commit -m "refactor: restyle newsletter section with dark design and configurable text"
```

---

### Task 8: Create SEO text section

**Files:**
- Create: `sections/seo-text.liquid`

- [ ] **Step 1: Create seo-text.liquid**

```liquid
{%- if section.settings.text != blank -%}
<section class="py-10 lg:py-12 bg-gray-50">
  <div class="container">
    {%- if section.settings.heading != blank -%}
      <h2 class="text-lg lg:text-xl font-heading font-bold mb-4">{{ section.settings.heading }}</h2>
    {%- endif -%}

    <div class="text-sm text-gray-500 leading-relaxed lg:columns-2 lg:gap-8 [&>p]:mb-3">
      {{ section.settings.text }}
    </div>
  </div>
</section>
{%- endif -%}

{% schema %}
{
  "name": "SEO Text",
  "settings": [
    { "type": "text", "id": "heading", "label": "Überschrift", "default": "Nachhaltige Designmöbel online kaufen — Made in Italy" },
    {
      "type": "richtext",
      "id": "text",
      "label": "Text",
      "default": "<p>Bei uns findest du nachhaltige Möbel des italienischen Designlabels Slide Design. Seit 2002 fertigt Slide in seiner Fabrik bei Mailand Sitzmöbel, Tische und Leuchten aus 100% recycelbarem Bio-Polyethylen — ein Material, das aus Zuckerrohr gewonnen wird und vollständig ohne Schadstoffe verarbeitet wird.</p><p>Ob für Indoor oder Outdoor — unsere Designermöbel sind wetterfest, UV-beständig und leicht zu reinigen. Entworfen von international renommierten Designern wie Karim Rashid, Marcel Wanders und Paola Navone, verbinden sie italienische Ästhetik mit nachhaltiger Produktion.</p><p>Entdecke unsere Kollektion an Stühlen, Sesseln, Hockern, Esstischen und Couchtischen. Kostenloser Versand ab 150€ und 30 Tage Rückgaberecht — damit du in Ruhe entscheiden kannst.</p>"
    }
  ],
  "presets": [{ "name": "SEO Text" }]
}
{% endschema %}
```

- [ ] **Step 2: Commit**

```bash
git add sections/seo-text.liquid
git commit -m "feat: add seo-text section with 2-column rich text layout"
```

---

### Task 9: Simplify hero-banner section

**Files:**
- Modify: `sections/hero-banner.liquid`

- [ ] **Step 1: Replace hero-banner.liquid with simplified static hero**

Replace the entire content of `sections/hero-banner.liquid` with:

```liquid
{%- assign block = section.blocks.first -%}
{%- if block -%}
<section class="relative overflow-hidden">
  <div class="relative min-h-[70vh] lg:min-h-[85vh] flex items-center overflow-hidden" {{ block.shopify_attributes }}>

    {%- comment -%} Background image (static, no parallax, no video) {%- endcomment -%}
    {%- if block.settings.image != blank -%}
      <div class="absolute inset-0">
        {% render 'image',
          image: block.settings.image,
          alt: block.settings.heading,
          class: 'w-full h-full object-cover',
          sizes: '100vw',
          priority: true
        %}
      </div>
    {%- else -%}
      <div class="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700"></div>
    {%- endif -%}

    {%- comment -%} Overlay {%- endcomment -%}
    <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>

    {%- comment -%} Content {%- endcomment -%}
    <div class="container relative z-10 py-20 lg:py-32">
      <div class="max-w-2xl {% if block.settings.text_alignment == 'center' %}mx-auto text-center{% endif %}">
        {%- if block.settings.subheading != blank -%}
          <p class="text-xs sm:text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">
            {{ block.settings.subheading }}
          </p>
        {%- endif -%}
        {%- if block.settings.heading != blank -%}
          <h1 class="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold text-white leading-[1.1] mb-6">
            {{ block.settings.heading }}
          </h1>
        {%- endif -%}
        {%- if block.settings.text != blank -%}
          <p class="text-lg sm:text-xl text-white/80 mb-8 max-w-lg {% if block.settings.text_alignment == 'center' %}mx-auto{% endif %}">
            {{ block.settings.text }}
          </p>
        {%- endif -%}
        <div class="flex flex-wrap gap-4 {% if block.settings.text_alignment == 'center' %}justify-center{% endif %}">
          {%- if block.settings.button_text != blank -%}
            <a href="{{ block.settings.button_link }}" class="inline-flex items-center px-8 py-4 bg-accent text-white font-medium rounded hover:bg-accent/90 transition-colors text-sm uppercase tracking-wider">
              {{ block.settings.button_text }}
            </a>
          {%- endif -%}
          {%- if block.settings.button_text_2 != blank -%}
            <a href="{{ block.settings.button_link_2 }}" class="inline-flex items-center px-8 py-4 border-2 border-white text-white font-medium rounded hover:bg-white hover:text-primary transition-colors text-sm uppercase tracking-wider">
              {{ block.settings.button_text_2 }}
            </a>
          {%- endif -%}
        </div>
      </div>
    </div>
  </div>
</section>
{%- endif -%}

{% schema %}
{
  "name": "Hero Banner",
  "settings": [],
  "blocks": [
    {
      "type": "slide",
      "name": "Hero",
      "limit": 1,
      "settings": [
        { "type": "image_picker", "id": "image", "label": "Hintergrundbild" },
        { "type": "text", "id": "subheading", "label": "Subheading", "default": "100% Made in Italy" },
        { "type": "text", "id": "heading", "label": "Überschrift (H1)", "default": "Italienisches Design für dein Zuhause" },
        { "type": "textarea", "id": "text", "label": "Text", "default": "Nachhaltige Möbel aus recycelbarem Bio-Kunststoff — designed von weltbekannten Designern." },
        { "type": "text", "id": "button_text", "label": "Button 1 Text", "default": "Kollektion entdecken" },
        { "type": "url", "id": "button_link", "label": "Button 1 Link" },
        { "type": "text", "id": "button_text_2", "label": "Button 2 Text", "default": "Über Slide Design" },
        { "type": "url", "id": "button_link_2", "label": "Button 2 Link" },
        {
          "type": "select", "id": "text_alignment", "label": "Text-Ausrichtung",
          "options": [
            { "value": "left", "label": "Links" },
            { "value": "center", "label": "Zentriert" }
          ],
          "default": "left"
        }
      ]
    }
  ],
  "max_blocks": 1,
  "presets": [{ "name": "Hero Banner", "blocks": [{ "type": "slide" }] }]
}
{% endschema %}
```

- [ ] **Step 2: Commit**

```bash
git add sections/hero-banner.liquid
git commit -m "refactor: simplify hero-banner to static single-image, remove video/parallax/multi-slide"
```

---

### Task 10: Add structured data schemas

**Files:**
- Create: `snippets/schema-organization.liquid`
- Create: `snippets/schema-website.liquid`

- [ ] **Step 1: Create schema-organization.liquid**

```liquid
{%- comment -%}
  Organization Schema — renders on every page via theme.liquid.
  Provides company info for Google Knowledge Panel.
{%- endcomment -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": {{ shop.name | json }},
  "url": {{ shop.url | json }},
  {%- if shop.brand.logo -%}
  "logo": {{ shop.brand.logo | image_url: width: 600 | json }},
  {%- endif -%}
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": {{ shop.email | json }}
  }
}
</script>
```

- [ ] **Step 2: Create schema-website.liquid**

```liquid
{%- comment -%}
  WebSite Schema — renders on homepage via theme.liquid.
  Enables Google Sitelinks Search Box.
{%- endcomment -%}
{%- if request.page_type == 'index' -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": {{ shop.name | json }},
  "url": {{ shop.url | json }},
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "{{ shop.url }}/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
</script>
{%- endif -%}
```

- [ ] **Step 3: Commit**

```bash
git add snippets/schema-organization.liquid snippets/schema-website.liquid
git commit -m "feat: add Organization and WebSite structured data schemas"
```

---

### Task 11: Update meta-tags with Twitter Cards

**Files:**
- Modify: `snippets/meta-tags.liquid`

- [ ] **Step 1: Add Twitter Card tags at the end of meta-tags.liquid**

Append the following after the last line in `snippets/meta-tags.liquid` (after line 47):

```liquid

{%- comment -%} Twitter Card {%- endcomment -%}
<meta name="twitter:card" content="summary_large_image">
{%- if page_title -%}
  <meta name="twitter:title" content="{{ page_title | escape }}">
{%- endif -%}
{%- if page_description -%}
  <meta name="twitter:description" content="{{ page_description | escape }}">
{%- endif -%}
{%- if product.featured_image -%}
  <meta name="twitter:image" content="{{ product.featured_image | image_url: width: 1200 }}">
{%- endif -%}
```

- [ ] **Step 2: Commit**

```bash
git add snippets/meta-tags.liquid
git commit -m "feat: add Twitter Card meta tags"
```

---

### Task 12: Include schemas in theme.liquid

**Files:**
- Modify: `layout/theme.liquid`

- [ ] **Step 1: Add schema renders before closing head tag**

In `layout/theme.liquid`, add the schema snippets just before `{{ content_for_header }}` (line 35):

```liquid
  {% render 'schema-organization' %}
  {% render 'schema-website' %}

  {{ content_for_header }}
```

- [ ] **Step 2: Commit**

```bash
git add layout/theme.liquid
git commit -m "feat: include Organization and WebSite schemas in theme.liquid"
```

---

### Task 13: Update index.json template

**Files:**
- Modify: `templates/index.json`

- [ ] **Step 1: Replace index.json with new section order and settings**

Replace the entire content of `templates/index.json` with:

```json
{
  "sections": {
    "hero": {
      "type": "hero-banner",
      "blocks": {
        "slide-1": {
          "type": "slide",
          "settings": {
            "subheading": "100% Made in Italy",
            "heading": "Italienisches Design für dein Zuhause",
            "text": "Nachhaltige Möbel aus recycelbarem Bio-Kunststoff — designed von weltbekannten Designern.",
            "button_text": "Kollektion entdecken",
            "button_text_2": "Über Slide Design",
            "text_alignment": "left"
          }
        }
      },
      "block_order": ["slide-1"],
      "settings": {}
    },
    "trust-bar": {
      "type": "trust-bar",
      "blocks": {
        "made-in-italy": {
          "type": "trust_item",
          "settings": {
            "icon": "italy",
            "title": "Made in Italy",
            "subtitle": "Fabrik in Mailand"
          }
        },
        "recycelbar": {
          "type": "trust_item",
          "settings": {
            "icon": "recycle",
            "title": "100% Recycelbar",
            "subtitle": "Bio-Polyethylen"
          }
        },
        "versand": {
          "type": "trust_item",
          "settings": {
            "icon": "truck",
            "title": "Kostenloser Versand",
            "subtitle": "Ab 150€ Bestellwert"
          }
        },
        "rueckgabe": {
          "type": "trust_item",
          "settings": {
            "icon": "return-arrow",
            "title": "30 Tage Rückgabe",
            "subtitle": "Kostenlos & einfach"
          }
        }
      },
      "block_order": ["made-in-italy", "recycelbar", "versand", "rueckgabe"],
      "settings": {}
    },
    "categories": {
      "type": "category-grid",
      "blocks": {
        "sitzmoebel": {
          "type": "category",
          "settings": {
            "label": "Sitzmöbel",
            "subtitle": "Stühle, Sessel & Hocker"
          }
        },
        "tische": {
          "type": "category",
          "settings": {
            "label": "Tische",
            "subtitle": "Esstische, Couchtische & Beistelltische"
          }
        },
        "leuchten": {
          "type": "category",
          "settings": {
            "label": "Leuchten",
            "subtitle": "Steh-, Tisch- & Hängeleuchten"
          }
        }
      },
      "block_order": ["sitzmoebel", "tische", "leuchten"],
      "settings": {
        "heading": "Unsere Kategorien",
        "subheading": "Kollektion"
      }
    },
    "featured-collection": {
      "type": "featured-collection",
      "settings": {
        "heading": "Bestseller",
        "subtitle": "Die beliebtesten Designs unserer Kunden",
        "products_count": 4,
        "show_view_all": true,
        "view_all_text": "Alle ansehen"
      }
    },
    "brand-story": {
      "type": "brand-story",
      "blocks": {
        "usp-bio": {
          "type": "usp",
          "settings": {
            "icon": "leaf",
            "title": "Bio-Polyethylen",
            "subtitle": "Aus Zuckerrohr gewonnen"
          }
        },
        "usp-recycle": {
          "type": "usp",
          "settings": {
            "icon": "recycle",
            "title": "100% Recycelbar",
            "subtitle": "Null Schadstoffemissionen"
          }
        },
        "usp-designer": {
          "type": "usp",
          "settings": {
            "icon": "palette",
            "title": "Star-Designer",
            "subtitle": "Karim Rashid, Marcel Wanders"
          }
        },
        "usp-outdoor": {
          "type": "usp",
          "settings": {
            "icon": "sun",
            "title": "Indoor & Outdoor",
            "subtitle": "Wetterfest & UV-beständig"
          }
        }
      },
      "block_order": ["usp-bio", "usp-recycle", "usp-designer", "usp-outdoor"],
      "settings": {
        "subheading": "Über die Marke",
        "heading": "Slide Design — Seit 2002 aus Mailand",
        "text": "<p>Gegründet von Giò Colonna Romano, verbindet Slide Design italienische Handwerkskunst mit nachhaltiger Innovation. Jedes Möbelstück wird in der eigenen Fabrik in Buccinasco gefertigt.</p>",
        "button_text": "Mehr über Slide Design"
      }
    },
    "testimonials": {
      "type": "testimonials",
      "blocks": {
        "review-1": {
          "type": "testimonial",
          "settings": {
            "rating": 5,
            "text": "Die Qualität ist herausragend. Man merkt sofort, dass hier mit Liebe zum Detail gearbeitet wird. Und das Beste: nachhaltig produziert!",
            "author": "Maria S.",
            "location": "München"
          }
        },
        "review-2": {
          "type": "testimonial",
          "settings": {
            "rating": 5,
            "text": "Endlich Möbel, bei denen man kein schlechtes Gewissen haben muss. Das Design ist zeitlos und die Verarbeitung erstklassig.",
            "author": "Thomas K.",
            "location": "Berlin"
          }
        },
        "review-3": {
          "type": "testimonial",
          "settings": {
            "rating": 5,
            "text": "Made in Italy — das spürt man. Wir haben unser komplettes Wohnzimmer damit eingerichtet und sind begeistert.",
            "author": "Sarah L.",
            "location": "Hamburg"
          }
        }
      },
      "block_order": ["review-1", "review-2", "review-3"],
      "settings": {
        "subheading": "Kundenstimmen",
        "heading": "Das sagen unsere Kunden",
        "subtitle": "Über 500 zufriedene Kunden in ganz Europa"
      }
    },
    "newsletter": {
      "type": "newsletter",
      "settings": {
        "heading": "10% Rabatt auf deine erste Bestellung",
        "subtitle": "Melde dich an und erhalte exklusive Angebote, neue Designs und Einrichtungstipps.",
        "disclaimer": "Kein Spam. Jederzeit abbestellbar."
      }
    },
    "seo-text": {
      "type": "seo-text",
      "settings": {
        "heading": "Nachhaltige Designmöbel online kaufen — Made in Italy",
        "text": "<p>Bei uns findest du nachhaltige Möbel des italienischen Designlabels Slide Design. Seit 2002 fertigt Slide in seiner Fabrik bei Mailand Sitzmöbel, Tische und Leuchten aus 100% recycelbarem Bio-Polyethylen — ein Material, das aus Zuckerrohr gewonnen wird und vollständig ohne Schadstoffe verarbeitet wird.</p><p>Ob für Indoor oder Outdoor — unsere Designermöbel sind wetterfest, UV-beständig und leicht zu reinigen. Entworfen von international renommierten Designern wie Karim Rashid, Marcel Wanders und Paola Navone, verbinden sie italienische Ästhetik mit nachhaltiger Produktion.</p><p>Entdecke unsere Kollektion an Stühlen, Sesseln, Hockern, Esstischen und Couchtischen. Kostenloser Versand ab 150€ und 30 Tage Rückgaberecht — damit du in Ruhe entscheiden kannst.</p>"
      }
    }
  },
  "order": [
    "hero",
    "trust-bar",
    "categories",
    "featured-collection",
    "brand-story",
    "testimonials",
    "newsletter",
    "seo-text"
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add templates/index.json
git commit -m "feat: update homepage template with new 8-section conversion-first layout"
```

---

### Task 14: Build CSS and verify

**Files:**
- Run build commands

- [ ] **Step 1: Run Tailwind build to compile CSS**

```bash
cd /Users/tobias/Documents/WW_Shopify_Theme && npm run build
```

Expected: Build completes without errors. `assets/application.css` is updated with new Tailwind classes used in the new sections.

- [ ] **Step 2: Verify all section files have valid Liquid syntax**

```bash
cd /Users/tobias/Documents/WW_Shopify_Theme && for f in sections/hero-banner.liquid sections/trust-bar.liquid sections/category-grid.liquid sections/featured-collection.liquid sections/brand-story.liquid sections/testimonials.liquid sections/newsletter.liquid sections/seo-text.liquid; do echo "--- $f ---" && grep -c 'schema' "$f"; done
```

Expected: Each file outputs `2` (opening and closing schema tag).

- [ ] **Step 3: Verify index.json is valid JSON**

```bash
cd /Users/tobias/Documents/WW_Shopify_Theme && python3 -c "import json; json.load(open('templates/index.json')); print('Valid JSON')"
```

Expected: `Valid JSON`

- [ ] **Step 4: Commit build output**

```bash
git add assets/application.css
git commit -m "build: compile CSS for homepage redesign"
```

---

### Task 15: Cleanup — remove unused section files

**Files:**
- Delete: `sections/category-bento.liquid` (replaced by category-grid)
- Delete: `sections/category-highlight.liquid` (replaced by category-grid)
- Delete: `sections/storytelling.liquid` (replaced by brand-story)

- [ ] **Step 1: Verify sections are not used in other templates**

```bash
cd /Users/tobias/Documents/WW_Shopify_Theme && grep -r "category-bento\|category-highlight\|storytelling" templates/ sections/ layout/ --include="*.json" --include="*.liquid" -l
```

Expected: Only `templates/index.json` (which we already updated) should match. If other templates reference them, keep those files.

- [ ] **Step 2: Remove unused section files**

```bash
cd /Users/tobias/Documents/WW_Shopify_Theme && git rm sections/category-bento.liquid sections/category-highlight.liquid sections/storytelling.liquid
```

- [ ] **Step 3: Commit**

```bash
git commit -m "cleanup: remove category-bento, category-highlight, storytelling sections (replaced by new homepage sections)"
```
