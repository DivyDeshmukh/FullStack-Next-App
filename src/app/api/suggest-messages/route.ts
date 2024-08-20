import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";
import { NextResponse } from "next/server";
import OpenAI from "openai/index.mjs";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: openai("gpt-4-turbo"),
      messages: convertToCoreMessages(messages),
    });

    return result.toDataStreamResponse();
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json(
        {
          name,
          status,
          headers,
          message,
        },
        { status: 500 }
      );
    } else {
      console.log(error);
      throw error;
    }
  }
}
