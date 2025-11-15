import { z } from "zod";

// Magic Word generation schema
export const magicWordRequestSchema = z.object({
  taskDescription: z.string().min(10, "Task description must be at least 10 characters"),
  styleIntent: z.string().optional(),
  temperature: z.enum(["low", "medium", "high"]).default("medium"),
});

export type MagicWordRequest = z.infer<typeof magicWordRequestSchema>;

export const magicWordSchema = z.object({
  word: z.string(),
  explanation: z.string(),
  exampleSnippet: z.string(),
});

export type MagicWord = z.infer<typeof magicWordSchema>;

export const magicWordResponseSchema = z.object({
  magicWords: z.array(magicWordSchema),
});

export type MagicWordResponse = z.infer<typeof magicWordResponseSchema>;

// Tension Seeds generation schema
export const tensionSeedRequestSchema = z.object({
  theme: z.string().min(5, "Theme must be at least 5 characters"),
  tensionAxes: z.array(z.string()).min(1, "At least one tension axis is required"),
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
