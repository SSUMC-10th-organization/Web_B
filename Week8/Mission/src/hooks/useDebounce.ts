import { useEffect, useState } from 'react';

/**
 * 값이 변경된 후 일정 시간이 지나야만 최종 값을 반환하는 커스텀 훅
 * @param value 디바운스를 적용할 입력 값
 * @param delay 지연 시간 (ms)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 후에 상태를 업데이트하는 타이머 설정
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 클린업 함수: value나 delay가 바뀌면 즉시 이전 타이머를 취소하고 새로 시작
    // 컴포넌트가 언마운트될 때도 실행되어 메모리 누수를 방지함
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // value와 delay가 변경될 때마다 이펙트 재실행

  return debouncedValue;
}