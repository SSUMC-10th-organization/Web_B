import { useRef } from 'react'
interface InputProps {
  // "문자열을 받아서 아무것도 반환하지 않는 함수"를 받겠다고 약속합니다.
  onAdd: (text: string) => void; 
}

function Input({onAdd}:InputProps){
    const inputRef = useRef<HTMLInputElement>(null); // 입력창을 참조하여 추적하는 변수
    const passText=(e:React.KeyboardEvent<HTMLInputElement>)=>{ // 엔터를 눌렀다면
        if(inputRef.current&&e.key==="Enter"&&inputRef.current.value!==''){
            onAdd(inputRef.current.value);
            inputRef.current.value=''; // 입력창 초기화
        }
    }
  
  return(
    <input ref={inputRef} placeholder="계획을 입력하세요. [ENTER]를 눌러 계획 저장" onKeyDown={passText}/>
  );
}

export default Input;