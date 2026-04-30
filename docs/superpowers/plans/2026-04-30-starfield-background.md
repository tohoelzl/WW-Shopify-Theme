# Sternenhimmel-Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Globaler Body-Background mit hand-drawn Möbel-Icons in `#0E7CB4` @ 40% Opacity (konfigurierbar im Theme-Editor), der sich als 800×800px SVG-Tile wiederholt — inkl. optionalem Parallax-Toggle.

**Architecture:** Ein statisches SVG-Tile mit ~12 zufällig positionierten/rotierten Möbel-Icons als Liquid-Snippet (`snippets/sky-pattern-svg.liquid`). Bei jedem Page-Render injiziert `layout/theme.liquid` die aktuelle Setting-Farbe und Opacity ins SVG-Template, encoded das Ergebnis als Data-URI und schreibt es als `background-image` auf den `<body>`. Tile-interne Icons haben ≥24px Sicherheitsabstand zum Tile-Rand (kein Cross-Tile-Cut). Sektionen mit eigenem Hintergrund überdecken den Sternenhimmel automatisch.

**Tech Stack:** Liquid, Shopify Theme-Settings, Tailwind CSS (Build-Pipeline via `src/css/components.css` → `assets/application.css`), Inline-SVG.

---

## File Structure

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `snippets/sky-pattern-svg.liquid` | SVG-Tile-Template mit `__COLOR__`/`__OPACITY__` Platzhaltern, ~12 Möbel-Icons, hand-drawn Stil |
| Modify | `config/settings_schema.json` | Neue Theme-Setting-Sektion "Hintergrund" mit 4 Settings |
| Modify | `layout/theme.liquid` | Body-Klasse `has-sky-bg`/`has-sky-parallax` setzen, inline `<style>`-Block mit Data-URI rendern (nur bei `sky_enabled`) |
| Modify | `src/css/components.css` | Base-Regeln für `.has-sky-bg` (background-repeat) und `.has-sky-parallax` (background-attachment: fixed). Wird via `npm run build:css` zu `assets/application.css` kompiliert. |

---

### Task 1: SVG-Tile-Template als Liquid-Snippet

**Files:**
- Create: `snippets/sky-pattern-svg.liquid`

- [ ] **Step 1: Snippet-Datei erstellen**

Datei `snippets/sky-pattern-svg.liquid` mit folgendem Inhalt anlegen. Das ist ein 800×800 SVG-Tile mit 12 hand-drawn Möbel-Icons (Stuhl, Tisch, Lampe, Sofa, Bett, Regal — gemischt). Alle Icons haben Sicherheitsabstand ≥24px zu allen Tile-Rändern. Stroke-Width ist `0.6` in den ursprünglichen 24×24 Icon-Koordinaten — durch den Scale-Faktor (~2.6–3.6) werden daraus ~1.6–2.2px im Tile, was die gewünschte dünne hand-drawn-Linie ergibt. `__COLOR__` und `__OPACITY__` sind die Liquid-Replace-Platzhalter.

