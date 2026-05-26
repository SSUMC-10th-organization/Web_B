import { useEffect, useRef } from "react";

export function useThrottle<
  T extends (...args: Parameters<T>) => ReturnType<T>,
>(callback: T, interval: number): T {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const throttled = (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallRef.current;

    if (timeSinceLastCall >= interval) {
      lastCallRef.current = now;
      callback(...args);
      console.log(`[Throttle] 호출됨 (interval: ${interval}ms)`);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now();
        callback(...args);
        console.log(`[Throttle] 지연 호출됨 (interval: ${interval}ms)`);
      }, interval - timeSinceLastCall);
    }
  };

  return throttled as T;
}
