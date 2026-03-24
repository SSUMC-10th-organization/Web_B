import {useState} from 'react'
import React from 'react';
import './App.css'
import Input from './components/TodoInput.tsx'
import Item from './components/TodoItem.tsx'
import List from './components/TodoList.tsx'

interface ListItem{
  id : number
  text : string
}

function App() {
  const [todo, setTodo] = useState<ListItem[]>([]); // todo에 해당하는 리스트
  const [done, setDone] = useState<ListItem[]>([]); // done에 해당하는 리스트
  
  const printItem=(state : string):React.ReactNode=>{
    if(state==='todo')
      return(
        todo.map((todo)=>(
          <Item
            key={todo.id}
            list={todo}
            pressBtn={pressButtonDone}
            state='완료'/>
        ))
      );
    else if(state==='done')
      return(
        done.map((done)=>(
          <Item
            key={done.id}
            list={done}
            pressBtn={pressButtonDel}
            state='삭제'/>
        ))
      );
  }
  const updateTodo=(t : string)=>{ // 엔터를 눌렀다면
      setTodo([...todo, {id:Date.now(), text:t}]); // 리스트에 입력창 문자열 추가
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
          <Input onAdd={updateTodo}/>
          <div className="todo-group">
              <div className="todo">
                  <h2>해야 할 일</h2>
                  <ul id="todo-list">
                    
                      <List c='todo' print={()=>printItem("todo")}/>
                    
                  </ul>

              </div>
              <div className="done">
                  <h2>완료 한 일</h2>
                  <ul id="done-list">
                      <List c='done' print={()=>printItem("done")}/>   
                  </ul> 

              </div>
          </div>
      </div>
    </>
  
}

export default App
