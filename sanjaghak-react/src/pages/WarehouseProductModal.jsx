import React, { useState, useEffect } from "react";
import "/src/styles/WarehouseProductModal.css";

export default function WarehouseProductModal({ shelf, onClose, onSave }) {
  if (!shelf) return null;

  const [stock, setStock] = useState(shelf.stock);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(stock !== shelf.stock);
  }, [stock, shelf.stock]);

  const increaseStock = () => {
    setStock(prev => prev + 1);
  };

  const decreaseStock = () => {
    setStock(prev => (prev > 0 ? prev - 1 : 0));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setStock(value === "" ? 0 : parseInt(value, 10));
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(stock);
    }
    onClose();
  };

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
              <td>
                <button onClick={decreaseStock} className="stock-btn minus-btn">-</button>
                <input 
                  type="text" 
                  className="stock-input"
                  value={stock}
                  onChange={handleInputChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                <button onClick={increaseStock} className="stock-btn plus-btn">+</button>
              </td>
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

        <div className="modal-actions">
          <button 
            className="save-btn" 
            onClick={handleSave} 
            disabled={!hasChanges}
          >
            ثبت تغییرات
          </button>
        </div>
      </div>
    </div>
  );
}
