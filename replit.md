# 提示词想象工作室

一款受Google TextFX启发的创意提示词构思工具，帮助用户生成"魔法词"和"张力种子"用于AI提示词工程。

## 概述

提示词想象工作室是一个网络应用，提供两种创意模式：

1. **魔法词工坊**：生成能塑造AI输出方向的强力关键词和短语，配有解释和示例提示词片段
2. **张力种子工作室**：创造富有挑衅性的、类似推文的陈述，捕捉创意摩擦，并附带后续问题深化探索

该工具被设计为"上游调味工作台" - 用户在这里获取灵感和创意方向，然后再到ChatGPT、Claude或其他AI工具中制作完整的提示词。

## 架构

### 技术栈
- **前端**：React、TypeScript、Tailwind CSS、Shadcn UI
- **后端**：Express.js、TypeScript
- **AI**：通过Replit AI集成的OpenAI GPT-5（无需API密钥）
- **状态管理**：TanStack Query（React Query）

### 项目结构
```
client/
  src/
    components/
      magic-word-atelier.tsx      # 魔法词模式界面
      tension-seeds-studio.tsx    # 张力种子模式界面
      mode-card.tsx               # 模式切换卡片
      magic-word-card.tsx         # 魔法词输出卡片
      tension-seed-card.tsx       # 张力种子输出卡片
      temperature-control.tsx     # 温度选择UI
      ui/                         # Shadcn UI组件
    pages/
      home.tsx                    # 主应用页面
    App.tsx                       # 根组件与路由
    index.css                     # 全局样式和主题标记
server/
  lib/
    openai.ts                     # OpenAI客户端配置
    prompts.ts                    # 提示词模板（易于自定义，中文内容生成）
  routes.ts                       # API端点
shared/
  schema.ts                       # 共享TypeScript类型和Zod模式
```

## 功能

### 魔法词工坊
- 输入：任务描述、可选风格意图、温度/创意度控制
- 输出：3-5个魔法词，包含：
  - 词语或短语
  - 解释其如何影响AI输出
  - 展示用法的示例提示词片段
- 一键复制功能

### 张力种子工作室
- 输入：主题、多个张力轴、温度/创意度控制
- 输出：3-5个张力种子，包含：
  - 挑衅性种子句（类似推文）
  - 2个后续探索问题
- 动态张力轴管理（添加/删除）
- 一键复制种子句

## 设计系统

### 颜色主题
应用使用受Google TextFX启发的模式特定颜色主题：

- **魔法词工坊**：绿色主题（鼠尾草绿、薄荷绿、森林绿）
  - 营造平静、成长导向的氛围
  - 主色：浅色模式 `hsl(145 65% 45%)`，深色模式 `hsl(145 55% 55%)`

- **张力种子工作室**：紫色/紫罗兰主题
  - 营造充满活力、创意的氛围
  - 主色：浅色模式 `hsl(270 65% 55%)`，深色模式 `hsl(270 60% 65%)`

### 排版
- 字体系列：Inter（干净、现代的无衬线字体）
- 等宽字体：JetBrains Mono（用于代码片段）
- 大型、有影响力的标题（4xl-5xl）用于模式名称
- 通过不同字重和大小建立清晰的层次结构

### 布局
- 响应式网格：大屏幕上左侧40%（标题/描述），右侧60%（输入/输出）
- 基于卡片的输出，间距宽敞
- 生成内容的平滑淡入动画

## API端点

### POST /api/magic-words
生成魔法词。

**请求：**
```json
{
  "taskDescription": "string (最少10个字符)",
  "styleIntent": "string (可选)",
  "temperature": "low" | "medium" | "high"
}
```

**响应：**
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
基于主题和张力轴生成张力种子。

**请求：**
```json
{
  "theme": "string (最少5个字符)",
  "tensionAxes": ["string array (至少1个)"],
  "temperature": "low" | "medium" | "high"
}
```

**响应：**
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

## 自定义指南

### 修改提示词模板
要调整生成内容的语调、风格或输出格式，请编辑：
- `server/lib/prompts.ts`

关键自定义点：
- `getMagicWordPrompt()`：控制魔法词的生成方式
- `getTensionSeedPrompt()`：控制张力种子的生成方式

每个模板包括：
- 基于温度的指导（低/中/高创意度）
- 输出格式规范（JSON结构）
- AI指南
- 中文内容生成指令

### 调整颜色主题
颜色变量定义在 `client/src/index.css`：
- 浅色模式：`:root` 部分
- 深色模式：`.dark` 部分

关键变量：
- `--magic`：魔法词主题颜色
- `--magic-light`：魔法模式的浅色背景
- `--tension`：张力种子主题颜色
- `--tension-light`：张力模式的浅色背景

### 温度行为
温度控制影响创意方法：
- **低**：保守、实用、经过验证的术语
- **中等**：平衡创意与实用性
- **高**：高度创新、非常规、突破界限

## 开发

### 运行应用
```bash
npm run dev
```
同时启动Express后端和Vite前端在同一端口。

### 环境变量
应用使用Replit AI集成，自动提供：
- `AI_INTEGRATIONS_OPENAI_BASE_URL`
- `AI_INTEGRATIONS_OPENAI_API_KEY`

无需手动配置API密钥。

## 用户偏好
- 干净、简约的界面，专注于内容生成
- 受TextFX启发的设计美学，带有模式特定颜色主题
- 平滑的过渡和动画
- 移动响应式布局
- 深色模式支持
- 完全中文界面和内容生成

## 最近更改
- 2025-01-15：初始实现，包含魔法词工坊和张力种子工作室
- 两种模式完全功能化，集成OpenAI GPT-5
- 完整响应式设计，支持深色模式
- 所有生成内容的一键复制功能
- 2025-01-15：将整个应用转换为中文环境，包括界面和生成内容
- 2025-01-16：重大更新和修复
  - 从OpenAI切换到OpenRouter集成，使用anthropic/claude-3-opus模型
  - 修复了HTTP头部中文字符编码问题
  - 修复了apiRequest函数返回JSON数据的问题
  - 修复了OpenRouter/Claude数组格式响应的处理
  - UI改进：使用Tabs组件替代大型模式卡片
  - 改进张力种子"添加轴"按钮的可见性和交互提示
  - 所有功能现在正常工作，平均响应时间18-20秒