# Featured Slider Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a new Shopify OS 2.0 section `featured-slider.liquid` with up to 8 manual product slots and auto-fill from a configurable fallback collection (typically a Best-Selling Smart Collection), shown as a horizontal slider optimized for desktop and mobile.

**Architecture:** Single `sections/featured-slider.liquid` file containing Liquid markup, JSON schema, scoped CSS, and scoped Vanilla JS. Reuses the existing `snippets/product-card.liquid`. CSS scroll-snap for swipe behavior; small Vanilla JS module for arrow controls and progress bar. No external libraries.

**Tech Stack:** Shopify OS 2.0 Liquid, Tailwind CSS (via `src/css/tailwind.css`), Vanilla JS, native CSS scroll-snap. No build step needed for the Liquid file itself.

**Spec reference:** [docs/superpowers/specs/2026-05-05-featured-slider-section-design.md](../specs/2026-05-05-featured-slider-section-design.md)

---

## File Structure

**Files to create:**
- `sections/featured-slider.liquid` — the entire section (markup + schema + scoped style + scoped script).

**Files to modify:**
- None.

**Files reused as-is:**
- `snippets/product-card.liquid` — rendered for each card.

---

## Testing Approach

This is a Shopify Liquid section; there is no automated unit-test suite for sections in this repo. Verification is **manual via the Shopify Theme Editor + Storefront preview**. After each task, run a Theme-Check lint pass and visually verify in the Theme Editor.

For each task: a "verification" step at the end describes exactly what to check in the Theme Editor / Storefront. Do not skip it.

**Theme-Check command:** `shopify theme check --no-color sections/featured-slider.liquid` (run from repo root). If `shopify` CLI isn't installed, skip and rely on manual review.

**Dev preview command:** `shopify theme dev` (from repo root) — opens a local preview. Add the section via Theme Editor UI to test.

---

## Task 1: Create section skeleton with schema and empty render

**Files:**
- Create: `sections/featured-slider.liquid`

- [ ] **Step 1: Create the file with the JSON schema and minimum markup**

Write `sections/featured-slider.liquid` with the following exact contents:

```liquid
{%- liquid
  assign slot_total = 8
  assign container_classes = 'container'
  if section.settings.full_width
    assign container_classes = 'container lg:max-w-none lg:px-10 xl:px-14'
  endif
  assign align = section.settings.alignment | default: 'left'
-%}

<section class="py-12 lg:py-16" id="featured-slider-{{ section.id }}">
  <div class="{{ container_classes }}">
    <div class="flex items-end justify-between mb-8">
      {%- if align == 'right' -%}
        {%- if section.settings.show_view_all and section.settings.view_all_url != blank -%}
          <a href="{{ section.settings.view_all_url }}" class="text-sm font-medium text-accent hover:underline shrink-0">
            {{ section.settings.view_all_text | default: 'Alle anzeigen' }} →
          </a>
        {%- else -%}
          <div></div>
        {%- endif -%}
        <div class="text-right">
          {%- if section.settings.heading != blank -%}
            <h2 class="text-2xl lg:text-3xl font-heading font-bold">{{ section.settings.heading }}</h2>
          {%- endif -%}
          {%- if section.settings.subtitle != blank -%}
            <p class="text-gray-500 text-sm mt-1">{{ section.settings.subtitle }}</p>
          {%- endif -%}
        </div>
      {%- else -%}
        <div>
          {%- if section.settings.heading != blank -%}
            <h2 class="text-2xl lg:text-3xl font-heading font-bold">{{ section.settings.heading }}</h2>
          {%- endif -%}
          {%- if section.settings.subtitle != blank -%}
            <p class="text-gray-500 text-sm mt-1">{{ section.settings.subtitle }}</p>
          {%- endif -%}
        </div>
        {%- if section.settings.show_view_all and section.settings.view_all_url != blank -%}
          <a href="{{ section.settings.view_all_url }}" class="text-sm font-medium text-accent hover:underline shrink-0">
            {{ section.settings.view_all_text | default: 'Alle anzeigen' }} →
          </a>
        {%- endif -%}
      {%- endif -%}
    </div>

    {%- comment -%} Slider track placeholder — filled in Task 3 {%- endcomment -%}
    <div class="featured-slider__track-placeholder">
      <p class="text-sm text-gray-400">Slider track will render here.</p>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Featured Slider",
  "settings": [
    { "type": "text", "id": "heading", "label": "Überschrift" },
    { "type": "text", "id": "subtitle", "label": "Untertitel" },
    {
      "type": "collection",
      "id": "fill_collection",
      "label": "Auffüll-Collection",
      "info": "Verbleibende Slots (bis 8 Total) werden aus dieser Collection in deren Sortierung aufgefüllt. Tipp: Smart Collection mit Sortierung 'Bestseller / Best Selling'."
    },
    { "type": "checkbox", "id": "show_view_all", "label": "'Alle anzeigen' Link", "default": true },
    { "type": "url", "id": "view_all_url", "label": "'Alle anzeigen' Ziel-URL" },
    { "type": "text", "id": "view_all_text", "label": "'Alle anzeigen' Text", "default": "Alle ansehen" },
    {
      "type": "select",
      "id": "alignment",
      "label": "Ausrichtung Header",
      "options": [
        { "value": "left", "label": "Links" },
        { "value": "right", "label": "Rechts" }
      ],
      "default": "left"
    },
    { "type": "checkbox", "id": "full_width", "label": "Volle Breite (Desktop)", "default": false },
    { "type": "checkbox", "id": "autoplay", "label": "Auto-Play", "default": false },
    { "type": "checkbox", "id": "loop", "label": "Endlos-Loop", "default": false }
  ],
  "blocks": [
    {
      "type": "product",
      "name": "Produkt",
      "limit": 8,
      "settings": [
        { "type": "product", "id": "product", "label": "Produkt" }
      ]
    }
  ],
  "presets": [
    { "name": "Featured Slider" }
  ]
}
{% endschema %}
```

