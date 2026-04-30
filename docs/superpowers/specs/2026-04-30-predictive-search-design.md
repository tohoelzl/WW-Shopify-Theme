# Live-Suche (Predictive Search) im Header — Design

**Datum:** 2026-04-30
**Status:** Approved
**Scope:** Erweiterung des bestehenden Such-Overlays um eine Live-Vorschau der Produkte während der Eingabe

## Ziel

Wenn der Nutzer im Header-Such-Overlay tippt, soll direkt unter dem Eingabefeld eine Vorschau passender Produkte erscheinen — ohne dass die Suchseite geladen werden muss. Die Suche durchsucht Produkttitel, Tags, Beschreibungen, Vendor und Type, sodass eine Eingabe wie „Tisch" auch alle Produkte aus der Tisch-Kategorie findet.

## User Stories

- Als Kunde tippe ich „Tisch" ein und sehe sofort die ersten 6 passenden Produkte mit Bild und Preis, ohne die Seite zu wechseln.
- Als Kunde sehe ich beim Tippen, ob die Suche gerade lädt (Skeleton-Platzhalter).
- Als Kunde sehe ich, wenn es keine Treffer gibt, eine deutliche Meldung.
- Als Kunde kann ich auf „Alle Ergebnisse anzeigen" klicken und komme zur vollständigen Suchergebnisseite.

## Architektur

### Bestehende Basis

Das Such-Overlay wurde im vorherigen Commit (`9104da8`) in [sections/header.liquid](../../../sections/header.liquid) eingebaut: Such-Icon im Header öffnet ein Slide-down-Overlay mit Eingabefeld und Submit-Button (führt zu `/search`). Diese Struktur bleibt vollständig erhalten und wird nur erweitert.

### Erweiterung

- **Alpine.js-State**: Im bestehenden `x-data` des Headers werden Felder für Query, Ergebnisse, Loading-Status und Total ergänzt.
- **API-Aufruf**: Shopifys eingebaute `/search/suggest.json`-API liefert die Produkt-Vorschläge als JSON. Keine externen Dependencies.
- **JS-Modul**: Neues `src/js/predictive-search.js` kapselt Debounce, AbortController und Fetch-Logik. Wird via esbuild zu `assets/predictive-search.js` gebaut. Das Modul registriert sich beim `alpine:init`-Event als `Alpine.data('predictiveSearch', ...)`. Eingebunden in `theme.liquid` per `<script defer>` **vor** dem Alpine-Bundle, sodass die Komponente registriert ist, wenn Alpine startet.
- **Render**: Vorschau-Liste rendert direkt unter dem Form im selben Overlay, mit reaktivem Alpine-Binding.

## Datenfluss

```
User tippt
  → @input="onInput($event.target.value)"
  → onInput setzt query, ruft scheduleSearch()
  → scheduleSearch debounced (300ms)
  → fetch GET /search/suggest.json?q=<query>
       &resources[type]=product
       &resources[limit]=6
       &resources[options][unavailable_products]=last
    (mit AbortController; alte Anfrage wird abgebrochen)
  → Response → results, total, loading=false
  → Alpine rendert Treffer-Liste
```

## UI-States

Genau einer dieser States ist im Vorschau-Bereich aktiv (per `x-show` gesteuert):

1. **Idle** (`query.length < 2`): Vorschau-Bereich versteckt — Overlay sieht aus wie zuvor.
2. **Loading** (`loading === true`): Skeleton-Liste mit 6 Platzhalter-Zeilen (graue Boxen mit `animate-pulse`).
3. **Results** (`results.length > 0`): Liste der Produkte (Bild 60×60 links, Titel + Preis rechts) + Footer-Button „Alle X Ergebnisse anzeigen" → `/search?q=<query>`.
4. **Empty** (`!loading && query.length >= 2 && results.length === 0`): Text „Keine Ergebnisse für '<query>'. Versuche einen anderen Begriff."
5. **Error** (`error === true`): Text „Suche momentan nicht verfügbar. Drücke Enter, um zur normalen Suche zu gelangen."

