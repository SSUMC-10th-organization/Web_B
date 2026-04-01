import type { FormEvent } from "react";
import { useState } from "react";
import type { TTodo } from "../types/todo";

const TodoBefore = () => {
	const [todos, setTodos] = useState<TTodo[]>([]);
	const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
	const [input, setInput] = useState<string>("");

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const text = input.trim();

		if (text) {
			const newTodo: TTodo = { id: Date.now(), text };
			setTodos((prevTodos) => [...prevTodos, newTodo]);
			setInput("");
		}
	};

	const completeTodo = (todo: TTodo) => {
		setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
		setDoneTodos((prevDoneTodos) => [...prevDoneTodos, todo]);
	};

	const deleteTodo = (todo: TTodo) => {
		setDoneTodos((prevDoneTodos) =>
			prevDoneTodos.filter((t) => t.id !== todo.id),
		);
	};

	return (
		<div className="todo-container">
			<h1 className="todo-container__header">SEOLY TODO</h1>
			<form onSubmit={handleSubmit} className="todo-container__form">
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					type="text"
					className="todo-container__input"
					placeholder="할 일을 입력해주세요."
					required
				/>
				<button type="submit" className="todo-container__button">
					할 일 추가
				</button>
			</form>
			<div className="render-container">
				<div className="render-container__section">
					<h2 className="render-container__title">할 일</h2>
					<ul id="todo-list" className="render-container__list">
						{/* 여기에 할 일들이 들어올 예정 */}
						{todos.map((todo) => (
							<li key={todo.id} className="render-container__item">
								<span className="render-container__iten-text">{todo.text}</span>
								<button
									type="button"
									onClick={() => completeTodo(todo)}
									style={{ backgroundColor: "#28a745" }}
									className="render-container__item-button"
								>
									완료
								</button>
							</li>
						))}
					</ul>
				</div>
				<div className="render-container__section">
					<h2 className="render-container__title">완료</h2>
					<ul id="done-list" className="render-container__list">
						{/* 여기에 한 일들이 들어올 예정 */}
						{doneTodos.map((todo) => (
							<li key={todo.id} className="render-container__item">
								<span className="render-container__iten-text">{todo.text}</span>
								<button
									type="button"
									onClick={() => deleteTodo(todo)}
									style={{ backgroundColor: "#dc3545" }}
									className="render-container__item-button"
								>
									삭제
								</button>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default TodoBefore;
