# Featured Slider Section — Design Spec

**Date:** 2026-05-05
**Status:** Draft, awaiting user review
**Type:** New Shopify section

## Summary

Eine neue Shopify-OS-2.0-Section `featured-slider.liquid`, die fix 8 Produkte als horizontalen Slider anzeigt. Der Merchant kann 0–8 Produkte manuell als Section-Blocks anlegen; verbleibende Slots werden automatisch aus einer im Theme-Editor wählbaren Auffüll-Collection (typisch eine Smart Collection „Bestseller", sortiert nach Best-Selling) ergänzt. Duplikate werden vermieden.

Die bestehende Section `featured-collection.liquid` bleibt unverändert. Die neue Section ist eine eigenständige Ergänzung.

## Goals

- Premium, Möbel-taugliches Slider-Layout, optimiert für Desktop und Mobile.
- Maximale Flexibilität für den Merchant: einzelne Slots manuell setzen oder vollständig aus Collection auffüllen.
- Keine externen Slider-Libraries, Vanilla-JS-only, CWV-freundlich.
- Wiederverwendung des bestehenden `product-card`-Snippets für visuelle Konsistenz.

## Non-Goals

- Echtes „Most Viewed" pro User-Session (Shopify-nativ nicht möglich ohne externe App). Auffüllung basiert auf der Collection-Sortierung in Shopify (typisch Best-Selling).
- Lazy-Loading-Logik jenseits von Shopifys nativem `loading="lazy"`.
- Mobile-Pfeile (Swipe reicht).
- Animationen über `scroll-behavior: smooth` hinaus.
- Modifikationen an der bestehenden `featured-collection.liquid`.

## User Stories

- Als Merchant möchte ich eine Slider-Section auf der Homepage einbauen, in der ich z.B. 5 Produkte selbst auswähle und 3 weitere automatisch aus der Bestseller-Collection ergänzt werden.
- Als Merchant möchte ich auch alle 8 Slots manuell setzen oder gar keinen — die Section soll in beiden Fällen sauber funktionieren.
- Als Besucher möchte ich auf Mobile durch die Produkte swipen und auf Desktop mit Pfeilen navigieren.
- Als Besucher möchte ich anhand einer Progress-Bar sehen, wo im Slider ich gerade bin.

## Architecture

**Eine einzige neue Datei:** `sections/featured-slider.liquid`. Markup, Schema, scoped `<style>` und scoped `<script>` liegen alle in dieser Datei. Kein neues Snippet, kein neues JS-Modul.

**Datenfluss:**

1. Section sammelt `section.blocks` mit gesetztem `block.settings.product` als `manual_products`-Array.
2. Wenn `manual_products.size < 8` und `section.settings.fill_collection` ist gesetzt: iteriere durch `fill_collection.products`, überspringe Produkte, die bereits in `manual_products` sind, sammle bis `8 - manual_products.size` Produkte.
3. Render-Reihenfolge: zuerst alle manuellen Produkte in Block-Reihenfolge, dann die Auffüll-Produkte.
4. Jede Card wird via `{% render 'product-card', product: product %}` ausgegeben.

**Render-Container:**

- Outer: `<section>` mit Container (Tailwind `container`, optional Full-Width-Variante wie in `featured-collection.liquid`).
- Header (Heading, Subtitle, optionaler View-All-Link, Alignment links/rechts) — Markup-Pattern aus `featured-collection.liquid` übernommen.
- Slider-Track: `<div>` mit `display: flex`, `overflow-x: auto`, `scroll-snap-type: x mandatory`, versteckte Scrollbar.
- Cards: jede Card hat fixe Breite (`flex: 0 0 calc(...)`) abhängig vom Breakpoint und `scroll-snap-align: start`.
- Desktop-Pfeile (`<button>`-Elemente) absolut positioniert links/rechts, vertikal mittig auf Card-Höhe. Sichtbar nur ab Tailwind-Breakpoint `lg` (≥ 1024px), darunter `hidden`.
- Progress-Bar unterhalb des Tracks, full-width des Containers, dünne Linie (~2px) mit gefülltem Inner-Element, dessen `width` sich per JS aktualisiert.

## Theme-Editor Schema

```jsonc
{
  "name": "Featured Slider",
  "settings": [
    { "type": "text", "id": "heading", "label": "Überschrift" },
    { "type": "text", "id": "subtitle", "label": "Untertitel" },
    {
      "type": "collection",
      "id": "fill_collection",
      "label": "Auffüll-Collection",
      "info": "Verbleibende Slots (bis 8 Total) werden aus dieser Collection in deren Sortierung aufgefüllt. Tipp: Smart Collection mit Sortierung „Bestseller / Best Selling"."
    },
    { "type": "checkbox", "id": "show_view_all", "label": "„Alle anzeigen\" Link", "default": true },
    { "type": "text", "id": "view_all_text", "label": "„Alle anzeigen\" Text", "default": "Alle ansehen" },
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
```

Hinweise:
- `limit: 8` auf dem Block-Level erzwingt das Maximum im Editor.
- `fill_collection` ist optional im Schema (nicht required), aber funktional notwendig, um auf 8 aufzufüllen, wenn weniger als 8 Blocks gesetzt sind. Wenn nicht gesetzt und Blocks < 8, zeigt der Slider nur die manuellen Produkte.
- Auto-Play-Intervall ist auf 5 Sekunden hardcoded (kein zusätzliches Setting — YAGNI).

## Liquid-Logik (Pseudocode)

```liquid
{%- liquid
  assign slot_total = 8

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
```

## Slider-Verhalten

**Sichtbarkeit pro Breakpoint (CSS-basiert):**

- Mobile (`< 768px`): 2 Cards sichtbar
- Tablet (`768px–1023px`): 3 Cards sichtbar
- Desktop (`≥ 1024px`): 4 Cards sichtbar

Implementierung: jede Card `flex: 0 0 calc((100% - (n - 1) * gap) / n)` wobei `n` per Media-Query wechselt. Gap zwischen Cards: `1rem` mobile, `1.5rem` desktop (analog zu `gap-4 lg:gap-6` aus der Featured-Collection).

**Scroll-Schritt:**

- Swipe (Mobile/Tablet): native, snapt automatisch durch `scroll-snap-align: start` auf jeder Card.
- Pfeil-Klick (Desktop): scrollt um genau **eine Card-Breite + Gap** weiter. Implementiert via `el.scrollBy({ left: cardWidth + gap, behavior: 'smooth' })`.

**Pfeile (nur Desktop, `≥ 1024px`):**

- Zwei `<button>` absolut positioniert links/rechts, vertikal mittig auf Card-Höhe.
- Disabled-State (`disabled` attribute + visuell ausgegraut): wenn `scrollLeft <= 0` (links) bzw. `scrollLeft + clientWidth >= scrollWidth` (rechts).
- `aria-label="Vorherige Produkte"` / `"Nächste Produkte"`.

**Progress-Bar:**

- Unterhalb des Tracks, full-width des Containers, ~2px hoch, dezenter Hintergrund-Strich.
- Inner-Element: `width: X%` (Prozent berechnet als `scrollLeft / (scrollWidth - clientWidth) * 100`). Width-basiert, nicht transform-basiert, weil die Berechnung trivial bleibt und die Performance bei einem einzigen Element vernachlässigbar ist.
- Update via `scroll`-Event auf dem Track (passiv, throttled mit `requestAnimationFrame`).
- Wenn der Slider nicht scrollbar ist (alle Cards passen rein), wird die Progress-Bar sowie die Pfeile ausgeblendet.

**Auto-Play (optional):**

- Wenn aktiviert: alle 5 Sekunden ein Card-Schritt nach rechts.
- Pause bei `mouseenter` auf der Section, Resume bei `mouseleave`.
- Pause bei `touchstart` auf dem Track (Mobile soll Auto-Play nicht im Weg stehen, sobald der User interagiert).
- Bei Erreichen des Endes: wenn `loop` aktiviert, springe zurück zu Start (`scrollTo({ left: 0 })`); sonst stoppe.

**Loop (optional):**

- Nur in Verbindung mit Auto-Play sinnvoll wirksam (manueller Pfeil-Klick führt schlicht ins Disabled).
- Bei aktivem Loop und Auto-Play: am Ende → zurück zu Start.

## Edge-Cases

- **0 manuelle Blocks + Collection gesetzt:** 8 Produkte aus Collection.
- **8 manuelle Blocks:** kein Collection-Loop, nur manuelle Produkte.
- **Manuelles Produkt ist auch in Collection:** wird im Auto-Fill via `unless manual_products contains product` übersprungen.
- **Collection liefert weniger als `needed` Produkte:** Slider zeigt weniger als 8 — kein Padding/Skeleton.
- **Final-Liste leer (keine Blocks, keine/leere Collection):** Im Storefront rendert die Section gar nichts (frühzeitiger Return). Nur im Theme-Editor (`request.design_mode == true`) wird ein dezenter Platzhalter-Hinweis angezeigt, damit der Merchant die Section überhaupt findet, um sie zu konfigurieren.
- **Final-Liste passt komplett ins Viewport (z.B. nur 2 Produkte auf Desktop bei 4 sichtbaren Slots, oder 1 Produkt auf Mobile bei 2 sichtbaren Slots):** Slider degradiert visuell zum Grid — Pfeile + Progress-Bar werden ausgeblendet (`scrollWidth <= clientWidth`-Check im JS).
- **Produkt unpubliziert/gelöscht:** Liquid-Objekt ist leer; Card wird nicht gerendert (Guard im Template).
- **Mehrere Slider-Instanzen auf einer Seite:** jede Section bindet ihren eigenen JS-Scope an die Section-ID — unabhängig voneinander.
- **Theme-Editor `shopify:section:load` Event:** JS muss bei diesem Event neu initialisieren, damit Pfeile + Progress-Bar nach Re-Render im Editor funktionieren.

## Styling

- **Tailwind** für Layout, Typografie, Farben (konsistent mit `featured-collection.liquid`).
- **Scoped `<style>`-Block** in der Section für:
  - `scroll-snap-type: x mandatory` auf dem Track.
  - `scroll-snap-align: start` auf den Cards.
  - `scrollbar-width: none` und `::-webkit-scrollbar { display: none }`.
  - Progress-Bar-Inner mit `transition: transform 0.1s linear` (oder Width-Transition).
  - Card-Breite per Media-Query (`flex-basis`-Berechnung).
- Header (Heading/Subtitle/View-All) übernimmt Pattern aus `featured-collection.liquid` 1:1 (Tailwind-Klassen, `text-2xl lg:text-3xl font-heading font-bold` etc.).

## JavaScript

- Vanilla JS, scoped per `section.id`, inline am Ende der Section.
- Verantwortlichkeiten:
  - Pfeil-Klick → `scrollBy` um Card-Breite + Gap.
  - `scroll`-Event auf Track (passive, rAF-gethrottled) → Progress-Bar-Width aktualisieren + Pfeil-Disabled-State setzen.
  - Auto-Play-Timer setzen/clearen, Pause bei Mouse-/Touch-Interaktion.
  - `shopify:section:load`- und `shopify:section:unload`-Events handeln (Re-Init / Cleanup im Editor).
- Card-Breite + Gap wird per `getBoundingClientRect()` der ersten Card und `getComputedStyle(track).gap` ausgelesen — keine hardcoded Werte, damit das mit den Breakpoint-Wechseln mitgeht.
- Kein Build-Step nötig (kein TypeScript-File für die Section).

## Accessibility

- Pfeile sind `<button type="button">` mit `aria-label`.
- Slider-Container hat `role="region"` und `aria-label` mit dem Heading-Text (Fallback: „Produktauswahl Slider").
- Cards bleiben mit Tab fokussierbar über die Links im `product-card`-Snippet.
- Auto-Play respektiert `prefers-reduced-motion`: bei aktiver Reduce-Motion-Präferenz wird Auto-Play nicht gestartet (auch wenn im Editor aktiviert).
- `scroll-behavior: smooth` ebenfalls auf `auto` zurückfallen, wenn `prefers-reduced-motion: reduce`.

## Performance

- Liquid-Loop endet via `break` sobald Auffüll-Bedarf gedeckt ist — kein unnötiger Overhead.
- Default-Limit von 50 Produkten beim Collection-Loop in Shopify ist mehr als genug für maximal 8 Auffüll-Produkte.
- Inline-CSS und JS halten sich klein (~60 Zeilen JS, ~30 Zeilen CSS), keine Library.
- Bilder nutzen Shopifys `loading="lazy"` aus dem `product-card`-Snippet.

## Test-Plan (manuell)

1. Section neu auf Homepage, Auffüll-Collection gesetzt, 0 Blocks → 8 Produkte aus Collection.
2. 5 Blocks gesetzt, Collection gesetzt → 5 manuell + 3 aus Collection.
3. 8 Blocks gesetzt → kein Auto-Fill, Collection-Setting wird ignoriert.
4. Manuelles Produkt überschneidet mit Collection → kein Duplikat im Render.
5. Collection liefert nur 3 Produkte, 0 Blocks → Slider zeigt 3 Cards, degradiert ggf. zum Grid.
6. Keine Blocks, keine Collection → Section rendert nichts (oder Hinweis im Editor).
7. Viewports getestet: 375px, 768px, 1024px, 1280px, 1920px — Card-Anzahl, Swipe, Pfeile.
8. Pfeil-Klick auf Desktop scrollt genau eine Card weiter.
9. Pfeil-Disabled-States am Anfang (links) und Ende (rechts) korrekt.
10. Progress-Bar reflektiert Scroll-Position akkurat.
11. Auto-Play startet/pausiert bei Hover/Touch, springt bei Loop=on zurück zu Start.
12. `prefers-reduced-motion: reduce` → kein Auto-Play, kein smooth-Scroll.
13. Zwei Slider-Instanzen auf derselben Seite → unabhängig scrollbar.
14. Theme-Editor: Section neu laden, Block hinzufügen/entfernen, Collection wechseln → Slider re-initialisiert sich korrekt.

## Out of Scope

- Änderungen an `featured-collection.liquid`.
- Externe Most-Viewed-Tracking-Apps.
- Touch-Pfeile auf Mobile.
- Konfigurierbares Auto-Play-Intervall.
- Konfigurierbare Card-Anzahl pro Breakpoint.
- Konfigurierbares Slot-Total (fix bei 8).

## Files Created

- `sections/featured-slider.liquid` (neu)

## Files Modified

- Keine.
