import type { Express } from "express";
import { createServer, type Server } from "http";
import { openai } from "./lib/openai";
import { getMagicWordPrompt, getTensionSeedPrompt } from "./lib/prompts";
import { logger } from "./lib/logger";
import {
  magicWordRequestSchema,
  magicWordResponseSchema,
  tensionSeedRequestSchema,
  tensionSeedResponseSchema,
  type MagicWordResponse,
  type TensionSeedResponse,
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Magic Word generation endpoint
  app.post("/api/magic-words", async (req, res) => {
    const startTime = Date.now();
    const endpoint = "/api/magic-words";

    try {
      // Validate request body
      const result = magicWordRequestSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        logger.warn("验证失败", { endpoint, error: validationError.message });
        return res.status(400).json({ error: validationError.message });
      }

      const { taskDescription, styleIntent, temperature } = result.data;

      logger.apiStart(endpoint, {
        taskDescriptionLength: taskDescription.length,
        hasStyleIntent: !!styleIntent,
        temperature,
      });

      // Generate prompt
      const prompt = getMagicWordPrompt(taskDescription, styleIntent, temperature);

      // 调用OpenRouter - 使用Claude Haiku 4.5以获得更快的响应速度
      const response = await openai.chat.completions.create({
        model: "anthropic/claude-haiku-4.5",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 4096,
      });

      const messageContent = response.choices[0]?.message?.content;
      if (!messageContent) {
        return res.status(500).json({ error: "No response from AI" });
      }

      // Handle both string and array content formats from OpenRouter/Claude
      let content: string;
      if (Array.isArray(messageContent)) {
        // Claude sometimes returns content as array of text blocks
        content = messageContent
          .filter((block: any) => block.type === "text")
          .map((block: any) => block.text || block.content || "")
          .join("");
      } else {
        content = messageContent;
      }

      // Strip markdown code fences if present
      content = content.trim();
      if (content.startsWith("```json")) {
        content = content.slice(7); // Remove ```json
      } else if (content.startsWith("```")) {
        content = content.slice(3); // Remove ```
      }
      if (content.endsWith("```")) {
        content = content.slice(0, -3); // Remove trailing ```
      }
      content = content.trim();

      // Parse and validate the response with defensive error handling
      let parsedResponse: MagicWordResponse;
      try {
        const rawParsed = JSON.parse(content);
        console.log("AI raw response:", JSON.stringify(rawParsed, null, 2));

        const validationResult = magicWordResponseSchema.safeParse(rawParsed);

        if (!validationResult.success) {
          console.error("AI response validation failed:", validationResult.error);
          // Attempt to salvage partial data if possible
          const verticalLenses = rawParsed.vertical_lenses;
          const horizontalLenses = rawParsed.horizontal_lenses;

          if (verticalLenses && Array.isArray(verticalLenses) && horizontalLenses && Array.isArray(horizontalLenses)) {
            // Filter valid lenses
            const validVertical = verticalLenses.filter((lens: any) =>
              lens && typeof lens.name === 'string' &&
              typeof lens.effect_line === 'string' &&
              typeof lens.example_snippet === 'string'
            );
            const validHorizontal = horizontalLenses.filter((lens: any) =>
              lens && typeof lens.name === 'string' &&
              typeof lens.effect_line === 'string' &&
              typeof lens.example_snippet === 'string'
            );

            if (validVertical.length > 0 || validHorizontal.length > 0) {
              parsedResponse = {
                vertical_lenses: validVertical,
                horizontal_lenses: validHorizontal
              };
              console.log(`Salvaged ${validVertical.length} vertical + ${validHorizontal.length} horizontal lenses`);
            } else {
              throw new Error("No valid lenses in response");
            }
          } else {
            throw new Error("Invalid response structure from AI");
          }
        } else {
          parsedResponse = validationResult.data;
          console.log(`Validation passed: ${parsedResponse.vertical_lenses.length} vertical + ${parsedResponse.horizontal_lenses.length} horizontal`);
        }
      } catch (parseError: any) {
        console.error("Failed to parse AI response:", parseError, "Raw content:", content);
        return res.status(500).json({
          error: "Failed to parse AI response",
          details: parseError.message,
        });
      }

      const duration = Date.now() - startTime;
      const totalLenses = parsedResponse.vertical_lenses.length + parsedResponse.horizontal_lenses.length;
      logger.apiSuccess(endpoint, duration, totalLenses);
      return res.json(parsedResponse);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      logger.apiError(endpoint, duration, error);
      return res.status(500).json({
        error: "Failed to generate magic words",
        details: error.message,
      });
    }
  });

  // Tension Seeds generation endpoint
  app.post("/api/tension-seeds", async (req, res) => {
    const startTime = Date.now();
    const endpoint = "/api/tension-seeds";

    try {
      // Validate request body
      const result = tensionSeedRequestSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        logger.warn("验证失败", { endpoint, error: validationError.message });
        return res.status(400).json({ error: validationError.message });
      }

      const { theme, tensionAxes, temperature } = result.data;

      logger.apiStart(endpoint, {
        themeLength: theme.length,
        axesCount: tensionAxes.length,
        temperature,
      });

      // Filter out empty tension axes
      const validAxes = tensionAxes.filter((axis) => axis.trim().length > 0);
      if (validAxes.length === 0) {
        return res.status(400).json({ error: "At least one tension axis is required" });
      }

      // Generate prompt
      const prompt = getTensionSeedPrompt(theme, validAxes, temperature);

      // 调用OpenRouter - 使用Claude Haiku 4.5以获得更快的响应速度
      const response = await openai.chat.completions.create({
        model: "anthropic/claude-haiku-4.5",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 4096,
      });

      const messageContent = response.choices[0]?.message?.content;
      if (!messageContent) {
        return res.status(500).json({ error: "No response from AI" });
      }

      // Handle both string and array content formats from OpenRouter/Claude
      let content: string;
      if (Array.isArray(messageContent)) {
        // Claude sometimes returns content as array of text blocks
        content = messageContent
          .filter((block: any) => block.type === "text")
          .map((block: any) => block.text || block.content || "")
          .join("");
      } else {
        content = messageContent;
      }

      // Strip markdown code fences if present
      content = content.trim();
      if (content.startsWith("```json")) {
        content = content.slice(7); // Remove ```json
      } else if (content.startsWith("```")) {
        content = content.slice(3); // Remove ```
      }
      if (content.endsWith("```")) {
        content = content.slice(0, -3); // Remove trailing ```
      }
      content = content.trim();

      // Parse and validate the response with defensive error handling
      let parsedResponse: TensionSeedResponse;
      try {
        const rawParsed = JSON.parse(content);
        const validationResult = tensionSeedResponseSchema.safeParse(rawParsed);
        
        if (!validationResult.success) {
          console.error("AI response validation failed:", validationResult.error);
          // Attempt to salvage partial data if possible
          if (rawParsed.tensionSeeds && Array.isArray(rawParsed.tensionSeeds) && rawParsed.tensionSeeds.length > 0) {
            // Filter valid tension seeds with proper string validation for followUpQuestions
            const validSeeds = rawParsed.tensionSeeds.filter((seed: any) => {
              if (!seed || typeof seed.seedSentence !== 'string') return false;
              if (!Array.isArray(seed.followUpQuestions)) return false;
              // Ensure all followUpQuestions are strings
              const validQuestions = seed.followUpQuestions.filter((q: any) => typeof q === 'string');
              if (validQuestions.length === 0) return false;
              // Update seed to only include valid questions
              seed.followUpQuestions = validQuestions;
              return true;
            });
            if (validSeeds.length > 0) {
              parsedResponse = { tensionSeeds: validSeeds };
            } else {
              throw new Error("No valid tension seeds in response");
            }
          } else {
            throw new Error("Invalid response structure from AI");
          }
        } else {
          parsedResponse = validationResult.data;
        }
      } catch (parseError: any) {
        console.error("Failed to parse AI response:", parseError, "Raw content:", content);
        return res.status(500).json({
          error: "Failed to parse AI response",
          details: parseError.message,
        });
      }

      const duration = Date.now() - startTime;
      logger.apiSuccess(endpoint, duration, parsedResponse.tensionSeeds.length);
      return res.json(parsedResponse);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      logger.apiError(endpoint, duration, error);
      return res.status(500).json({
        error: "Failed to generate tension seeds",
        details: error.message,
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
