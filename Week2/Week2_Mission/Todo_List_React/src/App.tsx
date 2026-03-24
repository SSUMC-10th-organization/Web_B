import './App.css'
import Input from './components/TodoInput.tsx'
import List from './components/TodoList.tsx'
import { TodoProvider } from './Todocontexts.tsx';

  function App() {
    return (
        <TodoProvider>
            <div className="container">
                <div className="title">★JB ToDo★ Context API</div>
                <Input />
                <div className="todo-group">
                    <List type="todo" title="해야 할 일" />
                    <List type="done" title="완료 한 일" />
                </div>
            </div>
        </TodoProvider>
    );

  }

export default App
