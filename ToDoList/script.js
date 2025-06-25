let todos = [];
let users = [];
const todoList = document.getElementById("todo-list");
document.addEventListener("DOMContentLoaded", initApp);

function getUserName(userId) {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
}

function printToDo({id, userId, title, completed}) {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.dataset.id = id;
    li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(userId)}</b></span>`;

    const status = document.createElement("input");
    status.type = "checkbox";
    status.cheked = completed;

    const close = document.createElement("span");
    close.innerHTML = "&times;";
    close.className = "close";

    li.prepend(status);
    li.append(close);

    todoList.prepend(li);
}

async function initApp() {
    try {
        const [todosData, usersData] = await Promise.all([
            getAllTodos(), 
            getAllUsers()
        ]);
        
        todos = todosData;
        users = usersData;
        
        todos.forEach(todo => printToDo(todo));
    } 
    catch (error) {
        console.error("Error initializing app:", error);
    }
}

async function getAllTodos() {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    if (!response.ok) {
        throw new Error("Failed to fetch todos");
    }

    return response.json();
}

async function getAllUsers() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }
    
    return response.json();
}