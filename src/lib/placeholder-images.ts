
// This file is deprecated and will be removed in a future update.
// All image data is now managed by src/lib/media.ts and fetched dynamically.

import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  linkUrl?: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
