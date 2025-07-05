// import { openai } from '@ai-sdk/openai';
// import { streamText } from 'ai';
// import type { CreateMessage } from 'ai';

// // Allow streaming responses up to 300 seconds
export const maxDuration = 300;

// export async function POST() {
//   const messages: CreateMessage[] = [
//     {
//       role: "user",
//       content: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."
//     }
//   ];



// try {
//   const result =  streamText({
//     model: openai('gpt-4o'),
//     messages,
//   });

//   console.log("result : ", result);
//   return result.toDataStreamResponse();
// } catch (error) { 
//   console.error("unexpected error occurred", error);
//   return Response.json(
//     {
//       success: false,
//       message: "error suggesting message"
//     },
//     {
//       status: 500
//     }
//   );
// }

// }


// File: /src/app/api/suggest-messages/route.ts
// import { OpenAI } from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST() {
//   try {
//     const chatCompletion = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo', // use 'gpt-4' only if you have access
//       messages: [
//         {
//           role: 'user',
//           content:
//             "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me. Avoid personal topics. Example: 'What's your dream job?||What's something simple that makes you happy?||If you could learn one skill instantly, what would it be?'",
//         },
//       ],
//     });

//     const aiResponse = chatCompletion.choices[0].message?.content ?? 'error';

//     return Response.json({
//       success: true,
//       message: aiResponse,
//     });
//   } catch (error) {
//     console.error('Error calling OpenAI API:', error);
//     return Response.json(
//       {
//         success: false,
//         message: 'Error suggesting message',
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }


// import { google } from '@ai-sdk/google';
// import { generateText } from 'ai';

// export const maxDuration = 300;

// export async function POST() {
//   try {
//     const result = await generateText({
//       model: google('gemini-pro'),
//       prompt: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me. Avoid personal topics. Example: 'What's your dream job?||What's something simple that makes you happy?||If you could learn one skill instantly, what would it be?'",
//       maxTokens: 300,
//     });

//     return Response.json({
//       success: true,
//       message: result.text,
//     });
//   } catch (error) {
//     console.error('Error calling Google Generative AI:', error);
//     return Response.json(
//       {
//         success: false,
//         message: 'Error suggesting message',
//       },
//       { status: 500 }
//     );
//   }
// }



// app/api/suggest-messages/route.ts

// import { google } from '@ai-sdk/google';
// import { generateText } from 'ai';

// export const maxDuration = 30; // seconds for streaming (if used)

// export async function POST() {
//   try {
//     const result = await generateText({
//       model: google('gemini-1.5-pro-latest'),
//       prompt: `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me. Avoid personal topics. Example: "What's your dream job?||What's something simple that makes you happy?||If you could learn one skill instantly, what would it be?"`,
//       maxTokens: 300,
//     });

//     return Response.json({
//       success: true,
//       message: result.text,
//     });
//   } catch (error) {
//     console.error('Error calling Google Generative AI:', error);
//     return Response.json(
//       {
//         success: false,
//         message: 'Error suggesting message',
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }



// import { OpenAI } from 'openai';
// import { ru } from 'zod/v4/locales';

// // Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // Make sure to set this in your environment variables
// });

// async function runChat() {
//   try {
//     const chatCompletion = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo', // or "gpt-3.5-turbo"
//       messages: [
//         { role: 'system', content: 'You are a helpful assistant.' },
//         { role: 'user', content: 'Tell me a joke about JavaScript.' },
//       ],
//       max_tokens: 150, // Adjust as needed
//     });

//     console.log('Response:', chatCompletion.choices[0].message?.content, chatCompletion);
//   } catch (error) {
//     console.error('Error calling OpenAI API:', error);
//   }
// }

// runChat();

// export const POST = runChat;

import { cerebras } from '@ai-sdk/cerebras';
import { generateText } from 'ai';

export const runtime = 'edge'; // Optional for performance
// export const maxDuration = 30; // Optional execution time limit

export async function POST() {
  try {
    const { text } = await generateText({
      model: cerebras('llama3.1-8b'),
      prompt: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.",
      maxTokens: 300, // Optional: controls output length
    });

    console.log('Cerebras response:', text);

    // return Response.json({
    //   success: true,
    //   message: text,
    // });
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