- [ ] **Step 2: Verify in Theme Editor**

Run: `shopify theme dev` (from repo root)
Open Theme Editor for the dev store. On the homepage, click "Add section" → search for "Featured Slider" → add it.

Expected:
- Section appears with empty header.
- Settings panel shows: Überschrift, Untertitel, Auffüll-Collection, Show View-All checkbox, View-All URL, View-All Text, Ausrichtung, Volle Breite, Auto-Play, Endlos-Loop.
- Block panel allows adding up to 8 "Produkt" blocks.
- Page renders without Liquid errors.

- [ ] **Step 3: Commit**

```bash
git add sections/featured-slider.liquid
git commit -m "feat(featured-slider): add section skeleton with schema"
```

---

## Task 2: Implement product-collection logic (manual + auto-fill)

**Files:**
- Modify: `sections/featured-slider.liquid`

- [ ] **Step 1: Replace the placeholder track with the Liquid logic**

In `sections/featured-slider.liquid`, replace the entire block:

```liquid
    {%- comment -%} Slider track placeholder — filled in Task 3 {%- endcomment -%}
    <div class="featured-slider__track-placeholder">
      <p class="text-sm text-gray-400">Slider track will render here.</p>
    </div>
```

with:

```liquid
    {%- liquid
      assign manual_products = '' | split: ''
      for block in section.blocks
        if block.settings.product != blank
          assign manual_products = manual_products | push: block.settings.product
        endif
      endfor

      assign needed = slot_total | minus: manual_products.size
      assign fill_products = '' | split: ''

      if needed > 0 and section.settings.fill_collection != blank
        for product in section.settings.fill_collection.products
          unless manual_products contains product
            assign fill_products = fill_products | push: product
            if fill_products.size >= needed
              break
            endif
          endunless
        endfor
      endif

      assign final_products = manual_products | concat: fill_products
    -%}

    {%- if final_products.size > 0 -%}
      <ul class="featured-slider__list grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 list-none p-0 m-0">
        {%- for product in final_products -%}
          {%- if product != blank -%}
            <li class="featured-slider__item">
              {% render 'product-card', product: product %}
            </li>
          {%- endif -%}
        {%- endfor -%}
      </ul>
    {%- elsif request.design_mode -%}
      <div class="rounded border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
        Wähle eine Auffüll-Collection oder füge Produkt-Blocks hinzu, um den Slider zu sehen.
      </div>
    {%- endif -%}
```

