
'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for tracking the state of a CSS media query.
 * @param query The media query string to match.
 * @returns `true` if the media query matches, `false` otherwise.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => {
      setMatches(media.matches);
    };

    media.addEventListener('change', listener);

    return () => {
      media.removeEventListener('change', listener);
    };
  }, [matches, query]);

  return matches;
}
