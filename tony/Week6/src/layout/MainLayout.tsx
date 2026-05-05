import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function MainLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const sidebarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(e.target as Node)
			) {
				setSidebarOpen(false);
			}
		};
		if (sidebarOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [sidebarOpen]);

	return (
		<div
			style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
		>
			<Header onMenuClick={() => setSidebarOpen((v) => !v)} />
			<div style={{ display: "flex", flex: 1, position: "relative" }}>
				<div ref={sidebarRef}>
					<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
				</div>
				<main
					style={{ flex: 1, padding: "1.5rem", overflowY: "auto", minWidth: 0 }}
				>
					<Outlet />
				</main>
			</div>
		</div>
	);
}
