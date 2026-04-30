# Predictive Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a live product preview to the existing header search overlay so customers see matching products as they type, without leaving the page.

**Architecture:** Register a new Alpine.js component `predictiveSearch` inside the existing `src/js/base.js` (so it's bundled with the theme's main JS). The component manages its own local state (query, results, loading, error) and calls Shopify's built-in `/search/suggest.json` API with debouncing and AbortController. The existing search overlay in `sections/header.liquid` is restructured to use this component on an inner wrapper, leaving the broader header state (mobileOpen, searchOpen, etc.) untouched.

**Tech Stack:** Alpine.js 3.14, Tailwind CSS 3.4, Shopify Liquid, native `fetch` + `AbortController`. esbuild bundles JS, tailwindcss CLI compiles CSS.

**Spec:** [docs/superpowers/specs/2026-04-30-predictive-search-design.md](../specs/2026-04-30-predictive-search-design.md)

---

## File Structure

- **Modify** `src/js/base.js` — register `Alpine.data('predictiveSearch', …)` before `Alpine.start()`
- **Modify** `sections/header.liquid` — restructure the search overlay's inner container to use `x-data="predictiveSearch()"`, add the preview render block
- **Build outputs** (do not edit by hand):
  - `assets/base.js` — produced by `npm run build:js`
  - `assets/application.css` — produced by `npm run build:css`

No new files. The component lives in `base.js` because that's where Alpine starts and where the cart store already lives — same pattern.

---

## Task 1: Register `predictiveSearch` Alpine component skeleton

**Files:**
- Modify: `src/js/base.js` (insert before `Alpine.start();` on line 102)

This task only registers the component with default state. No fetch logic yet. We confirm Alpine sees it by adding a temporary check.

- [ ] **Step 1: Add the component registration to `base.js`**

Open `src/js/base.js`. Insert the following block immediately before the existing `Alpine.start();` line:

```js
Alpine.data('predictiveSearch', () => ({
  MIN_CHARS: 2,
  DEBOUNCE_MS: 300,
  RESULT_LIMIT: 6,

  query: '',
  results: [],
  total: 0,
  loading: false,
  error: false,

  _debounceTimer: null,
  _abortController: null,

  onInput(value) {
    this.query = value;
    this.scheduleSearch();
  },

  scheduleSearch() {
    if (this._debounceTimer) clearTimeout(this._debounceTimer);
    if (this.query.length < this.MIN_CHARS) {
      this.results = [];
      this.total = 0;
      this.loading = false;
      this.error = false;
      return;
    }
    this.loading = true;
    this.error = false;
    this._debounceTimer = setTimeout(() => this.runSearch(), this.DEBOUNCE_MS);
  },

  async runSearch() {
    // Implementation in Task 3
  },

  clear() {
    if (this._debounceTimer) clearTimeout(this._debounceTimer);
    if (this._abortController) this._abortController.abort();
    this.query = '';
    this.results = [];
    this.total = 0;
    this.loading = false;
    this.error = false;
  },
}));
```

- [ ] **Step 2: Build the JS bundle**

Run: `npm run build:js`
Expected: esbuild prints something like `assets/base.js  XX.Xkb` with no errors.

- [ ] **Step 3: Manual verification — component is registered**

Open the theme in a browser (use `shopify theme dev` if not already running, or load the live preview). Open DevTools console and run:

```js
Alpine.$data(document.body)
```

Expected: should not throw. Then create a test element and check the component name resolves:

```js
const el = document.createElement('div');
el.setAttribute('x-data', 'predictiveSearch()');
document.body.appendChild(el);
Alpine.initTree(el);
console.log(Alpine.$data(el).MIN_CHARS); // should print 2
el.remove();
```

Expected: `2` is printed. If `predictiveSearch is not defined` appears, the registration didn't happen — re-check Step 1.

- [ ] **Step 4: Commit**

```bash
git add src/js/base.js assets/base.js
git commit -m "feat(search): register predictiveSearch Alpine component skeleton"
```

---

