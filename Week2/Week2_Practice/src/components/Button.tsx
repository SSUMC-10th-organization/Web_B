interface ButtonProps {
	onClick?: () => void;
	text: string;
}

const Button = ({ onClick, text }: ButtonProps) => {
	return (
		<button type="button" onClick={onClick}>
			{text}
		</button>
	);
};

export default Button;
