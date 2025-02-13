import React, { useEffect, useState } from "react";

interface Card {
  _id: string;
  text: string;
  completed: boolean;
}

interface List {
  _id: string;
  title: string;
  cards: Card[];
}

interface KanbanBoard {
  boardTitle: string;
  lists: List[];
}

const KanbanPage = () => {
  const [kanban, setKanban] = useState<KanbanBoard | null>(null);

  // Fetch Kanban data
  useEffect(() => {
    const fetchKanban = async () => {
      try {
        const res = await fetch("/api/kanban");
        if (!res.ok) throw new Error("Failed to fetch Kanban data");
        const data = await res.json();
        setKanban(data[0]); // Setăm primul board Kanban
      } catch (error) {
        console.error(error);
      }
    };

    fetchKanban();
  }, []);

  // Handle checkbox change
  const handleCardCompletion = async (cardId: string, listId: string, completed: boolean) => {
    try {
      const res = await fetch("/api/kanban", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cardId, listId, completed: !completed }),
      });
      if (!res.ok) throw new Error("Failed to update card completion");
      
      // Update the local state after the API update
      setKanban((prevKanban) => {
        if (!prevKanban) return null;

        const updatedLists = prevKanban.lists.map((list) => {
          if (list._id === listId) {
            const updatedCards = list.cards.map((card) =>
              card._id === cardId ? { ...card, completed: !completed } : card
            );
            return { ...list, cards: updatedCards };
          }
          return list;
        });

        return { ...prevKanban, lists: updatedLists };
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {kanban ? (
        <>
          <h1>{kanban.boardTitle}</h1>
          <div className="kanban-board">
            {kanban.lists.map((list) => (
              <div key={list._id} className="kanban-list">
                <h2>{list.title}</h2>
                {list.cards.map((card) => (
                  <div key={card._id} className="kanban-card">
                    <p>{card.text}</p>
                    <input
                      type="checkbox"
                      checked={card.completed}
                      onChange={() =>
                        handleCardCompletion(card._id, list._id, card.completed)
                      }
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default KanbanPage;
