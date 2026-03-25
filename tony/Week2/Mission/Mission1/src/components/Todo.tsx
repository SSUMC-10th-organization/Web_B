import { useTodo } from "../context/TodoContext";
import TodoList from "./TodoList";

const Todo = () => {
	const { inputText, setInputText, makeList } = useTodo();

	return (
		<>
			<header>
				<h1>SEUNGJITODO</h1>
			</header>
			<main>
				<form className="input-area" onSubmit={(e) => e.preventDefault()}>
					<input
						type="text"
						id="inputText"
						placeholder="할 일 입력"
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
					/>
					<button type="button" id="btn" onClick={makeList}>
						할 일 추가
					</button>
				</form>
				<TodoList />
			</main>
		</>
	);
};

export default Todo;
