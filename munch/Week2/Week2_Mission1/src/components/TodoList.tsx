import { useTodo } from "../context/TodoContext";
import TodoItem from "./TodoItem";

const TodoList = () => {
	const { todos } = useTodo(); // completeTodo를 더이상 받아서 넘길 필요가 없음.

	return (
		<div className="render-container__section">
			<h2 className="render-container__title">할 일</h2>
			<ul className="render-container__list">
				{todos.map((todo) => (
					<TodoItem key={todo.id} todo={todo} /> // completeTodo props 제거함.
				))}
			</ul>
		</div>
	);
};

export default TodoList;
