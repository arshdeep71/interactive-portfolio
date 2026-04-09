import { useState, useEffect } from "react";

/**
 * A hook that delays the visibility of a loading state to prevent flickering
 * on fast network requests or rapid UI updates.
 *
 * @param isLoading the current actual loading state
 * @param delayMs time in milliseconds to wait before showing the loading skeleton (default: 300ms)
 * @returns boolean indicating whether to actually show the loading skeleton
 */
export function useSmartSkeleton(isLoading: boolean, delayMs = 300) {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      // Delay showing the skeleton to avoid flicker on fast loads
      timeoutId = setTimeout(() => {
        setShowSkeleton(true);
      }, delayMs);
    } else {
      // Hide immediately when no longer loading
      setShowSkeleton(false);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isLoading, delayMs]);

  return showSkeleton;
}
