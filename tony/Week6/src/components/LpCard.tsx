import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Lp } from "../apis/lp";

interface LpCardProps {
	lp: Lp;
}

export default function LpCard({ lp }: LpCardProps) {
	const navigate = useNavigate();
	const [hovered, setHovered] = useState(false);

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: 카드 전체를 클릭 가능한 영역으로 사용
		// biome-ignore lint/a11y/noStaticElementInteractions: 카드 전체를 클릭 가능한 영역으로 사용
		<div
			onClick={() => navigate(`/lp/${lp.id}`)}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			style={{
				position: "relative",
				borderRadius: "10px",
				overflow: "hidden",
				cursor: "pointer",
				aspectRatio: "1 / 1",
				backgroundColor: "#1f2937",
				transform: hovered ? "scale(1.04)" : "scale(1)",
				transition: "transform 0.2s ease",
				boxShadow: hovered
					? "0 8px 24px rgba(0,0,0,0.25)"
					: "0 2px 8px rgba(0,0,0,0.1)",
			}}
		>
			<img
				src={lp.thumbnail}
				alt={lp.title}
				style={{
					width: "100%",
					height: "100%",
					objectFit: "cover",
					display: "block",
				}}
			/>

			{/* hover 오버레이 */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
					opacity: hovered ? 1 : 0,
					transition: "opacity 0.2s ease",
					display: "flex",
					flexDirection: "column",
					justifyContent: "flex-end",
					padding: "0.75rem",
					gap: "0.25rem",
				}}
			>
				<div
					style={{
						fontWeight: "bold",
						fontSize: "0.95rem",
						color: "#fff",
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					}}
				>
					{lp.title}
				</div>
				<div style={{ fontSize: "0.78rem", color: "#d1d5db" }}>
					{lp.createdAt?.slice(0, 10)}
				</div>
				<div style={{ fontSize: "0.78rem", color: "#f9a8d4" }}>
					❤️ {lp.likes?.length ?? 0}
				</div>
			</div>

			{/* 기본 하단 정보 (hover 아닐 때) */}
			{!hovered && (
				<div
					style={{
						position: "absolute",
						bottom: 0,
						left: 0,
						right: 0,
						padding: "0.5rem 0.6rem",
						background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
						color: "#fff",
						fontSize: "0.78rem",
					}}
				>
					<div
						style={{
							fontWeight: "bold",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
					>
						{lp.title}
					</div>
					<div style={{ opacity: 0.75 }}>{lp.createdAt?.slice(0, 10)}</div>
				</div>
			)}
		</div>
	);
}
