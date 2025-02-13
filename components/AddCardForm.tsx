import { useState } from "react";

interface AddCardFormProps {
  listId: string;
  addCard: (listId: string, cardText: string) => void;
}

const AddCardForm = ({ listId, addCard }: AddCardFormProps) => {
  const [cardText, setCardText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardText.trim()) return;
    addCard(listId, cardText);
    setCardText("");
  };

  return (
    <form onSubmit={handleSubmit} className="add-card-form">
      <input
        type="text"
        value={cardText}
        onChange={(e) => setCardText(e.target.value)}
        placeholder="Add a new card..."
        className="border p-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2">
        Add Card
      </button>
    </form>
  );
};

export default AddCardForm;
