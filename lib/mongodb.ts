import { MongoClient } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

const connectToDatabase = async () => {
  // Dacă conexiunea a fost deja deschisă, returnează conexiunea cached
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Conectează-te la MongoDB
  const client = new MongoClient(process.env.MONGODB_URI || "");
  await client.connect();  // Deschide conexiunea

  const db = client.db();  // Obține instanța bazei de date

  // Salvează clientul și baza de date pentru reutilizare
  cachedClient = client;
  cachedDb = db;

  return { client, db };
};

export default connectToDatabase;
