
import { ai } from '@/ai/genkit';
import { handleRequest } from '@genkit-ai/next';
import * as adminFunctions from '@/app/api/[[...route]]/functions/instagram-sync';

// All Genkit flows and tools are defined in the plugin.
const handler = handleRequest({
  // Genkit flows
  flows: [ai],
  // Custom Firebase Functions
  customFunctions: adminFunctions,
});

export const GET = handler;
export const POST = handler;
