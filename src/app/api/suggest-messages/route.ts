import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import type {CreateMessage} from 'ai'
import { success } from 'zod/v4';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const messages: CreateMessage[] = [
    {
      role: "user",
      content: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."
    }
  ];

  try {
    const result = streamText({
      model: openai('gpt-4o'),
      maxTokens: 300,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("unexpected error occured")
    return Response.json({
      success: false,
      message: "error suggesting message"
    },
      {
        status: 500
      })
  }
}