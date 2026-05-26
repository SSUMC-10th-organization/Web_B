import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import useSidebar from "../hooks/useSidebar";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function MainLayout() {
	const { isOpen, close, toggle } = useSidebar();
	const sidebarRef = useRef<HTMLDivElement>(null);

	// 사이드바 외부 클릭 시 닫기
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
				close();
			}
		};
		if (isOpen) document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen, close]);

	return (
		<div className="flex flex-col min-h-screen">
			<Header onMenuClick={toggle} />
			<div className="flex flex-1 relative">
				<div ref={sidebarRef}>
					<Sidebar isOpen={isOpen} onClose={close} />
				</div>
				<main className="flex-1 p-6 overflow-y-auto min-w-0">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
