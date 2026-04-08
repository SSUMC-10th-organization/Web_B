import { useState } from "react";
import ButtonGroup from "./components/ButtonGroup";

function App() {
	const [count, setCount] = useState(0);

	const handleIncrement = () => {
		setCount(count + 1);
	};

	const handleDecrement = () => {
		setCount(count - 1);
	};

	return (
		<>
			<h1>{count}</h1>
			<ButtonGroup
				handleIncrement={handleIncrement}
				handleDecrement={handleDecrement}
			/>
		</>
	);
}

export default App;
