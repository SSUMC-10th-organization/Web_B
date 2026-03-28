import React, { useEffect, useState } from "react";

interface LinkProps {
	to: string;
	children: React.ReactNode;
}

export const Link = ({ to, children }: LinkProps) => {
	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		window.history.pushState({}, "", to);
		window.dispatchEvent(new Event("popstate"));
	};

	return (
		<a href={to} onClick={handleClick}>
			{children}
		</a>
	);
};

interface RouteProps {
	path: string;
	component: React.ComponentType;
}

export const Route = ({ path, component }: RouteProps) => {
	return null;
};

export const Routes = ({ children }: { children: React.ReactNode }) => {
	const [currentPath, setCurrentPath] = useState(window.location.pathname);

	useEffect(() => {
		const handlePathChange = () => setCurrentPath(window.location.pathname);
		window.addEventListener("popstate", handlePathChange);
		return () => window.removeEventListener("popstate", handlePathChange);
	}, []);

	const matchedRoute = React.Children.toArray(children).find((child) => {
		const route = child as React.ReactElement<RouteProps>;
		return route.props.path === currentPath;
	}) as React.ReactElement<RouteProps> | undefined;

	if (!matchedRoute) return <h1>404</h1>;

	const Component = matchedRoute.props.component;
	return <Component />;
};
