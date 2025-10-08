
import { cerebras } from '@ai-sdk/cerebras';
import { generateText } from 'ai';

export const maxDuration = 30;
export const runtime = 'edge';

export async function POST() {
  try {
    const topics = ["fun", "curious", "philosophical", "random", "programming", "tech"];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    const { text } = await generateText({
      model: cerebras('llama3.1-8b'),
      prompt: `Create 3 open-ended questions in a ${randomTopic} tone, separated by '||', for an anonymous social Q&A platform. Avoid personal or sensitive topics.`,
      temperature: 0.9,
      maxTokens: 300,
    });


    return new Response(text);
  } catch (error) {
    console.error('Error calling Cerebras:', error);
    return Response.json(
      {
        success: false,
        message: 'Failed to generate response from Cerebras.',
      },
      { status: 500 }
    );
  }
}
