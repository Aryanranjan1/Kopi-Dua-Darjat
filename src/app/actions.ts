'use server';

import { generateBrandStory } from '@/ai/flows/generate-brand-story';
import { z } from 'zod';

const BrandStorySchema = z.object({
  publicationType: z.string().min(1, { message: 'Publication type is required' }),
});

export type BrandStoryState = {
  message?: string | null;
  brandStory?: string | null;
  errors?: {
    publicationType?: string[];
  };
};

export async function generateBrandStoryAction(
  prevState: BrandStoryState,
  formData: FormData
) : Promise<BrandStoryState> {
  const validatedFields = BrandStorySchema.safeParse({
    publicationType: formData.get('publicationType'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid input',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await generateBrandStory({ publicationType: validatedFields.data.publicationType });
    return {
      ...prevState,
      message: 'success',
      brandStory: result.brandStory,
    };
  } catch (error) {
    console.error(error);
    return {
      ...prevState,
      message: 'error',
      brandStory: null,
    };
  }
}
