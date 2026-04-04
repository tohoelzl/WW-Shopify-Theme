# Homepage Redesign — Conversion-First mit Brand-Story

**Datum:** 2026-04-04
**Ansatz:** Conversion-First (Ansatz A)
**Ziel:** SEO-optimierte, conversion-fokussierte Homepage mit Slide Design Brand-Story als Vertrauens-Verstärker

---

## Kontext

Die aktuelle Homepage hat 11 Sections mit mehreren Problemen:
- Kein H1-Tag (schlecht für SEO)
- Trust-Badges ganz unten statt above the fold
- Video-Hero (langsam, schlecht für Core Web Vitals)
- 4x redundante Category-Highlights
- Bento-Grid ohne klaren Fokus
- Kein SEO-Textblock
- Keine strukturierten Daten (Organization, WebSite Schema)
- Nachhaltigkeit/Brand-Story zu versteckt

Die neue Homepage reduziert auf 8 fokussierte Sections, basierend auf Best Practices von Westwing, IKEA, Wayfair, home24 und Connox.

---

## Finale Section-Struktur

### Section 1: Hero Banner
- **Typ:** Statisches Lifestyle-Bild (kein Video, kein Auto-Slider)
- **Inhalt:**
  - Subtitle über Headline: "100% Made in Italy" (grün, uppercase, letter-spacing)
  - **H1-Tag:** "Italienisches Design für dein Zuhause" (oder ähnlich — finaler Text bei Implementierung)
  - Beschreibungstext: Nachhaltige Möbel, Bio-Kunststoff, Designer
  - Primärer CTA: "Kollektion entdecken" → verlinkt auf Haupt-Collection
  - Sekundärer CTA: "Über Slide Design" → verlinkt auf Brand-Seite
- **Bild:** Lifestyle-Foto (Terrasse/Wohnzimmer mit Slide Design Möbeln)
- **Technisch:**
  - Kein Parallax-Effekt (Performance)
  - Responsive: Auf Mobile wird das Bild beschnitten, Text bleibt lesbar
  - Bild via Shopify Image API mit srcset für optimale Größen
  - Lazy Loading: NEIN (above the fold — eager loading)

### Section 2: Trust-Bar
- **Position:** Direkt unter Hero (above the fold auf Desktop)
- **Layout:** 4 USPs in einer Reihe (Desktop), 2x2 Grid (Mobile)
- **USPs:**
  1. 🇮🇹 Made in Italy — "Fabrik in Mailand"
  2. ♻️ 100% Recycelbar — "Bio-Polyethylen"
  3. 🚚 Kostenloser Versand — "Ab 150€ Bestellwert"
  4. ↩️ 30 Tage Rückgabe — "Kostenlos & einfach"
