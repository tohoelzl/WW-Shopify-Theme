# Sternenhimmel-Background — Design-Spec

**Datum:** 2026-04-30
**Status:** Brainstorming-Output, bereit für Implementation-Plan

## Ziel

Ein dezentes, "schwebendes" Möbel-Icon-Pattern als globaler Page-Background, das durch alle transparenten Sektionen sichtbar bleibt. Vermittelt Premium- und Möbel-Brand-Charakter ohne Content zu erschlagen.

## Visuelle Spezifikation

| Property | Wert |
|---|---|
| Farbe (Default) | `#0E7CB4` |
| Opacity (Default) | `0.4` |
| Icon-Stil | Hand-drawn / sketchy SVG, stroke-only |
| Stroke-Width | ~1.2 |
| Icon-Set | Stuhl, Tisch, Lampe, Sofa, Bett, Regal (6 Motive) |
| Größenbereich | 22–36px (gemischt für Tiefenwirkung) |
| Rotation | random ±45° pro Icon |
| Dichte | ~12 Icons pro 800×800 Tile |

## Architektur

### Tile-Pattern als Body-Background

Ein statisches SVG-Tile mit ~12 Möbel-Icons in fester Position, gemischten Größen und random Rotationen. Tile ist 800×800px (`viewBox`).

**Anforderungen ans Tile:**
- Kein Icon innerhalb des Tiles darf die Tile-Grenze überschreiten — Sicherheitsabstand mindestens 24px zum Rand
- Am Viewport-Rand dürfen Icons natürlich abgeschnitten werden (organischer Look) — nur tile-zu-tile darf nichts zerschnitten sein

### CSS-Anbindung via Liquid-Data-URI

Da SVG-Background-Images keine CSS-Custom-Properties empfangen, werden Farbe und Opacity zur Render-Zeit ins SVG injiziert und das Ergebnis als Data-URI ins `background-image` geschrieben. Das SVG-Template lebt als Liquid-Snippet (`snippets/sky-pattern-svg.liquid`) mit `__COLOR__`/`__OPACITY__` Platzhaltern.

Im `<head>` von `layout/theme.liquid`, nur wenn `settings.sky_enabled`:

```liquid
{% if settings.sky_enabled %}
  {% assign sky_color = settings.sky_color | default: '#0E7CB4' | replace: '#', '%23' %}
  {% assign sky_opacity = settings.sky_opacity | default: 40 | divided_by: 100.0 %}
  {%- capture sky_svg -%}{% render 'sky-pattern-svg' %}{%- endcapture -%}
  {% assign sky_svg = sky_svg | replace: '__COLOR__', sky_color | replace: '__OPACITY__', sky_opacity %}
  <style>
    body.has-sky-bg {
      background-image: url("data:image/svg+xml,{{ sky_svg | url_encode }}");
      background-repeat: repeat;
    }
  </style>
{% endif %}
```

Body-Klasse `has-sky-bg` wird ebenfalls nur bei `settings.sky_enabled` gesetzt.

### Parallax-Toggle

Wenn `settings.enable_background_parallax = true`:
- Body bekommt zusätzlich `has-sky-parallax`
- CSS: `background-attachment: fixed`
- iOS Safari ignoriert `fixed` automatisch und fällt auf normales Mitscrollen zurück — kein zusätzlicher JS- oder Mobile-Sonderfall nötig
- Bewusst kein JS-Parallax (Performance/Core Web Vitals priorisiert)

## Theme-Settings

Neue Sektion in `config/settings_schema.json`: **"Hintergrund"** (oder "Background")

| Setting | Type | Default | Beschreibung |
|---|---|---|---|
| `sky_enabled` | checkbox | `true` | Sternenhimmel-Hintergrund aktivieren |
| `sky_color` | color | `#0E7CB4` | Farbe der Möbel-Icons |
| `sky_opacity` | range (10–60, step 5) | `40` | Transparenz in % |
| `enable_background_parallax` | checkbox | `false` | Parallax-Effekt (Hintergrund bleibt beim Scrollen stehen) |

## Verhalten zu bestehenden Sektionen

