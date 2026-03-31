# FAQ-System — Pflege-Anleitung

## Übersicht

Das FAQ-System basiert auf Shopify Metaobjects. Es erlaubt euch, individuelle FAQ-Sets für jede Kollektion, jedes Produkt und jede Seite zu erstellen und zu pflegen. Die FAQs werden automatisch als Accordion auf der jeweiligen Seite angezeigt und generieren Schema.org FAQPage Markup für bessere SEO (Rich Snippets in Google).

---

## Schritt 1: FAQ-Einträge erstellen

1. Gehe zu **Shopify Admin → Content → Metaobjects**
2. Klicke auf **"FAQ Entry"** (falls noch nicht vorhanden, wird dieser Typ beim Theme-Setup automatisch erstellt)
3. Klicke auf **"Eintrag hinzufügen"**
4. Fülle aus:
   - **Question:** Die Frage, z.B. *"Aus welchem Material bestehen eure Möbel?"*
   - **Answer:** Die Antwort im Rich-Text-Editor. Du kannst hier:
     - Fettdruck und Kursiv verwenden
     - Listen (Aufzählung oder nummeriert) einfügen
     - Links setzen
     - Absätze formatieren
5. Klicke auf **"Speichern"**
6. Wiederhole für alle Fragen, die du brauchst

> **Tipp:** Erstelle zuerst ALLE Fragen, die du brauchst. Danach bündelst du sie in FAQ-Sets.

---

## Schritt 2: FAQ-Set erstellen

1. Gehe zu **Shopify Admin → Content → Metaobjects**
2. Klicke auf **"FAQ Set"**
3. Klicke auf **"Eintrag hinzufügen"**
4. Fülle aus:
   - **Title:** Ein beschreibender Name, z.B. *"Biokunststoff-Möbel FAQ"* oder *"Stühle Kollektion FAQ"*
   - **Entries:** Klicke auf **"Metaobject auswählen"** und wähle die gewünschten FAQ-Einträge aus. Du kannst die Reihenfolge per Drag & Drop ändern.
5. Klicke auf **"Speichern"**

---

## Schritt 3: FAQ-Set zuweisen

### Auf einer Kollektion

1. Gehe zu **Shopify Admin → Produkte → Kollektionen**
2. Öffne die gewünschte Kollektion
3. Scrolle nach unten zum Bereich **"Metafields"**
4. Suche das Feld **"FAQ Set"** (`custom.faq_set`)
5. Klicke auf **"Metaobject auswählen"** und wähle das passende FAQ-Set
6. **Speichern**

### Auf einem Produkt

1. Gehe zu **Shopify Admin → Produkte**
2. Öffne das gewünschte Produkt
3. Scrolle nach unten zum Bereich **"Metafields"**
4. Suche das Feld **"FAQ Set"** (`custom.faq_set`)
5. Wähle das passende FAQ-Set
6. **Speichern**

### Auf einer Seite

1. Gehe zu **Shopify Admin → Onlineshop → Seiten**
2. Öffne die gewünschte Seite
3. Scrolle nach unten zum Bereich **"Metafields"**
4. Suche das Feld **"FAQ Set"** (`custom.faq_set`)
5. Wähle das passende FAQ-Set
6. **Speichern**

---

## FAQ-Set entfernen

Um ein FAQ-Set von einer Kollektion/Produkt/Seite zu entfernen:

1. Öffne die jeweilige Ressource im Admin
2. Im Metafield **"FAQ Set"** klicke auf das **"✕"** neben dem ausgewählten Set
3. **Speichern**

Die FAQs verschwinden sofort von der Seite.

---

## Beispiel-Struktur

```
FAQ Set: "Biokunststoff-Möbel FAQ"
├── Entry: "Aus welchem Material bestehen eure Möbel?"
│   └── "Unsere Möbel werden aus nachhaltigem Biokunststoff hergestellt..."
├── Entry: "Ist Biokunststoff genauso stabil wie herkömmlicher Kunststoff?"
│   └── "Ja, unser Biokunststoff ist mindestens genauso stabil..."
├── Entry: "Wie pflege ich Biokunststoff-Möbel?"
│   └── "Die Pflege ist denkbar einfach: Mit einem feuchten Tuch..."
└── Entry: "Wo werden die Möbel hergestellt?"
    └── "Alle unsere Möbel werden in Italien gefertigt..."

FAQ Set: "Versand & Retoure FAQ"
├── Entry: "Wie lange dauert die Lieferung?"
│   └── "Die Lieferzeit beträgt in der Regel 5-10 Werktage..."
├── Entry: "Ist der Versand kostenlos?"
│   └── "Ab einem Bestellwert von 150€ liefern wir kostenlos..."
└── Entry: "Wie funktioniert die Rückgabe?"
    └── "Du hast 30 Tage Zeit, deine Bestellung zurückzugeben..."
```

**Zuordnung:**
- Kollektion "Stühle" → FAQ Set "Biokunststoff-Möbel FAQ"
- Kollektion "Tische" → FAQ Set "Biokunststoff-Möbel FAQ" (gleiches Set wiederverwendbar!)
- Seite "Versand" → FAQ Set "Versand & Retoure FAQ"

---

## SEO-Vorteile

Wenn ein FAQ-Set zugewiesen ist, generiert das Theme automatisch:

1. **Schema.org FAQPage Markup** — Google kann die FAQs als Rich Snippet in den Suchergebnissen anzeigen
2. **Accordion UI** — Verbessert die Usability und hält Besucher länger auf der Seite
3. **Keyword-Abdeckung** — FAQ-Texte sind vollständig indexierbar und verbessern die thematische Relevanz

> **Hinweis:** Es kann einige Tage dauern, bis Google die Rich Snippets anzeigt. Du kannst den Status in der Google Search Console unter "Verbesserungen → FAQs" prüfen.

---

## Häufige Fragen zur FAQ-Pflege

**Kann ich ein FAQ-Set auf mehreren Seiten verwenden?**
Ja! Ein FAQ-Set kann auf beliebig vielen Kollektionen, Produkten und Seiten gleichzeitig referenziert werden.

**Was passiert, wenn ich einen FAQ-Eintrag ändere?**
Die Änderung wird sofort auf allen Seiten sichtbar, die diesen Eintrag (über ein FAQ-Set) verwenden.

**Kann ich die Reihenfolge der Fragen ändern?**
Ja, in der FAQ-Set Bearbeitung kannst du die Einträge per Drag & Drop umsortieren.

**Wie viele FAQ-Einträge kann ein Set haben?**
Es gibt kein technisches Limit, aber für die Usability empfehlen wir 3-8 Einträge pro Set.