NOTE: The `<ul>` here uses the existing 2/3/4 grid as a temporary fallback. Task 3 replaces the grid classes with the slider classes. Doing this in two tasks lets us verify the data logic independently of the slider UX.

- [ ] **Step 2: Verify in Theme Editor — manual + auto-fill scenarios**

In the dev store, test these scenarios on the homepage with the Featured Slider section:

a) **0 manual blocks + Bestseller collection set:** Should show 8 products from the collection.
b) **5 manual blocks + Bestseller collection set:** Should show 5 manual products first, then 3 from the collection.
c) **8 manual blocks:** Should show only the 8 manual products (no auto-fill).
d) **0 manual blocks + no collection:** Should show nothing on storefront, dashed-border placeholder in Theme Editor.
e) **Manual product duplicated in Bestseller collection:** Verify it appears only once (in its manual slot position).

For each scenario, count the rendered cards and verify the order.

- [ ] **Step 3: Commit**

```bash
git add sections/featured-slider.liquid
git commit -m "feat(featured-slider): manual blocks + collection auto-fill logic"
```

---

## Task 3: Convert grid to horizontal slider track (CSS scroll-snap)

**Files:**
- Modify: `sections/featured-slider.liquid`

- [ ] **Step 1: Wrap the list in a slider container and replace the grid classes**

Find this block in `sections/featured-slider.liquid`:

```liquid
    {%- if final_products.size > 0 -%}
      <ul class="featured-slider__list grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 list-none p-0 m-0">
        {%- for product in final_products -%}
          {%- if product != blank -%}
            <li class="featured-slider__item">
              {% render 'product-card', product: product %}
            </li>
          {%- endif -%}
        {%- endfor -%}
      </ul>
    {%- elsif request.design_mode -%}
      <div class="rounded border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
        Wähle eine Auffüll-Collection oder füge Produkt-Blocks hinzu, um den Slider zu sehen.
      </div>
    {%- endif -%}
```

Replace it with:

```liquid
    {%- if final_products.size > 0 -%}
      <div class="featured-slider__wrapper relative">
        <ul class="featured-slider__track" data-featured-slider-track>
          {%- for product in final_products -%}
            {%- if product != blank -%}
              <li class="featured-slider__item">
                {% render 'product-card', product: product %}
              </li>
            {%- endif -%}
          {%- endfor -%}
        </ul>

        {%- comment -%} Arrows + progress bar added in Task 4 {%- endcomment -%}
      </div>
    {%- elsif request.design_mode -%}
      <div class="rounded border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
        Wähle eine Auffüll-Collection oder füge Produkt-Blocks hinzu, um den Slider zu sehen.
      </div>
    {%- endif -%}
```

- [ ] **Step 2: Add a scoped `<style>` block at the very end of the section file (after `{% endschema %}` is NOT allowed; place style BEFORE `{% schema %}`)**

Add the following block immediately BEFORE the `{% schema %}` line (so the style is part of the rendered section output):

```liquid
{% stylesheet %}
.featured-slider__track {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0;
  margin: 0;
  list-style: none;
}
.featured-slider__track::-webkit-scrollbar {
  display: none;
}
.featured-slider__item {
  flex: 0 0 calc((100% - 1rem) / 2);
  scroll-snap-align: start;
}
@media (min-width: 768px) {
  .featured-slider__track {
    gap: 1rem;
  }
  .featured-slider__item {
    flex: 0 0 calc((100% - 2rem) / 3);
  }
}
@media (min-width: 1024px) {
  .featured-slider__track {
    gap: 1.5rem;
  }
  .featured-slider__item {
    flex: 0 0 calc((100% - 4.5rem) / 4);
  }
}
@media (prefers-reduced-motion: reduce) {
  .featured-slider__track {
    scroll-behavior: auto;
  }
}
{% endstylesheet %}
```

NOTE: Shopify supports `{% stylesheet %}` blocks inside sections — they're concatenated into a single CSS bundle and scoped automatically. The CSS uses standard CSS (not Tailwind utility classes inside the stylesheet block, since `{% stylesheet %}` content does not pass through PostCSS/Tailwind).

