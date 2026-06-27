# TODO - Zaiqa Junction menu fixes

## Phase 1: Understand & align
- [x] Inspect current menu rendering (ProductCard / MenuBrowser)
- [x] Inspect current image resolution (lib/visuals.ts)
- [x] Inspect current customization modal (AddToCartSheet)
- [x] Inspect cart model constraints (CartProvider / types)

## Phase 2: Data model + variant consolidation (single entry per product)
- [ ] Extend `MenuItem` type to support option groups (e.g., Half/Full, 3-6-12 pcs, etc.) and hint badge text
- [ ] Refactor `lib/data.ts` to remove duplicate entries:
  - Nuggets: consolidate into one entry with 3/6/12 options
  - Tempura Nuggets: consolidate into one entry with 4/8 options
  - Handi/Karahi: consolidate into one entry with Half/Full options
  - Pasta: consolidate into one entry with Half/Full options
  - Wings, Strips: consolidate into one entry with piece-count options
- [ ] Update any deal references / seed order references to the new consolidated item ids

## Phase 3: UI updates
- [ ] Update `components/product-card.tsx`:
  - Show base price (lowest option)
  - Show hint badge text when options exist
  - Ensure Add opens modal for options
- [ ] Update `components/add-to-cart-sheet.tsx`:
  - Replace hardcoded Half/Full logic with generic option-group UI
  - Dynamic unit price update based on selected option

## Phase 4: Image correctness
- [ ] Replace `lib/visuals.ts` regex rules with explicit `item.id` → correct `public/images/menu/*.webp` mappings
- [ ] Add/assign composite deal images for Deal 649 and Deal 2899
- [ ] Ensure all affected items use distinct images (no duplicates on same viewport adjacency)

## Phase 5: Adjacency rule (no same image adjacent in menu grid)
- [ ] Update `components/menu-browser.tsx` to reorder visible items to avoid adjacent equal image src

## Phase 6: Verification
- [ ] Run lint/build
- [ ] Manual checks on /menu:
  - Options badges show correctly
  - Modal reveals correct quantity/options selectors and prices update
  - No adjacent repeated images
  - Deals show composite images

