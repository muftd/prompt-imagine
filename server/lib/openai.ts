import OpenAI from "openai";

// 使用Replit的AI集成服务，通过OpenRouter访问多个AI模型，无需您自己的API密钥
// 参考：javascript_openrouter_ai_integrations blueprint
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENROUTER_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://promptimagination.replit.app", // 可选，用于OpenRouter的跟踪
    "X-Title": "提示词想象工作室", // 可选，显示在OpenRouter日志中
  }
});

export { openai };
