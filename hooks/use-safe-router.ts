'use client';

import { useRouter } from 'next/navigation';

export function useSafeRouter() {
  try {
    return useRouter();
  } catch {
    return {
      back: () => {
        if (typeof window !== 'undefined') window.history.back();
      },
      push: (url: string) => {
        if (typeof window !== 'undefined') window.location.href = url;
      },
      replace: (url: string) => {
        if (typeof window !== 'undefined') window.location.replace(url);
      },
      prefetch: () => {},
      refresh: () => {},
      forward: () => {},
    };
  }
}
