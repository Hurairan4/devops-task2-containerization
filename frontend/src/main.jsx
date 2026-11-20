import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  async function loadTasks() {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Request failed");
      setTasks(await response.json());
      setMessage("");
    } catch {
      setMessage("Unable to connect to the backend.");
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(event) {
    event.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() })
      });

      if (!response.ok) throw new Error("Request failed");

      setTitle("");
      await loadTasks();
    } catch {
      setMessage("Unable to create task.");
    }
  }

  return (
    <main className="container">
      <header>
        <span className="eyebrow">AWS EC2 • Docker • React • PostgreSQL</span>
        <h1>DevOps Task Manager</h1>
        <p>A containerized full-stack application</p>
      </header>

      <section className="panel">
        <h2>Create a Task</h2>
        <form onSubmit={addTask}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a new task..."
            maxLength={200}
            required
          />
          <button type="submit">Add Task</button>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Your Tasks</h2>
          <span className="count">{tasks.length} total</span>
        </div>
        {message && <p role="alert" className="error">{message}</p>}
        {tasks.length === 0 && !message && <p>No tasks yet.</p>}
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <span className="task-icon">✓</span>
              <span>{task.title}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer>Task 2 — Application Containerization & Asset Optimization</footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
