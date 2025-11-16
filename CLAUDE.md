# CLAUDE.md - AI Assistant Guide for Prompt Imagination Studio

## Project Overview

**Prompt Imagination Studio (提示词想象工作室)** is a creative prompt ideation tool inspired by Google TextFX. It helps users generate "Magic Words" and "Tension Seeds" for AI prompt engineering. The application is fully localized in Chinese and serves as an "upstream flavor workbench" - users get inspiration and creative direction here before crafting full prompts in ChatGPT, Claude, or other AI tools.

**Key Concept:** This tool is NOT a full prompt builder. It's designed to spark creativity and provide starting points that users then develop into complete prompts in their AI tool of choice.

## Technology Stack

### Frontend
- **React 18.3** with TypeScript 5.6
- **Wouter 3.3** - Lightweight routing (React Router alternative)
- **TanStack Query 5.60** (React Query) - Server state management
- **React Hook Form 7.55** with **Zod 3.24** - Form validation
- **Shadcn UI** - Component library (New York style, 30+ components)
- **Tailwind CSS 3.4** with Tailwind CSS v4 (vite plugin)
- **Framer Motion 11.13** - Animations
- **Lucide React 0.453** - Icons

### Backend
- **Express.js 4.21** with TypeScript
- **OpenAI GPT-5** via Replit AI Integrations (no API key required)
- **Node.js 20** runtime
- **Drizzle ORM 0.39** with PostgreSQL support (minimal usage)

### Build Tools
- **Vite 5.4** - Frontend bundler with HMR
- **esbuild 0.25** - Server bundler
- **tsx 4.20** - TypeScript execution for development

### Deployment
- **Replit** hosting platform
- **PostgreSQL 16** available but not actively used
- Single port (5000) serves both API and frontend

## Project Structure

```
/home/user/prompt-imagine/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── magic-word-atelier.tsx      # Magic Words mode interface
│   │   │   ├── magic-word-card.tsx         # Individual magic word display
│   │   │   ├── tension-seeds-studio.tsx    # Tension Seeds mode interface
│   │   │   ├── tension-seed-card.tsx       # Individual tension seed display
│   │   │   ├── mode-card.tsx               # Mode switcher cards
│   │   │   ├── temperature-control.tsx     # Creativity level selector
│   │   │   └── ui/                         # Shadcn UI components (30+)
│   │   ├── pages/
│   │   │   ├── home.tsx                    # Main application page
│   │   │   └── not-found.tsx               # 404 page
│   │   ├── lib/
│   │   │   ├── queryClient.ts              # TanStack Query config + API helpers
│   │   │   └── utils.ts                    # Utility functions (cn helper)
│   │   ├── hooks/
│   │   │   ├── use-toast.ts                # Toast notifications
│   │   │   └── use-mobile.tsx              # Mobile breakpoint detection
│   │   ├── App.tsx                         # Root component, routing setup
│   │   ├── main.tsx                        # React entry point
│   │   └── index.css                       # Global styles, CSS variables, themes
│   ├── index.html                          # HTML entry point
│   └── public/                             # Static assets
│
├── server/                          # Backend Express application
│   ├── lib/
│   │   ├── openai.ts                       # OpenAI client configuration
│   │   └── prompts.ts                      # Prompt templates (Chinese content)
│   ├── index.ts                            # Express server entry point
│   ├── routes.ts                           # API endpoint definitions
│   ├── vite.ts                             # Vite dev server integration
│   └── storage.ts                          # In-memory storage (minimal usage)
│
├── shared/                          # Shared TypeScript types
│   └── schema.ts                           # Zod schemas and TypeScript types
│
├── attached_assets/                 # Static assets
├── package.json                     # Dependencies and scripts
├── vite.config.ts                   # Vite build configuration
├── tailwind.config.ts               # Tailwind theme configuration
├── tsconfig.json                    # TypeScript configuration
├── drizzle.config.ts                # Drizzle ORM configuration
├── components.json                  # Shadcn UI configuration
├── design_guidelines.md             # Design system documentation
└── replit.md                        # Project documentation (Chinese)
```

