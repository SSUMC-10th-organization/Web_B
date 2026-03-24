import { useTodo } from "../context/TodoContext";
import DoneItem from "./DoneItem";

const DoneList = () => {
	const { doneTodos } = useTodo(); // deleteTodo를 더이상 받아서 넘길 필요가 없음.
	return (
		<div className="render-container__section">
			<h2 className="render-container__title">할 일</h2>
			<ul className="render-container__list">
				{doneTodos.map((todo) => (
					<DoneItem key={todo.id} todo={todo} /> // deleteTodo props 제거함.
				))}
			</ul>
		</div>
	);
};

export default DoneList;
