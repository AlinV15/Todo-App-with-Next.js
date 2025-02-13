import { NextRequest, NextResponse } from 'next/server';

import { ObjectId } from 'mongodb';
import connectToDatabase from '@/lib/mongodb';

interface Task {
  text: string;
  completed: boolean;
}

export async function GET(req: NextRequest) {
  const db = await connectToDatabase();
  const collection = db.db.collection("tasks");

  const tasks = await collection.find({}).toArray();
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const db = await connectToDatabase();
  const collection = db.db.collection("tasks");

  const { text }: Task = await req.json();
  const newTask = { text, completed: false };
  await collection.insertOne(newTask);
  return NextResponse.json(newTask, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const db = await connectToDatabase();
  const collection = db.db.collection("tasks");

  const { id, completed }: { id: string; completed: boolean } = await req.json();
  await collection.updateOne({ _id: new ObjectId(id) }, { $set: { completed } });
  return NextResponse.json({ id, completed });
}

export async function DELETE(req: NextRequest) {
  const db = await connectToDatabase();
  const collection = db.db.collection("tasks");

  const { id }: { id: string } = await req.json();
  await collection.deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ id });
}
