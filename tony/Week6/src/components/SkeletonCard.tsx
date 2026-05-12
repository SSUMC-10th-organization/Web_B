const shimmer = `
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
`;

if (typeof document !== "undefined") {
	const style = document.createElement("style");
	style.textContent = shimmer;
	document.head.appendChild(style);
}

export default function SkeletonCard() {
	return (
		<div
			style={{
				aspectRatio: "1 / 1",
				borderRadius: "8px",
				background:
					"linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
				backgroundSize: "400px 100%",
				animation: "shimmer 1.4s ease infinite",
			}}
		/>
	);
}
