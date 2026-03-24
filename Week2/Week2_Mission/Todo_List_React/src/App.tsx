import { useState, useRef } from 'react'
import './App.css'
interface ListItem{
  id : number
  text : string
}

function App() {
  const [todo, setTodo] = useState<ListItem[]>([]); // todo에 해당하는 리스트
  const [done, setDone] = useState<ListItem[]>([]); // done에 해당하는 리스트
  const inputRef = useRef<HTMLInputElement>(null); // 입력창을 참조하여 추적하는 변수
  
  const handleEnter=(e:React.KeyboardEvent<HTMLInputElement>)=>{ // 엔터를 눌렀다면
    if (e.key==="Enter"&&inputRef.current!=null&&inputRef.current.value!=''){
      setTodo([...todo, {id:Date.now(), text:inputRef.current.value}]); // 리스트에 입력창 문자열 추가
      inputRef.current.value=''; // 입력창 초기화
    }
  }
  const pressButtonDone=(index:number)=>{
    const list = todo.filter((item)=> item.id !== index); // 현재 버튼이 속한 계획을 제외하고 저장
    const move = todo.find((item)=> item.id === index)
    if(move!==undefined)
    setDone([...done,{id:move.id,text:move.text}]) // done으로 옮기기
    setTodo(list); // 그걸 저장해서 todo에서 제거
  }

  const pressButtonDel=(index:number)=>{
    const list = done.filter((item)=> item.id !== index); // 현재 버튼이 속한 계획을 제외하고 저장
    setDone(list); // 그걸 저장해서 done에서 제거
  }
  return <>
      <div className="container">
          <div className="title">★JB ToDo★ React ver</div>
          <div className="line"></div>
          <input ref={inputRef} placeholder="계획을 입력하세요. [ENTER]를 눌러 계획 저장" onKeyDown={handleEnter}/>
          <div className="todo-group">
              <div className="todo">
                  <h2>해야 할 일</h2>
                  <ul id="todo-list">
                    {
                      todo.map((todo) => ( // 리스트를 전부 순회하는 함수. 즉 모든 리스트 요소를 보인다
                        <li key={todo.id}>{todo.text}
                        <button onClick={()=>pressButtonDone(todo.id)}>완료</button>
                        </li>
                      )
                    )}
                  </ul>

              </div>
              <div className="done">
                  <h2>완료 한 일</h2>
                  <ul id="done-list">
                    {
                      done.map((done) => ( // 리스트를 전부 순회하는 함수. 즉 모든 리스트 요소를 보인다
                        <li key={done.id}>{done.text}
                        <button onClick={()=>pressButtonDel(done.id)}>삭제</button>
                        </li>
                      )
                    )}    
                  </ul> 

              </div>
          </div>
      </div>
    </>
  
}

export default App
