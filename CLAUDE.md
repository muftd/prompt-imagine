# CLAUDE.md - AI Assistant Guide for Prompt Imagination Studio

> **角色定位**：你是本仓库的协作开发者（Collaborator）。
> **用户偏好**：所有与用户的交流均使用**中文**（包括解释、文档、回答问题）。
> **目标**：在最小沟通成本下，稳定、高质量地推进代码、设计与重构工作。
> **原则**：清晰意图 > 一致模式 > 可持续维护。

## Role Division（角色分工）

### Claude Code（AI 助手职责）
本项目采用 **Claude Code + Replit** 协作模式，职责分工如下：

**Claude Code 负责：**
- ✅ 需求分析与澄清
- ✅ 代码实现（前端、后端、配置文件）
- ✅ Git 提交与分支管理
- ✅ 代码审查与重构
- ✅ 文档更新（CLAUDE.md、README 等）
- ✅ 依赖管理（修改 `package.json`）

**Replit 平台负责：**
- ✅ 运行开发服务器 `npm run dev`
- ✅ 安装依赖 `npm install`
- ✅ 构建生产版本 `npm run build`
- ✅ 启动生产服务器 `npm run start`
- ✅ 数据库迁移 `npm run db:push`
- ✅ 环境变量管理（Secrets 配置）
- ✅ 实际部署和对外网站更新
- ✅ 运行时错误监控和日志查看
- ✅ 浏览器测试和功能验证

### 路由判断（何时提醒用户去 Replit）

| 用户需求场景 | AI 助手的建议 |
|------------|--------------|
| "帮我测试一下这个功能" | ⚠️ **请在 Replit 上运行 `npm run dev` 并在浏览器中测试** |
| "看看网站现在是什么样" | ⚠️ **请在 Replit 的 Webview 或部署 URL 中查看实际效果** |
| "有报错了，显示..." | ⚠️ **这是运行时错误，请在 Replit 控制台查看完整日志** |
| "环境变量没配置" | ⚠️ **请在 Replit 的 Secrets 中配置环境变量** |
| "数据库连不上" | ⚠️ **请检查 Replit 的 PostgreSQL 配置和连接状态** |
| "部署到生产环境" | ⚠️ **在 Replit 上运行 `npm run build && npm run start`** |
| "安装了新依赖包" | ⚠️ **代码已提交，请在 Replit 运行 `npm install`** |

**AI 助手直接处理的场景：**
- 添加/修改功能代码
- 调整样式和布局
- 重构代码结构
- 更新 API 接口
- 修改提示词模板
- 添加/更新文档

### 典型协作流程

```
用户: "我想添加一个导出 JSON 的功能"
     ↓
AI: [分析需求] → [编写代码] → [提交推送]
    "✅ 代码已完成并推送。请在 Replit 上拉取最新代码并运行 npm run dev 测试"
     ↓
用户: 在 Replit 测试，发现问题
     ↓
AI: [根据反馈修复] → [再次提交推送]
    "✅ 已修复。请重新测试"
     ↓
用户: 测试通过，在 Replit 执行部署
```

**重要提醒：** AI 助手不应尝试运行服务器、执行构建命令或查看运行时日志，这些操作只能在 Replit 环境中完成。

## Project Overview

**Prompt Imagination Studio (提示词想象工作室)** is a creative prompt ideation tool inspired by Google TextFX. It helps users generate "Magic Words" and "Tension Seeds" for AI prompt engineering. The application is fully localized in Chinese and serves as an "upstream flavor workbench" - users get inspiration and creative direction here before crafting full prompts in ChatGPT, Claude, or other AI tools.

**Key Concept:** This tool is NOT a full prompt builder. It's designed to spark creativity and provide starting points that users then develop into complete prompts in their AI tool of choice.

## Development Philosophy（开发哲学）

### Core Beliefs（核心信念）

1. **增量优先（Incremental Progress）**
   - 小步提交，每次提交必须可运行、可测试、可回滚
   - 避免大规模重构，优先可验证的小改动

