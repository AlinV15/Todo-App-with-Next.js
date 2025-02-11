'use client';
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import { useEffect, useState } from "react";

interface Task {
  text: string;
  completed: boolean;
}


export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text: string) => {
    const newTask: Task = { text, completed: false };
    setTasks([...tasks, newTask]);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleTask = (index: number) => {
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-5 border rounded shadow-md">
      <h1 className="text-xl font-bold mb-4">To do list </h1>
      <TodoForm addTask={addTask} />
      <TodoList tasks={tasks} removeTask={removeTask} toggleTask={toggleTask} />
    </div>
  );
}
