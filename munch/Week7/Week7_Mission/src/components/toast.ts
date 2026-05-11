type ToastType = "success" | "error" | "info";

export type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

export const TOAST_EVENT = "toast:add";

let toastId = 0;

export const toast = {
  success: (message: string) => {
    window.dispatchEvent(
      new CustomEvent(TOAST_EVENT, {
        detail: { id: ++toastId, message, type: "success" } satisfies ToastItem,
      }),
    );
  },
  error: (message: string) => {
    window.dispatchEvent(
      new CustomEvent(TOAST_EVENT, {
        detail: { id: ++toastId, message, type: "error" } satisfies ToastItem,
      }),
    );
  },
  info: (message: string) => {
    window.dispatchEvent(
      new CustomEvent(TOAST_EVENT, {
        detail: { id: ++toastId, message, type: "info" } satisfies ToastItem,
      }),
    );
  },
};