## Komponenten

### `src/js/predictive-search.js` (neu)

Exportiert eine Alpine-Component-Factory, die im Header per `x-data="predictiveSearch()"` (auf einem inneren Wrapper) ergänzt zum bestehenden Header-State läuft. Alternative: globale Funktion auf `window` registrieren.

**Empfohlene Struktur:** Eigene Alpine-Component für den Such-Overlay-Wrapper, damit die Logik isoliert bleibt und der Haupt-Header-State (`mobileOpen`, `searchOpen`, …) nicht weiter aufgebläht wird.

**State:**
- `query: string`
- `results: Array<{ id, title, url, image, price, priceFormatted }>`
- `total: number`
- `loading: boolean`
- `error: boolean`

**Methods:**
- `onInput(value)` — setzt `query`, ruft `scheduleSearch()`
- `scheduleSearch()` — clear/set Timeout (300ms), bei Trigger ruft `runSearch()`
- `runSearch()` — AbortController abort + neuer; fetch; setzt State; ignoriert `AbortError`
- `clear()` — resettet alles (z. B. beim Schließen des Overlays)

**Konstanten:**
- `MIN_CHARS = 2`
- `DEBOUNCE_MS = 300`
- `RESULT_LIMIT = 6`

### `sections/header.liquid` (Anpassung)

Der bestehende Such-Overlay-Block wird umstrukturiert:

```liquid
<div class="absolute top-0 inset-x-0 bg-white shadow-lg" ...>
  <div class="container py-6" x-data="predictiveSearch()" x-effect="!searchOpen && clear()">
    <form action="{{ routes.search_url }}" method="get" role="search" ...>
      <input
        type="search" name="q"
        x-ref="searchInput"
        @input="onInput($event.target.value)"
        ...
      >
      ...
    </form>

    {%- comment -%} Vorschau-Bereich {%- endcomment -%}
    <div class="mt-6" x-show="query.length >= 2" x-cloak>
      {%- comment -%} Loading state {%- endcomment -%}
      <div x-show="loading" class="space-y-3">…6× Skeleton…</div>

      {%- comment -%} Results {%- endcomment -%}
      <ul x-show="!loading && results.length > 0" class="divide-y divide-gray-100">
        <template x-for="product in results" :key="product.id">
          <li>
            <a :href="product.url" class="flex items-center gap-4 py-3 hover:bg-gray-50 -mx-2 px-2 rounded">
              <img :src="product.image" :alt="product.title" class="w-16 h-16 object-cover rounded">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate" x-text="product.title"></p>
                <p class="text-sm text-gray-600" x-text="product.priceFormatted"></p>
              </div>
            </a>
          </li>
        </template>
      </ul>

      {%- comment -%} View all {%- endcomment -%}
      <a x-show="!loading && total > 0"
         :href="`{{ routes.search_url }}?q=${encodeURIComponent(query)}`"
         class="block mt-4 text-center text-sm font-semibold text-primary hover:text-accent">
        Alle <span x-text="total"></span> Ergebnisse anzeigen
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
  </div>
</div>
```

### `layout/theme.liquid` (Anpassung)

`<script src="{{ 'predictive-search.js' | asset_url }}" defer></script>` wird ergänzt (analog zu bestehenden JS-Modulen). Der Build-Schritt `npm run build:js` erstellt das Asset aus `src/js/predictive-search.js`.

## Datentransformation (API → State)

Shopifys `/search/suggest.json` gibt zurück:

```json
{
  "resources": {
    "results": {
      "products": [
        {
          "id": 123,
          "title": "Eichentisch Oslo",
          "url": "/products/eichentisch-oslo",
          "image": "https://cdn.shopify.com/...",
          "price": "1.299,00 €",
          ...
        }
      ]
    }
  }
}
```

Das Modul mappt `data.resources.results.products[*]` auf das interne State-Format. Total wird aus `products.length` abgeleitet (die Suggest-API liefert keinen separaten Total-Count) — bei `total === RESULT_LIMIT` zeigen wir den „Alle Ergebnisse"-Button auch dann, da unklar ist, ob mehr existieren. Für den exakten Total-Count müsste eine zweite Anfrage an `/search.json` laufen, was wir explizit nicht tun (YAGNI).

