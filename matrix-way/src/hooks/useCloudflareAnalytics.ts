import { useCallback } from 'react';

export function useCloudflareAnalytics() {
  const trackEvent = useCallback((eventName: string, data?: Record<string, any>) => {
    const consent = localStorage.getItem('consent') === "true";
    if (!consent) return; 

    if (!window._cfq) {
      window._cfq = [];
    }

    window._cfq.push([
      "trackEvent",
      {
        name: eventName,
        ...data,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  return { trackEvent };
}