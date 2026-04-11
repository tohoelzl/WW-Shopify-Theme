# Tetris Grid Section — Design Spec

## Overview

A new Shopify OS 2.0 section (`tetris-grid.liquid`) that displays products or collections in a visually dynamic "Tetris-style" grid layout. Rows alternate between two height patterns, creating an engaging visual rhythm on desktop while falling back to a standard grid on mobile.

## Layout Concept

4 columns on desktop, with alternating height patterns per row:

- **Pattern "outside_tall"**: Left and right cards are 1.5× taller, middle two cards are normal height
- **Pattern "center_tall"**: Middle two cards are 1.5× taller, left and right cards are normal height

### Vertical Alignment (automatic, based on row position)

The alignment is calculated automatically — no manual setting needed:

| Row Position | Alignment | Behavior |
|---|---|---|
| Only 1 row | `align-items: center` | Centered vertically |
| First row | `align-items: start` | Top edge flush, tall cards extend downward |
| Last row | `align-items: end` | Bottom edge flush, tall cards extend upward |
| Middle rows | `align-items: center` | All cards centered vertically |

### Aspect Ratios

- Normal card: `aspect-ratio: 1/1` (square)
- Tall card: `aspect-ratio: 2/3` (approximately 1.5× height of square)

### Mobile (< 1024px)

- 2 columns
- All cards same height: `aspect-ratio: 1/1`
- No height variation — standard uniform grid
- Gap: same as current featured-collection sections

## Section Architecture

### Section Settings

| Setting | Type | Default | Description |
|---|---|---|---|
| `heading` | text | (empty) | Optional section heading above all rows |
| `padding_top` | range (0-100) | 40 | Top padding in px |
| `padding_bottom` | range (0-100) | 40 | Bottom padding in px |

### Blocks (type: "row")

Each block represents one row in the grid.

| Setting | Type | Default | Description |
|---|---|---|---|
| `pattern` | select | `outside_tall` | Height pattern: `outside_tall` or `center_tall` |
| `collection` | collection | (none) | Source collection for products/categories |
| `display_type` | select | `products` | Display as `products` or `categories` |
| `row_title` | text | (empty) | Optional title displayed above this row |
| `products_count` | range (4-4) | 4 | Fixed at 4 (matches 4-column grid) |

**Block limit:** 16 (Shopify max), allowing up to 16 rows.

## Card Rendering

### Product cards (`display_type: products`)

Uses existing `snippets/product-card.liquid`:
- Product image (square on mobile, square or 2:3 on desktop depending on position)
- Vendor
- Product title
- Price (inkl. MwSt.)
- Hover effects (image scale, secondary image reveal)

### Category cards (`display_type: categories`)

Uses existing category card pattern from `category-grid.liquid`:
- Collection featured image as background
- Rounded corners (`rounded-xl`)
- Title overlay at bottom
- Hover scale effect on image

## CSS Implementation

Uses CSS Grid with Tailwind utility classes where possible, custom styles for the height logic:

```css
/* Desktop grid */
.tetris-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem; /* lg:gap-5 */
}

/* Tall card aspect ratio */
.tetris-row .card-tall {
  aspect-ratio: 2/3;
}

/* Normal card aspect ratio */
.tetris-row .card-normal {
  aspect-ratio: 1/1;
}

/* Alignment per position */
.tetris-row--first { align-items: start; }
.tetris-row--middle { align-items: center; }
.tetris-row--last { align-items: end; }
.tetris-row--only { align-items: center; }
```

Mobile override:
```css
@media (max-width: 1023px) {
  .tetris-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  .tetris-row .card-tall,
  .tetris-row .card-normal {
    aspect-ratio: 1/1;
  }
}
```

## Row Title

- Displayed above each row if `row_title` is set
- Styled consistent with existing section headings (font-heading, appropriate size)
- Left-aligned (matching existing section heading style)

## Continuation Rows (same collection, no title)

If multiple consecutive rows use the same collection without a title between them, products continue from where the previous row left off. Implementation:
- Track product offset via Liquid `forloop` across blocks with same collection handle
- Skip products already shown in previous rows of the same collection

## File Structure

- `sections/tetris-grid.liquid` — Main section file with schema, Liquid logic, and inline styles
- No new snippets needed (reuses `product-card.liquid` and category card markup)

## Integration

Replace or supplement existing homepage sections (category-grid, featured-collection, featured-collection-2) by adding `tetris-grid` section in `templates/index.json`. Existing sections remain available for other pages.
