export default function SkeletonComment() {
	return (
		<div className="flex gap-3 py-3 border-b border-gray-100 items-start">
			{/* 아바타 원형 */}
			<div className="w-8 h-8 rounded-full shrink-0 skeleton" />
			{/* 이름 + 내용 */}
			<div className="flex-1 flex flex-col gap-[0.4rem] pt-[0.2rem]">
				<div className="w-[28%] h-3 rounded skeleton" />
				<div className="w-[80%] h-3 rounded skeleton" />
			</div>
		</div>
	);
}
