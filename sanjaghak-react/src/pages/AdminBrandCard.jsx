import React from "react";
import "/src/styles/adminBrandCard.css";

function AdminBrandCard({ brand }) {
  return (
    <div className="adminBrandCardadmin">
      <img
        src={brand.image}
        alt={brand.name || "brand"}
        className="adminBrandCardadmin__image"
      />
    </div>
  );
}

export default AdminBrandCard;