Der Sternenhimmel ist ein Body-Background. Alle Sektionen mit eigenem Hintergrund (Hero-Image, weiße Cards, farbige Banner) überdecken ihn automatisch — **kein bestehender Code wird angefasst**. Sichtbar ist der Sternenhimmel nur in den "neutralen" Bereichen zwischen Sektionen, sowie in Sektionen ohne expliziten Hintergrund.

## Files

| Datei | Aktion |
|---|---|
| `snippets/sky-pattern-svg.liquid` | NEU — SVG-Tile-Template mit `__COLOR__`/`__OPACITY__` Platzhaltern |
| `layout/theme.liquid` | EDIT — Body-Class `has-sky-bg`/`has-sky-parallax` setzen, inline `<style>` mit Data-URI rendern (nur bei `sky_enabled`) |
| `config/settings_schema.json` | EDIT — neue "Hintergrund"-Sektion mit 4 Settings |
| `assets/application.css` | EDIT — Base-Regeln für `.has-sky-bg` (background-color etc.) und `.has-sky-parallax` (background-attachment: fixed) |

## Build-Reihenfolge

1. SVG-Tile zeichnen (`snippets/sky-pattern-svg.liquid`) — ~12 hand-drawn Möbel-Icons mit Sicherheitsabstand zum Rand, `__COLOR__`/`__OPACITY__` Platzhalter. Visuell verifizieren: keine zerschnittenen Icons an Tile-Grenzen.
2. Theme-Settings in `config/settings_schema.json` ergänzen.
3. CSS-Regeln für `.has-sky-bg` und `.has-sky-parallax` in `assets/application.css`.
4. `layout/theme.liquid` anpassen: Body-Class + inline-Style mit injiziertem SVG.
5. Manuelle QA im Shopify Theme-Editor (siehe Test-Plan).

## Test-Plan

- [ ] Master-Toggle aus → Hintergrund komplett weiß, kein Pattern
- [ ] Master-Toggle ein → Sternenhimmel sichtbar
- [ ] Color-Picker auf eine andere Farbe (z.B. `#7c3aed`) → Icons wechseln Farbe live
- [ ] Opacity-Slider 10/40/60 → sichtbare Transparenz-Änderung
- [ ] Parallax aus → Hintergrund scrollt mit Content
- [ ] Parallax ein (Desktop Chrome/Firefox/Safari) → Hintergrund bleibt fixiert
- [ ] Parallax ein (Mobile iOS) → Fallback auf Mitscrollen funktioniert ohne Fehler/Stottern
- [ ] Tile-Naht prüfen: bei großem Viewport (1920×1080+) sind keine sichtbaren Tile-Grenzen oder zerschnittene Icons sichtbar
- [ ] Hero-Section, Produktgalerie, weiße Card-Sektionen verdecken den Sternenhimmel korrekt
- [ ] Lighthouse Performance-Score auf Homepage bleibt unverändert oder besser

## Out of Scope

- Animation der Icons (Schweben, Drehen, Twinkle) — möglicher V2-Iteration
- JS-generiertes Pattern für "jeder Reload anders" — Tile bleibt statisch
- Mehrere Tile-Sets (Möbel-Stil-Wechsel, Tag/Nacht) — V2
- Per-Section-Toggles für Sichtbarkeit — V2 falls Bedarf
- Mobile-spezifisches Tile (kleinere Icons / weniger Dichte) — wird nur bei Bedarf nachgezogen

## Bekannte Trade-Offs

- **Statisches Tile**: gleiche Wiederholung bei jedem Reload. Bei sorgfältigem Tile-Design (zufällige Rotation, gemischte Größen, gute Verteilung) und 800×800 Tile-Größe in der Praxis nicht störend.
- **Liquid-Color-Injection**: das SVG-Template muss bei jedem Page-Render einmal verarbeitet werden. Vernachlässigbar gegenüber dem Caching-Vorteil eines kleinen Inline-SVG.
- **`background-attachment: fixed` auf Mobile**: wird ignoriert, das ist beabsichtigt — keine UX-Regression.
