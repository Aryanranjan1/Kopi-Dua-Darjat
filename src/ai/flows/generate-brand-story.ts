'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a brand story for Kopi Dua Darjat.
 *
 * The flow takes a media publication type as input and returns a brand story tailored for that publication.
 * - generateBrandStory - A function that generates the brand story.
 * - GenerateBrandStoryInput - The input type for the generateBrandStory function.
 * - GenerateBrandStoryOutput - The return type for the generateBrandStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBrandStoryInputSchema = z.object({
  publicationType: z
    .string()
    .describe("The type of media publication for which the brand story is being generated (e.g., 'magazine', 'blog', 'social media')."),
});
export type GenerateBrandStoryInput = z.infer<typeof GenerateBrandStoryInputSchema>;

const GenerateBrandStoryOutputSchema = z.object({
  brandStory: z.string().describe('The generated brand story.'),
});
export type GenerateBrandStoryOutput = z.infer<typeof GenerateBrandStoryOutputSchema>;

export async function generateBrandStory(input: GenerateBrandStoryInput): Promise<GenerateBrandStoryOutput> {
  return generateBrandStoryFlow(input);
}

const generateBrandStoryPrompt = ai.definePrompt({
  name: 'generateBrandStoryPrompt',
  input: {schema: GenerateBrandStoryInputSchema},
  output: {schema: GenerateBrandStoryOutputSchema},
  prompt: `You are an expert marketing copywriter specializing in crafting compelling brand stories for food and beverage companies.

  Your task is to generate a brand story for Kopi Dua Darjat, a café brand with the personality of being heritage, artisan, warm, and rustic yet modern - \"Antara Warisan & Artisan.\"

  The brand story should be tailored for the following type of media publication: {{{publicationType}}}.

  Here's some background information about Kopi Dua Darjat:
  *   Brand Name: Kopi Dua Darjat
  *   Tagline: Antara Warisan & Artisan
  *   Heritage: Kopi Kampung style
  *   Outlets: 50+
  *   Price range: RM3-6
  *   Target Audience:
  * Local customers (16–40, mobile-first, price-conscious)
  * Franchise prospects (20–50, entrepreneurial)
  * Media / Partners
  * Admin/Outlet Managers
  * Business Goals:
  * Centralize outlets & franchise leads
  * Increase local SEO visibility
  * Promote signature drinks and heritage
  * Simplify admin operations
  * Our Story:
  * Founders: Hadi + Azad
  * Brand Timeline: Nov 2020 → 50+ outlets
  * Brewing method & kopi kampung heritage
  * Press mentions / awards
  * Mission & values

  Write a brand story that captures the essence of Kopi Dua Darjat and resonates with the target audience of the specified publication type.
  The brand story must be less than 200 words.
  `,
});

const generateBrandStoryFlow = ai.defineFlow(
  {
    name: 'generateBrandStoryFlow',
    inputSchema: GenerateBrandStoryInputSchema,
    outputSchema: GenerateBrandStoryOutputSchema,
  },
  async input => {
    const {output} = await generateBrandStoryPrompt(input);
    return output!;
  }
);
