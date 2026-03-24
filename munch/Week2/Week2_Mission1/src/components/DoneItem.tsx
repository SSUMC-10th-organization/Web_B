import { useTodo } from "../context/TodoContext"; // props 대신 훅 사용함.
import type { TTodo } from "../type/todo";

const DoneItem = ({ todo }: { todo: TTodo }) => {
	const { deleteTodo } = useTodo(); // props drilling 없이 직접 접근함.

	return (
		<li className="render-container__item">
			<span className="render-container__item-text">{todo.text}</span>
			<button
				type="button"
				style={{ backgroundColor: "#dc3545" }}
				onClick={() => deleteTodo(todo)}
				className="render-container__item-button"
			>
				삭제
			</button>
		</li>
	);
};

export default DoneItem;