## Key Entry Points

### Frontend Flow
1. `client/index.html` - Loads fonts (Inter, JetBrains Mono), sets Chinese locale
2. `client/src/main.tsx` - React root rendering with StrictMode
3. `client/src/App.tsx` - QueryClientProvider wrapper, Router setup
4. `client/src/pages/home.tsx` - Main application UI with mode switching

### Backend Flow
1. `server/index.ts` - Express app setup, middleware, error handling, port 5000
2. `server/routes.ts` - API endpoint registration (`/api/magic-words`, `/api/tension-seeds`)
3. `server/vite.ts` - Vite dev server (development) or static file serving (production)

## API Endpoints

### POST /api/magic-words
**Location:** `server/routes.ts:20`

Generates 3-5 "magic words" with explanations and example snippets.

**Request Schema:**
```typescript
{
  taskDescription: string;    // min 10 chars
  styleIntent?: string;       // optional
  temperature: "low" | "medium" | "high";
}
```

**Response Schema:**
```typescript
{
  magicWords: Array<{
    word: string;             // The magic word/phrase
    explanation: string;      // How it shapes AI output
    exampleSnippet: string;   // Example usage in a prompt
  }>;
}
```

**Implementation Notes:**
- Calls OpenAI GPT-5 with Chinese prompts
- Defensive parsing with fallback for malformed AI responses
- Filters valid items if partial data is salvageable
- Temperature affects creativity level in prompt template

### POST /api/tension-seeds
**Location:** `server/routes.ts:59`

Generates 3-5 provocative "tension seeds" with follow-up questions.

**Request Schema:**
```typescript
{
  theme: string;              // min 5 chars
  tensionAxes: string[];      // min 1 axis
  temperature: "low" | "medium" | "high";
}
```

**Response Schema:**
```typescript
{
  tensionSeeds: Array<{
    seedSentence: string;           // Provocative tweet-like statement
    followUpQuestions: string[];    // 2 questions for deeper exploration
  }>;
}
```

**Implementation Notes:**
- Tension axes create creative friction (e.g., "tradition vs innovation")
- AI generates Chinese content
- Same defensive parsing approach as magic words

## Core Components

### MagicWordAtelier
**Location:** `client/src/components/magic-word-atelier.tsx`

Main interface for Magic Words mode.

**Key Features:**
- React Hook Form with Zod validation
- Three fields: task description (required), style intent (optional), temperature
- TanStack Query mutation for API calls
- Renders `MagicWordCard` components in responsive grid
- Loading states and error handling
- Clears previous results before showing new ones

**Form Schema:** Defined in `shared/schema.ts` as `insertMagicWordRequestSchema`

### TensionSeedsStudio
**Location:** `client/src/components/tension-seeds-studio.tsx`

Main interface for Tension Seeds mode.

**Key Features:**
- Dynamic tension axes management (add/remove buttons)
- Theme input with validation
- Temperature control
- Renders `TensionSeedCard` components
- Minimum 1 tension axis required

**Form Schema:** Defined in `shared/schema.ts` as `insertTensionSeedRequestSchema`

### ModeCard
**Location:** `client/src/components/mode-card.tsx`

Mode switcher card component.

**Props:**
```typescript
{
  mode: "magic" | "tension";
  isActive: boolean;
  onClick: () => void;
}
```

**Styling:**
- Active state: 3px colored border, elevated shadow, vibrant accent
- Inactive state: subtle border, muted colors, hover effect
- Mode-specific colors from CSS variables

### TemperatureControl
**Location:** `client/src/components/temperature-control.tsx`

Three-level creativity selector (低/中等/高).

**Props:**
```typescript
{
  value: "low" | "medium" | "high";
  onChange: (value: "low" | "medium" | "high") => void;
}
```

**Behavior:**
- Segmented button group with Chinese labels
- Controls AI creativity level in prompt generation
- Low = conservative, High = highly creative

## Design System & Styling

