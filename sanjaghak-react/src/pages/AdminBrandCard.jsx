import React from "react";
import "/src/styles/adminBrandCard.css";

function AdminBrandCard({ brand }) {
  return (
    <div
      className={`adminBrandCardadminhover ${brand.active ? 'brandActive' : 'brandInactive'}`}
    >
      <div className="adminBrandCardadmin">
        <img src={brand.logoUrl} className="adminBrandCardadmin__image" />
        <p className="adminBrandCardadmin__name">{brand.Name}</p>
      </div>
    </div>

  );
}

export default AdminBrandCard;