```liquid
{%- comment -%}
  Sky-Pattern-Tile: 800×800 SVG mit 12 hand-drawn Möbel-Icons.
  Wird in layout/theme.liquid via render geladen, dann __COLOR__ und __OPACITY__ ersetzt
  und als Data-URI ins background-image geschrieben.

  Tile-Boundary: alle Icons haben mindestens 24px Abstand zu jedem Tile-Rand.
  Icons sind 60-100px groß, gemischte Rotationen ±45°.
{%- endcomment -%}
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <g stroke="__COLOR__" stroke-width="0.6" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="__OPACITY__">
    <!-- Stuhl, top-left -->
    <g transform="translate(80 90) rotate(-22) scale(3.2)">
      <path d="M6.2 10.1V5.1c0-1.1.9-2 2-2h7.8c1.1 0 2.1.9 2.1 2v5"/>
      <path d="M5 10.1h14L18.1 16H6l-1-5.9Z"/>
      <path d="M7.1 16v4M17 16.1v4"/>
    </g>
    <!-- Lampe, top-mid -->
    <g transform="translate(310 60) rotate(15) scale(2.8)">
      <path d="M8.1 8.05 16 8.1l-2 5.95L10.05 14Z"/>
      <path d="M12 14.1v5.9M9.05 20H15"/>
    </g>
    <!-- Tisch, top-right -->
    <g transform="translate(560 110) rotate(-38) scale(3.6)">
      <path d="M3.1 8.2 21 8.05l-.05 2.95L3 11.05Z"/>
      <path d="M5.05 11.1 5 20M19 11.05 19.1 20"/>
    </g>
    <!-- Bett, mid-left -->
    <g transform="translate(110 270) rotate(28) scale(3.0)">
      <path d="M3 18.05V8.1M21 18v-9.95"/>
      <path d="M3.05 13.1 21 13M3 18h18.05"/>
      <path d="M6.05 13c0-1.1.9-2 2-2h3.9c1.1 0 2.05.9 2.05 2"/>
    </g>
    <!-- Sofa, mid-center -->
    <g transform="translate(360 320) rotate(-10) scale(3.4)">
      <path d="M3.1 12.1c0-1.1.9-2 2-2s2 .9 2 2v3"/>
      <path d="M21 12c0-1.1-.9-2-2.1-2-1.1 0-2 .9-2 2.05v3"/>
      <path d="M5.1 15.05 19 15v3.1L5 18Z"/>
      <path d="M7.05 18.1V20M17 18v2.1"/>
    </g>
    <!-- Regal, mid-right -->
    <g transform="translate(620 290) rotate(40) scale(2.6)">
      <path d="M5.05 4.1V20M19 4v16.05"/>
      <path d="M5 8.05 19.05 8M5.1 14 19 14.05"/>
    </g>
    <!-- Tisch, lower-left -->
    <g transform="translate(70 510) rotate(-30) scale(2.9)">
      <path d="M3.1 8.2 21 8.05l-.05 2.95L3 11.05Z"/>
      <path d="M5.05 11.1 5 20M19 11.05 19.1 20"/>
    </g>
    <!-- Stuhl, lower-center -->
    <g transform="translate(330 540) rotate(35) scale(3.1)">
      <path d="M6.2 10.1V5.1c0-1.1.9-2 2-2h7.8c1.1 0 2.1.9 2.1 2v5"/>
      <path d="M5 10.1h14L18.1 16H6l-1-5.9Z"/>
      <path d="M7.1 16v4M17 16.1v4"/>
    </g>
    <!-- Lampe, lower-right -->
    <g transform="translate(600 530) rotate(-18) scale(3.2)">
      <path d="M8.1 8.05 16 8.1l-2 5.95L10.05 14Z"/>
      <path d="M12 14.1v5.9M9.05 20H15"/>
    </g>
    <!-- Regal, bottom-left -->
    <g transform="translate(140 690) rotate(20) scale(2.7)">
      <path d="M5.05 4.1V20M19 4v16.05"/>
      <path d="M5 8.05 19.05 8M5.1 14 19 14.05"/>
    </g>
    <!-- Sofa, bottom-center -->
    <g transform="translate(380 700) rotate(-25) scale(2.8)">
      <path d="M3.1 12.1c0-1.1.9-2 2-2s2 .9 2 2v3"/>
      <path d="M21 12c0-1.1-.9-2-2.1-2-1.1 0-2 .9-2 2.05v3"/>
      <path d="M5.1 15.05 19 15v3.1L5 18Z"/>
      <path d="M7.05 18.1V20M17 18v2.1"/>
    </g>
    <!-- Bett, bottom-right -->
    <g transform="translate(610 690) rotate(12) scale(2.6)">
      <path d="M3 18.05V8.1M21 18v-9.95"/>
      <path d="M3.05 13.1 21 13M3 18h18.05"/>
      <path d="M6.05 13c0-1.1.9-2 2-2h3.9c1.1 0 2.05.9 2.05 2"/>
    </g>
  </g>
</svg>
```

- [ ] **Step 2: Tile-Boundary visuell verifizieren**

Temporär das Snippet direkt in einem Browser öffnen, um zu prüfen dass keine Icons abgeschnitten sind. Schnellster Weg: eine Test-HTML-Datei `/tmp/tile-test.html` erstellen:

```html
<!doctype html>
<html><head><style>
  body { margin: 0; padding: 40px; background: #f5f5f5; }
  .tile-frame { width: 800px; height: 800px; border: 2px dashed red; position: relative; background: white; }
  .tile-frame svg { display: block; }
</style></head>
<body>
  <div class="tile-frame">
    <!-- Inhalt aus snippets/sky-pattern-svg.liquid hier einfügen, mit __COLOR__ → #0E7CB4 und __OPACITY__ → 0.4 -->
  </div>
</body></html>
```

