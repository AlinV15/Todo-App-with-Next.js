 // Asumăm că ai definit tipurile corespunzătoare
import Kanban, { Card, List } from '@/models/Kanban';
import { connect } from 'mongoose';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined");
    }
    await connect(mongoUri);
    let kanban = await Kanban.find();
    
    // If no board exists, create a default one
    if (kanban.length === 0) {
      const defaultBoard = new Kanban({
        boardTitle: "My Kanban Board",
        lists: [
          { title: "To Do", cards: [] },
          { title: "In Progress", cards: [] },
          { title: "Done", cards: [] }
        ]
      });
      await defaultBoard.save();
      kanban = [defaultBoard];
    }
    
    return NextResponse.json(kanban);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: "Failed to fetch Kanban boards" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined");
    }
    await connect(mongoUri);
    const { listId, card } = await request.json();
    
    const kanban = await Kanban.findOne();
    if (!kanban) {
      return NextResponse.json(
        { error: "Kanban board not found" },
        { status: 404 }
      );
    }

    // Find the list and add the card
    const list = kanban.lists.find((l: List) => l._id.toString() === listId);
    if (!list) {
      return NextResponse.json(
        { error: "List not found" },
        { status: 404 }
      );
    }

    // Add the new card to the list
    list.cards.push({
      text: card.text,
      completed: false
    });

    await kanban.save();
    
    // Return the newly created card
    const newCard = list.cards[list.cards.length - 1];
    return NextResponse.json(newCard);
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: "Failed to add card" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined");
    }
    await connect(mongoUri);
    const { cardId, listId, completed, sourceListId, destListId } = await request.json();
    
    const kanban = await Kanban.findOne();
    if (!kanban) {
      return NextResponse.json(
        { error: "Kanban board not found" },
        { status: 404 }
      );
    }

    // Handle card completion update
    if (completed !== undefined) {
      const list = kanban.lists.find((l: List) => l._id.toString() === listId);
      if (!list) {
        return NextResponse.json(
          { error: "List not found" },
          { status: 404 }
        );
      }

      const card = list.cards.find((c: Card) => c._id.toString() === cardId);
      if (!card) {
        return NextResponse.json(
          { error: "Card not found" },
          { status: 404 }
        );
      }

      card.completed = completed;
    }
    // Handle card movement
    else if (sourceListId && destListId) {
      const sourceList = kanban.lists.find((l: List) => l._id.toString() === sourceListId);
      const destList = kanban.lists.find((l: List) => l._id.toString() === destListId);
      
      if (!sourceList || !destList) {
        return NextResponse.json(
          { error: "List not found" },
          { status: 404 }
        );
      }

      const cardIndex = sourceList.cards.findIndex((c: Card) => c._id.toString() === cardId);
      if (cardIndex === -1) {
        return NextResponse.json(
          { error: "Card not found" },
          { status: 404 }
        );
      }

      // Move the card
      const [card] = sourceList.cards.splice(cardIndex, 1);
      destList.cards.push(card);
    }

    await kanban.save();
    return NextResponse.json({ message: "Update successful" });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: "Failed to update card" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined");
    }
    await connect(mongoUri);
    const { listId, cardId } = await request.json();
    
    const kanban = await Kanban.findOne();
    if (!kanban) {
      return NextResponse.json(
        { error: "Kanban board not found" },
        { status: 404 }
      );
    }

    const list = kanban.lists.find((l: List) => l._id.toString() === listId);
    if (!list) {
      return NextResponse.json(
        { error: "List not found" },
        { status: 404 }
      );
    }

    const cardIndex = list.cards.findIndex((c: Card) => c._id.toString() === cardId);
    if (cardIndex === -1) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      );
    }

    // Remove the card
    list.cards.splice(cardIndex, 1);
    await kanban.save();

    return NextResponse.json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: "Failed to delete card" },
      { status: 500 }
    );
  }
}
