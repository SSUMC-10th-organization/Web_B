var btn = document.querySelector('#btn');
var inputText = document.querySelector('#inputText');
var todoItems = document.querySelector('#todoItems');
var doneItems = document.querySelector('#doneItems');
function makeList() {
    var text = inputText.value;
    if (text === '')
        return;
    var item = document.createElement('div');
    item.className = 'item';
    var span = document.createElement('span');
    span.textContent = text;
    var doneBtn = document.createElement('button');
    doneBtn.textContent = '완료';
    doneBtn.className = 'done-btn';
    doneBtn.addEventListener('click', function () { return moveToDone(item, text); });
    item.appendChild(span);
    item.appendChild(doneBtn);
    todoItems.appendChild(item);
    inputText.value = '';
}
function moveToDone(item, text) {
    todoItems.removeChild(item);
    var doneItem = document.createElement('div');
    doneItem.className = 'item';
    var span = document.createElement('span');
    span.textContent = text;
    var deleteBtn = document.createElement('button');
    deleteBtn.textContent = '삭제';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', function () { return doneItems.removeChild(doneItem); });
    doneItem.appendChild(span);
    doneItem.appendChild(deleteBtn);
    doneItems.appendChild(doneItem);
}
btn.addEventListener('click', makeList);
