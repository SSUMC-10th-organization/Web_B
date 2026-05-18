type ConfirmModalProps = {
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
};

const ConfirmModal = ({ message, onConfirm, onCancel }: ConfirmModalProps) => {
	return (
		<div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
			<div className="bg-[#1e1e1e] rounded-2xl p-8 flex flex-col items-center gap-6 min-w-[280px] relative">
				<button
					type="button"
					onClick={onCancel}
					className="absolute top-4 right-4 text-gray-400 hover:text-white"
				>
					✕
				</button>
				<p className="text-white text-center">{message}</p>
				<div className="flex gap-4">
					<button
						type="button"
						onClick={onConfirm}
						className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
					>
						예
					</button>
					<button
						type="button"
						onClick={onCancel}
						className="px-6 py-2 bg-[#e91e8c] text-white rounded-lg font-medium hover:bg-[#c2185b] transition-colors"
					>
						아니오
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmModal;
