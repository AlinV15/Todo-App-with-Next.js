import React from 'react';
import TodoItem from './TodoItem';

interface Task {
  _id: string;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  tasks: Task[];
  removeTask: (id: string) => void;
  toggleTask: (id: string, completed: boolean) => void;
}

export default function TodoList({ tasks, removeTask, toggleTask }: TodoListProps) {
  return (
    <ul className="mt-4 space-y-2">
      {tasks.map((task) => (
        <TodoItem
          key={task._id}
          task={task}
          removeTask={removeTask}
          toggleTask={toggleTask}
        />
      ))}
    </ul>
  );
}
