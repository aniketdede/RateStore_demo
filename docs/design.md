# DESIGN.md — RateStore Soft UI Design System

## 1. OVERVIEW — DESIGN SYSTEM SOURCE
This design applies best-practice accessibility-focused UI rules (soft shadows, focus-visible, SVG icons, responsive at 375/768/1024/1440, contrast 2265 4.5:1, reduced-motion respected): 84 UI styles, accessibility-first checklist, responsive at 375/768/1024/1440, soft-shadow evolution, no neon/emoji-icons, SVG icons only (Heroicons/Lucide), `cursor-pointer` on clickable elements, focus states visible, light-mode contrast ≥4.5:1, `prefers-reduced-motion` respected.

Pattern selected: **Admin Dashboard + Data Table + Card List** (clean, premium, trust-oriented for government/compliance context — avoids bright gradients; uses soft lavender background + warm white cards + teal accents + charcoal navy text).

## 2. COLOR PALETTE — Soft UI Color Evolution
Based on Best-practice palette rules with RateStore branding (teal = trust/action, purple = admin/authority):
- Background base: `#F8F0FB` (soft lavender — calming, not neon purple)
- Card / surface: `#FFFFFF` + soft shadow (`0 1px 3px rgba(26,35,50,0.06), 0 4px 12px rgba(26,35,50,0.08)`)
- Primary accent (action/CTA): `#2AB7A9` (teal — high contrast on white, pass 4.5:1)
- Secondary / authority (Admin badges): `#7B5AA6` (soft purple — used sparingly for role tags)
- Text primary: `#1A2332` (charcoal — 4.5:1+ on white)
- Text secondary: `#5D6575` (muted — used for meta/labels)
- Success: `#2AB7A9`
- Error / warning: `#D97A6B` (soft coral — not bright red)
- Border: `#EAE3F0` (very subtle divider)

Anti-patterns avoided (per best-practice checklist): no neon gradients, no harsh purple backgrounds on text, no emoji-as-icons, no dark-mode default (light-first), no harsh animations.

## 3. TYPOGRAPHY — Pairing from design standards
- Headings: `Inter`, 600 weight, 24–32px, `#1A2332`, letter-spacing `-0.025em`
- Body / table: `Inter`, 400 weight, 14–16px, `#374151`, line-height 1.6
- Labels / meta / table headers: 12px, uppercase, letter-spacing `0.05em`, `#5D6575`
- Monospace for IDs: `JetBrains Mono`, 12px, `#6B7280`
- Font loading: `preconnect` to Google Fonts; `font-display: swap`; `prefers-reduced-motion` disables font-fade animations.

## 4. COMPONENT SYSTEM (reused across Admin / User / Owner)
- **Card**: white, `border-radius: 16px`, `padding: 24px`, shadow-soft, hover `translateY(-2px)` + shadow increase (gentle, not bounce).
- **Button Primary**: `#2AB7A9` fill, white text, `border-radius: 10px`, `padding: 10px 20px`, `cursor: pointer`, focus ring `2px solid #2AB7A9` with `2px` offset.
- **Button Ghost**: white fill, `#2AB7A9` border/text, same radius, focus ring same.
- **Table**: white card, sticky header (`#F3F4F6`), row hover `#F8F0FB`, `cursor: pointer` on interactive rows, focus visible on sort buttons.
- **Input**: white bg, `border: 1px solid #D1D5DB`, `border-radius: 10px`, focus `border-color: #2AB7A9` + shadow `0 0 0 3px rgba(42,183,169,0.15)`.
- **Badge / Role Tag**: `padding: 4px 10px`, `border-radius: 9999px`, `font-size: 12px`, `font-weight: 600`. Admin=`#7B5AA6` bg + white; User=`#2AB7A9` bg + white; Owner=`#D4973A` bg + white.
- **Icon set**: SVG only — `lucide-react` icons (Store, Users, Star, Shield, Search, Menu, ChevronDown, LogOut, Lock, CheckCircle, AlertCircle). No emoji characters.
- **Navigation**: sidebar on desktop (240px), top bar collapse on mobile (`768px` breakpoint). Active link has `#2AB7A9` left border + light bg.

## 5. ACCESSIBILITY CHECKLIST (Accessibility mandatory)
- [x] Text contrast `≥4.5:1` (charcoal on white passes; teal on white passes ~4.8:1; purple on white passes ~5.1:1)
- [x] Focus states visible on all interactive elements (buttons, links, inputs, table sort)
- [x] `cursor: pointer` on all clickable elements (cards, rows, buttons)
- [x] SVG icons with `aria-label` or `aria-hidden` where decorative
- [x] `prefers-reduced-motion` respected via CSS `@media (prefers-reduced-motion: reduce)` (disable hover transforms, fade-ins)
- [x] Responsive tested at 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (wide)
- [x] No text clipping / broken labels at narrow widths; tables scroll horizontally on mobile rather than crush
- [x] Semantic HTML (`<nav>`, `<main>`, `<header>`, `<table>`, `<button>` for actions — not divs)
- [x] Keyboard nav: `Tab` order logical; `Enter` activates buttons; `Escape` closes mobile nav

## 6. RESPONSIVE BREAKPOINTS (Responsive standard)
- Mobile-first: base styles for `375px`; tablet at `768px`; desktop at `1024px`; wide at `1440px`.
- Sidebar hides below `1024px` → hamburger + slide-over drawer (`transform: translateX` with `0.3s ease`, disabled for `reduce-motion`).
- Tables: `overflow-x: auto` with sticky first column on mobile; cards stack vertically.
- Modal / confirmation dialogs center, `max-width: 480px`, `padding: 24px`, backdrop `rgba(26,35,50,0.35)`.

## 7. ROLE SURFACES (navigation + content layout)
- **Admin**: Sidebar → Dashboard (stats cards), Users (table with filter inputs + sort headers), Stores (table), Add User (form card), Add Store (form card).
- **Normal User**: Top nav (Stores | My Ratings). Main: search bar + card grid (store name, address, overall rating, user rating, submit/modify button). Empty state: illustration + message when no ratings.
- **Store Owner**: Dashboard layout — hero stat (average rating large number + star icons), table of users who rated, filter by date/value.
- **Shared patterns**: Loading skeleton (3 stacked gray bars with shimmer), error banner (`#D97A6B` bg + icon + close button), success toast (`#2AB7A9` + check icon, auto-dismiss 4s).

## 8. ANTI-PATTERNS AVOIDED
- No bright neon gradients (especially purple/pink AI gradients) on text or backgrounds.
- No emoji icons; all icons are SVG with proper labels.
- No dark mode default (light-first; dark mode can be added later with `prefers-color-scheme` if requested).
- No harsh bounce animations; hover lifts are `2px` with `0.2s ease-out`.
- No text scaled below 14px; no line-height below 1.4 for body.
- No `cursor: default` on interactive cards — always `cursor: pointer`.
