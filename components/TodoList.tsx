import React from 'react'
import TodoItem from './TodoItem';

interface Task {
    text: string;
    completed: boolean;
  }
  
  interface TodoListProps {
    tasks: Task[];
    removeTask: (index: number) => void;
    toggleTask: (index: number) => void;
  }

  export default function TodoList({ tasks, removeTask, toggleTask }: TodoListProps) {
    return (
      <ul className="mt-4 space-y-2">
        {tasks.map((task, index) => (
          <TodoItem
            key={index}
            task={task}
            removeTask={() => removeTask(index)}
            toggleTask={() => toggleTask(index)}
          />
        ))}
      </ul>
    );
  }