'use client';

import { useRef, useLayoutEffect, useCallback } from 'react';

/**
 * A React hook that dynamically adjusts the font size of an element to fit within its parent container.
 * This is particularly useful for creating "perfect-fit" headlines.
 *
 * @template T - The type of the DOM element to be fitted (e.g., HTMLHeadingElement).
 * @param containerRef - A React ref object pointing to the container element whose width will be used as the boundary.
 * @returns A React ref object to be attached to the text element that needs to be resized.
 */
export function useFitText<T extends HTMLElement>(
  containerRef: React.RefObject<HTMLElement>
) {
  const elementRef = useRef<T>(null);

  const fitText = useCallback(() => {
    const element = elementRef.current;
    const container = containerRef.current;

    if (!element || !container) {
      return;
    }

    // Reset styles on mobile to let CSS handle wrapping
    if (window.innerWidth <= 768) {
      element.style.fontSize = ''; // Remove inline style
      return;
    }
    
    element.style.whiteSpace = 'nowrap';
    element.style.display = 'block';

    // Start with a very large font size to find the max possible size
    let fontSize = 200; 
    element.style.fontSize = `${fontSize}px`;

    // Iteratively reduce font size until the text fits within the container
    while (element.scrollWidth > container.offsetWidth && fontSize > 12) {
      fontSize--;
      element.style.fontSize = `${fontSize}px`;
    }
  }, [containerRef]);

  // useLayoutEffect runs synchronously after all DOM mutations.
  // This is preferred over useEffect for DOM measurements to avoid flickering.
  useLayoutEffect(() => {
    fitText();
    
    // Add event listener to refit text on window resize
    window.addEventListener('resize', fitText);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('resize', fitText);
    };
  }, [fitText]); // Rerun the effect if the fitText function changes

  return elementRef;
}
