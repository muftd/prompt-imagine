/**
 * Prompt templates for generating Magic Words and Tension Seeds
 * These can be easily modified to adjust the tone, style, and output format
 */

export function getMagicWordPrompt(
  taskDescription: string,
  styleIntent: string | undefined,
  temperature: "low" | "medium" | "high"
): string {
  const temperatureGuidance = {
    low: "Be conservative and practical. Focus on well-established, proven terminology.",
    medium: "Balance creativity with practicality. Mix conventional and novel approaches.",
    high: "Be highly creative and unconventional. Push boundaries with unexpected word choices.",
  };

  return `You are an expert in prompt engineering and creative AI interaction. Your task is to generate 3-5 "Magic Words" - powerful keywords or short phrases that can shape the direction and tone of AI outputs.

**Task Description:**
${taskDescription}

**Style Intent:**
${styleIntent || "Not specified - use your judgment"}

**Creative Approach:**
${temperatureGuidance[temperature]}

**Instructions:**
Generate 3-5 magic words that would be useful for this task. For each magic word:
1. Provide the word or short phrase (2-4 words max)
2. Explain HOW this word influences AI output direction
3. Give a concrete example prompt snippet showing the word in context

**Output Format (JSON):**
Return a JSON object with this exact structure:
{
  "magicWords": [
    {
      "word": "The magic word or phrase",
      "explanation": "A clear explanation of how this word shapes AI output",
      "exampleSnippet": "A complete example prompt snippet demonstrating usage"
    }
  ]
}

**Guidelines:**
- Magic words should be evocative and purposeful
- Explanations should be practical and specific
- Example snippets should be realistic and immediately usable
- Vary the type of magic words (structural, tonal, stylistic, conceptual)
- Make them relevant to the task description

Return ONLY the JSON object, no additional text.`;
}

export function getTensionSeedPrompt(
  theme: string,
  tensionAxes: string[],
  temperature: "low" | "medium" | "high"
): string {
  const temperatureGuidance = {
    low: "Generate grounded, practical tension seeds with clear real-world applications.",
    medium: "Balance provocative ideas with actionable insights. Mix abstract and concrete.",
    high: "Be bold and provocative. Challenge assumptions and explore unexpected angles.",
  };

  return `You are a creative strategist specializing in generative tension and ideation. Your task is to create "Tension Seeds" - provocative, Tweet-like statements that capture creative friction and spark new thinking.

**Theme:**
${theme}

**Tension Axes:**
${tensionAxes.map((axis, i) => `${i + 1}. ${axis}`).join('\n')}

**Creative Approach:**
${temperatureGuidance[temperature]}

**Instructions:**
Generate 3-5 tension seeds based on the theme and tension axes. Each seed should:
1. Be a single, punchy sentence (like a great tweet)
2. Create productive tension or challenge assumptions
3. Be visually evocative and memorable
4. Include 2 follow-up questions that help explore the seed's implications

**Output Format (JSON):**
Return a JSON object with this exact structure:
{
  "tensionSeeds": [
    {
      "seedSentence": "A provocative, tweet-worthy statement",
      "followUpQuestions": [
        "First follow-up question to deepen exploration",
        "Second follow-up question to expand thinking"
      ]
    }
  ]
}

**Guidelines:**
- Seed sentences should be punchy and memorable (under 20 words)
- Create genuine tension between the axes provided
- Follow-up questions should open new avenues of thought
- Make it relevant to demos, articles, or product narratives
- Be specific enough to be useful, general enough to inspire

Return ONLY the JSON object, no additional text.`;
}
