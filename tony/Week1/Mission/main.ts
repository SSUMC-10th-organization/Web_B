const btn = document.querySelector('#btn') as HTMLButtonElement;
const inputText = document.querySelector('#inputText') as HTMLInputElement;
const todoItems = document.querySelector('#todoItems') as HTMLDivElement;
const doneItems = document.querySelector('#doneItems') as HTMLDivElement;

function makeList(): void {
    const text: string = inputText.value;
    if (text === '') return;

    const item = document.createElement('div');
    item.className = 'item';

    const span = document.createElement('span');
    span.textContent = text;

    const doneBtn = document.createElement('button');
    doneBtn.textContent = '완료';
    doneBtn.className = 'done-btn';
    doneBtn.addEventListener('click', () => moveToDone(item, text));

    item.appendChild(span);
    item.appendChild(doneBtn);
    todoItems.appendChild(item);

    inputText.value = '';
}

function moveToDone(item: HTMLDivElement, text: string): void {
    todoItems.removeChild(item);

    const doneItem = document.createElement('div');
    doneItem.className = 'item';

    const span = document.createElement('span');
    span.textContent = text;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '삭제';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => doneItems.removeChild(doneItem));

    doneItem.appendChild(span);
    doneItem.appendChild(deleteBtn); 
    doneItems.appendChild(doneItem);
}

btn.addEventListener('click', makeList);
