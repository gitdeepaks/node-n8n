import prisma from '@/lib/db';
import { inngest } from './client';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { step } from 'inngest';
import { sleep } from '@trpc/server/unstable-core-do-not-import';
import { createOpenAI } from '@ai-sdk/openai';
import { createGroq } from '@ai-sdk/groq';

const google = createGoogleGenerativeAI();
const openAI = createOpenAI({
  apiKey: process.env.OPEN_API_KEY,
});
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const execute = inngest.createFunction(
  { id: 'execute' },
  { event: 'execute/ai' },
  async ({ event, step }) => {
    await step.sleep('Quied Pretender', '5s');
    const { steps: geminiSteps } = await step.ai.wrap(
      'gemini-generate-text',
      generateText,
      {
        model: google('gemini-2.5-flash'),
        system: 'You are the helpful assistant',
        prompt: 'Which is Better AI SDK-5 or Langchain and Langraph ?',
      }
    );
    await step.sleep('Quied Pretender', '5s');
    const { steps: openAISteps } = await step.ai.wrap(
      'openai-generate-text',
      generateText,
      {
        model: openAI('gpt-4'),
        system: 'You are the helpful assistant',
        prompt: 'Which is Better AI SDK-5 or Langchain and Langraph ?',
      }
    );
    const { steps: groqSteps } = await step.ai.wrap(
      'groq-generate-text',
      generateText,
      {
        model: groq('llama-3.3-70b-versatile'),
        system: 'You are the helpful assistant',
        prompt: 'Which is Better AI SDK-5 or Langchain and Langraph ?',
      }
    );
    return {
      geminiSteps,
      openAISteps,
      groqSteps,
    };
  }
);
