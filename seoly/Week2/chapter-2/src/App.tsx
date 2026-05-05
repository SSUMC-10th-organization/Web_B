import ButtonGroup from "./components/ButtonGroup";
import { useCount } from "./context/CounterProvider";

function App() {
	const context = useCount();

	console.log(context);

	return (
		<>
			<h1>{context.count}</h1>
			<ButtonGroup />
		</>
	);
}

export default App;
