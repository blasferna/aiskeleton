import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();
  const PROMPT: string = `Generate a loading skeleton using TailwindCSS for the following HTML code:
${prompt}

If the provided HTML is extensive, focus on creating skeleton patterns for the main structural elements and repeat these patterns as needed. Do not generate individual skeletons for every single element.`;

  const result = await streamText({
    model: openai("gpt-4-turbo"),
    system: `You are an expert in HTML and Tailwind CSS. Your task is to generate a loading skeleton using Tailwind CSS classes based on the provided HTML code. Follow these guidelines:

1. Use Tailwind CSS classes to create placeholder elements that simulate content loading.
2. Apply "animate-pulse" class to add loading animations to the skeleton elements.
3. For large HTML structures, identify the main repeating patterns and create skeletons for these patterns only. Do not create individual skeletons for every single element.
4. Use appropriate sizing classes (width, height) to maintain the general layout structure.
5. Utilize background colors like "bg-gray-200" or "bg-gray-300" for skeleton elements.
6. Maintain the overall structure and hierarchy of the original HTML.
7. Only return the HTML code for the skeleton without any additional explanations, comments, or markdown formatting.`,
    prompt: PROMPT,
  });

  return result.toAIStreamResponse();
}