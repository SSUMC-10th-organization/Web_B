import { useTodo } from '../Todocontexts'; 
import Item from './TodoItem';

interface ListProps {
    type: 'todo' | 'done';
    title: string;
}

function List({ type, title }: ListProps) {
    const { todo, done, moveToDone, deleteDone } = useTodo(); 
    
    const items = type === 'todo' ? todo : done;
    const action = type === 'todo' ? moveToDone : deleteDone;
    const buttonText = type === 'todo' ? '완료' : '삭제';

    return (
        <div className={type}>
            <h2>{title}</h2>
            <ul id={`${type}-list`}>
                {items.map((it) => (
                    <Item 
                        key={it.id} 
                        list={it} 
                        pressBtn={action} 
                        state={buttonText} 
                    />
                ))}
            </ul>
        </div>
    );
}
export default List;