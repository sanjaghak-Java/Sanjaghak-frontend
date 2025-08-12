import React, { useState } from "react";
import '/src/styles/WarehouseProductSelectorModal.css';

function WarehouseProductSelectorModal({ products, onClose, onSelectProduct }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (product) => {
    onSelectProduct(product);
    onClose();
  };

  return (
    <div className="warehouse-modal-backdrop" onClick={onClose}>
      <div
        className="warehouse-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="warehouse-search-inputs">
          <input
            type="text"
            placeholder="جستجو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="warehouse-modal-content">
          <div className="warehouse-modal-item" style={{ color: "#999" }}>
            <div>نام محصول</div>
            <div>رنگ</div>
            <div>موقعیت</div>
            <div>موجودی</div>
          </div>

          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="warehouse-modal-item"
                onClick={() => handleProductClick(product)}
                style={{ cursor: "pointer" }}
              >
                <div>{product.name}</div>
                <div>{product.variant}</div>
                <div>{product.section} - {product.shelf}</div>
                <div>{product.stock}</div>
              </div>
            ))
          ) : (
            <div className="warehouse-no-results">محصولی یافت نشد.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WarehouseProductSelectorModal;
