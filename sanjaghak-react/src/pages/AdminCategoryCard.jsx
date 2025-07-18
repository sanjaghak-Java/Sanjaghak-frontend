import React from "react";
import "/src/styles/admincategorycard.css";

function AdminCategoryCard({ category }) {
  return (
    <div className="adminCategoryCard">
      <img
        src={category.image}
        alt={category.name}
        className="adminCategoryCard__image"
      />
      <h3 className="adminCategoryCard__name">{category.name}</h3>
    </div>
  );
}

export default AdminCategoryCard;