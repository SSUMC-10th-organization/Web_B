export const LoadingSpinner = () => (
	<div className="flex justify-center items-center py-20">
		<div className="w-10 h-10 border-4 border-[#e91e8c] border-t-transparent rounded-full animate-spin" />
	</div>
);

export const ErrorFallback = ({ onRetry }: { onRetry: () => void }) => (
	<div className="flex flex-col items-center justify-center py-20 text-gray-400">
		<p className="mb-4">데이터를 불러오는 중 오류가 발생했습니다.</p>
		<button
			type="button"
			onClick={onRetry}
			className="px-4 py-2 bg-[#e91e8c] text-white rounded hover:bg-[#c2185b] transition-colors"
		>
			다시 시도
		</button>
	</div>
);