## Task 2: Wire the search input to the component (no fetch yet)

**Files:**
- Modify: `sections/header.liquid` (the search overlay block, currently around lines 547–612 — the block that begins with `{%- comment -%} ===== SEARCH OVERLAY ===== {%- endcomment -%}`)

We restructure the inner container to use `x-data="predictiveSearch()"` and bind `@input` on the search input. We also wire the existing `searchOpen` toggle to call `clear()` when the overlay closes.

- [ ] **Step 1: Locate the existing overlay container**

In `sections/header.liquid`, find the block:

```liquid
    <div
      class="absolute top-0 inset-x-0 bg-white shadow-lg"
      x-show="searchOpen"
      ...
    >
      <div class="container py-6">
        <form action="{{ routes.search_url }}" method="get" role="search" class="flex items-center gap-3">
```

- [ ] **Step 2: Add `x-data` and `x-effect` to the inner container, and `@input` to the input**

Replace:

```liquid
      <div class="container py-6">
        <form action="{{ routes.search_url }}" method="get" role="search" class="flex items-center gap-3">
```

With:

```liquid
      <div class="container py-6" x-data="predictiveSearch()" x-effect="!searchOpen && clear()">
        <form action="{{ routes.search_url }}" method="get" role="search" class="flex items-center gap-3">
```

Then find the `<input>` element inside the form (it has `id="header-search-input"`, `x-ref="searchInput"`) and add `@input="onInput($event.target.value)"`. Replace:

```liquid
          <input
            id="header-search-input"
            type="search"
            name="q"
            x-ref="searchInput"
            placeholder="{{ 'general.search.placeholder' | t | default: 'Wonach suchen Sie?' }}"
            autocomplete="off"
            class="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-base lg:text-lg placeholder-gray-400 py-2"
          >
```

With:

```liquid
          <input
            id="header-search-input"
            type="search"
            name="q"
            x-ref="searchInput"
            x-model="query"
            @input="onInput($event.target.value)"
            placeholder="{{ 'general.search.placeholder' | t | default: 'Wonach suchen Sie?' }}"
            autocomplete="off"
            class="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-base lg:text-lg placeholder-gray-400 py-2"
          >
```

- [ ] **Step 3: Manual verification — typing updates the component state**

No build needed (Liquid changes are live for `theme dev`; if not, push). Open the search overlay in the browser, click into the input, type "te". Open DevTools console and run:

```js
Alpine.$data(document.querySelector('[x-data="predictiveSearch()"]')).query
```

Expected: `"te"`. If empty, the binding didn't take — re-check Step 2.

- [ ] **Step 4: Commit**

```bash
git add sections/header.liquid
git commit -m "feat(search): wire search input to predictiveSearch component"
```

---

## Task 3: Implement `runSearch` with fetch + AbortController

**Files:**
- Modify: `src/js/base.js` (the `runSearch` method placeholder from Task 1)

We replace the empty `runSearch` with a real implementation that calls `/search/suggest.json`, maps the response, and handles aborts and errors.

- [ ] **Step 1: Replace the `runSearch` placeholder**

In `src/js/base.js`, find:

```js
  async runSearch() {
    // Implementation in Task 3
  },
```

Replace with:

```js
  async runSearch() {
    if (this._abortController) this._abortController.abort();
    this._abortController = new AbortController();

    const params = new URLSearchParams({
      q: this.query,
      'resources[type]': 'product',
      'resources[limit]': String(this.RESULT_LIMIT),
      'resources[options][unavailable_products]': 'last',
    });

    try {
      const res = await fetch(`/search/suggest.json?${params.toString()}`, {
        signal: this._abortController.signal,
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const products = (data?.resources?.results?.products || []).map((p) => ({
        id: p.id,
        title: p.title,
        url: p.url,
        image: p.featured_image?.url || p.image || '',
        priceFormatted: p.price,
      }));
      this.results = products;
      this.total = products.length;
      this.loading = false;
      this.error = false;
    } catch (e) {
      if (e.name === 'AbortError') return;
      console.error('Predictive search failed:', e);
      this.results = [];
      this.total = 0;
      this.loading = false;
      this.error = true;
    }
  },
```

