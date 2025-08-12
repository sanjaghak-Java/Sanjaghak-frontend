// WarehouseProductModal.jsx
import React from "react";
import "/src/styles/WarehouseProductModal.css";

export default function WarehouseProductModal({ shelf, onClose }) {
  if (!shelf) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>جزئیات محصول در {shelf.name}</h3>

        <table className="product-table">
          <tbody>
            <tr>
              <th>نام محصول</th>
              <td>{shelf.productName}</td>
            </tr>
            <tr>
              <th>رنگ</th>
              <td>{shelf.color}</td>
            </tr>
            <tr>
              <th>موجودی</th>
              <td>{shelf.stock}</td>
            </tr>
            <tr>
              <th>رزرو شده</th>
              <td>{shelf.reserved}</td>
            </tr>
            <tr>
              <th>قیمت</th>
              <td>{shelf.price.toLocaleString()} تومان</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
