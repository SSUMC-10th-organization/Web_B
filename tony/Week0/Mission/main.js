const btn = document.querySelector("#btn");
const inputText = document.querySelector("#inputText");
const todoItems = document.querySelector("#todoItems");
const doneItems = document.querySelector("#doneItems");

function makeList() {
	const text = inputText.value;
	if (text === "") return;

	const item = document.createElement("div");
	item.className = "item";

	const span = document.createElement("span");
	span.textContent = text;

	const doneBtn = document.createElement("button");
	doneBtn.textContent = "완료";
	doneBtn.className = "done-btn";
	doneBtn.addEventListener("click", () => moveToDone(item, text));

	item.appendChild(span);
	item.appendChild(doneBtn);
	todoItems.appendChild(item);

	inputText.value = "";
}

function moveToDone(item, text) {
	todoItems.removeChild(item);

	const doneItem = document.createElement("div");
	doneItem.className = "item";

	const span = document.createElement("span");
	span.textContent = text;

	const deleteBtn = document.createElement("button");
	deleteBtn.textContent = "삭제";
	deleteBtn.className = "delete-btn";
	deleteBtn.addEventListener("click", () => doneItems.removeChild(doneItem));

	doneItem.appendChild(span);
	doneItem.appendChild(deleteBtn);
	doneItems.appendChild(doneItem);
}

btn.addEventListener("click", makeList);
