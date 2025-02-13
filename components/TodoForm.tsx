import React, { useState } from 'react';

interface TodoFormProps {
  addTask: (task: string) => void;
}

export default function TodoForm({ addTask }: TodoFormProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === "") return;
    addTask(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add task..."
        className="border p-2 flex-1 rounded text-black"
      />
      <button type="submit" className="bg-green-500 text-white p-2 rounded">
        Add
      </button>
    </form>
  );
}
