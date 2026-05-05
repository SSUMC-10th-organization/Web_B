import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const linkStyle = ({ isActive }: { isActive: boolean }) => ({
		display: "flex",
		alignItems: "center",
		gap: "0.5rem",
		padding: "0.6rem 1rem",
		borderRadius: "6px",
		textDecoration: "none",
		color: isActive ? "#ec4899" : "#374151",
		fontWeight: isActive ? ("bold" as const) : ("normal" as const),
		backgroundColor: isActive ? "#fdf2f8" : "transparent",
		fontSize: "0.95rem",
	});

	return (
		<>
			{/* 모바일 오버레이 */}
			{isMobile && isOpen && (
				<button
					type="button"
					onClick={onClose}
					aria-label="사이드바 닫기"
					style={{
						position: "fixed",
						inset: 0,
						background: "rgba(0,0,0,0.3)",
						zIndex: 8,
						top: "60px",
						border: "none",
						cursor: "default",
						padding: 0,
					}}
				/>
			)}

			<aside
				style={{
					width: "200px",
					minHeight: "calc(100vh - 60px)",
					borderRight: "1px solid #e5e7eb",
					padding: "1.25rem 0.75rem",
					backgroundColor: "#fff",
					flexShrink: 0,
					...(isMobile
						? {
								position: "fixed" as const,
								top: "60px",
								left: 0,
								zIndex: 9,
								transform: isOpen ? "translateX(0)" : "translateX(-100%)",
								transition: "transform 0.25s ease",
								boxShadow: isOpen ? "4px 0 12px rgba(0,0,0,0.15)" : "none",
							}
						: {}),
				}}
			>
				<nav
					style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
				>
					<NavLink to="/" style={linkStyle} end>
						🔍 찾기
					</NavLink>
					<NavLink to="/my" style={linkStyle}>
						👤 마이페이지
					</NavLink>
				</nav>
			</aside>
		</>
	);
}
