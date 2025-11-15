/**
 * 用于生成魔法词和张力种子的提示词模板
 * 这些模板可以轻松修改以调整语调、风格和输出格式
 */

export function getMagicWordPrompt(
  taskDescription: string,
  styleIntent: string | undefined,
  temperature: "low" | "medium" | "high"
): string {
  const temperatureGuidance = {
    low: "保守实用。专注于成熟的、经过验证的术语。",
    medium: "平衡创意与实用性。混合传统和新颖的方法。",
    high: "高度创新和非常规。用意想不到的词汇选择突破界限。",
  };

  return `你是提示词工程和创意AI交互的专家。你的任务是生成3-5个"魔法词" - 能够塑造AI输出方向和语调的强力关键词或短语。

**任务描述：**
${taskDescription}

**风格意图：**
${styleIntent || "未指定 - 请自行判断"}

**创意方法：**
${temperatureGuidance[temperature]}

**指示：**
为此任务生成3-5个有用的魔法词。对于每个魔法词：
1. 提供词语或短语（最多2-4个词）
2. 解释这个词如何影响AI输出方向
3. 给出一个具体的提示词片段示例，展示该词在上下文中的使用

**输出格式（JSON）：**
返回具有此确切结构的JSON对象：
{
  "magicWords": [
    {
      "word": "魔法词或短语",
      "explanation": "清楚解释这个词如何塑造AI输出",
      "exampleSnippet": "一个完整的示例提示词片段，展示用法"
    }
  ]
}

**准则：**
- 魔法词应该富有启发性和目的性
- 解释应该实用且具体
- 示例片段应该真实且可立即使用
- 变化魔法词的类型（结构性、语调性、风格性、概念性）
- 使其与任务描述相关
- 所有内容必须用中文生成

仅返回JSON对象，无需额外文本。`;
}

export function getTensionSeedPrompt(
  theme: string,
  tensionAxes: string[],
  temperature: "low" | "medium" | "high"
): string {
  const temperatureGuidance = {
    low: "生成扎实、实用的张力种子，具有明确的现实应用。",
    medium: "平衡挑衅性想法与可操作的见解。混合抽象和具体。",
    high: "大胆且具有挑衅性。挑战假设并探索意想不到的角度。",
  };

  return `你是专注于生成张力和创意的创意策略师。你的任务是创建"张力种子" - 具有挑衅性的、类似推文的陈述，捕捉创意摩擦并激发新思考。

**主题：**
${theme}

**张力轴：**
${tensionAxes.map((axis, i) => `${i + 1}. ${axis}`).join('\n')}

**创意方法：**
${temperatureGuidance[temperature]}

**指示：**
基于主题和张力轴生成3-5个张力种子。每个种子应该：
1. 是一个单独的、有力的句子（像一条优秀的推文）
2. 创造富有成效的张力或挑战假设
3. 具有视觉冲击力且令人难忘
4. 包括2个后续问题，帮助探索种子的含义

**输出格式（JSON）：**
返回具有此确切结构的JSON对象：
{
  "tensionSeeds": [
    {
      "seedSentence": "一个具有挑衅性的、值得推特分享的陈述",
      "followUpQuestions": [
        "第一个后续问题，深化探索",
        "第二个后续问题，扩展思维"
      ]
    }
  ]
}

**准则：**
- 种子句应该有力且令人难忘（少于20个词）
- 在提供的轴之间创造真正的张力
- 后续问题应该开辟新的思路
- 使其与演示、文章或产品叙述相关
- 足够具体以便实用，足够通用以激发灵感
- 所有内容必须用中文生成

仅返回JSON对象，无需额外文本。`;
}