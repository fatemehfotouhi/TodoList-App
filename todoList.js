const todoInput = document.querySelector(".todo-input");
const addButton = document.querySelector(".add-btn");
const errorText = document.querySelector(".error-text");
const todosContainer = document.querySelector(".todos-container");
const selectStatus = document.querySelector(".select-status");
const sortDate = document.querySelector(".sort-date");


const todos = getAllTodos();
renderTodos(todos);
const filtered = {
    selectedValue: "All",
    sortValue: "Latest",
};

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
        createdAt: new Date().getSeconds(),
        isComplete: false,
    };
    todoInput.value = "";
    savedTodo(newTodo);
    filterBaseOnStatusTodo();
})

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
                <span class="todo-title ${_todo.isComplete ? "todo-completed" : ""}">${_todo.title}</span>
                <div class="todo-details">
                    <span class="todo-date">${_todo.createdAt}</span>
                    <button data-todo-id=${_todo.id} class="todo-check">
                       ${_todo.isComplete ? " &#10004;" : ""}
                    </button>
                    <button data-todo-id=${_todo.id} class="todo-remove">
                       Delete
                    </button>
                </div>
            </li>`
    });
    todosContainer.innerHTML = result;

    const removeButtons = [...document.querySelectorAll(".todo-remove")];
    removeButtons.forEach(btn => { btn.addEventListener("click", deleteTodo) });

    const checkButtons = [...document.querySelectorAll(".todo-check")];
    checkButtons.forEach(btn => { btn.addEventListener("click", completeTodo) });

}
function deleteTodo(e) {
    const todos = getAllTodos();
    const id = e.target.dataset.todoId;
    const filteredTodos = todos.filter(todo => Number(todo.id) !== Number(id))
    savedAllTodos(filteredTodos);
    filterBaseOnStatusTodo();
}

function completeTodo(e) {
    const todos = getAllTodos();
    const id = e.target.dataset.todoId;
    const findTodo = todos.find(todo => Number(todo.id) === Number(id))
    findTodo.isComplete = !findTodo.isComplete;
    savedAllTodos(todos);
    filterBaseOnStatusTodo();
}

selectStatus.addEventListener("change", (e) => {
    filtered.selectedValue = e.target.value;
    filterBaseOnStatusTodo();
});

sortDate.addEventListener("change", (e) => {
    console.log(e.target.value);
    filtered.sortValue = e.target.value;
})

function filterBaseOnStatusTodo() {
    const todos = getAllTodos();
    switch (filtered.selectedValue) {
        case "Completed":
            const filteredCompletedTodos = todos.filter(todo => todo.isComplete);
            renderTodos(filteredCompletedTodos);
            break;
        case "Uncompleted":
            const filteredUncompletedTodos = todos.filter(todo => !todo.isComplete);
            renderTodos(filteredUncompletedTodos);
            break;
        case "All":
            renderTodos(todos);
            break;
    }

}

function sortByDate() {
    const todos = getAllTodos();
    const sortDate = todos.sort((a, b) => {
        const date1 = new Date(a.createdAt).getTime();
        const date2 = new Date(b.createdAt).getTime();
        if (filtered.sortValue === "Latest") return date1 - date2;
        if (filtered.sortValue === "Newest") return date2 - date1;
    })
    renderTodos(sortDate)
}
