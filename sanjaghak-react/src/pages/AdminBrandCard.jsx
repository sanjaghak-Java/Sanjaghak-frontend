import React from "react";
import "/src/styles/adminBrandCard.css";

function AdminBrandCard({ brand }) {
  return (
    <div
      className={`adminBrandCardadmin ${brand.active ? 'brandActive' : 'brandInactive'}`}
    >
      <img src={brand.logoUrl} className="adminBrandCardadmin__image" />
    </div>
  );
}

export default AdminBrandCard;