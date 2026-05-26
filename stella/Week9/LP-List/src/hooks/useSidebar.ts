import { useState, useEffect } from "react";

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    setIsOpen(false);
    document.body.style.overflow = "unset";
  };

  const toggle = () => {
    if (isOpen) close();
    else open();
  };

  // ESC 키 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // 컴포넌트 언마운트 시 스크롤 복구
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return { isOpen, open, close, toggle };
}
