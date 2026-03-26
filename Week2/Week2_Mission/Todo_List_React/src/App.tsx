import './App.css'
import Input from './components/TodoInput.tsx'
import List from './components/TodoList.tsx'
import { ThemeProvider } from './ThemeContext.tsx';
import { TodoProvider } from './Todocontexts.tsx';
import { ThemeToggle } from './components/ThemeToggle.tsx'

function App() {
    return (
        <ThemeProvider>
            <TodoProvider>
                <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 flex flex-col items-center p-10 pt-[20vh]">
                    <div className="w-full max-w-4xl text-gray-900 dark:text-gray-100 flex flex-col items-center">
                        
                        <ThemeToggle />

                        <h1 className="title text-4xl font-bold mb-8 text-center tracking-tight">
                            ★JB ToDo★ Context API
                        </h1>
                        <div className="w-full mb-16 items-center flex flex-col">
                            <Input />
                        </div>

                        <div className="todo-group grid grid-cols-1 md:grid-cols-2 gap-12 w-full mt-10">
                            <List type="todo" title="해야 할 일" />
                            <List type="done" title="완료 한 일" />
                        </div>

                    </div>
                </div>
            </TodoProvider>
        </ThemeProvider>
    );
}

export default App