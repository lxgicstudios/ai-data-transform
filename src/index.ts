import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";

function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error(
      "Missing OPENAI_API_KEY environment variable.\n" +
      "Get one at https://platform.openai.com/api-keys then:\n" +
      "  export OPENAI_API_KEY=sk-..."
    );
    process.exit(1);
  }
  return new OpenAI({ apiKey });
}

export async function generate(input: string): Promise<string> {
  const openai = getOpenAI();
  const userContent = `Generate an ETL script for this transformation: ${input}`;
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: `You are a data engineering expert. Generate a complete, working ETL script for the requested transformation. Use Node.js by default. Include error handling, logging, and batch processing where appropriate. Add comments explaining the approach. Output production-ready code.` },
      { role: "user", content: userContent }
    ],
    temperature: 0.7,
  });
  return response.choices[0].message.content || "";
}
