import {
	Children,
	cloneElement,
	isValidElement,
	type ReactElement,
	useMemo,
} from "react";
import { useCurrentPath } from "./hooks";

type RouteElement = ReactElement<{
	path: string;
	component: React.FC;
}>;

type Props = {
	children: ReactElement[];
};

export const Routes = ({ children }: Props) => {
	const currentPath = useCurrentPath();

	const activeRoute = useMemo(() => {
		const routes = Children.toArray(children).filter((child) =>
			isValidElement(child),
		) as RouteElement[];

		return routes.find((route) => route.props.path === currentPath);
	}, [children, currentPath]);

	if (!activeRoute) return <div>404</div>;

	return cloneElement(activeRoute);
};
