// app/page.tsx
'use client';

import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Card {
  _id: string;
  text: string;
  completed: boolean;
  completedAt?: string | null;
}

interface List {
  _id: string;
  title: string;
  cards: Card[];
}

interface KanbanData {
  boardTitle: string;
  lists: List[];
}

interface DraggedCard {
  card: Card;
  sourceListId: string;
}

const KanbanBoard: React.FC = () => {
  const [kanban, setKanban] = useState<KanbanData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newCardText, setNewCardText] = useState<string>('');
  const [selectedList, setSelectedList] = useState<string>('');
  const [draggedCard, setDraggedCard] = useState<DraggedCard | null>(null);

  const defaultKanban: KanbanData = {
    boardTitle: "My Kanban Board",
    lists: [
      { _id: "1", title: "To Do", cards: [] },
      { _id: "2", title: "In Progress", cards: [] },
      { _id: "3", title: "Done", cards: [] }
    ]
  };

  useEffect(() => {
    const fetchKanban = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/kanban');
        const data = await response.json();
        setKanban(data.length > 0 ? data[0] : defaultKanban);
      } catch (err) {
        setError('Failed to load board' + err);
        setKanban(defaultKanban);
      } finally {
        setLoading(false);
      }
    };
    fetchKanban();
  }, []);

  useEffect(() => {
    const checkCompletedCards = async () => {
      if (!kanban) return;

      const now = new Date();
      
      kanban.lists.forEach(list => {
        list.cards.forEach(card => {
          if (card.completed && card.completedAt) {
            const completedAt = new Date(card.completedAt);
            const hoursSinceCompletion = (now.getTime() - completedAt.getTime()) / (1000 * 60 * 60);
            
            if (hoursSinceCompletion >= 24) {
              handleDeleteCard(card._id, list._id);
            }
          }
        });
      });
    };

    const interval = setInterval(checkCompletedCards, 60000);
    return () => clearInterval(interval);
  }, [kanban]);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardText.trim() || !selectedList) return;

    const newCard: Partial<Card> = {
      text: newCardText,
      completed: false
    };

    try {
      const response = await fetch('/api/kanban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listId: selectedList,
          card: newCard
        })
      });

      if (!response.ok) throw new Error('Failed to add card');

      const addedCard = await response.json();

      setKanban(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          lists: prev.lists.map(list =>
            list._id === selectedList
              ? { ...list, cards: [...list.cards, addedCard] }
              : list
          )
        };
      });

      setNewCardText('');
    } catch (err) {
      setError('Failed to add card' + err);
    }
  };

  const handleCardCompletion = async (cardId: string, listId: string, completed: boolean) => {
    try {
      const response = await fetch('/api/kanban', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId,
          listId,
          completed: !completed,
          completedAt: !completed ? new Date().toISOString() : null
        })
      });

      if (!response.ok) throw new Error('Failed to update card');

      setKanban(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          lists: prev.lists.map(list =>
            list._id === listId
              ? {
                  ...list,
                  cards: list.cards.map(card =>
                    card._id === cardId
                      ? { 
                          ...card, 
                          completed: !completed,
                          completedAt: !completed ? new Date().toISOString() : null 
                        }
                      : card
                  )
                }
              : list
          )
        };
      });
    } catch (err) {
      setError('Failed to update card'+ err);
    }
  };

  const handleDeleteCard = async (cardId: string, listId: string) => {
    try {
      const response = await fetch('/api/kanban', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listId,
          cardId
        })
      });

      if (!response.ok) throw new Error('Failed to delete card');

      setKanban(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          lists: prev.lists.map(list =>
            list._id === listId
              ? {
                  ...list,
                  cards: list.cards.filter(card => card._id !== cardId)
                }
              : list
          )
        };
      });
    } catch (err) {
      setError('Failed to delete card' + err);
    }
  };

  const handleDragStart = (e: React.DragEvent, card: Card, listId: string) => {
    setDraggedCard({ card, sourceListId: listId });
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLDivElement;
    target.classList.add('bg-gray-200');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLDivElement;
    target.classList.remove('bg-gray-200');
  };

  const handleDrop = async (e: React.DragEvent, destListId: string) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLDivElement;
    target.classList.remove('bg-gray-200');
    
    if (!draggedCard || draggedCard.sourceListId === destListId) return;

    const { card, sourceListId } = draggedCard;

    try {
      const response = await fetch('/api/kanban', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceListId,
          destListId,
          cardId: card._id
        })
      });

      if (!response.ok) throw new Error('Failed to move card');

      setKanban(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          lists: prev.lists.map(list => {
            if (list._id === sourceListId) {
              return {
                ...list,
                cards: list.cards.filter(c => c._id !== card._id)
              };
            }
            if (list._id === destListId) {
              return {
                ...list,
                cards: [...list.cards, card]
              };
            }
            return list;
          })
        };
      });
    } catch (err) {
      setError('Failed to move card' + err);
    }

    setDraggedCard(null);
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!kanban) return null;

  return (
    <div className="max-w-full mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 font-bebas">{kanban.boardTitle}</h1>
      
      <form onSubmit={handleAddCard} className="mb-8 flex gap-4 justify-center flex-wrap">
        <select
          value={selectedList}
          onChange={(e) => setSelectedList(e.target.value)}
          className="border rounded p-2 text-gray-800 w-full sm:w-auto"
        >
          <option value="">Select List</option>
          {kanban.lists.map(list => (
            <option key={list._id} value={list._id}>{list.title}</option>
          ))}
        </select>
        <input
          type="text"
          value={newCardText}
          onChange={(e) => setNewCardText(e.target.value)}
          placeholder="New card text..."
          className="border rounded p-2 flex-grow max-w-md text-black"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Card
        </button>
      </form>

      <div className="flex gap-6 overflow-x-auto pb-4 flex-wrap justify-start">
        {kanban.lists.map(list => (
          <div
            key={list._id}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, list._id)}
            className="bg-gray-100 rounded-lg p-4 w-full sm:w-80 md:w-96 flex-shrink-0 transition-colors duration-200"
          >
            <h2 className="text-xl font-semibold mb-4 text-neutral-900">{list.title}</h2>
            {list.cards.map(card => (
              <div
                key={card._id}
                draggable
                onDragStart={(e) => handleDragStart(e, card, list._id)}
                className="bg-white rounded shadow p-3 mb-3 cursor-move hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <p className={card.completed ? "line-through text-gray-400" : "text-gray-800"}>{card.text}</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={card.completed}
                      onChange={() => handleCardCompletion(card._id, list._id, card.completed)}
                      className="appearance-none w-6 h-6 border-2 border-gray-400 rounded-md flex items-center justify-center checked:bg-green-500 checked:border-green-700 checked:after:content-['✔'] checked:after:text-white checked:after:text-lg checked:after:flex checked:after:items-center checked:after:justify-center"
                    />
                    <button
                      onClick={() => handleDeleteCard(card._id, list._id)}
                      className="text-red-500 hover:text-red-700 px-2 py-1 rounded-full hover:bg-red-50"
                    >
                      <X />
                    </button>
                  </div>
                </div>
                {card.completed && card.completedAt && (
                  <div className="text-xs text-gray-500 mt-1">
                    Completed: {new Date(card.completedAt).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
