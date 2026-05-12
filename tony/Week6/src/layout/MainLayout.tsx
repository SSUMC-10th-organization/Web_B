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
		<div className="flex flex-col min-h-screen">
			<Header onMenuClick={() => setSidebarOpen((v) => !v)} />
			<div className="flex flex-1 relative">
				<div ref={sidebarRef}>
					<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
				</div>
				<main className="flex-1 p-6 overflow-y-auto min-w-0">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
