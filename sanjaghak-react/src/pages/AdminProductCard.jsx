import React from "react";
import "/src/styles/AdminProductCard.css";

function AdminProductCard({ product, onClick }) {
  const imageSrc = product.mainImageUrl || product.image || "/placeholder.png";

  return (
    <div className="adminProductCard" onClick={() => onClick(product)} style={{ cursor: 'pointer' }}>
      <img src={imageSrc} alt={product.productName} className="adminProductCard__image" />
      <div className="adminProductCard__details">
        <h2 className="adminProductCard__name">{product.productName}</h2>
        <p className="adminProductCard__info">دسته: {product.categoryName || "نامشخص"}</p>
        <p className="adminProductCard__info">برند: {product.brandName || "نامشخص"}</p>
      </div>
    </div>
  );
}

export default AdminProductCard;