### Color System
**Location:** `client/src/index.css`

**Mode-Specific Colors (TextFX-inspired):**

**Magic Words (Green Theme):**
```css
--magic: 145 65% 45%;              /* Light mode primary */
--magic-dark: 145 55% 55%;         /* Dark mode primary */
--magic-light: 145 50% 95%;        /* Light backgrounds */
--magic-foreground: 0 0% 100%;     /* Text on magic color */
```

**Tension Seeds (Purple/Violet Theme):**
```css
--tension: 270 65% 55%;            /* Light mode primary */
--tension-dark: 270 60% 65%;       /* Dark mode primary */
--tension-light: 270 40% 95%;      /* Light backgrounds */
--tension-foreground: 0 0% 100%;   /* Text on tension color */
```

### Typography
- **Primary Font:** Inter (Google Fonts)
- **Monospace:** JetBrains Mono
- **Mode Titles:** `text-4xl md:text-5xl font-bold`
- **Card Headings:** `text-xl font-semibold`
- **Body Text:** `text-base` (16px)

### Custom Utilities
**Location:** `client/src/index.css:100-120`

```css
.hover-elevate       /* Hover shadow effect */
.active-elevate      /* Active/selected shadow */
.toggle-elevate      /* Toggle button shadow */
```

### Layout Patterns
- **Container:** `max-w-7xl mx-auto px-6 md:px-8`
- **Output Grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Mode Cards:** Side-by-side on desktop, stacked on mobile
- **Main Split:** 40% left (title/description), 60% right (input/output)

## AI Prompt Architecture

### Prompt Templates
**Location:** `server/lib/prompts.ts`

**Key Functions:**

1. **getMagicWordPrompt(taskDescription, styleIntent, temperature)**
   - Returns system prompt for magic word generation
   - Temperature-specific guidance (low/medium/high creativity)
   - JSON response format specification
   - Chinese content generation instructions

2. **getTensionSeedPrompt(theme, tensionAxes, temperature)**
   - Returns system prompt for tension seed generation
   - Incorporates tension axes for creative friction
   - Tweet-like provocative statements
   - Follow-up questions for deeper exploration

**Temperature Behavior:**
- **Low:** Conservative, practical, proven terminology
- **Medium:** Balanced creativity and practicality
- **High:** Highly innovative, unconventional, boundary-pushing

**Important:** All prompts generate Chinese content. The AI is instructed to maintain cultural context and linguistic nuance.

## Development Workflows

### Running the Application

**Development Mode:**
```bash
npm run dev
```
- Starts Express server with tsx (TypeScript execution)
- Vite dev server integrated into Express
- Hot module replacement enabled
- Single port: http://localhost:5000
- API at `/api/*`, frontend at root

**Type Checking:**
```bash
npm run check
```
- Runs TypeScript compiler without emitting files
- Checks both client and server code

### Building for Production

```bash
npm run build
```

**Build Steps:**
1. Vite builds client → `dist/public/`
2. esbuild bundles server → `dist/index.js`
3. External packages not bundled

**Start Production Server:**
```bash
npm run start
```
- Runs `dist/index.js` with NODE_ENV=production
- Serves static files from `dist/public/`

### Database Operations

```bash
npm run db:push
```
- Pushes Drizzle schema to PostgreSQL
- Currently minimal database usage (mostly in-memory)

## Code Patterns & Conventions

### Type Safety
**Location:** `shared/schema.ts`

**Pattern:** Zod schemas define runtime validation AND generate TypeScript types.

```typescript
// Define Zod schema
export const insertMagicWordRequestSchema = z.object({
  taskDescription: z.string().min(10),
  styleIntent: z.string().optional(),
  temperature: z.enum(["low", "medium", "high"])
});

// Generate TypeScript type
export type InsertMagicWordRequest = z.infer<typeof insertMagicWordRequestSchema>;
```

**Benefits:**
- Single source of truth for types
- Runtime validation on API calls
- Type safety across client/server boundary
- Automatic validation error messages

