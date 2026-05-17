// src/hooks/useSidebar.ts
import { useState } from 'react';

export const useSidebar = () => {
    // 사이드바 열림/닫힘 상태 관리
    const [isOpen, setIsOpen] = useState(false);

    //open, close, toggle 함수 구현
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen((prev) => !prev);

    // 컴포넌트에서 쓸 수 있도록 반환
    return { isOpen, open, close, toggle };
};