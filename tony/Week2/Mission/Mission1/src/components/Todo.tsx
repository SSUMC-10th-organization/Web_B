import { useState } from "react";

interface TodoItem {
    id: number;
    text: string;
}

const Todo = () => {
    const [inputText, setInputText] = useState<string>("");
    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
    const [doneItems, setDoneItems] = useState<TodoItem[]>([]);

    const makeList = () => {
        if (inputText === "") return;
        const newItem: TodoItem = { id: Date.now(), text: inputText };
        setTodoItems([...todoItems, newItem]);
        setInputText("");
    };

    const moveToDone = (item: TodoItem) => {
        setTodoItems(todoItems.filter((todo) => todo.id !== item.id));
        setDoneItems([...doneItems, item]);
    };

    const deleteItem = (item: TodoItem) => {
        setDoneItems(doneItems.filter((done) => done.id !== item.id));
    };

    return (
        <>
            <header>
                <h1>SEUNGJITODO</h1>
            </header>
            <main>
                <form className="input-area" onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="text"
                        id="inputText"
                        placeholder="할 일 입력"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <button type="button" id="btn" onClick={makeList}>
                        할 일 추가
                    </button>
                </form>

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
            </main>
        </>
    );
};

export default Todo;