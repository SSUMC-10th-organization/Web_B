// src/hooks/useThrottle.ts
import { useRef, useCallback, useEffect } from "react";

export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  interval: number
): T {
  const lastExecuted = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 컴포넌트의 상태가 변할 때마다 가장 "최신의 함수"를 몰래 저장해둡니다.
  const callbackRef = useRef<T>(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastExecuted.current >= interval) {
        // 과거의 callback이 아니라, 항상 최신인 callbackRef.current를 실행
        callbackRef.current(...args);
        lastExecuted.current = now;
      } else if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          // 여기서도 최신 함수를 실행
          callbackRef.current(...args);
          lastExecuted.current = Date.now();
          timerRef.current = null;
        }, interval - (now - lastExecuted.current));
      }
    },
    [interval]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return throttledCallback as T;
}