document.addEventListener('DOMContentLoaded', (event) => {
    loadTasks();
    document.getElementById("toggleSidebar").onclick = toggleSidebar;
    document.addEventListener('click', handleClickOutsideSidebar);
});

function addTask() {
    const dataInput = document.getElementById("dataInput");
    const taskValue = dataInput.value.trim();

    if (taskValue !== "") {
        const tasks = getTasksFromLocalStorage();
        const newTask = {
            id: generateUniqueId(),
            value: taskValue,
            checked: false,
            removed: false
        };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks)); 
        dataInput.value = "";
        renderTasks();
    } else {
        alert("Please enter a task.");
    }
}

function generateUniqueId() {
    return Math.floor(Math.random() * Date.now());
}

function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function loadTasks() {
    renderTasks();
}

function renderTasks() {
    const tasks = getTasksFromLocalStorage();
    const taskTableBody = document.querySelector("#taskTable tbody");
    taskTableBody.innerHTML = "";

    tasks.forEach((task, index) => {
        if (!task.removed) {
            const row = document.createElement("tr");
            
            const indexCell = document.createElement("td");
            indexCell.textContent = index + 1;// 
            
            const taskCell = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.checked;
            checkbox.onclick = function() {
                toggleTaskStatus(task.id);
            };
            taskCell.appendChild(checkbox);
            taskCell.appendChild(document.createTextNode(" " + task.value));
            
            const actionCell = document.createElement("td");
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = function() {
                removeTask(task.id);
            };
            actionCell.appendChild(deleteButton);
            
            row.appendChild(indexCell);
            row.appendChild(taskCell);
            row.appendChild(actionCell);
            
            taskTableBody.appendChild(row);
        }
    });
}


function toggleTaskStatus(taskId) {
    const tasks = getTasksFromLocalStorage();
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.checked = !task.checked;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
}

function removeTask(taskId) {
    const tasks = getTasksFromLocalStorage();
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.removed = true;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
}

function showCheckedItems() {
    showItems(true, false);
}

function showPendingItems() {
    showItems(false, false);
}

function showRemovedItems() {
    showItems(false, true);
}

function showItems(isChecked, isRemoved) {
    const tasks = getTasksFromLocalStorage();
    const taskTableBody = document.querySelector("#taskTable tbody");
    taskTableBody.innerHTML = "";

    tasks.forEach((task, index) => {
        if (task.checked === isChecked && task.removed === isRemoved) {
            const row = document.createElement("tr");
            
            const indexCell = document.createElement("td");
            indexCell.textContent = index + 1;
            
            const taskCell = document.createElement("td");
            taskCell.textContent = task.value;
            
            const actionCell = document.createElement("td");
            if (isRemoved) {
                const restoreButton = document.createElement("button");
                restoreButton.textContent = "Restore";
                restoreButton.onclick = function() {
                    restoreTask(task.id);
                };
                const deletePermanentlyButton = document.createElement("button");
                deletePermanentlyButton.textContent = "Delete Permanently";
                deletePermanentlyButton.onclick = function() {
                    deletePermanently(task.id);
                };
                actionCell.appendChild(restoreButton);
                actionCell.appendChild(deletePermanentlyButton);
            } else {
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.onclick = function() {
                    removeTask(task.id);
                };
                actionCell.appendChild(deleteButton);
            }
            
            row.appendChild(indexCell);
            row.appendChild(taskCell);
            row.appendChild(actionCell);
            
            taskTableBody.appendChild(row);
        }
    });
}

function restoreTask(taskId) {
    const tasks = getTasksFromLocalStorage();
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.removed = false;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
}

function deletePermanently(taskId) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar.style.display === "block") {
        sidebar.style.display = "none";
    } else {
        sidebar.style.display = "block";
    }
}
function handleClickOutsideSidebar(event) {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggleSidebar");

    if (sidebar.style.display === "block" && !sidebar.contains(event.target) && event.target !== toggleBtn) {
        sidebar.style.display = "none";
    }
}
