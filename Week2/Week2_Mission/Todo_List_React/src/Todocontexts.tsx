import type React from "react";
import { createContext, useContext, useState } from "react";
import type { ListItem } from "./components/TodoItem";

interface TodoContextType {
	todo: ListItem[];
	done: ListItem[];
	addTodo: (text: string) => void;
	moveToDone: (id: number) => void;
	deleteDone: (id: number) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
	const [todo, setTodo] = useState<ListItem[]>([]);
	const [done, setDone] = useState<ListItem[]>([]);

	const addTodo = (text: string) =>
		setTodo([...todo, { id: Date.now(), text }]);

	const moveToDone = (id: number) => {
		const item = todo.find((it) => it.id === id);
		if (item) {
			setDone([...done, item]);
			setTodo(todo.filter((it) => it.id !== id));
		}
	};

	const deleteDone = (id: number) => setDone(done.filter((it) => it.id !== id));

	return (
		<TodoContext.Provider
			value={{ todo, done, addTodo, moveToDone, deleteDone }}
		>
			{children}
		</TodoContext.Provider>
	);
}

export const useTodo = () => {
	const context = useContext(TodoContext);
	if (!context) throw new Error("TodoProvider 안에서만 쓰세요!");
	return context;
};
