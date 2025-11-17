import type { Express } from "express";
import { createServer, type Server } from "http";
import { openai } from "./lib/openai";
import { getMagicWordPrompt, getTensionSeedPrompt } from "./lib/prompts";
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
    try {
      // Validate request body
      const result = magicWordRequestSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ error: validationError.message });
      }

      const { taskDescription, styleIntent, temperature } = result.data;

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
        const validationResult = magicWordResponseSchema.safeParse(rawParsed);
        
        if (!validationResult.success) {
          console.error("AI response validation failed:", validationResult.error);
          // Attempt to salvage partial data if possible
          if (rawParsed.magicWords && Array.isArray(rawParsed.magicWords) && rawParsed.magicWords.length > 0) {
            // Filter valid magic words
            const validWords = rawParsed.magicWords.filter((word: any) => 
              word && typeof word.word === 'string' && 
              typeof word.explanation === 'string' && 
              typeof word.exampleSnippet === 'string'
            );
            if (validWords.length > 0) {
              parsedResponse = { magicWords: validWords };
            } else {
              throw new Error("No valid magic words in response");
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

      return res.json(parsedResponse);
    } catch (error: any) {
      console.error("Error generating magic words:", error);
      return res.status(500).json({
        error: "Failed to generate magic words",
        details: error.message,
      });
    }
  });

  // Tension Seeds generation endpoint
  app.post("/api/tension-seeds", async (req, res) => {
    try {
      // Validate request body
      const result = tensionSeedRequestSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ error: validationError.message });
      }

      const { theme, tensionAxes, temperature } = result.data;

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

      return res.json(parsedResponse);
    } catch (error: any) {
      console.error("Error generating tension seeds:", error);
      return res.status(500).json({
        error: "Failed to generate tension seeds",
        details: error.message,
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