In `/tmp/tile-test.html` den SVG-Inhalt einfügen, beide Platzhalter manuell ersetzen, mit `open /tmp/tile-test.html` öffnen. Sicherstellen: alle Icons befinden sich vollständig innerhalb der roten Tile-Grenze. Falls ein Icon näher als 24px am Rand: Position im Snippet anpassen.

Expected: Alle 12 Icons komplett im 800×800 Frame sichtbar, keine Überlappung mit der roten Boundary.

- [ ] **Step 3: Tiling visuell verifizieren**

Zweite Test-HTML `/tmp/tile-repeat-test.html` erstellen, die das SVG als Background-Image kachelt:

```html
<!doctype html>
<html><head><style>
  body { margin: 0; padding: 0; min-height: 200vh;
    background-image: url('data:image/svg+xml;utf8,<svg ...>'); /* SVG-Content URL-encoded mit __COLOR__→%230E7CB4 und __OPACITY__→0.4 */
    background-repeat: repeat;
  }
</style></head><body></body></html>
```

Im Browser öffnen, scrollen und visuell prüfen: keine sichtbaren harten Tile-Grenzen, keine Icons die am Tile-Übergang abgeschnitten erscheinen. Tile-Wiederholung soll im normalen Lesefluss nicht auffallen.

Expected: Auf einem 1920×1080-Viewport sind ~5–6 Tile-Wiederholungen sichtbar; keine Naht und keine zerschnittenen Icons.

- [ ] **Step 4: Commit**

```bash
git add snippets/sky-pattern-svg.liquid
git commit -m "feat: add sky-pattern SVG tile snippet for starfield background"
```

---

### Task 2: Theme-Settings hinzufügen

**Files:**
- Modify: `config/settings_schema.json`

- [ ] **Step 1: Neue Sektion "Hintergrund" hinzufügen**

`config/settings_schema.json` öffnen. Aktuell enthält die Datei eine Top-Level-JSON-Array mit einem einzigen Objekt (Logo). Die Datei vollständig durch folgendes ersetzen:

```json
[
  {
    "name": "Logo",
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
      }
    ]
  },
  {
    "name": "Hintergrund",
    "settings": [
      {
        "type": "header",
        "content": "Sternenhimmel"
      },
      {
        "type": "checkbox",
        "id": "sky_enabled",
        "label": "Sternenhimmel-Hintergrund aktivieren",
        "default": true,
        "info": "Zeigt ein dezentes Pattern aus Möbel-Icons als globalen Body-Background."
      },
      {
        "type": "color",
        "id": "sky_color",
        "label": "Icon-Farbe",
        "default": "#0E7CB4"
      },
      {
        "type": "range",
        "id": "sky_opacity",
        "label": "Transparenz",
        "min": 10,
        "max": 60,
        "step": 5,
        "default": 40,
        "unit": "%"
      },
      {
        "type": "checkbox",
        "id": "sky_parallax",
        "label": "Parallax-Effekt",
        "default": false,
        "info": "Hintergrund bleibt beim Scrollen stehen statt mitzuscrollen. Auf iOS Safari nicht unterstützt — Fallback auf Mitscrollen."
      }
    ]
  }
]
```

- [ ] **Step 2: JSON-Validität prüfen**

Run: `python3 -m json.tool config/settings_schema.json > /dev/null`

Expected: Kein Output (= valides JSON). Bei Fehler: Output zeigt die fehlerhafte Stelle.

- [ ] **Step 3: Commit**

```bash
git add config/settings_schema.json
git commit -m "feat: add Hintergrund theme settings (sky pattern + parallax)"
```

---

### Task 3: CSS-Regeln für Body-Klassen

**Files:**
- Modify: `src/css/components.css`

- [ ] **Step 1: CSS-Regeln am Ende von `src/css/components.css` ergänzen**

`src/css/components.css` öffnen. Am Ende der Datei (nach allen Splide-Regeln) folgenden Block hinzufügen:

```css
/* Sky-Pattern Background
   Die background-image-Regel selbst wird in layout/theme.liquid inline gesetzt
   (Data-URI mit aktueller Setting-Farbe/Opacity injiziert).
   Hier nur die unveränderlichen Eigenschaften. */
body.has-sky-bg {
  background-repeat: repeat;
  background-position: 0 0;
  background-size: 800px 800px;
}

body.has-sky-parallax {
  background-attachment: fixed;
}
```

- [ ] **Step 2: CSS neu bauen**

