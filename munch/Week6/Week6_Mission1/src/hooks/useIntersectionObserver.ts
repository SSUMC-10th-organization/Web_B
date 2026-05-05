import { useEffect, useRef } from "react";

export const useIntersectionObserver = (
  callback: () => void,
  hasNextPage: boolean | undefined,
) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          callback();
        }
      },
      { threshold: 0.5 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [callback, hasNextPage]);

  return observerRef;
};
