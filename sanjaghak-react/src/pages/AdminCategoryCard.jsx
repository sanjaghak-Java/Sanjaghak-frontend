import React from "react";
import "/src/styles/admincategorycard.css";

function AdminCategoryCard({ category }) {
  return (
    <div className="adminCategoryCardhover">
      <div className="adminCategoryCard">
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.categoryName}
            className="adminCategoryCard__image"
          />
        ) : (
          <div className="adminCategoryCard__placeholderadmin">بدون تصویر</div>
        )}
        <h3 className="adminCategoryCard__nameadmin">{category.categoryName}</h3>
      </div>
    </div>

  );
}

export default AdminCategoryCard;