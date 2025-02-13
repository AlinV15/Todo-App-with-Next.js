"use client";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return <div>Please sign in to see your name.</div>;
  }

  return (
    <div>
      <h1 className="font-bebas text-4xl">Hello, {user?.fullName || user?.username}</h1>
    </div>
  );
}