### API Request Pattern
**Location:** `client/src/lib/queryClient.ts`

**Custom apiRequest Wrapper:**
```typescript
export async function apiRequest(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    // Handle errors
  }

  return response.json();
}
```

**Usage in Components:**
```typescript
const mutation = useMutation({
  mutationFn: (data: InsertMagicWordRequest) =>
    apiRequest('/api/magic-words', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
});
```

### Form Validation Pattern
**Location:** Example in `client/src/components/magic-word-atelier.tsx:30`

**React Hook Form + Zod Resolver:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm<InsertMagicWordRequest>({
  resolver: zodResolver(insertMagicWordRequestSchema),
  defaultValues: {
    taskDescription: '',
    styleIntent: '',
    temperature: 'medium',
  },
});
```

**Benefits:**
- Type-safe form values
- Automatic validation
- Error messages from Zod schema
- Integration with Shadcn UI Form components

### Component Style Pattern
**Location:** `client/src/lib/utils.ts`

**cn() Utility for Class Merging:**
```typescript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage:**
```typescript
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className // Allow prop override
)} />
```

### Error Handling Pattern
**Location:** `server/routes.ts:35` (example)

**Defensive AI Response Parsing:**
```typescript
// Try to salvage partial data even if AI response is malformed
let validWords = [];
try {
  const parsed = JSON.parse(aiResponse);
  validWords = parsed.magicWords.filter(word =>
    word.word && word.explanation && word.exampleSnippet
  );
} catch (error) {
  // Fallback: try to extract any valid JSON fragments
}

if (validWords.length === 0) {
  throw new Error('No valid magic words generated');
}
```

## Important Notes for AI Assistants

### Language & Localization
- **All UI text is in Chinese** - maintain consistency when adding features
- **AI-generated content is Chinese** - prompts must specify Chinese output
- **Comments can be English** - code comments don't need translation
- **User-facing strings must be Chinese** - buttons, labels, placeholders, errors

### When Adding Features

1. **Define Zod Schema First**
   - Add to `shared/schema.ts`
   - Generate TypeScript type with `z.infer`
   - Use for both client and server validation

2. **Follow Component Patterns**
   - Use Shadcn UI components from `client/src/components/ui/`
   - Use `cn()` utility for className merging
   - Implement loading states and error handling
   - Use TanStack Query for API calls

3. **Maintain Mode-Specific Theming**
   - Magic Words uses green (`--magic` CSS variable)
   - Tension Seeds uses purple (`--tension` CSS variable)
   - Apply to buttons, borders, highlights, badges

4. **API Endpoint Checklist**
   - Add to `server/routes.ts`
   - Create Zod schema in `shared/schema.ts`
   - Implement defensive parsing for AI responses
   - Add error handling and validation
   - Update this documentation

### Code Style Preferences

