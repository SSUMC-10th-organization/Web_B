import { useTodo } from "../context/TodoContext";

const TodoForm = () => {
	const { input, setInput, handleSubmit } = useTodo();
	return (
		<form onSubmit={handleSubmit} className="todo-container__form">
			<input
				value={input}
				onChange={(e) => setInput(e.target.value)}
				type="text"
				placeholder="할 일 입력"
				required
				className="todo-container__input"
			/>
			<button type="submit" className="todo-container__button">
				할 일 추가
			</button>
		</form>
	);
};

export default TodoForm;