Run: `npm run build:css`

Expected: Output endet mit "Done in <Nms>." und ohne Errors. `assets/application.css` enthält jetzt die neuen Regeln.

- [ ] **Step 3: Verifizieren dass die Regeln in der gebauten Datei sind**

Run: `grep -n "has-sky-bg\|has-sky-parallax" assets/application.css`

Expected: Zwei Treffer: `body.has-sky-bg{...}` und `body.has-sky-parallax{...}` (Tailwind minified leicht; Klassen-Selektoren bleiben aber erhalten).

- [ ] **Step 4: Commit**

```bash
git add src/css/components.css assets/application.css
git commit -m "feat: add CSS rules for sky background body classes"
```

---

### Task 4: Body-Klassen und Inline-Style in `theme.liquid`

**Files:**
- Modify: `layout/theme.liquid`

- [ ] **Step 1: Inline-Style-Block für Sky-Pattern im `<head>` ergänzen**

`layout/theme.liquid` öffnen. Aktuell endet der `<style>`-Block bei Zeile ~31 (`</style>` direkt nach den `--font-*` CSS-Variablen). Direkt **nach** diesem schließenden `</style>` (also vor dem `<script>`-Block mit `window.themeSettings`) folgenden Block einfügen:

```liquid
  {%- if settings.sky_enabled -%}
    {%- assign sky_color_encoded = settings.sky_color | default: '#0E7CB4' | replace: '#', '%23' -%}
    {%- assign sky_opacity_value = settings.sky_opacity | default: 40 | divided_by: 100.0 -%}
    {%- capture sky_svg_raw -%}{% render 'sky-pattern-svg' %}{%- endcapture -%}
    {%- assign sky_svg_filled = sky_svg_raw | replace: '__COLOR__', sky_color_encoded | replace: '__OPACITY__', sky_opacity_value | strip_newlines | replace: '"', "'" | url_encode -%}
    <style>
      body.has-sky-bg {
        background-image: url("data:image/svg+xml,{{ sky_svg_filled }}");
      }
    </style>
  {%- endif -%}
```

**Hinweise zur Liquid-Logik:**
- `replace: '#', '%23'` — der Color-Setting wird als `#0E7CB4` zurückgegeben; `#` ist in einer Data-URI ein Anker und muss URL-encoded sein.
- `divided_by: 100.0` — Range-Setting liefert Integer (40), wir brauchen Float (0.4) als SVG-`opacity`-Wert.
- `strip_newlines | replace: '"', "'"` — Das SVG enthält Double-Quotes für XML-Attribute; im CSS `url("...")`-Wrapper müssen die intern auf Single-Quotes wechseln, sonst bricht der CSS-String. Newlines raus, weil `url_encode` sie zu `%0A` macht und das die Data-URI unnötig aufbläht.
- `url_encode` — finale URL-safe Encoding aller verbleibenden Sonderzeichen (`<`, `>`, Leerzeichen).

- [ ] **Step 2: Body-Tag mit Sky-Klassen erweitern**

In `layout/theme.liquid` die aktuelle `<body>`-Zeile (Zeile 45):

```liquid
<body class="font-body text-primary bg-[var(--color-background)]">
```

ersetzen durch:

```liquid
<body class="font-body text-primary bg-[var(--color-background)]{% if settings.sky_enabled %} has-sky-bg{% if settings.sky_parallax %} has-sky-parallax{% endif %}{% endif %}">
```

- [ ] **Step 3: Theme-Editor öffnen und Smoketest**

Falls Shopify CLI installiert: `shopify theme dev` (sonst: Theme via `shopify theme push --unpublished` zu einem Dev-Store hochladen und Theme-Editor öffnen).

Im Theme-Editor unter **Theme settings → Hintergrund**:
1. Toggle "Sternenhimmel-Hintergrund aktivieren" ist eingeschaltet → Pattern muss auf der Storefront sichtbar sein
2. Toggle aus → Pattern verschwindet, weißer Hintergrund

Expected: Sternenhimmel sichtbar/unsichtbar je nach Toggle. Keine Console-Errors. Inline-`<style>`-Block im `<head>` nur sichtbar wenn Toggle aktiv.

- [ ] **Step 4: Commit**

```bash
git add layout/theme.liquid
git commit -m "feat: render sky-pattern background and toggle classes in theme.liquid"
```

---

### Task 5: Manuelle QA — Theme-Editor-Settings

**Files:** (kein Code-Edit, nur Verifikation)

