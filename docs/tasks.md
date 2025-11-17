# Tasks: Prompt Imagination Studio V1.0

## 0. 任务管理约定

**粒度控制：**
- 每条任务应在 0.5~2 小时内可完成
- 拆分过大的任务为子任务
- 避免任务间的强依赖

**状态标签：**
- `[TODO]` 尚未开始
- `[DOING]` 正在进行
- `[BLOCKED]` 卡住，需用户决策或外部条件
- `[DONE]` 已完成，附简短结果

**更新频率：**
- 每完成一个任务立即更新状态
- 发现新任务时及时添加
- 每轮迭代结束后归档已完成任务

## 1. 当前任务列表

### M1: 性能优化（已完成）✅

- `[DONE]` 将 AI 模型从 Claude 3 Opus 切换到 Haiku 4.5
  - 位置：`server/routes.ts` 两处（magic-words + tension-seeds）
  - 结果：响应时间从 18-20 秒降至 5-10 秒
- `[DONE]` 添加 markdown 代码块清理逻辑
  - 位置：`server/routes.ts` 两个端点
  - 结果：正确处理 Claude 返回的 ```json 包裹
- `[DONE]` 合并 Replit 的 UI 优化改动
  - 结果：Figma 风格切换器、glassmorphism 效果、渐变背景

### M2: 用户体验优化（进行中）🔄

- `[DONE]` 添加输入字符数限制和实时提示
  - 位置：`shared/schema.ts` + 两个 atelier 组件
  - 结果：
    - Schema 添加字符限制：taskDescription/styleIntent 500，theme 200，tensionAxes 100
    - 所有验证错误信息中文化
    - 表单添加实时字符计数器，带颜色编码（正常/警告/错误）

- `[DONE]` 改进加载状态的视觉反馈
  - 位置：新建 `loading-skeleton.tsx` + 两个 atelier 组件
  - 结果：
    - 创建 LoadingSkeleton 和 TensionSeedSkeleton 组件
    - 模拟真实卡片结构（badge、文本、代码块）
    - 替换原有的简单旋转动画
    - 保持渐进式加载动画（stagger effect）

- `[DONE]` 优化错误提示的友好度
  - 位置：新建 `error-handler.ts` + 两个 atelier 组件
  - 结果：
    - 创建错误处理工具函数 getFriendlyErrorMessage
    - 针对不同错误类型提供专属提示（网络、超时、HTTP、验证等）
    - Magic Word 和 Tension Seed 各有专属错误提示
    - 错误消息包含：标题、描述、建议（💡 图标）

- `[DONE]` 添加"复制全部"和"清空结果"功能
  - 位置：两个 atelier 组件的结果标题栏
  - 结果：
    - 添加操作按钮组（复制全部 + 清空）
    - 显示结果数量标记
    - 复制全部：格式化所有内容为纯文本（带分隔符）
    - 清空：清空当前结果并显示 toast 确认
    - 按钮带动画效果（hover scale、状态切换）

- `[DONE]` 添加生成结果为空时的友好提示
  - 位置：两个 atelier 组件的空状态
  - 结果：
    - 增强图标展示（更大尺寸 + 渐变光晕效果）
    - 更友好的标题和描述文案
    - 添加示例建议卡片（3 个真实用例）
    - 符合各自主题配色（emerald/purple）
    - 提升新用户引导体验

### M3: 稳定性增强（进行中）🔄

- `[DONE]` 为 AI 调用添加超时配置
  - 位置：`client/src/lib/queryClient.ts` 的 apiRequest 函数
  - 结果：
    - 使用 AbortController 实现 60 秒超时
    - 超时后抛出友好的中文错误提示
    - 适用于所有 API 调用

- `[DONE]` 实现 API 调用失败的重试机制
  - 位置：`client/src/lib/queryClient.ts` 的 mutations 配置
  - 结果：
    - 最多重试 2 次，指数退避策略（1s, 2s）
    - 超时错误和网络错误会重试
    - HTTP 4xx/5xx 错误不重试
    - 自动应用到所有 mutations

- `[TODO]` 添加 React Error Boundary
  - 位置：`client/src/App.tsx` 包裹主要组件
  - 功能：捕获渲染错误，显示友好界面
  - 参考：Shadcn UI 的错误处理模式

- `[TODO]` 完善服务端日志记录
  - 位置：`server/routes.ts` 两个端点
  - 内容：记录请求参数、响应时间、错误详情
  - 工具：console.log + 时间戳（Replit 可查看）

## 2. 已完成任务（归档）

### 基础设施（2025-01-15）

- `[DONE]` 在 Replit 创建项目并绑定 GitHub 仓库
  - 仓库：`muftd/prompt-imagine`
  - 结果：项目可通过 Replit 访问和部署

- `[DONE]` 配置 OpenRouter AI 集成
  - 模型：最初使用 Claude 3 Opus
  - 环境变量：在 Replit Secrets 中配置

### 核心功能（2025-01-15）

- `[DONE]` 实现魔法词工坊完整功能
  - 文件：`client/src/components/magic-word-atelier.tsx` + `magic-word-card.tsx`
  - 功能：表单验证、API 调用、结果展示、复制

- `[DONE]` 实现张力种子工作室完整功能
  - 文件：`client/src/components/tension-seeds-studio.tsx` + `tension-seed-card.tsx`
  - 功能：动态张力轴、表单验证、结果展示

- `[DONE]` 实现温度控制组件
  - 文件：`client/src/components/temperature-control.tsx`
  - 样式：三段式选择器，中文标签

### UI/UX 优化（2025-01-16）

- `[DONE]` 实现 Figma 风格的模式切换器
  - 文件：`client/src/pages/home.tsx`
  - 效果：平滑动画、渐变背景、glassmorphism

- `[DONE]` 添加模式特定的渐变背景
  - 颜色：魔法词（绿色）、张力种子（紫色）
  - 动画：Framer Motion crossfade

- `[DONE]` 优化卡片组件的交互和视觉
  - 效果：hover 提升、阴影层次、圆角

- `[DONE]` 切换到思源黑体字体
  - 文件：`client/src/index.css`
  - 效果：改善中文显示质量

### 协作流程（2025-01-16）

- `[DONE]` 创建工具协作工作流文档
  - 文件：`docs/tooling-workflow.md`
  - 内容：ChatGPT、Claude Code、Replit 分工

- `[DONE]` 更新 CLAUDE.md 指向工作流文档
  - 添加"必读文档"章节
  - 避免文档冗余

### Dev Docs 建设（当前）

- `[DONE]` 创建 `docs/plan.md`
  - 内容：V1.0 目标、阶段划分、验收标准

- `[DONE]` 创建 `docs/context.md`
  - 内容：技术栈、决策、约束、经验

- `[DOING]` 创建 `docs/tasks.md`
  - 内容：当前任务列表、已完成归档

## 3. 阻塞点

### 决策类阻塞

- `[BLOCKED]` M3 历史记录功能的 UI 设计
  - 问题：侧边抽屉 vs 独立页面 vs 模态框？
  - 需要：用户确认偏好的交互方式

- `[BLOCKED]` 是否需要添加用户偏好设置
  - 问题：保存默认温度、主题色等
  - 需要：评估是否在 V1.0 范围内

### 技术类阻塞

- `[BLOCKED]` Replit 部署后字体加载问题
  - 现象：（待观察）思源黑体可能在某些环境加载失败
  - 需要：在 Replit 实际测试
  - 备选：配置 Google Fonts CDN fallback

## 4. 待拆分的大任务

以下任务当前粒度过大，需要进一步拆分：

- "添加完整的用户引导系统"
  - 拆分为：首次访问提示、功能说明弹窗、示例输入建议

- "性能监控和分析"
  - 拆分为：添加关键指标埋点、实现简单的日志聚合、创建性能仪表板

## 5. 未来考虑（超出 V1.0 范围）

以下任务不在当前 plan.md 的 V1.0 范围内，仅作记录：

- 实现用户账户系统
- 添加多语言支持（英文）
- 集成更多 AI 模型选择
- 实现协作分享功能
- 开发移动端适配版本
- 添加 Prompt 模板市场