The flex-basis math:
- Mobile (2 cards visible): `(100% - 1 gap) / 2` where gap = 1rem.
- Tablet (3 cards visible): `(100% - 2 gaps) / 3` where gap = 1rem → `(100% - 2rem) / 3`.
- Desktop (4 cards visible): `(100% - 3 gaps) / 4` where gap = 1.5rem → `(100% - 4.5rem) / 4`.

- [ ] **Step 3: Verify in Theme Editor — slider behavior**

Reload the Theme Editor preview. With at least 8 products in the slider:

a) On Mobile (375px): exactly 2 cards visible per view; can swipe horizontally; cards snap to start.
b) On Tablet (768px): exactly 3 cards visible per view; swipe works.
c) On Desktop (1280px): exactly 4 cards visible per view; horizontal scroll via mouse wheel + drag (no arrows yet).
d) Scrollbar is hidden in all browsers (Chrome, Safari, Firefox).
e) When fewer than the visible count of products exist (e.g., only 3 products on Desktop), the cards still render in a row but without scrolling — verify there's no horizontal overflow / no broken layout.

- [ ] **Step 4: Commit**

```bash
git add sections/featured-slider.liquid
git commit -m "feat(featured-slider): horizontal scroll-snap track"
```

---

## Task 4: Add desktop arrows and progress bar (markup + styles only)

**Files:**
- Modify: `sections/featured-slider.liquid`

- [ ] **Step 1: Add arrow buttons and progress bar markup**

In `sections/featured-slider.liquid`, find:

```liquid
        {%- comment -%} Arrows + progress bar added in Task 4 {%- endcomment -%}
      </div>
```

Replace with:

```liquid
        <button
          type="button"
          class="featured-slider__arrow featured-slider__arrow--prev"
          data-featured-slider-prev
          aria-label="Vorherige Produkte"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button
          type="button"
          class="featured-slider__arrow featured-slider__arrow--next"
          data-featured-slider-next
          aria-label="Nächste Produkte"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="featured-slider__progress" data-featured-slider-progress aria-hidden="true">
        <div class="featured-slider__progress-bar" data-featured-slider-progress-bar></div>
      </div>
```

NOTE: The `</div>` shown above closes `featured-slider__wrapper`. The progress bar sits OUTSIDE the wrapper but inside the container, below the slider. Make sure the indentation matches the surrounding structure.

After this edit, the structure inside `<div class="{{ container_classes }}">` should be:
1. Header `<div class="flex items-end ...">`
2. `<div class="featured-slider__wrapper relative">` containing `<ul>` + 2 arrow `<button>`s
3. `<div class="featured-slider__progress">` containing inner bar

- [ ] **Step 2: Add the styles for arrows + progress bar**

In the `{% stylesheet %}` block, append the following rules (at the end, before `{% endstylesheet %}`):

```css
.featured-slider__arrow {
  display: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: white;
  color: #111;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.featured-slider__arrow:hover:not(:disabled) {
  transform: translateY(-50%) scale(1.05);
}
.featured-slider__arrow:disabled {
  opacity: 0.3;
  cursor: default;
}
.featured-slider__arrow--prev { left: -1.25rem; }
.featured-slider__arrow--next { right: -1.25rem; }
@media (min-width: 1024px) {
  .featured-slider__arrow {
    display: flex;
  }
}
.featured-slider__progress {
  margin-top: 1.5rem;
  height: 2px;
  width: 100%;
  background: rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border-radius: 9999px;
}
.featured-slider__progress-bar {
  height: 100%;
  width: 0%;
  background: #111;
  transition: width 0.1s linear;
}
.featured-slider__progress.is-hidden {
  display: none;
}
.featured-slider__arrow.is-hidden {
  display: none !important;
}
```

NOTE: The arrow's vertical position is `top: 50%`, which centers on the entire wrapper height (which is the card height since cards are the only child). Cards have variable height depending on title length, but the centering on 50% is acceptable for this use case (matches typical e-commerce slider arrows). The card image area dominates visually.

- [ ] **Step 3: Verify in Theme Editor — markup is present, styled, but not yet functional**

Reload preview.

Expected on Desktop (≥ 1024px):
- Two circular arrow buttons appear left/right, centered vertically over the cards, slightly outside the card edges.
- Below the slider, a thin horizontal line (the progress track) is visible, full container width.
- Clicking arrows does NOT scroll yet (no JS).