**Anpassung am Design:** Der Button-Text wird leicht geändert — statt „Alle X Ergebnisse anzeigen" zeigen wir „Alle Ergebnisse anzeigen" (ohne Zahl), wenn der Total nicht bekannt ist.

## Fehlerbehandlung

- **Netzwerkfehler / non-200**: `error = true` setzen, Empty-/Loading-State ausblenden, Error-Meldung zeigen. Form bleibt nutzbar (Enter führt zu `/search`).
- **AbortError**: Komplett ignorieren (kein State-Update) — passiert bei jeder neuen Eingabe.
- **Leeres Query nach Debounce**: Kein Fetch, State wird auf `idle` zurückgesetzt.
- **Keine Retry-Logik**: Shopifys Endpoint ist stabil; bei transient errors versucht der Nutzer ohnehin durch Weitertippen erneut.

## Performance

- Debounce 300ms reduziert Anfragen auf ~1 pro Eingabepause.
- AbortController bricht in-flight-Requests ab, wenn der Nutzer weitertippt — keine Race Conditions.
- `MIN_CHARS = 2` filtert Single-Char-Anfragen aus.
- Kein clientseitiges Caching nötig — Shopify cached die Suggest-API serverseitig.

## Accessibility

- Eingabefeld behält bestehende `aria-label`/`<label class="sr-only">`.
- Vorschau-Liste bekommt `role="listbox"` und Items `role="option"` — optional, falls Zeit reicht. **MVP:** semantische `<ul>`/`<li>` reicht.
- Loading-State bekommt `aria-busy="true"` auf dem Container.
- Tastatur-Navigation (Pfeil hoch/runter durch Treffer) ist **nicht** Teil dieses Specs — kann später ergänzt werden.

## Was NICHT enthalten ist (YAGNI)

- Keine Kategorie-/Collection-Vorschläge (Nutzer hat „nur Produkte" gewählt; Kategorie-Treffer kommen über Tags ohnehin)
- Keine Suchvorschläge / Such-Queries-Liste
- Keine „Recent searches"-History
- Keine Highlight-Markierung der Suchbegriffe in den Treffern
- Kein Analytics-Tracking
- Keine Tastatur-Navigation durch Treffer (nur Tab/Enter wie üblich)
- Keine zweite Anfrage für exakten Total-Count

## Build & Deployment

1. `npm run build:js` baut `src/js/predictive-search.js` → `assets/predictive-search.js`
2. `npm run build:css` (falls neue Tailwind-Klassen verwendet werden, z. B. `animate-pulse`, `w-15`, `h-15`)
3. Commit: `feat: live search with product preview in header overlay`
4. Push nach `origin/master` — Shopify zieht automatisch.

## Testing-Strategie

Da das Theme keine automatisierten Tests hat, manuelles Smoke-Testing:

1. **Idle-State**: Such-Overlay öffnen, Eingabefeld leer → keine Vorschau.
2. **Single-Char**: „T" eingeben → keine Vorschau.
3. **Match**: „Tisch" eingeben → Loading-Skeleton kurz, dann Liste mit Produkten.
4. **No-Match**: „xyzabc123" → Empty-Meldung.
5. **Schnelles Tippen**: Schnell „Tisch" → „Tische" → „Tisch" — keine alten Ergebnisse, kein Flackern.
6. **Klick auf Produkt**: Führt zur Produktseite.
7. **Klick auf „Alle Ergebnisse anzeigen"**: Führt zu `/search?q=tisch`.
8. **Enter im Eingabefeld**: Submit auf `/search?q=...` (bestehendes Verhalten).
9. **ESC**: Overlay schließt, State wird zurückgesetzt.
10. **Mobile**: Funktioniert auf schmalen Viewports, Overlay nimmt volle Breite ein.

## Offene Fragen

Keine — Design ist abgestimmt.
