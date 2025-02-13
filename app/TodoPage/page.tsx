'use client';
import React, { useEffect, useState } from "react";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";

interface Task {
  _id: string;
  text: string;
  completed: boolean;
}

const page = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  const addTask = async (text: string) => {
    const newTask = { text, completed: false };
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });
    const data = await res.json();
    setTasks([...tasks, data]);
  };

  const removeTask = async (_id: string) => {
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: _id }),
    });
    setTasks(tasks.filter((task) => task._id !== _id));
  };

  const toggleTask = async (_id: string, completed: boolean) => {
    const res = await fetch("/api/tasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: _id, completed: !completed }),
    });
    const data = await res.json();
    setTasks(
      tasks.map((task) =>
        task._id === data.id ? { ...task, completed: data.completed } : task
      )
    );
  };

  return (
    <div className="max-w-sm sm:max-w-md md:max-w-lg mx-auto mt-10 p-5 border rounded shadow-md w-full">
      <h1 className="text-xl font-bold mb-4 text-center">To do list</h1>
      <TodoForm addTask={addTask} />
      <TodoList tasks={tasks} removeTask={removeTask} toggleTask={toggleTask} />
    </div>
  );
};

export default page;
