import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { VISUALIZER_SYSTEM_PROMPT } from './prompts';
import type { AlgoTrace } from '@/types/visualization';

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function generateVisualization(code: string): Promise<AlgoTrace> {
  const response = await client.send(
    new InvokeModelCommand({
      modelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-sonnet-4-20250514-v1:0',
      contentType: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 8192,
        messages: [
          {
            role: 'user',
            content: `Analyze this Python code and generate a step-by-step visualization trace:\n\n\`\`\`python\n${code}\n\`\`\``,
          },
        ],
        system: VISUALIZER_SYSTEM_PROMPT,
      }),
    })
  );

  const result = JSON.parse(new TextDecoder().decode(response.body));
  const text = result.content[0].text;

  // Parse the JSON response, handling potential markdown code fences
  let jsonStr = text.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  return JSON.parse(jsonStr) as AlgoTrace;
}
