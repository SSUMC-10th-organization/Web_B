import { useEffect, useState } from "react";
import { getCurrentPath } from "./utils";

export const useCurrentPath = () => {
	const [currentPath, setCurrentPath] = useState(getCurrentPath());

	useEffect(() => {
		const handleLocationChange = () => {
			setCurrentPath(getCurrentPath());
		};

		// 뒤로가기/앞으로가기 감지
		window.addEventListener("popstate", handleLocationChange);
		// Link 컴포넌트를 통한 URL 변경 감지
		window.addEventListener("pushstate", handleLocationChange);

		return () => {
			window.removeEventListener("popstate", handleLocationChange);
			window.removeEventListener("pushstate", handleLocationChange);
		};
	}, []);

	return currentPath;
};
