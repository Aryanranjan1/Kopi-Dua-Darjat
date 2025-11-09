
import { ai } from '@/ai/genkit';
import { handleRequest } from '@genkit-ai/next/server';
import * as functions from '@/app/api/[[...route]]/functions/instagram-sync';

// All flows and tools are defined in the plugin.
// This will register all flows and tools with Genkit.
// See the Genkit docs for more info: https://genkit.dev/docs/flow/define

const handler = handleRequest({
  // The tools available to the model.
  tools: [],
  // Where to find the flows.
  flows: [ai],
  // Pass in your custom functions
  customFunctions: functions,
});

export const GET = handler;
export const POST = handler;