- [ ] **Step 1: Color-Picker testen**

Im Theme-Editor: `Hintergrund → Icon-Farbe` auf `#7c3aed` (Purple) setzen. Storefront refreshen.

Expected: Icons im Background-Pattern sind jetzt purple statt blau. Live-Preview im Editor reagiert auf den Picker.

- [ ] **Step 2: Wieder zurück auf `#0E7CB4`**

Color zurücksetzen auf den Default-Wert.

- [ ] **Step 3: Opacity-Slider testen**

`Hintergrund → Transparenz` auf `10%` setzen → Icons fast unsichtbar. Auf `60%` setzen → Icons deutlich präsenter.

Expected: Slider-Bewegung verändert die Sichtbarkeit der Icons sichtbar.

- [ ] **Step 4: Default zurücksetzen (40%)**

- [ ] **Step 5: Parallax-Toggle Desktop**

`Hintergrund → Parallax-Effekt` aktivieren. Auf der Storefront scrollen.

Expected (Desktop Chrome/Safari/Firefox): Hintergrund-Pattern bleibt fix beim Scrollen stehen (Content scrollt drüber).

- [ ] **Step 6: Parallax-Toggle Mobile-Simulation**

In Chrome DevTools Device-Toolbar auf "iPhone 14 Pro" stellen, neu laden, scrollen.

Expected: Pattern scrollt mit dem Content (iOS ignoriert `background-attachment: fixed` — bewusst). Kein Stottern, keine Layout-Shifts.

- [ ] **Step 7: Parallax aus**

Parallax wieder ausschalten.

- [ ] **Step 8: Tile-Naht prüfen bei großem Viewport**

Browser-Fenster auf ≥1920×1080 vergrößern. Lange Seite (z.B. eine Collection mit vielen Produkten oder Homepage) durchscrollen.

Expected: Keine sichtbaren rechteckigen Tile-Grenzen. Keine zerschnittenen Icons mitten in der Seite. Am rechten/unteren Viewport-Rand dürfen Icons abgeschnitten sein (das ist gewollt).

- [ ] **Step 9: Bestehende Sektionen mit eigenem Hintergrund**

Eine Seite mit Hero-Slider, Featured-Collection (weiße Cards), und Footer öffnen.

Expected: Hero-Image-Section verdeckt den Sternenhimmel komplett. Weiße Card-Sektionen verdecken ihn ebenfalls. Sternenhimmel ist nur in den "neutralen" Bereichen zwischen Sektionen sichtbar.

---

### Task 6: Performance-Smoketest

**Files:** (keine Code-Edits)

- [ ] **Step 1: Lighthouse vorher (falls noch nicht geschehen, vergleichen mit Baseline)**

In Chrome DevTools → Lighthouse → "Performance" → Mobile Run. Score notieren.

Falls Baseline nicht verfügbar: Sky-Toggle aus, Run, Score notieren.

- [ ] **Step 2: Lighthouse nachher (Sky aktiv)**

Sky-Toggle ein, gleiche Seite, Run.

Expected: Performance-Score-Differenz ≤2 Punkte. Kein neuer "Avoid large layout shifts"-Warning. Kein neuer "Reduce unused CSS"-Warning für die gebauten Styles.

- [ ] **Step 3: Bildgröße der Inline-Data-URI prüfen**

In den DevTools im Network-Tab den HTML-Response der Homepage öffnen, im Response-Body den `<style>`-Block mit `url("data:image/svg+xml,...")` finden. Länge der Data-URI grob messen (Zeichen-Count).

Expected: <8KB inline. Falls deutlich größer: SVG-Template auf unnötige Whitespaces/Kommentare prüfen.

- [ ] **Step 4: Wenn alles passt, finaler Commit**

Falls aus Step 1–3 noch keine Änderungen committed sind:

```bash
git status   # sollte clean sein
```

Falls clean: kein zusätzlicher Commit nötig — Plan abgeschlossen.

---

## Erfolgskriterium

Plan ist abgeschlossen, wenn:
- Sky-Pattern im Default-Zustand auf jeder Seite sichtbar ist (außer in Sektionen mit eigenem Hintergrund)
- Alle 4 Theme-Settings funktionieren wie beschrieben
- Lighthouse-Performance-Score nicht spürbar gefallen ist
- Auf Mobile keine Stottern/Layout-Shifts sichtbar sind
- Alle Tasks committed sind und `git status` clean ist
