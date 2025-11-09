
import { ai } from '@/ai/genkit';
import { handleRequest } from '@genkit-ai/next';

// All Genkit flows and tools are defined in the plugin.
// This handler now ONLY deals with Genkit flows.
const handler = handleRequest({
  flows: [ai],
});

export const GET = handler;
export const POST = handler;
