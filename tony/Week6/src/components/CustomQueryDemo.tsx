import { useCustomFetch } from "../hooks/useCustomFetch";
import { useCustomQuery } from "../hooks/useCustomQuery";

interface Todo {
	id: number;
	title: string;
	completed: boolean;
}

const fetchTodos = () =>
	fetch("https://jsonplaceholder.typicode.com/todos?_limit=5").then((r) =>
		r.json(),
	);

// 기본 CustomFetch — 캐싱/재시도 없음
function BasicFetchDemo() {
	const { data, isPending, isError, error } = useCustomFetch<Todo[]>(
		"https://jsonplaceholder.typicode.com/todos?_limit=5",
	);

	if (isPending) return <p>Loading (useCustomFetch)...</p>;
	if (isError) return <p>Error: {error?.message}</p>;

	return (
		<section>
			<h2>useCustomFetch (캐싱 없음)</h2>
			<ul>
				{data?.map((t) => (
					<li key={t.id}>{t.title}</li>
				))}
			</ul>
		</section>
	);
}

// 확장된 CustomQuery — staleTime 5초, retry 2회
function CustomQueryDemo() {
	const { data, isPending, isError, error } = useCustomQuery<Todo[]>({
		queryKey: ["todos"],
		queryFn: fetchTodos,
		staleTime: 5000,
		retry: 2,
	});

	if (isPending) return <p>Loading (useCustomQuery)...</p>;
	if (isError) return <p>Error: {error?.message}</p>;

	return (
		<section>
			<h2>useCustomQuery (staleTime: 5s, retry: 2)</h2>
			<ul>
				{data?.map((t) => (
					<li key={t.id}>{t.title}</li>
				))}
			</ul>
		</section>
	);
}

export function CustomQueryDemoPage() {
	return (
		<div style={{ padding: "2rem" }}>
			<h1>CustomFetch → CustomQuery 확장 실습</h1>
			<BasicFetchDemo />
			<hr />
			<CustomQueryDemo />
		</div>
	);
}
