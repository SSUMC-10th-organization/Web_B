interface TodoResponse {
	userId: number;
	id: number;
	title: string;
	completed: boolean;
}

export const fetchTodos = async (): Promise<TodoResponse[]> => {
	const response = await fetch("https://jsonplaceholder.typicode.com/todos");

	if (!response.ok) {
		throw new Error("Failed to fetch todos");
	}

	const todos = await response.json();

	return todos;
};