- [ ] **Step 2: Rebuild the JS bundle**

Run: `npm run build:js`
Expected: rebuild completes, no errors.

- [ ] **Step 3: Manual verification — fetch fires and returns results**

Reload the storefront. Open the search overlay, type a real product term (e.g., "tisch" or "stuhl" — pick whatever exists in the catalog). Open DevTools Network tab and filter for `suggest.json`.

Expected:
- A request to `/search/suggest.json?q=tisch&resources%5Btype%5D=product&resources%5Blimit%5D=6&...`
- Status 200, JSON response with `resources.results.products`
- In the console: `Alpine.$data(document.querySelector('[x-data="predictiveSearch()"]')).results` shows up to 6 product objects with `id`, `title`, `url`, `image`, `priceFormatted`.

If the request never fires: check that `query.length >= 2` and that the debounce is firing (300ms wait).
If the request 404s: the API path may differ — check Shopify's docs for the storefront's actual locale prefix (rare, but possible on multi-language stores). The route `/search/suggest.json` is the standard.

- [ ] **Step 4: Manual verification — abort works**

Type a query fast (e.g., "t", "ti", "tis", "tisch" rapidly). In Network tab, expected: earlier requests show `(canceled)` status, only the last completes. No console errors about race conditions.

- [ ] **Step 5: Commit**

```bash
git add src/js/base.js assets/base.js
git commit -m "feat(search): fetch products from /search/suggest.json with abort + debounce"
```

---

## Task 4: Render the preview UI (results, loading skeleton, empty, error)

**Files:**
- Modify: `sections/header.liquid` — add the preview block AFTER the closing `</form>` and BEFORE the closing `</div>` of the overlay container (the one we added `x-data` to in Task 2).

- [ ] **Step 1: Locate the closing `</form>`**

The form ends with `</form>` followed by:

```liquid
      </div>
    </div>
  </div>
</header>
```

We insert the preview block between the `</form>` and the first `</div>`.

- [ ] **Step 2: Insert the preview block**

After `</form>`, before the first `</div>`, insert:

```liquid
        {%- comment -%} ===== LIVE PREVIEW ===== {%- endcomment -%}
        <div class="mt-6" x-show="query.length >= 2" x-cloak :aria-busy="loading">
          {%- comment -%} Loading skeleton {%- endcomment -%}
          <ul x-show="loading" class="space-y-3" aria-hidden="true">
            <template x-for="i in 6" :key="i">
              <li class="flex items-center gap-4 py-2">
                <div class="w-16 h-16 bg-gray-100 rounded animate-pulse"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-3 bg-gray-100 rounded animate-pulse w-3/4"></div>
                  <div class="h-3 bg-gray-100 rounded animate-pulse w-1/4"></div>
                </div>
              </li>
            </template>
          </ul>

          {%- comment -%} Results {%- endcomment -%}
          <ul x-show="!loading && results.length > 0" class="divide-y divide-gray-100">
            <template x-for="product in results" :key="product.id">
              <li>
                <a :href="product.url" class="flex items-center gap-4 py-3 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors">
                  <img :src="product.image" :alt="product.title" class="w-16 h-16 object-cover rounded bg-gray-50" loading="lazy">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate" x-text="product.title"></p>
                    <p class="text-sm text-gray-600" x-text="product.priceFormatted"></p>
                  </div>
                </a>
              </li>
            </template>
          </ul>

          {%- comment -%} View all link {%- endcomment -%}
          <a x-show="!loading && total > 0"
             :href="`{{ routes.search_url }}?q=${encodeURIComponent(query)}`"
             class="block mt-4 text-center text-sm font-semibold text-primary hover:text-accent transition-colors">
            Alle Ergebnisse anzeigen
          </a>

          {%- comment -%} Empty {%- endcomment -%}
          <p x-show="!loading && results.length === 0 && !error" class="text-sm text-gray-500 py-4">
            Keine Ergebnisse für „<span x-text="query"></span>". Versuche einen anderen Begriff.
          </p>

          {%- comment -%} Error {%- endcomment -%}
          <p x-show="error" class="text-sm text-gray-500 py-4">
            Suche momentan nicht verfügbar. Drücke Enter, um zur normalen Suche zu gelangen.
          </p>
        </div>
```

