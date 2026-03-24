import { useTodo } from "../context/TodoContext"; // props 대신 훅 사용함.
import type { TTodo } from "../type/todo";

const TodoItem = ({ todo }: { todo: TTodo }) => {
	const { completeTodo } = useTodo(); // props drilling 없이 직접 접근함.

	return (
		<li className="render-container__item">
			<span className="render-container__item-text">{todo.text}</span>
			<button
				type="button"
				style={{ backgroundColor: "#28a745" }}
				onClick={() => completeTodo(todo)}
				className="render-container__item-button"
			>
				완료
			</button>
		</li>
	);
};

export default TodoItem;
