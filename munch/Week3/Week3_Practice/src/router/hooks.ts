import { useEffect, useState } from "react";
import { getCurrentPath, PUSHSTATE_EVENT } from "./utils";

export const useCurrentPath = () => {
	const [path, setPath] = useState(getCurrentPath());

	useEffect(() => {
		const updatePath = () => {
			setPath(getCurrentPath());
		};

		window.addEventListener("popstate", updatePath);
		window.addEventListener(PUSHSTATE_EVENT, updatePath);

		return () => {
			window.removeEventListener("popstate", updatePath);
			window.removeEventListener(PUSHSTATE_EVENT, updatePath);
		};
	}, []);

	return path;
};