Expected on Mobile/Tablet:
- No arrow buttons visible (`display: none` below `lg`).
- Progress bar IS visible (will be hidden by JS in Task 5 if not scrollable).

- [ ] **Step 4: Commit**

```bash
git add sections/featured-slider.liquid
git commit -m "feat(featured-slider): arrow buttons + progress bar markup"
```

---

## Task 5: Wire up arrows + progress bar with Vanilla JS

**Files:**
- Modify: `sections/featured-slider.liquid`

- [ ] **Step 1: Add the `{% javascript %}` block**

In `sections/featured-slider.liquid`, immediately AFTER `{% endstylesheet %}` and BEFORE `{% schema %}`, insert:

```liquid
{% javascript %}
(function () {
  function initSlider(section) {
    const track = section.querySelector('[data-featured-slider-track]');
    const prevBtn = section.querySelector('[data-featured-slider-prev]');
    const nextBtn = section.querySelector('[data-featured-slider-next]');
    const progress = section.querySelector('[data-featured-slider-progress]');
    const progressBar = section.querySelector('[data-featured-slider-progress-bar]');

    if (!track) return;

    function getStep() {
      const firstItem = track.querySelector('.featured-slider__item');
      if (!firstItem) return 0;
      const itemRect = firstItem.getBoundingClientRect();
      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
      return itemRect.width + gap;
    }

    function isScrollable() {
      return track.scrollWidth - track.clientWidth > 1;
    }

    function updateUI() {
      const scrollable = isScrollable();
      if (progress) progress.classList.toggle('is-hidden', !scrollable);
      if (prevBtn) prevBtn.classList.toggle('is-hidden', !scrollable);
      if (nextBtn) nextBtn.classList.toggle('is-hidden', !scrollable);

      if (!scrollable) {
        if (progressBar) progressBar.style.width = '0%';
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
        return;
      }

      const max = track.scrollWidth - track.clientWidth;
      const ratio = max > 0 ? track.scrollLeft / max : 0;
      if (progressBar) progressBar.style.width = (ratio * 100) + '%';

      if (prevBtn) prevBtn.disabled = track.scrollLeft <= 0;
      if (nextBtn) nextBtn.disabled = track.scrollLeft >= max - 1;
    }

    let rafId = null;
    function onScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(function () {
        updateUI();
        rafId = null;
      });
    }

    function scrollByStep(direction) {
      const step = getStep();
      if (!step) return;
      track.scrollBy({ left: step * direction, behavior: 'smooth' });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { scrollByStep(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { scrollByStep(1); });
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateUI);

    updateUI();

    return function cleanup() {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateUI);
    };
  }

  function initAll() {
    document.querySelectorAll('[id^="featured-slider-"]').forEach(function (section) {
      if (section.dataset.featuredSliderInit === '1') return;
      const cleanup = initSlider(section);
      section.dataset.featuredSliderInit = '1';
      section._featuredSliderCleanup = cleanup;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', function (event) {
    const section = event.target.querySelector('[id^="featured-slider-"]') || (event.target.id && event.target.id.indexOf('featured-slider-') === 0 ? event.target : null);
    if (section && section.dataset.featuredSliderInit !== '1') {
      const cleanup = initSlider(section);
      section.dataset.featuredSliderInit = '1';
      section._featuredSliderCleanup = cleanup;
    }
  });

  document.addEventListener('shopify:section:unload', function (event) {
    const section = event.target.querySelector('[id^="featured-slider-"]') || (event.target.id && event.target.id.indexOf('featured-slider-') === 0 ? event.target : null);
    if (section && typeof section._featuredSliderCleanup === 'function') {
      section._featuredSliderCleanup();
      section._featuredSliderCleanup = null;
      section.dataset.featuredSliderInit = '';
    }
  });
})();
{% endjavascript %}
```

- [ ] **Step 2: Verify in Theme Editor — arrows + progress functional**

Reload preview.