- [ ] **Step 3: Build CSS (new Tailwind classes used)**

The preview block uses some classes that may not exist elsewhere in the theme yet (`animate-pulse`, `divide-y`, `divide-gray-100`, `w-3/4`, `w-1/4`, `gap-4`). Tailwind's content scan picks them up automatically from `sections/**/*.liquid`.

Run: `npm run build:css`
Expected: rebuild completes in <500ms with no errors.

- [ ] **Step 4: Manual verification — all four states render correctly**

Reload the storefront, open the search overlay.

State 1 — Idle: Input empty → preview block hidden (no `mt-6` div visible).

State 2 — Loading: Type "te". Expected: skeleton list of 6 grey rows briefly, then transitions.

State 3 — Results: Type a real term like "tisch". Expected: list of products with image, title, price; "Alle Ergebnisse anzeigen" link below.

State 4 — Empty: Type "xyzabc123" (or any nonsense). Expected: "Keine Ergebnisse für 'xyzabc123'. Versuche einen anderen Begriff."

State 5 — Error: In DevTools Network tab, set "Offline". Type "tisch". Expected: "Suche momentan nicht verfügbar..." appears.

- [ ] **Step 5: Manual verification — clicking a result navigates**

In Results state, click a product row. Expected: navigates to `/products/<handle>`.

- [ ] **Step 6: Manual verification — "Alle Ergebnisse anzeigen" link**

Click the "Alle Ergebnisse anzeigen" link. Expected: navigates to `/search?q=<query>` (or whatever the localized search route is).

- [ ] **Step 7: Manual verification — closing the overlay clears state**

Type "tisch" (results visible). Press ESC. Re-open the overlay (click search icon). Expected: input is empty, no preview shown. (This works because of `x-effect="!searchOpen && clear()"` from Task 2.)

- [ ] **Step 8: Commit**

```bash
git add sections/header.liquid assets/application.css
git commit -m "feat(search): render live product preview with loading/empty/error states"
```

---

## Task 5: Final smoke test and push

- [ ] **Step 1: Run the full smoke checklist from the spec**

Open the storefront and walk through the test scenarios listed in `docs/superpowers/specs/2026-04-30-predictive-search-design.md` under "Testing-Strategie":

1. Idle (empty input): no preview ✓
2. Single char ("T"): no preview ✓
3. Match ("tisch"): skeleton briefly, then results ✓
4. No match ("xyzabc123"): empty message ✓
5. Fast typing: no flicker, only last query's results visible ✓
6. Click product: navigates to PDP ✓
7. Click "Alle Ergebnisse anzeigen": goes to /search?q=... ✓
8. Enter in input: form submits to /search ✓
9. ESC: overlay closes, state resets ✓
10. Mobile (resize window <768px): overlay full-width, preview readable ✓

If any fails, fix in a focused task before pushing.

- [ ] **Step 2: Verify nothing else broke**

Quick regression check — open the cart drawer, open the mega menu, navigate to a product page. Expected: all work as before, no console errors.

- [ ] **Step 3: Pull-rebase and push**

Shopify auto-syncs to remote, so always rebase before pushing:

```bash
git fetch origin
git pull --rebase origin master
git push origin master
```

Expected: push succeeds, remote is updated.

---

## Out of Scope (do NOT implement)

These are explicitly excluded per the spec — if you find yourself adding them, stop:

- Category/collection result groups
- Search-query suggestions
- "Recent searches" history
- Highlight markup of the query in result titles
- Analytics tracking of searches
- Keyboard navigation (arrow keys) through results
- A second `/search.json` request to get the exact total count
