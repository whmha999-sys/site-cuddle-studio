# Plan: Floating "back to top" button

Add a small floating button that scrolls the page to the top.

## Behavior
- Hidden until the user scrolls more than ~400px down
- Fades in smoothly when shown
- On click: smooth-scrolls the window to the very top
- Visible on every page (Home, PDP, all info pages)

## Style & position
- Bottom-right corner, fixed
- Round 44px circle, Teclast orange `#e8590c` (matches new footer)
- White up-arrow icon (`ChevronUp` from lucide-react)
- Subtle shadow + hover lift
- Stacked **above** the existing EN/AR tweaks button so they don't overlap
- Mirrored to bottom-left in RTL (Arabic) using `insetInlineEnd` so it stays on the natural "end" side

## Implementation
- New component `src/storefront/back-to-top.jsx` — self-contained: scroll listener with `useEffect`, local `visible` state, click handler that calls `window.scrollTo({ top: 0, behavior: 'smooth' })`
- Render once inside `StorefrontApp.jsx` next to the existing floating tweaks button
- Adjust the existing tweaks button's `bottom` from `16px` → `68px` (or place back-to-top above it) so the two stack neatly with ~12px gap

No backend, no routing, no other components touched.
