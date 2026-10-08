import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 30;

export async function POST() {
  try {
    const topics = ["fun", "curious", "philosophical", "random", "programming", "tech"];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    const { text } = await generateText({
      model: google('gemini-1.5-flash'), // Updated to stable model
      prompt: `Create 3 open ended questions in a ${randomTopic} tone, separated by '||', for an anonymous social Q&A platform. Avoid quotes.`,
      temperature: 0.9,
      maxTokens: 300,
    });

    return new Response(text);
  } catch (error) {
    console.error('Error calling Google Gemini:', error);
    return Response.json(
      {
        success: false,
        message: 'Failed to generate response from AI.',
      },
      { status: 500 }
    );
  }
}