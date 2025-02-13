import React from "react";
import Card from "./Card";


const List = ({ list }: { list: any }) => {
  return (
    <div className="list">
      <h3>{list.title}</h3>
      {list.cards.map((card: any) => (
        <Card key={card._id} card={card} />
      ))}
    </div>
  );
};

export default List;