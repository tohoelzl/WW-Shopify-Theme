# Tetris Grid Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new Shopify OS 2.0 section that displays products/categories in an alternating-height "Tetris" grid pattern with automatic vertical alignment based on row position.

**Architecture:** Single section file (`sections/tetris-grid.liquid`) using CSS Grid. Rows are added as blocks, each configurable with pattern, collection, display type, and optional title. The product-card snippet is reused for product display; category card markup is inline (following `category-grid.liquid` pattern).

**Tech Stack:** Liquid, Tailwind CSS (existing setup), CSS Grid with custom inline styles for height logic.

---

## File Structure

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `sections/tetris-grid.liquid` | Section with Liquid logic, HTML grid, inline CSS, and JSON schema |
| Modify | `templates/index.json` | Add tetris-grid section to homepage, replacing featured-collection sections |

---

### Task 1: Create the tetris-grid section with schema

**Files:**
- Create: `sections/tetris-grid.liquid`

- [ ] **Step 1: Create section file with schema and basic structure**

Create `sections/tetris-grid.liquid` with the full implementation:

```liquid
{%- style -%}
  .tetris-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
  }
  .tetris-row--first { align-items: start; }
  .tetris-row--middle { align-items: center; }
  .tetris-row--last { align-items: end; }
  .tetris-row--only { align-items: center; }

  .tetris-card-tall {
    aspect-ratio: 2/3;
  }
  .tetris-card-normal {
    aspect-ratio: 1/1;
  }

  @media (max-width: 1023px) {
    .tetris-row {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }
    .tetris-card-tall,
    .tetris-card-normal {
      aspect-ratio: 1/1;
    }
  }
{%- endstyle -%}

<section class="py-12 lg:py-16" style="padding-top: {{ section.settings.padding_top }}px; padding-bottom: {{ section.settings.padding_bottom }}px;">
  <div class="container">
    {%- if section.settings.heading != blank -%}
      <h2 class="text-2xl lg:text-3xl font-heading font-bold text-center mb-8 lg:mb-10">
        {{ section.settings.heading }}
      </h2>
    {%- endif -%}

    {%- assign total_rows = section.blocks.size -%}

    {%- for block in section.blocks -%}
      {%- assign row_index = forloop.index -%}

      {%- comment -%} Determine alignment class {%- endcomment -%}
      {%- liquid
        if total_rows == 1
          assign align_class = 'tetris-row--only'
        elsif forloop.first
          assign align_class = 'tetris-row--first'
        elsif forloop.last
          assign align_class = 'tetris-row--last'
        else
          assign align_class = 'tetris-row--middle'
        endif
      -%}

      {%- comment -%} Optional row title {%- endcomment -%}
      {%- if block.settings.row_title != blank -%}
        <h3 class="text-xl lg:text-2xl font-heading font-bold mb-4 {% if forloop.first == false %}mt-8 lg:mt-10{% endif %}">
          {{ block.settings.row_title }}
        </h3>
      {%- elsif forloop.first == false -%}
        <div class="mt-6 lg:mt-8"></div>
      {%- endif -%}

      {%- assign collection = block.settings.collection -%}
      {%- assign pattern = block.settings.pattern -%}
      {%- assign display_type = block.settings.display_type -%}

      {%- comment -%} Calculate product offset for continuation rows {%- endcomment -%}
      {%- assign product_offset = 0 -%}
      {%- if collection -%}
        {%- for prev_block in section.blocks -%}
          {%- if forloop.index >= row_index -%}
            {%- break -%}
          {%- endif -%}
          {%- if prev_block.settings.collection == collection and prev_block.settings.display_type == display_type -%}
            {%- assign product_offset = product_offset | plus: 4 -%}
          {%- endif -%}
        {%- endfor -%}
      {%- endif -%}

      <div class="tetris-row {{ align_class }}" {{ block.shopify_attributes }}>
        {%- if collection -%}
          {%- if display_type == 'products' -%}
            {%- for product in collection.products limit: 4 offset: product_offset -%}
              {%- liquid
                assign card_index = forloop.index
                if pattern == 'outside_tall'
                  if card_index == 1 or card_index == 4
                    assign card_class = 'tetris-card-tall'
                  else
                    assign card_class = 'tetris-card-normal'
                  endif
                else
                  if card_index == 2 or card_index == 3
                    assign card_class = 'tetris-card-tall'
                  else
                    assign card_class = 'tetris-card-normal'
                  endif
                endif
              -%}
              <div class="{{ card_class }} overflow-hidden rounded">
                {% render 'product-card', product: product, class: 'h-full' %}
              </div>
            {%- endfor -%}
          {%- else -%}
            {%- comment -%} Category display {%- endcomment -%}
            {%- for product in collection.products limit: 4 offset: product_offset -%}
              {%- liquid
                assign card_index = forloop.index
                if pattern == 'outside_tall'
                  if card_index == 1 or card_index == 4
                    assign card_class = 'tetris-card-tall'
                  else
                    assign card_class = 'tetris-card-normal'
                  endif
                else
                  if card_index == 2 or card_index == 3
                    assign card_class = 'tetris-card-tall'
                  else
                    assign card_class = 'tetris-card-normal'
                  endif
                endif
              -%}
              <a href="{{ product.url }}" class="group relative rounded-xl overflow-hidden {{ card_class }}">
                {%- if product.featured_image -%}
                  {% render 'image',
                    image: product.featured_image,
                    alt: product.title,
                    class: 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-105',
                    sizes: '(min-width: 1024px) 25vw, 50vw'
                  %}
                {%- else -%}
                  <div class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
                {%- endif -%}
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent">
                  <div class="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                    <h3 class="text-white font-heading font-bold text-lg lg:text-xl">
                      {{ product.title }}
                    </h3>
                  </div>
                </div>
              </a>
            {%- endfor -%}
          {%- endif -%}
        {%- else -%}
          {%- comment -%} Placeholder cards when no collection selected {%- endcomment -%}
          {%- for i in (1..4) -%}
            {%- liquid
              if pattern == 'outside_tall'
                if i == 1 or i == 4
                  assign card_class = 'tetris-card-tall'
                else
                  assign card_class = 'tetris-card-normal'
                endif
              else
                if i == 2 or i == 3
                  assign card_class = 'tetris-card-tall'
                else
                  assign card_class = 'tetris-card-normal'
                endif
              endif
            -%}
            <div class="{{ card_class }} animate-pulse rounded bg-gray-100"></div>
          {%- endfor -%}
        {%- endif -%}
      </div>
    {%- endfor -%}
  </div>
</section>

{% schema %}
{
  "name": "Tetris Grid",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Überschrift",
      "default": ""
    },
    {
      "type": "range",
      "id": "padding_top",
      "label": "Abstand oben (px)",
      "min": 0,
      "max": 100,
      "step": 4,
      "default": 48
    },
    {
      "type": "range",
      "id": "padding_bottom",
      "label": "Abstand unten (px)",
      "min": 0,
      "max": 100,
      "step": 4,
      "default": 48
    }
  ],
  "blocks": [
    {
      "type": "row",
      "name": "Reihe",
      "settings": [
        {
          "type": "text",
          "id": "row_title",
          "label": "Titel (optional)"
        },
        {
          "type": "select",
          "id": "pattern",
          "label": "Muster",
          "options": [
            { "value": "outside_tall", "label": "Außen hoch" },
            { "value": "center_tall", "label": "Mitte hoch" }
          ],
          "default": "outside_tall"
        },
        {
          "type": "collection",
          "id": "collection",
          "label": "Kollektion"
        },
        {
          "type": "select",
          "id": "display_type",
          "label": "Anzeige als",
          "options": [
            { "value": "products", "label": "Produkte" },
            { "value": "categories", "label": "Kategorien (Bild + Titel)" }
          ],
          "default": "products"
        }
      ]
    }
  ],
  "max_blocks": 16,
  "presets": [
    {
      "name": "Tetris Grid",
      "blocks": [
        {
          "type": "row",
          "settings": {
            "row_title": "Bestseller",
            "pattern": "outside_tall"
          }
        },
        {
          "type": "row",
          "settings": {
            "row_title": "Sitzmöbel",
            "pattern": "center_tall"
          }
        }
      ]
    }
  ]
}
{% endschema %}
```