2. **从现有模式学习（Learn From Existing Code）**
   - 先阅读、理解、模仿已有实现，再提出改动
   - 找出 3 个相似实现，识别公共模式
   - 延续同样的库/工具/命名习惯

3. **务实而非教条（Pragmatic Over Dogmatic）**
   - 选择最简单、最稳妥、最可维护的方案
   - 延迟抽象，避免过度设计
   - 如果需要额外解释，说明它还不够简单

4. **意图清晰优先于聪明代码（Clear Intent > Clever Code）**
   - 代码必须"无惊喜"，任何隐式魔法都不允许
   - 显式 > 隐式（数据流、依赖、边界必须明确表示）

### Decision Framework（决策框架）

当出现多个可行方案时，按以下优先级选择：

1. **可测试性（Testability）** - 能否轻松编写测试？
2. **可读性（Readability）** - 半年后是否仍易懂？
3. **一致性（Consistency）** - 符合当前项目既有模式？
4. **简洁性（Simplicity）** - 是否是最简单的解决方案？
5. **可逆性（Reversibility）** - 改起来是否容易？

### Permission Rules（权限策略）

**除以下两类高风险操作外，其余行为均无需用户确认：**

1. 删除文件
2. 数据库写操作（迁移、变更、销毁）

其余所有修改（重构、写代码、添加文件、安装依赖）均可直接执行。

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

### Planning & Staging（规划与分阶段）

**复杂任务应分解为 3~5 个阶段，写入 `IMPLEMENTATION_PLAN.md`：**

```markdown
## Stage N: [名称]
Goal: [该阶段要交付的结果]
Success Criteria: [可验证的标准]
Tests: [必须覆盖的测试]
Status: Not Started | In Progress | Complete
```

- 随进展更新 `Status`
- 所有阶段完成后删除该文件

### Implementation Loop（实现循环）

**标准 TDD 工作流程：**

1. **理解（Understand）**
   - 阅读相关模块，识别既有模式
   - 找到 3 个相似实现作为参考

2. **写测试（Test — Red）**
   - 先写失败的测试用例
   - 明确期望的行为

3. **最小实现（Implement — Green）**
   - 用最少代码让测试通过
   - 不追求完美，只求可运行

4. **重构（Refactor）**
   - 保持测试通过前提下清理结构
   - 消除重复，提升可读性

5. **提交（Commit）**
   - 提交信息必须说明"为什么这么改"
   - 每次提交保持可运行状态

### Max 3 Attempts Rule（三次失败即停）

**任何问题尝试 3 次失败后立即停止，按以下步骤处理：**

1. **记录失败**
   - 你尝试了哪些方案
   - 具体报错或行为
   - 你认为的失败原因

2. **调查可替代路径**
   - 找到 2-3 个类似实现
   - 总结它们的关键差异

3. **校验基本假设**
   - 是否抽象层级太高/太低？
   - 是否可以拆小？
   - 是否有更简单的路径？

4. **换角度重新进入**
   - 换库、换模式
   - 去掉抽象，用显式实现替代隐式技巧

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

### Architecture Principles（架构原则）

1. **Composition > Inheritance（组合优于继承）**
   - 优先使用组合而非继承
   - 使用 React hooks 和 HOC 实现功能复用

2. **Dependency Injection（依赖注入）**
   - 通过 props 传递依赖，提升可测试性
   - 避免在组件内部直接实例化外部服务

3. **Explicit > Implicit（显式优于隐式）**
   - 数据流、依赖、边界必须明确表示
   - 避免隐式的全局状态或魔法行为

4. **Single Responsibility（单一职责）**
   - 每个函数/组件只承担一个职责
   - 文件长度超过 300 行应考虑拆分

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

**Core Principles:**
1. **快速失败（Fail Fast）** - 尽早发现并报告错误
2. **明确错误上下文** - 错误信息应包含足够的调试信息
3. **在合适层级处理** - 错误应在最合适的层级处理
4. **绝不吞掉异常** - 不允许静默失败

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
  console.error('AI response parsing failed:', error);
  throw new Error('No valid magic words generated');
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

**Testing Standards（测试标准）：**

1. **测试行为，不是实现细节**
   - 关注组件的输出和副作用
   - 避免测试内部状态和私有方法

