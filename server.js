const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const TASKS_FILE = "tasks.json";

app.use(cors());
app.use(express.json()); // Parse JSON request bodies
app.use(express.static("public")); // Serve frontend

// Load tasks from file
function loadTasks() {
    if (!fs.existsSync(TASKS_FILE)) return [];
    return JSON.parse(fs.readFileSync(TASKS_FILE, "utf8"));
}

// Save tasks to file
function saveTasks(tasks) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), "utf8");
}

// 📌 API Endpoints

// ✅ Get all tasks
app.get("/tasks", (req, res) => {
    res.json(loadTasks());
});

// ✅ Add a task
app.post("/tasks", (req, res) => {
    const tasks = loadTasks();
    const newTask = { id: Date.now(), text: req.body.text };
    tasks.push(newTask);
    saveTasks(tasks);
    res.status(201).json(newTask);
});

// ✅ Remove a task
app.delete("/tasks/:id", (req, res) => {
    let tasks = loadTasks();
    const taskId = parseInt(req.params.id);
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks(tasks);
    res.json({ message: "Task deleted" });
});

// ✅ Check if tasks persist after reload
app.get("/check-persistence", (req, res) => {
    res.json({ persisted: fs.existsSync(TASKS_FILE) });
});

// ✅ Get storage method
app.get("/storage", (req, res) => {
    res.json({ method: "JSON file (tasks.json)" });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