- [ ] **Step 2: Verify file was created correctly**

Run: `head -5 sections/tetris-grid.liquid`
Expected: First lines showing `{%- style -%}`

- [ ] **Step 3: Commit**

```bash
git add sections/tetris-grid.liquid
git commit -m "feat: add tetris-grid section with alternating height patterns"
```

---

### Task 2: Update product-card snippet to support height override

The product card currently uses `aspect-square` on the image container. When wrapped in a tetris card with a different aspect ratio, the card needs to fill the parent height instead of forcing square.

**Files:**
- Modify: `snippets/product-card.liquid` (line 12)

- [ ] **Step 1: Modify product-card to support h-full class pass-through**

Change line 12 in `snippets/product-card.liquid` from:

```liquid
    <div class="relative aspect-square overflow-hidden rounded bg-gray-50 mb-3">
```

To:

```liquid
    <div class="relative overflow-hidden rounded bg-gray-50 mb-3 {{ card_class | default: '' | contains: 'h-full' | if: true: 'h-full', false: 'aspect-square' }}">
```

Wait — Liquid doesn't support ternary like that. Instead, we need a simpler approach. The tetris grid wraps the product-card in a container with the aspect ratio set. The product card image should fill its parent when a `h-full` class is passed.

Actually, looking at the existing code: the product-card is wrapped in a `<div class="{{ card_class }}">` and then has `aspect-square` on the image div. For the tetris grid, the outer wrapper already sets the aspect ratio. We need the image to fill the parent height.

Better approach: Add a new parameter `image_aspect` to product-card:

In `snippets/product-card.liquid`, change line 8-12:

From:
```liquid
{%- liquid
  assign card_class = class | default: ''
-%}

<div class="group {{ card_class }}">
  <a href="{{ product.url }}" class="block">
    <div class="relative aspect-square overflow-hidden rounded bg-gray-50 mb-3">
```

To:
```liquid
{%- liquid
  assign card_class = class | default: ''
  assign aspect_class = image_aspect | default: 'aspect-square'
-%}

<div class="group {{ card_class }}">
  <a href="{{ product.url }}" class="block h-full">
    <div class="relative {{ aspect_class }} overflow-hidden rounded bg-gray-50 mb-3">
```

Then in the tetris-grid section, render product cards with:
```liquid
{% render 'product-card', product: product, class: 'h-full', image_aspect: 'h-full' %}
```

- [ ] **Step 2: Update product-card.liquid**

Change lines 8-12 of `snippets/product-card.liquid` from:

```liquid
{%- liquid
  assign card_class = class | default: ''
-%}

<div class="group {{ card_class }}">
  <a href="{{ product.url }}" class="block">
    <div class="relative aspect-square overflow-hidden rounded bg-gray-50 mb-3">
```

To:

```liquid
{%- liquid
  assign card_class = class | default: ''
  assign aspect_class = image_aspect | default: 'aspect-square'
-%}

<div class="group {{ card_class }}">
  <a href="{{ product.url }}" class="block h-full">
    <div class="relative {{ aspect_class }} overflow-hidden rounded bg-gray-50 mb-3">
```

- [ ] **Step 3: Update tetris-grid.liquid product card render call**

In `sections/tetris-grid.liquid`, change the product card render line from:

```liquid
{% render 'product-card', product: product, class: 'h-full' %}
```

To:

```liquid
{% render 'product-card', product: product, class: 'h-full', image_aspect: 'h-full' %}
```

- [ ] **Step 4: Verify existing pages still work**

The default `image_aspect` is `'aspect-square'`, so all existing usages of product-card (featured-collection, etc.) remain unchanged.

Run: `grep -r "render 'product-card'" sections/ snippets/`
Expected: All existing calls do NOT pass `image_aspect`, so they get the default `aspect-square`.

- [ ] **Step 5: Commit**

```bash
git add snippets/product-card.liquid sections/tetris-grid.liquid
git commit -m "feat: product-card supports custom image aspect for tetris grid"
```

---

### Task 3: Add tetris-grid section to homepage

**Files:**
- Modify: `templates/index.json`

- [ ] **Step 1: Add tetris-grid section to index.json**

Replace the `featured-collection` and `featured-collection-2` entries in `templates/index.json` with a single `tetris-grid` section. Keep `category-grid` as-is since it uses a different block structure (manual links/images).

In the `"sections"` object, replace:

```json
"featured-collection": {
  "type": "featured-collection",
  ...
},
"featured-collection-2": {
  "type": "featured-collection",
  ...
}
```

With:

```json
"tetris-grid": {
  "type": "tetris-grid",
  "blocks": {
    "row-1": {
      "type": "row",
      "settings": {
        "row_title": "Bestseller",
        "pattern": "outside_tall",
        "collection": "tische",
        "display_type": "products"
      }
    },
    "row-2": {
      "type": "row",
      "settings": {
        "row_title": "Sitzmöbel",
        "pattern": "center_tall",
        "collection": "stuehle",
        "display_type": "products"
      }
    }
  },
  "block_order": ["row-1", "row-2"],
  "settings": {
    "heading": "",
    "padding_top": 48,
    "padding_bottom": 48
  }
}
```

In the `"order"` array, replace `"featured-collection"` and `"featured-collection-2"` with `"tetris-grid"`:

```json
"order": [
  "hero",
  "trust-bar",
  "categories",
  "tetris-grid",
  "brand-story",
  "testimonials",
  "newsletter",
  "seo-text"
]
```

- [ ] **Step 2: Validate JSON**

Run: `cat templates/index.json | python3 -m json.tool > /dev/null`
Expected: No errors (valid JSON)

- [ ] **Step 3: Commit**

```bash
git add templates/index.json
git commit -m "feat: replace featured-collection sections with tetris-grid on homepage"
```

---

### Task 4: Visual testing and polish

- [ ] **Step 1: Run Shopify theme dev for visual check**

Run: `shopify theme dev` (or however the dev server is started)
Open the homepage and verify:
- Row 1 (Bestseller): outside_tall pattern — cards 1 & 4 are taller, top-aligned
- Row 2 (Sitzmöbel): center_tall pattern — cards 2 & 3 are taller, bottom-aligned
- Mobile: all cards same height, 2 columns

- [ ] **Step 2: Check product card image behavior**

Verify that product images fill the tall card containers without distortion (object-cover handles this). Check hover effects still work.

- [ ] **Step 3: Fix any visual issues found**

Address any spacing, overflow, or alignment issues discovered during visual testing.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "fix: tetris-grid visual polish after testing"
```
