(function () {
    let todos = [];
    let users = [];
    const todoList = document.getElementById("todo-list");
    const userSelect = document.getElementById("user-todo");
    const form = document.querySelector("form");
    const counter = document.getElementById("todo-counter");

    document.addEventListener("DOMContentLoaded", initApp);
    form.addEventListener("submit", handleSubmit);

    function updateCounter() {
        const total = todos.length;
        const completed = todos.filter(todo => todo.completed).length;
        counter.textContent = `${completed} / ${total}`;
    }

    function getUserName(userId) {
        const user = users.find(u => u.id == userId);
        return user ? user.name : 'Unknown';
    }

    function printToDo({ id, userId, title, completed }) {
        const li = document.createElement("li");
        li.className = "todo-item";
        li.dataset.id = id;
        li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(userId)}</b></span>`;

        const status = document.createElement("input");
        status.type = "checkbox";
        status.checked = completed;
        status.addEventListener("change", handleTodoChange);

        const close = document.createElement("span");
        close.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="#ff6b6b" viewBox="0 0 24 24" width="20" height="20" stroke="#ff6b6b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
    <path d="M10 11v6"></path>
    <path d="M14 11v6"></path>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
  </svg>
`;

        close.className = "close";
        close.addEventListener("click", handleClose);

        li.prepend(status);
        li.append(close);

        todoList.prepend(li);

        updateCounter();
    }

    function createUserOption(user) {
        const option = document.createElement("option");
        option.value = user.id;
        option.innerText = user.name;
        userSelect.append(option);
    }

    function removeTodo(todoId) {
        todos = todos.filter(todo => todo.id !== Number(todoId));

        const todo = todoList.querySelector(`[data-id="${todoId}"]`);
        if (!todo) return;

        todo.querySelector("input").removeEventListener("change", handleTodoChange);
        todo.querySelector(".close").removeEventListener("click", handleClose);

        todo.remove();
        updateCounter();
    }

    // -------------------------------------------------event handlers

    function handleSubmit(event) {
        event.preventDefault();

        createTodo({
            userId: Number(form.user.value),
            title: form.todo.value,
            completed: false
        });
    }

    function handleTodoChange() {
        const todoId = this.parentElement.dataset.id;
        const completed = this.checked;

        toggleTodoComplate(todoId, completed);
    }

    function handleClose() {
        const todoId = this.parentElement.dataset.id;
        deleteTodo(todoId);
    }

    // -------------------------------------------------receiving and sending data

    async function initApp() {
        try {
            const [todosData, usersData] = await Promise.all([
                getAllTodos(),
                getAllUsers()
            ]);

            todos = todosData;
            users = usersData;

            todos.forEach(todo => printToDo(todo));
            users.forEach(user => createUserOption(user));

            updateCounter();
        }
        catch (error) {
            console.error("Error initializing app:", error);
            alert("Ошибка загрузки данных: " + error.message);
        }
    }

    async function getAllTodos() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=15");
            if (!response.ok) {
                throw new Error(`Failed to fetch todos. Status: ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error("getAllTodos error:", error);
            alert("Ошибка при получении задач");
            return [];
        }
    }

    async function getAllUsers() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/users?_limit=5");
            if (!response.ok) {
                throw new Error(`Failed to fetch users. Status: ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error("getAllUsers error:", error);
            alert("Ошибка при получении пользователей");
            return [];
        }
    }

    async function createTodo(todo) {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
                method: "POST",
                body: JSON.stringify(todo),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to create todo. Status: ${response.status}`);
            }

            const newTodo = await response.json();
            const fullTodo = { ...todo, id: newTodo.id };
            todos.push(fullTodo);
            printToDo(fullTodo);
        }
        catch (error) {
            console.error("createTodo error:", error);
            alert("Ошибка при добавлении задачи");
        }
    }

    async function toggleTodoComplate(todoId, completed) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
                method: "PATCH",
                body: JSON.stringify({ completed }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to update todo. Status: ${response.status}`);
            }

            const todo = todos.find(t => t.id == todoId);
            if (todo) {
                todo.completed = completed;
            }

            updateCounter();
        }
        catch (error) {
            console.error("toggleTodoComplate error:", error);
            alert("Ошибка при изменении статуса задачи");
        }
    }

    async function deleteTodo(todoId) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                removeTodo(todoId);
            }
            else {
                throw new Error(`Failed to delete todo. Status: ${response.status}`);
            }
        }
        catch (error) {
            console.error("deleteTodo error:", error);
            alert("Ошибка при удалении задачи");
        }
    }
})();