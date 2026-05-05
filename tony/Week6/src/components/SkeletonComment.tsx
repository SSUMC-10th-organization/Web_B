const shimmerStyle = {
	background: "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
	backgroundSize: "400px 100%",
	animation: "shimmer 1.4s ease infinite",
} as const;

export default function SkeletonComment() {
	return (
		<div
			style={{
				display: "flex",
				gap: "0.75rem",
				padding: "0.75rem 0",
				borderBottom: "1px solid #f3f4f6",
				alignItems: "flex-start",
			}}
		>
			{/* 아바타 원형 */}
			<div
				style={{
					width: 32,
					height: 32,
					borderRadius: "50%",
					flexShrink: 0,
					...shimmerStyle,
				}}
			/>
			{/* 이름 + 내용 */}
			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					gap: "0.4rem",
					paddingTop: "0.2rem",
				}}
			>
				<div
					style={{ width: "28%", height: 12, borderRadius: 4, ...shimmerStyle }}
				/>
				<div
					style={{ width: "80%", height: 12, borderRadius: 4, ...shimmerStyle }}
				/>
			</div>
		</div>
	);
}
