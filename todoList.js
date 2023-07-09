
// Selecting

const todoInput = document.querySelector(".todo-input");
const addButton = document.querySelector(".add-btn");
const errorText = document.querySelector(".error-text");
const todosContainer = document.querySelector(".todos-container");
const selectStatus = document.querySelector(".select-status");
const modal = document.querySelector(".modal");
const backdrop = document.querySelector(".backdrop");
const modalInput = document.querySelector(".modal-input");
const closeButton = document.querySelector(".close-btn");
const saveEditedTodoButton = document.querySelector(".save-edited-todo");
const modalError = document.querySelector(".modal-error")
const sortDate = document.querySelector(".sort-date");

const filtered = {
    selectedValue: "All",
    sortValue: "Latest",
};

document.addEventListener("DOMContentLoaded", (e) => {
    const todos = getAllTodos();
    renderTodos(todos)
})


//Events

addButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (!todoInput.value) {
        errorText.classList.remove("hidden");
        return null;
    };
    errorText.classList.add("hidden");
    const newTodo = {
        title: todoInput.value,
        id: new Date().getTime(),
        createdAt: new Date().toISOString(),
        isComplete: false,
    };
    todoInput.value = "";
    savedTodo(newTodo);
    filterBaseOnStatusTodo();
})

selectStatus.addEventListener("change", (e) => {
    filtered.selectedValue = e.target.value;
    filterBaseOnStatusTodo();
});

closeButton.addEventListener("click", closeModal);
backdrop.addEventListener("click", closeModal);
saveEditedTodoButton.addEventListener("click", saveEditedTodo)

sortDate.addEventListener("change", (e) => {
    console.log(e.target.value)
    filtered.sortValue = e.target.value;
    filterBaseOnStatusTodo();
})


//Functions

function savedTodo(_todo) {
    const todos = getAllTodos();
    todos.push(_todo);
    return localStorage.setItem("todos", JSON.stringify(todos));
}

function savedAllTodos(_todos) {
    return localStorage.setItem("todos", JSON.stringify(_todos));
}

function getAllTodos() {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    return todos;
}

function renderTodos(_todos) {
    let result = "";
    _todos.forEach(_todo => {
        result += `<li class="todo-item">
                <span class="todo-title ${_todo.isComplete ? "todo-completed" : ""}">${_todo.title.length < 20 ? _todo.title : _todo.title.slice(0, 15) + '...'}</span>
                <div class="todo-details">
                    <span class="todo-date">${new Date(_todo.createdAt).toLocaleDateString()}</span>
                    <button data-todo-id=${_todo.id} class="todo-check">
                       ${_todo.isComplete ? " &#10004;" : ""}
                    </button>
                    <button data-todo-id=${_todo.id} class="todo-edit ${_todo.isComplete && "disabled"}">
                      Edit
                    </button>
                    <button data-todo-id=${_todo.id} class="todo-remove">
                      <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </li>`
    });
    todosContainer.innerHTML = result;

    const removeButtons = [...document.querySelectorAll(".todo-remove")];
    removeButtons.forEach(btn => { btn.addEventListener("click", deleteTodo) });

    const checkButtons = [...document.querySelectorAll(".todo-check")];
    checkButtons.forEach(btn => { btn.addEventListener("click", completeTodo) });

    const editButtons = [...document.querySelectorAll(".todo-edit")];
    editButtons.forEach(btn => { btn.addEventListener("click", openModal) });
}

function deleteTodo(e) {
    const todos = getAllTodos();
    const id = e.target.dataset.todoId;
    const filteredTodos = todos.filter(todo => Number(todo.id) !== Number(id));
    savedAllTodos(filteredTodos);
    filterBaseOnStatusTodo();
}

function completeTodo(e) {
    const todos = getAllTodos();
    const id = e.target.dataset.todoId;
    const findTodo = todos.find(todo => Number(todo.id) === Number(id));
    findTodo.isComplete = !findTodo.isComplete;
    savedAllTodos(todos);
    filterBaseOnStatusTodo();
}

function closeModal() {
    modal.classList.add("hidden");
    backdrop.classList.add("hidden");
}

function openModal(e) {
    modal.classList.remove("hidden");
    backdrop.classList.remove("hidden");
    const todos = getAllTodos();
    const id = e.target.dataset.todoId;
    console.log(id);
    saveEditedTodoButton.setAttribute("data-todo-id", String(id))
    const findTodo = todos.find(todo => Number(todo.id) === Number(id));
    console.log(findTodo)
    modalInput.value = findTodo.title;
}
function saveEditedTodo(e) {
    console.log("hello")
    e.preventDefault();
    if (!modalInput.value) {
        modalError.classList.remove("hidden");
        return null;
    };
    modalError.classList.add("hidden");
    const todos = getAllTodos();
    const newValue = modalInput.value;
    const id = saveEditedTodoButton.getAttribute("data-todo-id");
    console.log(id)
    const findTodo = todos.find(todo => Number(todo.id) === Number(id));
    findTodo.title = newValue;
    savedAllTodos(todos);
    filterBaseOnStatusTodo();
    closeModal();
}

function filterBaseOnStatusTodo() {
    const sortedDates = sortByDate();
    switch (filtered.selectedValue) {
        case "Completed": {
            const filteredCompletedTodos = sortedDates.filter(todo => todo.isComplete);
            renderTodos(filteredCompletedTodos);
            break;
        }
        case "Uncompleted": {
            const filteredUncompletedTodos = sortedDates.filter(todo => !todo.isComplete);
            renderTodos(filteredUncompletedTodos);
            break;
        }
        case "All": {
            renderTodos(sortedDates);
            break;
        }
        default: renderTodos(sortedDates)
    }
}

function sortByDate() {
    const todos = getAllTodos();
    const SortedDates = todos.sort((a, b) => {
        const date1 = new Date(a.createdAt).getTime();
        const date2 = new Date(b.createdAt).getTime();
        if (filtered.sortValue === "Latest") return date1 - date2;
        if (filtered.sortValue === "Newest") return date2 - date1;
    })
    return SortedDates;
}
