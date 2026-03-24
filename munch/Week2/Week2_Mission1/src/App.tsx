import "./App.css";
import DoneList from "./components/DoneList";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import { TodoProvider } from "./context/TodoContext";

function App() {
	return (
		<TodoProvider>
			<div className="todo-container">
				<h1 className="todo-container__header">Munch ToDo</h1>
				<TodoForm /> {/* props 없음*/}
				<div className="render-container">
					<TodoList /> {/* props 없음*/}
					<DoneList /> {/* props 없음*/}
				</div>
			</div>
		</TodoProvider>
	);
}

export default App;
