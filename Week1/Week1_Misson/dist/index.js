"use strict";
const input = document.getElementById('user-input');
const todo = document.getElementById('todo-list');
const done = document.getElementById('done-list');
input.addEventListener('keypress', function (e) {
    if (e.key == "Enter" && input.value != "") {
        const newLi = document.createElement('li');
        const newSp = document.createElement('Span');
        const newBtn = document.createElement('button');
        newSp.innerText = input.value;
        newBtn.innerText = "완료";
        newLi.appendChild(newSp);
        newLi.appendChild(newBtn);
        todo.appendChild(newLi);
        input.value = "";
        newBtn.onclick = function () {
            newBtn.innerText = "삭제";
            newBtn.onclick = function () {
                done.removeChild(newLi);
            };
            done.appendChild(newLi);
        };
    }
});
