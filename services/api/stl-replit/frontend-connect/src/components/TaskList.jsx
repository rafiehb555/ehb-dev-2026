import { useEffect, useState } from "react";
import { completeTask as completeTaskApi, runAIAnalysis } from "../services/api";

export default function TaskList({ userId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    const res = await runAIAnalysis(userId);
    setTasks(res.data.tasks || []);
  };

  useEffect(() => {
    if (!userId) return;
    loadTasks()
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [userId]);

  const handleCompleteTask = async (id) => {
    await completeTaskApi(id);
    await loadTasks();
    alert("Task Completed");
  };

  if (loading) return <div className="card">Loading tasks...</div>;

  return (
    <div className="card">
      <h3>AI Tasks</h3>
      {tasks.length === 0 ? <p>No pending tasks.</p> : null}
      {tasks.map((task) => (
        <div key={task._id} style={{ marginTop: 10, opacity: task.status === "completed" ? 0.6 : 1 }}>
          <h4 style={{ marginBottom: 4 }}>{task.title}</h4>
          <p style={{ marginTop: 0 }}>{task.description}</p>
          <p style={{ marginTop: 0 }}>Status: {task.status}</p>
          {task.status !== "completed" ? (
            <button onClick={() => handleCompleteTask(task._id)}>Complete Task (+{task.reward})</button>
          ) : null}
        </div>
      ))}
    </div>
  );
}

