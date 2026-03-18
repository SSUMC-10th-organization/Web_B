const todoInput = document.getElementById("todo-input") as HTMLInputElement;
const todoList = document.getElementById("todo-list") as HTMLDivElement;
const doneList = document.getElementById("done-list") as HTMLDivElement;

todoInput.addEventListener("keydown", handelInput);

function handelInput(event: KeyboardEvent): void {
  if (event.key === "Enter") {
    const taskText = todoInput.value.trim();

    if (taskText === "") {
      alert("할 일을 입력해주세요.");
      return;
    }

    addTodo(taskText);
    todoInput.value = "";
  }
}

function addTodo(text: string): void {
  const itemDiv = document.createElement("div");
  itemDiv.className = "item";

  const textSpan = document.createElement("span");
  textSpan.textContent = text;

  const actionBtn = document.createElement("button");
  actionBtn.className = "btn";
  actionBtn.textContent = "완료";

  actionBtn.addEventListener("click", () => {
    completeTodo(itemDiv, actionBtn);
  });

  itemDiv.appendChild(textSpan);
  itemDiv.appendChild(actionBtn);
  todoList.appendChild(itemDiv);
}

function completeTodo(
  itemDiv: HTMLDivElement,
  actionBtn: HTMLButtonElement,
): void {
  todoList.removeChild(itemDiv);
  itemDiv.classList.add("completed");
  actionBtn.textContent = "삭제";

  const deleteBtn = actionBtn.cloneNode(true) as HTMLButtonElement;
  deleteBtn.addEventListener("click", () => {
    deleteTodo(itemDiv);
  });

  itemDiv.replaceChild(deleteBtn, actionBtn);

  doneList.appendChild(itemDiv);
}

function deleteTodo(itemDiv: HTMLDivElement): void {
  doneList.removeChild(itemDiv);
}

export {};