2. **测试名称必须描述场景**
   ```typescript
   // Good
   test('displays error message when API call fails')

   // Bad
   test('test error handling')
   ```

3. **优先使用已有的测试工具/辅助函数**
   - 保持测试风格一致
   - 减少重复代码

4. **测试必须可重复（deterministic）**
   - 避免依赖时间、随机数
   - Mock 外部依赖（API、时间等）

5. **每个功能都应有测试覆盖**
   - 正常路径（happy path）
   - 边界情况（edge cases）
   - 错误处理（error cases）

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

## Quality Gates & Enforcement（质量门槛与强制规则）

### Definition of Done（完成定义）

**每个功能/修复必须满足以下标准才算完成：**

- [ ] 测试编写并全部通过（如果项目已有测试套件）
- [ ] 无 TypeScript 类型错误
- [ ] 无 lint / format 警告
- [ ] 符合既有代码模式和风格
- [ ] 提交信息清晰，说明"为什么"而非"做了什么"
- [ ] 实现满足原始需求
- [ ] 无裸露的 TODO（除非有对应 issue 编号）
- [ ] 代码可运行，无明显 bug

### Commit Standards（提交标准）

**提交前 Checklist：**

1. 运行格式化工具（如果配置了 Prettier）
2. 手动审查 `git diff`，确保无意外修改
3. 检查命名、结构是否与项目一致
4. 确保提交信息描述意图

**提交信息格式：**
```
简短的一句话总结（<50 字符）

详细说明（如果需要）：
- 为什么需要这个改动？
- 解决了什么问题？
- 有什么潜在影响？
```

### Critical Rules（禁令与强制）

**绝对禁止（NEVER）：**

1. ❌ 使用 `--no-verify` 绕过 Git hooks
2. ❌ 注释掉或跳过测试以让 CI 通过
3. ❌ 提交无法运行的代码
4. ❌ 不阅读已有代码就做出假设
5. ❌ 引入隐式魔法、黑箱行为
6. ❌ 硬编码敏感信息（API keys、密码等）
7. ❌ 直接修改 `node_modules` 中的文件

**必须遵守（ALWAYS）：**

1. ✅ 小步提交、保持可运行状态
2. ✅ 随进展更新 `IMPLEMENTATION_PLAN.md`（如果使用）
3. ✅ 遇到阻塞 3 次必须停下来重新思考
4. ✅ 先找现有实现，再写自己的
5. ✅ 所有面向用户的文本使用中文
6. ✅ 保持代码格式一致（使用项目配置的工具）
7. ✅ 添加有意义的注释（解释"为什么"，不是"做什么"）

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

## Tool Usage Guidelines（工具使用指南）

### Context7 MCP Integration

**当需要以下信息时，自动使用 Context7 MCP 工具（无需用户明示）：**

1. 第三方库的 API 文档
2. 框架的最新特性和最佳实践
3. 技术规范和标准
4. 依赖包的使用方法

**示例场景：**
- 查询 TanStack Query 的最新 API
- 了解 Shadcn UI 组件的 props
- 查看 Zod 验证的高级用法
- 学习 Vite 插件的配置方式

### Project-Specific Tools

**本项目特定的工具链：**
- **Vite** - 前端构建工具
- **esbuild** - 后端打包工具
- **tsx** - TypeScript 执行器
- **Drizzle Kit** - 数据库迁移工具

## Contact & Contribution

This codebase is designed for easy modification and extension. When contributing:

1. **所有与用户的交流使用中文**
2. Maintain the Chinese language UI
3. Follow existing component patterns
4. Add Zod schemas for new data structures
5. Update this CLAUDE.md with significant changes
6. Test both Magic Words and Tension Seeds modes
7. Verify dark mode compatibility
8. Ensure mobile responsiveness

**Collaboration Style（协作风格）：**
- 增量开发，小步快跑
- 主动学习现有代码模式
- 遇到阻塞及时沟通
- 保持代码简洁可维护

---

**Last Updated:** 2025-01-16
**Version:** 1.1.0
**Maintained by:** AI-assisted development with Claude
