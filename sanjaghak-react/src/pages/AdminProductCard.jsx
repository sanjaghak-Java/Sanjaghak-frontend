import React from "react";
import "/src/styles/AdminProductCard.css";



function AdminProductCard({ product, onClick }) {
  return (
    <div
      className="adminProductCard"
      onClick={() => onClick && onClick(product)}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <img
        src={product.image}
        alt={product.name}
        className="adminProductCard__image"
      />
      <div className="adminProductCard__details">
        <h2 className="adminProductCard__name">{product.name}</h2>
        <p className="adminProductCard__info">
          قیمت: {product.price.toLocaleString()} تومان
        </p>
        <p className="adminProductCard__info">دسته: {product.category}</p>
        <p className="adminProductCard__info">برند: {product.brand}</p>
      </div>
    </div>
  );
}

export default AdminProductCard;