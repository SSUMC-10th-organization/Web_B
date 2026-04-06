export default function LoadingSpinner() {
	return (
		<div className="flex justify-center items-center h-96">
			<div className="w-10 h-10 border-4 border-green-300 border-t-transparent rounded-full animate-spin" />
		</div>
	);
}
