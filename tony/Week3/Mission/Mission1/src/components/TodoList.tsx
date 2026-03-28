import { useTodo } from "../context/TodoContext";

const TodoList = () => {
	const { todoItems, doneItems, moveToDone, deleteItem } = useTodo();

	return (
		<article className="todolist">
			<section>
				<h2 className="section-title">할 일</h2>
				<ul id="todoItems">
					{todoItems.map((item) => (
						<li key={item.id} className="item">
							<span>{item.text}</span>
							<button
								type="button"
								className="done-btn"
								onClick={() => moveToDone(item)}
							>
								완료
							</button>
						</li>
					))}
				</ul>
			</section>
			<section>
				<h2 className="section-title">완료</h2>
				<ul id="doneItems">
					{doneItems.map((item) => (
						<li key={item.id} className="item">
							<span>{item.text}</span>
							<button
								type="button"
								className="delete-btn"
								onClick={() => deleteItem(item)}
							>
								삭제
							</button>
						</li>
					))}
				</ul>
			</section>
		</article>
	);
};

export default TodoList;