a) **Desktop (≥ 1024px):** Click right arrow → track scrolls smoothly by exactly one card-width + gap. Repeat: scrolls one card per click. Click left arrow → scrolls back. Progress bar fills as you scroll right, empties as you scroll left.
b) **At start:** Left arrow is visually disabled (faded). Right arrow is enabled.
c) **At end:** Right arrow is visually disabled. Left arrow is enabled.
d) **Mobile (375px):** Swipe right/left works (native scroll-snap). Progress bar updates as you swipe.
e) **Slider with only 2 products on Desktop (4 visible slots):** Arrows AND progress bar are hidden (`is-hidden` class applied).
f) **Theme Editor — add a new manual block:** After Shopify's `shopify:section:load` event fires, the slider re-initializes. Verify arrows/progress still work.
g) **Two Featured Slider sections on the same page:** Each scrolls independently (verify by clicking arrows on one — only that one scrolls).

- [ ] **Step 3: Commit**

```bash
git add sections/featured-slider.liquid
git commit -m "feat(featured-slider): arrows + progress bar JS"
```

---

## Task 6: Add auto-play and loop behavior

**Files:**
- Modify: `sections/featured-slider.liquid`

- [ ] **Step 1: Extend the JS to handle auto-play + loop**

In the `{% javascript %}` block, find the line:

```javascript
    if (prevBtn) prevBtn.addEventListener('click', function () { scrollByStep(-1); });
```

Immediately BEFORE that line, add a constant for the section settings reading:

```javascript
    const autoplay = section.dataset.autoplay === 'true';
    const loop = section.dataset.loop === 'true';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const AUTOPLAY_INTERVAL_MS = 5000;
    let autoplayTimer = null;

    function startAutoplay() {
      if (!autoplay || reduceMotion || !isScrollable()) return;
      stopAutoplay();
      autoplayTimer = setInterval(function () {
        if (!isScrollable()) return;
        const max = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= max - 1) {
          if (loop) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            stopAutoplay();
          }
        } else {
          scrollByStep(1);
        }
      }, AUTOPLAY_INTERVAL_MS);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }
```

Then, AFTER the line:

```javascript
    window.addEventListener('resize', updateUI);
```

Add:

```javascript
    section.addEventListener('mouseenter', stopAutoplay);
    section.addEventListener('mouseleave', startAutoplay);
    track.addEventListener('touchstart', stopAutoplay, { passive: true });

    startAutoplay();
```

Then, modify the cleanup return to also stop the autoplay. Find:

```javascript
    return function cleanup() {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateUI);
    };
```

Replace with:

```javascript
    return function cleanup() {
      stopAutoplay();
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateUI);
    };
```

- [ ] **Step 2: Pass `autoplay` and `loop` settings as data attributes on the section**

In `sections/featured-slider.liquid`, find:

```liquid
<section class="py-12 lg:py-16" id="featured-slider-{{ section.id }}">
```

Replace with:

```liquid
<section
  class="py-12 lg:py-16"
  id="featured-slider-{{ section.id }}"
  data-autoplay="{{ section.settings.autoplay }}"
  data-loop="{{ section.settings.loop }}"
>
```

NOTE: Liquid renders boolean settings as the strings `"true"` or `"false"`. The JS comparison `section.dataset.autoplay === 'true'` matches this.

- [ ] **Step 3: Verify in Theme Editor — auto-play + loop**

Reload preview.

a) **Auto-Play off (default):** Slider doesn't move on its own.
b) **Auto-Play on, Loop off:** Every 5 seconds, slider advances one card. Reaches the end → stops.
c) **Auto-Play on, Loop on:** Every 5 seconds, advances one card. At the end → smoothly scrolls back to start, then continues advancing.
d) **Hover with mouse on the section:** Auto-play pauses. Move mouse away → resumes.
e) **Mobile touch (use device or DevTools touch emulation):** Tap/swipe on the track → auto-play stops for the rest of the session.
f) **`prefers-reduced-motion: reduce` enabled (DevTools → Rendering → Emulate CSS media feature):** Auto-play does not start even if checkbox is on.

- [ ] **Step 4: Commit**

```bash
git add sections/featured-slider.liquid
git commit -m "feat(featured-slider): autoplay and loop"
```

---

## Task 7: Add accessibility attributes and final polish

**Files:**
- Modify: `sections/featured-slider.liquid`

- [ ] **Step 1: Add `role` and `aria-label` to the slider wrapper**

In `sections/featured-slider.liquid`, find:

```liquid
      <div class="featured-slider__wrapper relative">
        <ul class="featured-slider__track" data-featured-slider-track>
```

Replace with:

