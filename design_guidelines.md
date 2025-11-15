# Design Guidelines: Prompt Imagination Studio

## Design Approach
**Reference-Based Design** inspired by Google TextFX aesthetic with creative productivity influences from Linear and Notion. The design emphasizes creative exploration through clean, card-based interfaces with purposeful color differentiation between modes.

## Layout System

**Primary Grid Structure:**
- Spacing units: Tailwind `4, 6, 8, 12, 16, 24` for consistent rhythm
- Container: `max-w-7xl mx-auto px-6 md:px-8`
- Vertical sections: `py-8 md:py-12` for breathing room

**Page Structure:**
- Top: Mode switching cards (horizontal layout, 2 cards side-by-side)
- Main content split: 40% left (title/description), 60% right (input area)
- Below: Full-width output card grid (responsive columns)

## Typography

**Font Stack:**
- Primary: `Inter` or `DM Sans` from Google Fonts (clean, modern sans-serif)
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

**Hierarchy:**
- Page titles: `text-5xl md:text-6xl font-bold` (large, impactful)
- Mode titles: `text-3xl md:text-4xl font-bold`
- Subtitles: `text-lg md:text-xl font-medium opacity-80`
- Card headings: `text-xl font-semibold`
- Body text: `text-base` (16px)
- Helper text: `text-sm opacity-70`

## Component Library

**Mode Switching Cards (Top):**
- Two horizontal cards with clear visual distinction
- Active state: Bold border (3-4px), elevated shadow, vibrant accent color
- Inactive state: Subtle border (1px), muted colors, hover effect with gentle lift
- Size: Equal width distribution, `h-24 md:h-28`
- Content: Icon or emoji + mode name in bold

**Input Areas:**
- Large textarea: `min-h-32 md:min-h-40` with subtle border, rounded corners `rounded-lg`
- Single-line inputs: `h-12` with consistent styling
- Placeholder text: Italic, opacity 50%
- Temperature/Divergence control: Segmented button group (High/Medium/Low) or minimal slider
- Run button: Large, prominent, full corner radius `rounded-full`, bold text, px-8 py-3

**Output Cards:**
- Grid layout: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Card styling: White/light background, `rounded-xl`, soft shadow `shadow-lg`, padding `p-6`
- Card structure:
  - Magic Word: Large, colored badge or pill at top
  - Explanation: Regular text, 2-3 lines
  - Example snippet: Code-style background `bg-gray-50`, monospace font, `p-4 rounded-lg`
  - Copy button: Small, corner positioned or bottom-right, icon + text
- Tension Seeds: Similar card with seed sentence as heading + bulleted follow-up questions

**Visual Elements:**
- Borders: Soft, `border border-gray-200` or with accent colors for active states
- Shadows: Layered approach - subtle default `shadow-md`, elevated on hover/active `shadow-xl`
- Corners: Generous rounding - `rounded-lg` (8px) for inputs, `rounded-xl` (12px) for cards
- Spacing within cards: `space-y-4` for vertical stacking

## Color Strategy

**Mode-Specific Palettes (inspired by TextFX):**
- Magic Word Atelier: Green theme family (sage, mint, forest accents)
  - Primary: Vibrant green for active states, buttons
  - Background: Soft mint/sage tones for mode card
  - Accents: Forest green for magic word badges
  
- Tension Seeds Studio: Purple/violet theme family
  - Primary: Rich purple for active states, buttons
  - Background: Soft lavender tones for mode card
  - Accents: Deep violet for seed headings

**Neutral Foundation:**
- Base backgrounds: White or very light gray `bg-gray-50`
- Text: Dark gray `text-gray-900` with opacity variations
- Borders: Light gray `border-gray-200`

## Interaction Design

**Mode Switching:**
- Instant content swap (no page reload)
- Smooth fade transition for main content area (200-300ms)
- Update all sections: title, description, input fields, output area

**Copy Functionality:**
- Button state feedback: Text changes to "Copied!" with checkmark icon
- Subtle success color flash
- Returns to default after 2 seconds

**Run Button:**
- Loading state: Spinner icon, disabled appearance, "Generating..." text
- Success: Brief highlight before showing results
- Clear old results before showing new ones

## Images

**No hero images required** - this is a focused tool interface. Visual interest comes from:
- Mode-specific color themes creating distinct zones
- Card-based layouts with varied content
- Emoji or simple icons for mode identification
- Clean, purposeful whitespace

## Accessibility
- Maintain color contrast ratios of 4.5:1 minimum
- Focus states: Visible outline with offset for all interactive elements
- Keyboard navigation: Tab through mode cards, inputs, buttons, copy actions
- ARIA labels for icon-only buttons