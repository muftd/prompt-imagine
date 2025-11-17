# Design Guidelines: Prompt Imagination Studio (提示词想象工作室)

## Design Approach
**Reference-Based Design** combining Figma's precision, Linear's sophistication, and Vercel's modern aesthetic. Dark mode priority creates a professional, high-end creative environment with glassmorphism effects and premium micro-interactions.

## Color System (Theme Configuration Applied)

**Dark Mode (Primary):**
- Background: `hsl(20 14% 4%)`
- Card: `hsl(20 14% 8%)` with glassmorphism overlay
- Primary Accent: `hsl(9 75% 61%)` (coral red for interactive elements)
- Foreground: `hsl(45 25% 91%)`
- Borders: `hsl(20 14% 15%)` with subtle transparency
- Input: `hsl(20 14% 18%)`

**Mode-Specific Themes:**
- Magic Word Atelier: Emerald green gradients (`from-emerald-500 to-teal-400`) with `hsl(147 79% 42%)` accents
- Tension Seeds Studio: Purple gradients (`from-purple-500 to-violet-400`) with `hsl(341 75% 51%)` accents

**Light Mode (Secondary):**
- Background: `hsl(0 0% 94.12%)`
- Card: `hsl(0 0% 98.82%)`
- Primary: `hsl(342 85% 53%)`

## Typography

**Font Stack:**
- Primary: Source Han Sans CN (思源黑体), system-ui fallback
- Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

**Hierarchy:**
- App Title: `text-4xl md:text-5xl font-bold tracking-tight`
- Mode Titles: `text-3xl md:text-4xl font-bold`
- Section Headers: `text-2xl font-semibold`
- Card Titles: `text-lg font-semibold`
- Body: `text-base leading-relaxed`
- Captions: `text-sm opacity-60`

## Layout System

**Spacing Units:** Tailwind `4, 6, 8, 12, 16, 24, 32`

**Container:** `max-w-7xl mx-auto px-6 md:px-12`

**Page Structure:**
- Header: App branding + mode switcher (sticky, `backdrop-blur-xl` glassmorphism)
- Content Grid: Two-column responsive (`grid md:grid-cols-5`)
  - Left Panel (2 cols): Mode info, input controls with gradient background panel
  - Right Panel (3 cols): Output cards grid
- Vertical rhythm: `py-12 md:py-16` between major sections

## Component Library

**Mode Switcher (Header):**
- Segmented control with pill-style active indicator
- Active state: Gradient background matching mode color, `shadow-lg` elevation
- Smooth slide animation (Framer Motion) for active indicator
- Size: `h-12` with `px-6` padding, `rounded-full`

**Input Panel (Left):**
- Glassmorphic container: `backdrop-blur-md bg-card/50 border border-border/40`
- Large textarea: `min-h-48 resize-none rounded-xl` with subtle inner shadow
- Temperature control: Three-segment pill buttons with smooth color transitions
- Primary action button: `h-14 px-8 rounded-xl` with mode-specific gradient, glow effect on hover
- Framer Motion: Gentle spring animations on input focus

**Output Cards (Right):**
- Grid: `grid grid-cols-1 lg:grid-cols-2 gap-6`
- Card design:
  - Glassmorphic: `backdrop-blur-sm bg-card/80 border border-border/30`
  - Corner radius: `rounded-2xl`
  - Padding: `p-6`
  - Shadows: Multi-layer with colored tint matching mode theme
  - Hover: Subtle lift (`translate-y-[-2px]`) with enhanced shadow

**Card Structure:**
- Magic Word: Gradient badge at top (`px-4 py-2 rounded-full text-sm font-semibold`)
- Explanation: Body text with `leading-relaxed`
- Code Example: `bg-muted/30 backdrop-blur-sm p-4 rounded-lg font-mono text-sm`
- Copy button: Icon button with state animation (ripple effect on click)

**Visual Effects:**
- Glassmorphism: `backdrop-blur-xl bg-opacity-[0.7]` with gradient overlays
- Shadows: Layered approach - `shadow-lg` default, `shadow-2xl` on elevation
- Borders: 1px with 30-40% opacity for depth
- Gradients: Subtle mesh gradients in mode panels and buttons

## Animations (Framer Motion)

**Page Transitions:**
- Mode switch: Crossfade content (300ms) with stagger on output cards
- Card entrance: Staggered fade-up (50ms delay between cards)

**Micro-interactions:**
- Button press: Scale down to 0.98 with spring physics
- Input focus: Glow ring animation expanding outward
- Copy action: Checkmark icon with bounce, background flash (green tint)
- Hover states: Smooth color/shadow transitions (200ms)

**Loading States:**
- Skeleton screens with shimmer effect for output cards
- Spinning gradient border on primary button during generation

## Accessibility

- Focus rings: `ring-2 ring-primary/50 ring-offset-2 ring-offset-background`
- Keyboard navigation: Full support with visible focus indicators
- ARIA labels: All icon-only buttons and interactive elements
- Contrast: Verified 4.5:1 minimum across all text

## Images

**No hero images** - Tool-focused interface relies on:
- Mode-specific gradient backgrounds in panels
- Abstract gradient mesh overlays for visual interest
- Icon system (Heroicons) for actions and states
- Emoji for mode identification in switcher

## Responsive Behavior

- Mobile: Single column, stacked layout, mode switcher becomes dropdown
- Tablet: Maintains grid but with adjusted ratios
- Desktop: Full two-panel experience with maximum visual impact
- Breakpoints: Standard Tailwind (sm, md, lg, xl)