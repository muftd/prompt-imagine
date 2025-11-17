import { z } from "zod";

// Magic Word generation schema
export const magicWordRequestSchema = z.object({
  taskDescription: z.string()
    .min(10, "任务描述至少需要 10 个字符")
    .max(500, "任务描述不能超过 500 个字符"),
  styleIntent: z.string()
    .max(500, "风格意图不能超过 500 个字符")
    .optional(),
  temperature: z.enum(["low", "medium", "high"]).default("medium"),
});

export type MagicWordRequest = z.infer<typeof magicWordRequestSchema>;

// Lens schema for both vertical and horizontal lenses
export const lensSchema = z.object({
  name: z.string(),
  effect_line: z.string(),
  example_snippet: z.string(),
});

export type Lens = z.infer<typeof lensSchema>;

export const magicWordResponseSchema = z.object({
  vertical_lenses: z.array(lensSchema),
  horizontal_lenses: z.array(lensSchema),
});

export type MagicWordResponse = z.infer<typeof magicWordResponseSchema>;

// Deprecated: kept for reference
export const magicWordSchema = z.object({
  word: z.string(),
  explanation: z.string(),
  exampleSnippet: z.string(),
});

export type MagicWord = z.infer<typeof magicWordSchema>;

// Tension Seeds generation schema
export const tensionSeedRequestSchema = z.object({
  theme: z.string()
    .min(5, "主题至少需要 5 个字符")
    .max(200, "主题不能超过 200 个字符"),
  tensionAxes: z.array(
    z.string()
      .min(1, "张力轴不能为空")
      .max(100, "每个张力轴不能超过 100 个字符")
  ).min(1, "至少需要一个张力轴"),
  temperature: z.enum(["low", "medium", "high"]).default("medium"),
});

export type TensionSeedRequest = z.infer<typeof tensionSeedRequestSchema>;

export const tensionSeedSchema = z.object({
  seedSentence: z.string(),
  followUpQuestions: z.array(z.string()),
});

export type TensionSeed = z.infer<typeof tensionSeedSchema>;

export const tensionSeedResponseSchema = z.object({
  tensionSeeds: z.array(tensionSeedSchema),
});

export type TensionSeedResponse = z.infer<typeof tensionSeedResponseSchema>;
