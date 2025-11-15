# Prompt Imagination Studio

A creative prompt ideation tool inspired by Google TextFX that helps users generate "magic words" and "tension seeds" for AI prompt engineering.

## Overview

Prompt Imagination Studio is a web application that provides two creative modes:

1. **Magic Word Atelier**: Generates powerful keywords and phrases that shape AI output direction, complete with explanations and example prompt snippets
2. **Tension Seeds Studio**: Creates provocative, tweet-worthy statements that capture creative friction, along with follow-up questions to deepen exploration

The tool is designed as an "upstream flavoring workbench" - users come here to get inspiration and creative direction before crafting their full prompts in ChatGPT, Claude, or other AI tools.

## Architecture

### Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, TypeScript
- **AI**: OpenAI GPT-5 via Replit AI Integrations (no API key required)
- **State Management**: TanStack Query (React Query)

### Project Structure
```
client/
  src/
    components/
      magic-word-atelier.tsx      # Magic Word mode interface
      tension-seeds-studio.tsx    # Tension Seeds mode interface
      mode-card.tsx               # Mode switching cards
      magic-word-card.tsx         # Output card for magic words
      tension-seed-card.tsx       # Output card for tension seeds
      temperature-control.tsx     # Temperature selection UI
      ui/                         # Shadcn UI components
    pages/
      home.tsx                    # Main application page
    App.tsx                       # Root component with routing
    index.css                     # Global styles and theme tokens
server/
  lib/
    openai.ts                     # OpenAI client configuration
    prompts.ts                    # Prompt templates (easily customizable)
  routes.ts                       # API endpoints
shared/
  schema.ts                       # Shared TypeScript types and Zod schemas
```

## Features

### Magic Word Atelier
- Input: Task description, optional style intent, temperature/divergence control
- Output: 3-5 magic words with:
  - The word or phrase
  - Explanation of how it influences AI output
  - Example prompt snippet showing usage
- One-click copy functionality for snippets

### Tension Seeds Studio
- Input: Theme, multiple tension axes, temperature/divergence control
- Output: 3-5 tension seeds with:
  - Provocative seed sentence (tweet-like)
  - 2 follow-up questions for exploration
- Dynamic tension axis management (add/remove)
- One-click copy for seed sentences

## Design System

### Color Themes
The application uses mode-specific color themes inspired by Google TextFX:

- **Magic Word Atelier**: Green theme (sage, mint, forest)
  - Creates a calm, growth-oriented atmosphere
  - Primary: `hsl(145 65% 45%)` in light mode, `hsl(145 55% 55%)` in dark mode

- **Tension Seeds Studio**: Purple/violet theme
  - Creates an energetic, creative atmosphere
  - Primary: `hsl(270 65% 55%)` in light mode, `hsl(270 60% 65%)` in dark mode

### Typography
- Font Family: Inter (clean, modern sans-serif)
- Monospace: JetBrains Mono (for code snippets)
- Large, impactful titles (4xl-5xl) for mode names
- Clear hierarchy with varying font weights and sizes

### Layout
- Responsive grid: 40% left (title/description), 60% right (input/output) on large screens
- Card-based output with generous spacing
- Smooth fade-in animations for generated content

## API Endpoints

### POST /api/magic-words
Generates magic words for a given task.

**Request:**
```json
{
  "taskDescription": "string (min 10 chars)",
  "styleIntent": "string (optional)",
  "temperature": "low" | "medium" | "high"
}
```

**Response:**
```json
{
  "magicWords": [
    {
      "word": "string",
      "explanation": "string",
      "exampleSnippet": "string"
    }
  ]
}
```

### POST /api/tension-seeds
Generates tension seeds based on theme and tension axes.

**Request:**
```json
{
  "theme": "string (min 5 chars)",
  "tensionAxes": ["string array (min 1)"],
  "temperature": "low" | "medium" | "high"
}
```

**Response:**
```json
{
  "tensionSeeds": [
    {
      "seedSentence": "string",
      "followUpQuestions": ["string", "string"]
    }
  ]
}
```

## Customization Guide

### Modifying Prompt Templates
To adjust the tone, style, or output format of generated content, edit the prompt templates in:
- `server/lib/prompts.ts`

Key customization points:
- `getMagicWordPrompt()`: Controls how magic words are generated
- `getTensionSeedPrompt()`: Controls how tension seeds are generated

Each template includes:
- Temperature-based guidance (low/medium/high creativity)
- Output format specifications (JSON structure)
- Guidelines for the AI

### Adjusting Color Themes
Color variables are defined in `client/src/index.css`:
- Light mode: `:root` section
- Dark mode: `.dark` section

Key variables:
- `--magic`: Magic Word theme color
- `--magic-light`: Light background for Magic mode
- `--tension`: Tension Seeds theme color
- `--tension-light`: Light background for Tension mode

### Temperature Behavior
The temperature control affects the creative approach:
- **Low**: Conservative, practical, proven terminology
- **Medium**: Balanced creativity and practicality
- **High**: Highly creative, unconventional, boundary-pushing

## Development

### Running the Application
```bash
npm run dev
```
This starts both the Express backend and Vite frontend on the same port.

### Environment Variables
The application uses Replit AI Integrations, which automatically provides:
- `AI_INTEGRATIONS_OPENAI_BASE_URL`
- `AI_INTEGRATIONS_OPENAI_API_KEY`

No manual API key configuration is required.

## User Preferences
- Clean, minimal interface with focus on content generation
- TextFX-inspired design aesthetic with mode-specific color themes
- Smooth transitions and animations
- Mobile-responsive layout
- Dark mode support

## Recent Changes
- 2025-01-15: Initial implementation with Magic Word Atelier and Tension Seeds Studio
- Both modes fully functional with OpenAI GPT-5 integration
- Complete responsive design with dark mode support
- One-click copy functionality for all generated content
