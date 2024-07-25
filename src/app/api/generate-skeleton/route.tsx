import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();
  const PROMPT: string = `Generate a loading skeleton using TailwindCSS for the following HTML code:

${prompt}`;

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system: `You are an expert in HTML and Tailwind CSS. Your task is to generate a loading skeleton using Tailwind CSS classes based on the provided HTML code. The skeleton code should use TailwindCSS placeholders to simulate content loading and should have "pulse" animations. Only return the HTML code without any additional explanations, comments or markdown formatting.`,
    prompt: PROMPT,
  });

  return result.toAIStreamResponse();
}
