// Card.tsx
import React from "react";

const Card = ({ card }: { card: any }) => {
  return <div className="card">{card.text}</div>;
};

export default Card;
