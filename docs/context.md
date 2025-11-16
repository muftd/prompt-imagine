# Context: Prompt Imagination Studio V1.0

## 1. 项目环境 & 基础信息

**技术栈：**
- **前端**：React 18.3 + TypeScript 5.6
  - 路由：Wouter 3.3（轻量级）
  - 状态管理：TanStack Query 5.60
  - 表单：React Hook Form 7.55 + Zod 3.24
  - UI 组件：Shadcn UI（New York 风格）
  - 样式：Tailwind CSS 3.4 + Framer Motion 11.18.2
  - 图标：Lucide React 0.453
- **后端**：Express.js 4.21 + TypeScript
  - AI 集成：OpenRouter + Claude Haiku 4.5
  - 数据库：Drizzle ORM + PostgreSQL（配置但未用）
  - 会话：MemoryStore（内存存储）
- **构建工具**：
  - 前端：Vite 5.4
  - 后端：esbuild 0.25
  - 执行：tsx 4.20
- **部署平台**：Replit
  - 端口：5000（同时服务 API 和前端）
  - 环境变量：`AI_INTEGRATIONS_OPENROUTER_*`

**运行指令：**
```bash
# 开发模式
npm run dev

# 类型检查
npm run check

# 生产构建
npm run build && npm run start

# 数据库推送
npm run db:push
```

**仓库位置：**
- GitHub：`muftd/prompt-imagine`
- 分支策略：主分支 `main`，功能分支 `claude/*`

## 2. 已有成果 & 当前状态快照

**已实现功能：**
- ✅ 魔法词工坊：
  - 输入任务描述、风格意图、创意度
  - 生成 3-5 个魔法词，包含解释和示例片段
  - 一键复制单个卡片内容
- ✅ 张力种子工作室：
  - 输入主题、多个张力轴（动态添加/删除）
  - 生成 3-5 个张力种子，包含挑衅性陈述和后续问题
  - 一键复制种子句
- ✅ UI/UX：
  - Figma 风格的模式切换器（平滑动画）
  - Glassmorphism 玻璃态设计
  - 模式特定的渐变背景（绿色/紫色）
  - 粘性导航栏 + 响应式布局
  - 深色模式优先
- ✅ AI 集成：
  - OpenRouter + Claude Haiku 4.5
  - 防御性 JSON 解析（处理 markdown 代码块）
  - 部分数据抢救机制

**已稳定运行：**
- 在 Replit 上可访问
- 两个模式切换无卡顿
- AI 调用成功率高（需持续监控）
- 响应时间：5-10 秒（已优化）

## 3. 关键决策与理由

### 3.1 架构决策

**决策 1：使用 Wouter 而非 React Router**
- 理由：项目只有 2 个主要视图（模式切换），不需要复杂路由
- 好处：包体积小、API 简洁
- 权衡：功能有限，但当前场景足够

**决策 2：TanStack Query 管理服务器状态**
- 理由：AI 调用是异步、可重试的操作，需要专业的状态管理
- 好处：自带缓存、重试、错误处理
- 替代方案放弃原因：useState + useEffect 太原始，zustand 对这个场景过重

**决策 3：Shadcn UI 而非完整 UI 库**
- 理由：需要完全控制组件代码，方便定制
- 好处：代码在项目内、可按需修改、无版本依赖风险
- 权衡：需要手动管理组件更新，但换来灵活性

### 3.2 AI 集成决策

**决策 4：从 GPT-5 切换到 Claude Haiku 4.5**
- 理由：响应速度是用户体验的核心瓶颈
- 数据：Opus 18-20 秒 → Haiku 5-10 秒
- 权衡：Haiku 质量略低于 Opus，但速度提升显著，对创意工具足够

**决策 5：使用 OpenRouter 而非直接 API**
- 理由：Replit AI Integrations 提供无需 API key 的环境
- 好处：降低用户配置门槛
- 风险：依赖 Replit 基础设施，迁移时需调整

**决策 6：defensive parsing + 部分数据抢救**
- 理由：Claude 有时返回 markdown 代码块包裹的 JSON
- 实现：剥离 ```json 和 ```，过滤无效数据
- 效果：提升成功率，减少用户看到的错误

### 3.3 用户体验决策

**决策 7：纯中文界面和内容**
- 理由：目标用户是中文创作者，减少语言切换的认知负担
- 实现：UI 文案、AI prompts、生成内容全部中文
- 特例：代码注释和技术文档可用英文

