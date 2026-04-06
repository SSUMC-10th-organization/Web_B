type Props = {
	path: string;
	component: React.FC;
};

export const Route = ({ component: Component }: Props) => {
	return <Component />;
};
