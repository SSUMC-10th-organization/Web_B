//import './style.css';
const input = document.getElementById('user-input') as HTMLInputElement;
const todo = document.getElementById('todo-list') as HTMLDivElement;
const done = document.getElementById('done-list') as HTMLDivElement;

input.addEventListener('keypress', function(e) {
    if(e.key=="Enter" && input.value!=""){
        const newLi = document.createElement('li'); // 새 틀 제작
        const newSp = document.createElement('Span'); // 내부 글
        const newBtn = document.createElement('button'); // 버튼
        newSp.innerText = input.value; // 입력한 내용 옮기기
        newBtn.innerText = "완료" // 버튼 초기화
        newLi.appendChild(newSp);
        newLi.appendChild(newBtn); // li에 span과 button 자식으로
        todo.appendChild(newLi); // 그걸 todo에 넣기
        input.value = "";
        newBtn.onclick = function() { // 완료 버튼 누르면
            newBtn.innerText = "삭제"
            newBtn.onclick = function(){ // 삭제 버튼 누르면
                done.removeChild(newLi);
            }
            done.appendChild(newLi); // done에 추가하기
            };
        }
    });