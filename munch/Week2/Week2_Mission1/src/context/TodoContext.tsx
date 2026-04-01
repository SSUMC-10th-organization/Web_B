import { createContext, type ReactNode, useContext, useState } from "react";
import type { TTodo } from "../type/todo";

interface TodoContextType {
	todos: TTodo[];
	doneTodos: TTodo[];
	input: string;
	setInput: (setInput: string) => void;
	handleSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
	completeTodo: (todo: TTodo) => void;
	deleteTodo: (doneTodo: TTodo) => void;
}

export const TodoContext = createContext<TodoContextType | undefined>(
	undefined,
);

// Provider로 state와 로직을 여기서 관리함.
export const TodoProvider = ({ children }: { children: ReactNode }) => {
	const [todos, setTodos] = useState<TTodo[]>([]);
	const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
	const [input, setInput] = useState(String);

	const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		const text = input.trim();

		if (text) {
			setTodos((prevTodos) => [...prevTodos, { id: Date.now(), text }]);
			setInput("");
		}
	};

	const completeTodo = (todo: TTodo) => {
		setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
		setDoneTodos((prevDoneTodos) => [...prevDoneTodos, todo]);
	};

	const deleteTodo = (todo: TTodo) => {
		setDoneTodos((prevDoneTodo) =>
			prevDoneTodo.filter((t) => t.id !== todo.id),
		);
	};

	return (
		<TodoContext.Provider
			value={{
				todos,
				doneTodos,
				input,
				setInput,
				handleSubmit,
				completeTodo,
				deleteTodo,
			}}
		>
			{children}
		</TodoContext.Provider>
	);
};

export const useTodo = () => {
	const context = useContext(TodoContext);
	if (!context) {
		throw new Error(
			"useTodo는 반드시 TodoProvider 내부에서 사용되어야 합니다.",
		);
	}
	return context;
};
