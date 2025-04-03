document.addEventListener("DOMContentLoaded", loadTasks);

async function loadTasks() {
    const response = await fetch("/tasks");
    const tasks = await response.json();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.text;
        li.onclick = async function () {
            await deleteTask(task.id);
            loadTasks(); // Reload tasks after deletion
        };
        taskList.appendChild(li);
    });
}

async function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    await fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: taskText })
    });

    taskInput.value = "";
    loadTasks();
}

async function deleteTask(taskId) {
    await fetch(`/tasks/${taskId}`, { method: "DELETE" });
}