- **Styling:** Heller Hintergrund (#f8faf8), zentriert, Icons + Text
- **Technisch:** Icons als SVG (nicht Emojis — Emojis im Mockup waren Platzhalter), aus bestehendem icon.liquid Snippet

### Section 3: Kategorie-Grid
- **Layout:** 3 Kacheln nebeneinander (Desktop), 3er-Reihe oder gestapelt (Mobile)
- **Kategorien:**
  1. Sitzmöbel — "Stühle, Sessel & Hocker"
  2. Tische — "Esstische, Couchtische & Beistelltische"
  3. Leuchten — "Steh-, Tisch- & Hängeleuchten"
- **Design:**
  - Große Kacheln mit Collection-Bildern
  - Gradient-Overlay von unten (Text bleibt lesbar)
  - Kategorie-Name + Untertitel
  - Hover: leichter Zoom auf Bild
  - Jede Kachel verlinkt auf die jeweilige Collection
- **Heading:** H2 "Unsere Kategorien" mit Subtitle
- **Technisch:** Collections werden über Section-Settings ausgewählt (Shopify Collection Picker)

### Section 4: Featured Products (Bestseller)
- **Layout:** 4er-Grid (Desktop), 2er-Grid (Mobile)
- **Inhalt:**
  - H2 "Bestseller" mit Subtitle "Die beliebtesten Designs unserer Kunden"
  - "Alle ansehen →" Link zur Collection
  - Bis zu 8 Produkte (4 sichtbar, optional mehr)
  - Produktkarten: Bild, Titel, Preis (bestehendes product-card.liquid Snippet)
- **Collection:** Über Section-Setting auswählbar (z.B. "Bestseller" oder "Alle Produkte")
- **Technisch:** Nutzt bestehende featured-collection Section als Basis, wird überarbeitet

### Section 5: Brand-Story (Slide Design)
- **Layout:** Split — Bild links (50%), Text rechts (50%). Mobile: gestapelt
- **Inhalt:**
  - Subtitle: "Über die Marke" (grün, uppercase)
  - H2: "Slide Design — Seit 2002 aus Mailand"
  - Beschreibungstext: Gründer, Fabrik, Handwerkskunst + Innovation
  - 4 USP-Icons im 2x2 Grid:
    1. 🌱 Bio-Polyethylen — "Aus Zuckerrohr gewonnen"
    2. ♻️ 100% Recycelbar — "Null Schadstoffemissionen"
    3. 🎨 Star-Designer — "Karim Rashid, Marcel Wanders"
    4. ☀️ Indoor & Outdoor — "Wetterfest & UV-beständig"
  - CTA-Link: "Mehr über Slide Design →"
- **Bild:** Fabrik/Produktion oder Lifestyle-Bild
- **Technisch:** Neue Section (ersetzt bestehende storytelling.liquid)

### Section 6: Testimonials
- **Layout:** 3er-Grid (Desktop), horizontal scrollbar oder gestapelt (Mobile)
- **Kein Carousel** — alle Reviews sofort sichtbar
- **Inhalt pro Review:**
  - 5-Sterne-Rating
  - Zitat-Text
  - Name + Stadt
- **Heading:** H2 "Das sagen unsere Kunden" + Subtitle
- **Technisch:** Überarbeitete testimonials.liquid — Grid statt Splide.js Carousel

### Section 7: Newsletter
- **Layout:** Zentriert, volle Breite
- **Styling:** Dark Background (#1a1a2e), weißer Text — visueller Kontrast
- **Inhalt:**
  - H2: "10% Rabatt auf deine erste Bestellung"
  - Subtitle: "Melde dich an und erhalte exklusive Angebote, neue Designs und Einrichtungstipps."
  - E-Mail-Input + Submit-Button
  - Hinweis: "Kein Spam. Jederzeit abbestellbar."
- **Technisch:** Überarbeitete newsletter.liquid mit neuem Styling

### Section 8: SEO-Textblock (NEU)
- **Layout:** 2-Spalten-Text (Desktop), 1 Spalte (Mobile)
- **Inhalt:**
  - H2: "Nachhaltige Designmöbel online kaufen — Made in Italy"
  - Keyword-optimierter Fließtext (ca. 150-200 Wörter)
  - Tonalität: "Bei uns findest du..." (kein Markenname)
  - Keywords: nachhaltige Möbel, Designmöbel, Made in Italy, Bio-Kunststoff, Slide Design, Outdoor Möbel, recycelbar, Sitzmöbel, Tische, Leuchten
- **Styling:** Dezent (#fafafa Hintergrund), kleinere Schrift — informativ, nicht werbend
- **Technisch:** Neue Section (seo-text.liquid), Text über Shopify RichText-Setting editierbar

---

## SEO-Verbesserungen

### Heading-Hierarchie
- H1: Hero-Headline (genau 1x pro Seite)
- H2: Jede Section-Headline (Kategorien, Bestseller, Brand-Story, Testimonials, Newsletter, SEO-Text)
- H3: Innerhalb der Sections (Kategorie-Namen, Produkt-Titel)

### Strukturierte Daten (Schema Markup)
Neue Snippets für die Homepage:

1. **Organization Schema** — Firmenname, Logo, Kontakt, Social-Media-Profile
2. **WebSite Schema** — mit SearchAction für Google Sitelinks Search Box
3. **ItemList Schema** — für Featured Products (Bestseller)

### Meta Tags
- Twitter Card Tags ergänzen (twitter:card, twitter:title, twitter:description, twitter:image)
- Hreflang Tags für DE/EN (falls mehrsprachig aktiv)

### Interne Verlinkung
- Hero CTA → Haupt-Collection
- Kategorie-Kacheln → jeweilige Collections
- Featured Products → Produktseiten
- "Alle ansehen" → Collection-Seite
- Brand-Story CTA → About/Brand-Seite
- SEO-Text: natürliche Links zu Collections und Marken-Seite

---

## Was entfällt

| Aktuelle Section | Grund |
|---|---|
| category-bento | Ersetzt durch fokussiertes 3er Kategorie-Grid |
| category-highlight (4x) | Redundant — Kategorien jetzt im Grid |
| storytelling (fullbleed) | Ersetzt durch kompakte Brand-Story mit USP-Icons |
| trust-badges (unten) | Ersetzt durch Trust-Bar above the fold |
| hero-banner (Video/Slider) | Ersetzt durch statisches Bild (Performance) |

## Was bleibt (überarbeitet)

| Section | Änderung |
|---|---|
| featured-collection → Featured Products | Neues Heading, "Alle ansehen"-Link |
| testimonials | Grid statt Carousel |
| newsletter | Dark-Design, neues Styling |

## Was neu ist

| Section | Grund |
|---|---|
| Trust-Bar | Above the fold, nachweislich conversion-steigernd |
| Brand-Story (Split) | Kompakte Slide Design Präsentation mit USP-Icons |
| SEO-Textblock | Keyword-optimierter Content für Google |
| Organization Schema | Strukturierte Daten für Google Knowledge Panel |
| WebSite Schema | Sitelinks Search Box in Google |

---

## Technische Hinweise

### Performance
- Hero-Bild: eager loading (above the fold), alle anderen Bilder: lazy loading
- Kein Splide.js mehr auf Homepage (Testimonials = Grid statt Carousel) → weniger JS
- Statisches Hero-Bild statt Video → schnellere LCP (Largest Contentful Paint)
- Bilder via Shopify Image API mit responsive srcset

### Bestehende Infrastruktur nutzen
- Tailwind CSS (bestehend)
- Alpine.js (bestehend, für interaktive Elemente)
- product-card.liquid Snippet (bestehend, für Featured Products)
- icon.liquid Snippet (bestehend, für Trust-Bar und USP-Icons)
- image.liquid Snippet (bestehend, für responsive Bilder)

### Section-Settings
Alle Sections bekommen Shopify Section Settings für:
- Texte (Headings, Subtitles, Descriptions)
- Bilder (über Shopify Image Picker)
- Collections (über Shopify Collection Picker)
- Links (über Shopify URL Picker)
- Farben/Styling wo sinnvoll

### Mobile-First
- Alle Sections responsive designed
- Trust-Bar: 2x2 Grid auf Mobile
- Kategorie-Grid: 3 Kacheln bleiben (kleinere Bilder) oder vertikal gestapelt
- Featured Products: 2er-Grid
- Brand-Story: gestapelt (Bild oben, Text unten)
- Testimonials: gestapelt oder horizontal scrollbar
- SEO-Text: 1 Spalte

---

## Nicht im Scope

- Blog/Content-Marketing (nicht geplant)
- Mega-Menü Änderungen (explizit ausgeschlossen)
- Header/Footer Redesign (nur Homepage-Content)
- Neue Produktkarten-Designs (bestehende product-card.liquid wird genutzt)
- Mehrsprachigkeit (nur wenn bereits aktiv)