```liquid
      <div
        class="featured-slider__wrapper relative"
        role="region"
        aria-roledescription="Karussell"
        aria-label="{{ section.settings.heading | default: 'Produktauswahl' | escape }}"
      >
        <ul class="featured-slider__track" data-featured-slider-track>
```

- [ ] **Step 2: Verify accessibility**

Reload preview.

a) **Lighthouse Accessibility audit (DevTools → Lighthouse → Accessibility only):** No new errors introduced; score should remain the same as the baseline homepage.
b) **Keyboard tab through:** Tab focuses on first card link → next card link → ... → arrow buttons (in source order). All cards reachable via Tab.
c) **Screen reader (VoiceOver on macOS: Cmd+F5):** Announces "Karussell, [heading]" when entering the wrapper. Announces "Vorherige Produkte" / "Nächste Produkte" on arrow focus.

- [ ] **Step 3: Commit**

```bash
git add sections/featured-slider.liquid
git commit -m "feat(featured-slider): aria roles + labels"
```

---

## Task 8: Full end-to-end verification across all scenarios

**Files:**
- None (verification only)

- [ ] **Step 1: Run Theme-Check lint**

Run: `shopify theme check sections/featured-slider.liquid`

Expected: No errors. Warnings about `{% stylesheet %}` / `{% javascript %}` are expected to be empty since both are first-class Shopify features.

If `shopify` CLI isn't installed or this command fails because of a missing Shopify-dev environment, skip this step and rely on visual verification.

- [ ] **Step 2: Run the spec's full manual test plan**

Open the spec's Test-Plan section: [docs/superpowers/specs/2026-05-05-featured-slider-section-design.md](../specs/2026-05-05-featured-slider-section-design.md#test-plan-manuell)

Execute every numbered scenario (1–14). For each, write a one-line note in your terminal scratchpad: "Scenario N: PASS / FAIL — [observed]". Fix any FAIL by going back to the relevant task before proceeding.

- [ ] **Step 3: Cross-browser smoke test**

Test the section in:
- Chrome (latest, Desktop + Mobile emulation)
- Safari (latest, Desktop + Mobile emulation)
- Firefox (latest, Desktop)

Verify: scroll-snap works, arrows scroll one card, progress bar updates, scrollbar is hidden, no console errors.

- [ ] **Step 4: Performance smoke test**

In Chrome DevTools Network tab, reload the homepage with the Featured Slider section added.

Verify:
- No new external JS or CSS file requests for this section (everything is inline via `{% stylesheet %}` / `{% javascript %}`, which Shopify bundles).
- Total JS payload added is < 5 KB gzipped (the slider JS is small).
- Images on the cards use `loading="lazy"` (verify by inspecting any non-first card's `<img>` element).

- [ ] **Step 5: Final commit (if any cleanup was needed) and summary**

If any step in Tasks 1–7 needed a fix during this verification, commit those fixes with descriptive messages.

If everything passes without changes, no final commit is needed.

Print a one-paragraph summary of the verification results.

---

## Self-Review Notes

The spec covers: section skeleton + schema (Task 1), data logic with manual + auto-fill (Task 2), slider track CSS (Task 3), arrows + progress bar markup/styles (Task 4), JS for arrows + progress (Task 5), auto-play + loop (Task 6), accessibility (Task 7), full verification (Task 8). All spec sections (Architecture, Schema, Liquid logic, Slider behavior, Edge cases, Styling, JavaScript, Accessibility, Performance, Test plan) map to at least one task.

Selectors and data-attributes are consistent across tasks: `[data-featured-slider-track]`, `[data-featured-slider-prev]`, `[data-featured-slider-next]`, `[data-featured-slider-progress]`, `[data-featured-slider-progress-bar]` — defined in Task 4 markup and used in Task 5 + 6 JS.

Function names consistent: `initSlider`, `getStep`, `isScrollable`, `updateUI`, `scrollByStep`, `startAutoplay`, `stopAutoplay`.

CSS class names consistent: `featured-slider__track`, `featured-slider__item`, `featured-slider__wrapper`, `featured-slider__arrow`, `featured-slider__arrow--prev`, `featured-slider__arrow--next`, `featured-slider__progress`, `featured-slider__progress-bar`, `is-hidden`.
