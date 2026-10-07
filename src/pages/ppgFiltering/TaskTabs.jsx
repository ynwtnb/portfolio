import React from "react";
import { TASKS, TASK_LABELS } from "./content";

export default function TaskTabs({ task, setTask }) {
  return (
    <div className="ppgf-controls">
      <span className="ppgf-label">Task</span>
      <div className="ppgf-seg" role="group" aria-label="Task">
        {TASKS.map((t) => (
          <button key={t} aria-pressed={task === t} onClick={() => setTask(t)} title={TASK_LABELS[t].detail}>
            {TASK_LABELS[t].name}
          </button>
        ))}
      </div>
    </div>
  );
}
