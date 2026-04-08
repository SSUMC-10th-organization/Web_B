import Button from "./Button";

interface ButtonGroupProps {
	handleIncrement: () => void;
	handleDecrement: () => void;
}

const ButtonGroup = ({
	handleIncrement,
	handleDecrement,
}: ButtonGroupProps) => {
	return (
		<div>
			<Button onClick={handleIncrement} text="+1 증가" />
			<Button onClick={handleDecrement} text="-1 감소" />
		</div>
	);
};

export default ButtonGroup;
