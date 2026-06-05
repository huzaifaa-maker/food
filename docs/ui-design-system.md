# UI Design System

## Brand Feel

Premium, warm, direct-order focused, and trust-building. The site avoids a generic restaurant template by using real Zaiqa Junction food/menu photography and conversion language for a home-based kitchen.

## Color Tokens

| Token | Hex | Usage |
| --- | --- | --- |
| Charcoal | `#181411` | Header, hero overlays, premium CTA blocks |
| Ember | `#D94D1A` | Primary buttons, active states, highlights |
| Chilli | `#A9271C` | Badges, pricing accents, coupon emphasis |
| Saffron | `#F6A12A` | Stars, small premium highlights |
| Cream | `#FFF6EA` | Page backgrounds and warm surfaces |
| Parchment | `#F7E4C4` | Menu-inspired accents |
| Coriander | `#49775F` | WhatsApp and confirmation moments |

## Typography

- Display: Georgia-style serif for premium food headings.
- Interface: system sans-serif for fast rendering and clear mobile UI.
- No viewport-scaled font sizes; text sizes remain stable and responsive by layout.

## Components

- Buttons: 6px radius, strong contrast, icon-led where useful.
- Cards: 8px radius or less, used only for product/review/admin repeated items.
- Product cards: fixed image aspect ratios, popular badge, price chip, prep/spice metadata, add-to-cart button.
- Forms: 48px touch targets on mobile, clear labels, visible focus states.
- Sticky CTAs: mobile bottom bar with Order Now and WhatsApp.

## Performance Choices

- Next.js image optimization.
- Local compressed WhatsApp assets.
- Server-rendered page shells with client components only where interaction is needed.
- Demo data fallback avoids unnecessary backend calls during local development.
