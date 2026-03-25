import { createContext, useContext, useState } from "react";

interface TodoItem {
    id: number;
    text: string;
}

interface TodoContextType {
    inputText: string;
    todoItems: TodoItem[];
    doneItems: TodoItem[];
    setInputText: (text: string) => void;
    makeList: () => void;
    moveToDone: (item: TodoItem) => void;
    deleteItem: (item: TodoItem) => void;
}

const TodoContext = createContext<TodoContextType | null>(null);

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
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
        <TodoContext.Provider value={{ inputText, todoItems, doneItems, setInputText, makeList, moveToDone, deleteItem }}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodo = () => {
    const context = useContext(TodoContext);
    if (!context) throw new Error("TodoProvider 안에서 사용해주세요!");
    return context;
};