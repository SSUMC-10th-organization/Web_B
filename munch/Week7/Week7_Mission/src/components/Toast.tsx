import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info";

export type ToastItem = {
	id: number;
	message: string;
	type: ToastType;
};

const TOAST_EVENT = "toast:add";

let toastId = 0;

// eslint-disable-next-line react-refresh/only-export-components
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

const bgColor: Record<ToastType, string> = {
	success: "bg-green-600",
	error: "bg-red-500",
	info: "bg-gray-700",
};

type ToastItemProps = {
	item: ToastItem;
	onClose: (id: number) => void;
};

const ToastItemComponent = ({ item, onClose }: ToastItemProps) => {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setVisible(false);
			setTimeout(() => onClose(item.id), 300);
		}, 2500);
		return () => clearTimeout(timer);
	}, [item.id, onClose]);

	return (
		<div
			className={`px-5 py-3 rounded-xl text-white text-sm shadow-lg transition-all duration-300 ${bgColor[item.type]} ${
				visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
			}`}
		>
			{item.message}
		</div>
	);
};

export const ToastProvider = () => {
	const [toasts, setToasts] = useState<ToastItem[]>([]);

	useEffect(() => {
		const handler = (e: Event) => {
			const detail = (e as CustomEvent).detail as ToastItem;
			setToasts((prev) => [...prev, detail]);
		};

		window.addEventListener(TOAST_EVENT, handler);
		return () => window.removeEventListener(TOAST_EVENT, handler);
	}, []);

	const remove = (id: number) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	};

	return (
		<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center">
			{toasts.map((t) => (
				<ToastItemComponent key={t.id} item={t} onClose={remove} />
			))}
		</div>
	);
};
