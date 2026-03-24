import React, { useRef } from 'react';
import { useTodo } from '../Todocontexts'; 

function Input() {
    const { addTodo } = useTodo();
    const inputRef = useRef<HTMLInputElement>(null);

    const passText = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (inputRef.current && e.key === "Enter" && inputRef.current.value !== '') {
            addTodo(inputRef.current.value); 
            inputRef.current.value = '';
        }
    }

    return (
        <input 
            ref={inputRef} 
            placeholder="계획을 입력하세요. [ENTER]를 눌러 계획 저장" 
            onKeyDown={passText} 
        />
    );
}
export default Input;