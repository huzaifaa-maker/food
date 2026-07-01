# TODO - Digital Menu Refinement

## Step 1: Inspect current menu data & image mappings
- [x] Read `lib/data.ts` (categories, menuItems, deal fields, tea items)
- [x] Read `lib/visuals.ts` (resolveMenuImage mappings)
- [x] Read `components/deal-details-modal.tsx` (how deal badges render)

## Step 2: Implement requested UI/content changes
- [ ] Update category labeling/organization:
  - [ ] Rename Chapli Burgers → Chupli Burgers with Single/Double
  - [ ] Ensure Crunchy Burger section includes Crunchy Patty, Zinger, Double Decker
  - [ ] Ensure Wings section splits Masala Wings and Plain Baked Wings
- [ ] Fix images:
  - [ ] Milky Naan image mapping to `/images/menu/milky-naan.webp`
  - [ ] Wrap images replaced with correct product images (no Golden Nuggets)
  - [ ] Chunky Chicken image replaced with 12-piece chicken popcorn image
- [ ] Add new category `Tea Junction` with 4 teas (price, description, packaging visuals)
- [ ] Expand deal details for 649 and 2899:
  - [ ] Update handi quantity, appetizers, naans, drink volume (liters)
  - [ ] Ensure `free_items` matches manual text/images
- [ ] Consistency check: verify all modified items retain correct prices

## Step 3: Validate
- [ ] Run `npm run build` (or equivalent) and fix any TS errors
- [ ] Manually verify `/menu` and deal modal UI in browser

