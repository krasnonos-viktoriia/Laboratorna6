// Selectors 
const toDoBtn = document.querySelector(".todo-btn");
const toDoList = document.querySelector(".todo-list");
const standardTheme = document.querySelector(".standard-theme");
const lightTheme = document.querySelector(".light-theme");
const darkerTheme = document.querySelector(".darker-theme");

if (toDoBtn) toDoBtn.addEventListener("click", addToDo);
if (toDoList) toDoList.addEventListener("click", deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);

if (standardTheme) standardTheme.addEventListener("click", () => changeTheme("standard"));
if (lightTheme) lightTheme.addEventListener("click", () => changeTheme("light"));
if (darkerTheme) darkerTheme.addEventListener("click", () => changeTheme("darker"));

let savedTheme = localStorage.getItem("savedTheme") || "standard";

if (typeof module === 'undefined') {
    changeTheme(savedTheme);
}

// Functions
function addToDo(event) {
    if (event) event.preventDefault();
    
    const currentInput = document.querySelector(".todo-input");
    if (!currentInput) return; 

    const todoText = currentInput.value.trim();
    if (todoText === "") {
        alert("You must write something!");
        return;
    }
    const todoObject = { text: todoText, completed: false };
    savelocal(todoObject);
    renderToDo(todoObject);
    currentInput.value = "";
}

function savelocal(todoObj) {
    let todos = localStorage.getItem("todos") === null 
        ? [] 
        : JSON.parse(localStorage.getItem("todos"));
    todos.push(todoObj);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
    let todos = localStorage.getItem("todos") === null 
        ? [] 
        : JSON.parse(localStorage.getItem("todos"));
    todos.forEach((todo) => renderToDo(todo));
}

function renderToDo(todo) {
    const currentList = document.querySelector(".todo-list");
    if (!currentList) return; 

    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add("todo", `${savedTheme}-todo`);
    
    const newToDo = document.createElement("li");
    newToDo.innerText = todo.text;
    newToDo.classList.add("todo-item");
    toDoDiv.appendChild(newToDo);

    const checked = document.createElement("button");
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add("check-btn", `${savedTheme}-button`);
    toDoDiv.appendChild(checked);

    const deleted = document.createElement("button");
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add("delete-btn", `${savedTheme}-button`);
    toDoDiv.appendChild(deleted);

    if (todo.completed) toDoDiv.classList.add("completed");
    
    currentList.appendChild(toDoDiv);
}

function changeTheme(color) {
    localStorage.setItem("savedTheme", color);
    savedTheme = color;
    document.body.className = color;

    const title = document.getElementById("title");
    if (title) {
        color === "darker" 
            ? title.classList.add("darker-title") 
            : title.classList.remove("darker-title");
    }

    const input = document.querySelector("input");
    if (input) input.className = `${color}-input`;

    document.querySelectorAll(".todo").forEach((todo) => {
        todo.className = todo.classList.contains("completed") 
            ? `todo ${color}-todo completed` 
            : `todo ${color}-todo`;
    });

    document.querySelectorAll("button").forEach((button) => {
        if (button.classList.contains("check-btn")) button.className = `check-btn ${color}-button`;
        if (button.classList.contains("delete-btn")) button.className = `delete-btn ${color}-button`;
        if (button.classList.contains("todo-btn")) button.className = `todo-btn ${color}-button`;
    });
}

function deletecheck(event) {
    const item = event.target;
    if (item.classList.contains("delete-btn")) {
        const todo = item.parentElement;
        todo.classList.add("fall");
        removeLocalTodos(todo);
        todo.addEventListener("transitionend", () => todo.remove());
    }
    if (item.classList.contains("check-btn")) {
        const todoItem = item.parentElement;
        todoItem.classList.toggle("completed");
        updateLocalTodos(todoItem);
    }
}

function updateLocalTodos(todoItem) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    const todoIndex = todos.findIndex(item => item.text === todoItem.children[0].innerText);
    if (todoIndex !== -1) {
        todos[todoIndex].completed = todoItem.classList.contains("completed");
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}

function removeLocalTodos(todo) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    const todoIndex = todos.findIndex(item => item.text === todo.children[0].innerText);
    if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}

// Экспорт для Jest
if (typeof module !== 'undefined') {
    module.exports = { addToDo, savelocal, changeTheme, deletecheck, renderToDo };
}