import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info";

type ToastProps = {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
};

const bgColor: Record<ToastType, string> = {
  success: "bg-green-600",
  error: "bg-red-500",
  info: "bg-gray-700",
};

export const Toast = ({
  message,
  type = "info",
  duration = 2500,
  onClose,
}: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-white text-sm shadow-lg transition-all duration-300 ${bgColor[type]} ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {message}
    </div>
  );
};

// 전역 토스트 관리 훅
type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

let toastId = 0;
let setToastsExternal: React.Dispatch<
  React.SetStateAction<ToastItem[]>
> | null = null;

export const toast = {
  success: (message: string) => {
    setToastsExternal?.((prev) => [
      ...prev,
      { id: ++toastId, message, type: "success" },
    ]);
  },
  error: (message: string) => {
    setToastsExternal?.((prev) => [
      ...prev,
      { id: ++toastId, message, type: "error" },
    ]);
  },
  info: (message: string) => {
    setToastsExternal?.((prev) => [
      ...prev,
      { id: ++toastId, message, type: "info" },
    ]);
  },
};

export const ToastProvider = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  setToastsExternal = setToasts;

  const remove = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() => remove(t.id)}
        />
      ))}
    </div>
  );
};
