import { Trash2 } from 'lucide-react';
import React from 'react';

interface Task {
  _id: string;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  task: Task;
  removeTask: (id: string) => void;
  toggleTask: (id: string, completed: boolean) => void;
}

export default function TodoItem({ task, removeTask, toggleTask }: TodoItemProps) {
  return (
    <li className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg shadow-sm">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTask(task._id, task.completed)}
        className="w-6 h-6 border-2 border-gray-400 rounded-md flex items-center justify-center checked:bg-green-500 checked:border-green-700 checked:after:content-['✔'] checked:after:text-white checked:after:text-lg"
      />
      <span className={`flex-1 text-gray-700 ${task.completed ? "line-through text-gray-500" : ""}`}>
        {task.text}
      </span>
      <button onClick={() => removeTask(task._id)} className="text-red-500">
        <Trash2 />
      </button>
    </li>
  );
}