**决策 8：单页应用 + 模式切换**
- 理由：两个功能高度相似，统一入口降低学习成本
- 实现：Figma 风格的 tab 切换器
- 替代方案：分页路由被放弃，因为增加导航复杂度

## 4. 约束与风险备忘

**时间约束：**
- 无硬性 deadline，但希望 V1.0 在 2-3 周内完成
- 每轮迭代控制在 1-2 天

**技术约束：**
- Replit 免费额度有限，AI 调用需控制频率
- Claude Haiku 4.5 质量上限，复杂 prompt 可能效果不佳
- 前端 bundle 大小需控制（Shadcn UI 30+ 组件）

**已知风险：**
- **风险 1**：OpenRouter/Claude 偶尔返回非标准 JSON
  - 缓解：已有 defensive parsing
  - 后续：考虑加 retry 机制
- **风险 2**：用户输入过长导致 token 超限
  - 现状：Zod 校验有 min 长度，但无 max
  - TODO：添加合理的 max 限制（如 500 字符）
- **风险 3**：网络不稳定导致 API 调用超时
  - 现状：TanStack Query 默认无超时
  - TODO：配置 timeout 和友好错误提示

**环境约束：**
- Replit 环境变量不可在代码中硬编码
- PostgreSQL 配置存在但当前未用（保留扩展性）

## 5. 经验 & Best Practices

### 5.1 已踩过的坑

**坑 1：Claude 返回 markdown 包裹的 JSON**
- 现象：`response.content` 是 "```json\n{...}\n```"
- 解决：在 `server/routes.ts` 中剥离代码块
- 教训：AI 响应永远需要 defensive parsing

**坑 2：数组格式响应处理**
- 现象：Claude 有时返回 `[{type: "text", text: "..."}]`
- 解决：检查 `Array.isArray(messageContent)` 并提取文本
- 教训：OpenRouter 的响应格式不完全标准化

**坑 3：Replit 和 Claude Code 代码冲突**
- 现象：两端同时修改导致 git 冲突
- 解决：建立 `docs/tooling-workflow.md` 协作协议
- 教训：明确"谁要写，谁先 pull；谁写完，谁就 push"

**坑 4：Framer Motion 版本升级破坏动画**
- 现象：从 11.13 升级到 11.18.2 后部分动画失效
- 解决：检查 API 变更，调整 motion 配置
- 教训：动画库升级需在 Replit 实际测试

### 5.2 建议重复使用的模式

**模式 1：Zod schema → TypeScript type**
```typescript
// shared/schema.ts
export const requestSchema = z.object({...});
export type Request = z.infer<typeof requestSchema>;
```
- 好处：单一数据源，运行时验证 + 类型安全

**模式 2：apiRequest 封装**
```typescript
// client/src/lib/queryClient.ts
export async function apiRequest<T>(method, url, data): Promise<T>
```
- 好处：统一错误处理、类型推导、headers 配置

**模式 3：cn() 样式合并**
```typescript
// client/src/lib/utils.ts
export function cn(...inputs: ClassValue[])
```
- 好处：条件样式 + props 覆盖，避免 className 冲突

**模式 4：useForm + zodResolver**
```typescript
const form = useForm<T>({
  resolver: zodResolver(schema),
  defaultValues: {...}
});
```
- 好处：表单验证自动化、错误信息标准化

### 5.3 Claude Code 使用心得

**心得 1：单次对话控制范围**
- 不要在一次对话中"改前端 + 改后端 + 写文档"
- 推荐：1 次对话 = 1-2 个文件的修改 + 必要的 commit

**心得 2：利用 CLAUDE.md**
- 每次新窗口先让 AI 读 `docs/tooling-workflow.md`
- 确保 AI 理解角色分工和协作流程

**心得 3：测试在 Replit 完成**
- Claude Code 负责代码实现
- Replit 负责运行验证和部署
- 不在 Claude Code 中尝试运行服务器

## 6. 工具协作备忘

**参考文档：** `docs/tooling-workflow.md`

**快速提醒：**
- ChatGPT：规划、设计、复盘
- Claude Code：代码实现、Git 管理
- Replit：部署验收、环境修复
- GitHub：唯一真相源

**黄金规则：**
谁要写，谁先 pull；谁写完，谁就 push
