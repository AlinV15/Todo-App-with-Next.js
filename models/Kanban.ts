// models/kanban.ts
import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  text: String,
  completed: {
    type: Boolean,
    default: false,
    completedAt: Date  // New field
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