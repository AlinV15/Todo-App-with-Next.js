// models/kanban.ts
import mongoose from 'mongoose';

// Definirea tipurilor pentru Card și List
interface Card {
  _id: mongoose.Types.ObjectId;
  text: string;
  completed: boolean;
  completedAt: Date | null;
}

interface List {
  _id: mongoose.Types.ObjectId;
  title: string;
  cards: Card[];
}

const cardSchema = new mongoose.Schema({
  text: String,
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: { 
    type: Date, 
    default: null 
  }
});

const listSchema = new mongoose.Schema({
  title: String,
  cards: [cardSchema]
});

const kanbanSchema = new mongoose.Schema({
  boardTitle: String,
  lists: [listSchema]
});

const Kanban = mongoose.models.Kanban || mongoose.model('Kanban', kanbanSchema);

export default Kanban;

// Exportă și tipurile pentru utilizare în alte părți ale codului
export type { Card, List };