**Component Structure:**
```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces (if not in shared)
interface ComponentProps {
  value: string;
  onChange: (value: string) => void;
}

// 3. Component
export function Component({ value, onChange }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState();

  // 5. Event handlers
  const handleClick = () => {
    // ...
  };

  // 6. Render
  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

**File Naming:**
- Components: `kebab-case.tsx` (e.g., `magic-word-card.tsx`)
- Utilities: `kebab-case.ts` (e.g., `query-client.ts`)
- Pages: `kebab-case.tsx` (e.g., `not-found.tsx`)

**Import Aliases:**
- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

### Testing Considerations

**Current State:**
- No test suite implemented yet
- Manual testing in browser

**When Adding Tests:**
- Consider using Vitest (aligned with Vite)
- Test API endpoints independently
- Test component rendering and interactions
- Mock OpenAI API calls to avoid costs

### Performance Considerations

1. **AI API Calls:**
   - Only called on explicit user action (button click)
   - Show loading state during generation
   - Handle timeouts gracefully

2. **Bundle Size:**
   - Shadcn UI components are tree-shakeable
   - Import only needed Radix UI primitives
   - Code splitting via Vite automatic

3. **State Management:**
   - Use TanStack Query for server state
   - Local useState for UI state
   - No global state management needed (app is simple)

### Security Notes

**OpenAI Integration:**
- Uses Replit AI Integrations service
- API key managed by Replit (not in code)
- Environment variables: `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY`

**User Input Validation:**
- All inputs validated with Zod schemas
- Min/max length constraints enforced
- No SQL injection risk (using ORM)
- No XSS risk (React escapes by default)

**Session Management:**
- Minimal session usage (template boilerplate)
- Memory store for sessions (not production-ready for scale)
- No authentication required for current features

### Common Tasks

**Add a New Shadcn UI Component:**
```bash
npx shadcn-ui@latest add [component-name]
```
- Adds component to `client/src/components/ui/`
- Automatically configured for New York style
- May need to adjust Tailwind CSS variables

**Update Dependencies:**
```bash
npm update
```
- Check `package.json` for version constraints
- Test thoroughly after updates (especially React, Vite, TanStack Query)

**Add New API Endpoint:**
1. Define request/response schemas in `shared/schema.ts`
2. Add route handler in `server/routes.ts`
3. Register route in `server/routes.ts` export
4. Create API helper in `client/src/lib/queryClient.ts` (if needed)
5. Use in component with TanStack Query

**Modify AI Prompts:**
- Edit `server/lib/prompts.ts`
- Test with different temperature levels
- Ensure Chinese output is maintained
- Validate JSON structure in responses

### Debugging Tips

**API Issues:**
- Check Network tab for request/response
- Verify Zod schema validation errors
- Check server logs for OpenAI errors
- Test with lower temperature if responses are inconsistent

**Styling Issues:**
- Verify CSS variable values in browser DevTools
- Check Tailwind class compilation with build output
- Use browser's responsive mode for mobile testing
- Verify dark mode toggle works correctly

**Build Issues:**
- Clear `dist/` folder and rebuild
- Check TypeScript errors with `npm run check`
- Verify all imports use correct aliases
- Check for circular dependencies

## Recent Changes & History

**2025-01-15:**
- Initial implementation with Magic Word Atelier and Tension Seeds Studio
- Full Chinese localization (UI and AI-generated content)
- OpenAI GPT-5 integration via Replit AI Integrations
- Responsive design with dark mode support
- Copy-to-clipboard functionality for all generated content

**Known Limitations:**
- Database configured but not actively used
- No user authentication or accounts
- No persistence of generated content (session-based only)
- Limited to Chinese language output
- No rate limiting on API calls

## Future Considerations

**Potential Enhancements:**
- User accounts and saved prompts
- Export functionality (PDF, JSON, etc.)
- Prompt history and favorites
- Multi-language support (English, other languages)
- Advanced prompt templates
- Collaborative features (sharing, commenting)
- Rate limiting and usage analytics
- A/B testing different prompt strategies

**Technical Debt:**
- Add comprehensive test coverage
- Implement proper database usage (currently minimal)
- Add API rate limiting
- Improve error messages and user feedback
- Add analytics/telemetry
- Optimize bundle size further

## Resources

**Documentation:**
- Shadcn UI: https://ui.shadcn.com/
- TanStack Query: https://tanstack.com/query/latest
- React Hook Form: https://react-hook-form.com/
- Zod: https://zod.dev/
- Tailwind CSS: https://tailwindcss.com/

**Design Reference:**
- Google TextFX: https://textfx.withgoogle.com/
- Design principles in `design_guidelines.md`
- Chinese documentation in `replit.md`

## Contact & Contribution

This codebase is designed for easy modification and extension. When contributing:

1. Maintain the Chinese language UI
2. Follow existing component patterns
3. Add Zod schemas for new data structures
4. Update this CLAUDE.md with significant changes
5. Test both Magic Words and Tension Seeds modes
6. Verify dark mode compatibility
7. Ensure mobile responsiveness

---

**Last Updated:** 2025-01-16
**Version:** 1.0.0
**Maintained by:** AI-assisted development with Claude
