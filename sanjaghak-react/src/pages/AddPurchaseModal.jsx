import React, { useState } from 'react';
import '/src/styles/AddPurchaseModal.css';
import toman from "../assets/Toman.png";

function ProductSelectorModal({ isOpen, onClose, products, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const [expandedProductId, setExpandedProductId] = useState(null);

  if (!isOpen) return null;

  const categories = ["همه", ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "همه" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id) => {
    setExpandedProductId(prev => prev === id ? null : id);
  };

  function Chevron({ direction = "down", size = 24, color = "#333" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: direction === "up" ? "rotate(180deg)" : "none", transition: "transform 0.3s ease" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}


  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="جستجو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="modal-products">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div
                key={product.id}
                className="add-product-card"
              >
                <div className="product-header">
                  <h4>{product.name}</h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(product.id);
                    }}
                    className="toggle-btn"
                  >
                    <Chevron direction={expandedProductId === product.id ? "up" : "down"} size={20} color="#555" />
                  </button>
                </div>

                {expandedProductId === product.id && (
                  <div style={{ display: "flex", gap: "15px", alignItems: "center", justifyContent: "center" }}>
                    <img src={product.image} alt={product.name} className="add-product-image" />

                    <div className="add-card-info">
                      <div className="color-show-box">
                        انتخاب رنگ:
                        {product.colors ? product.colors.map((color, index) => (
                          <span
                            key={index}
                            className="product-color-show"
                            style={{ backgroundColor: color.hex, cursor: 'pointer', border: '1px solid #ccc', marginRight: 5 }}
                            title={color.name}
                            onClick={() => onSelect({ ...product, selectedColor: color })}
                          />
                        )) : (
                          <span
                            className="product-color-show"
                            style={{ backgroundColor: product.colorHex, cursor: 'pointer', border: '1px solid #ccc' }}
                            title={product.colorName}
                            onClick={() => onSelect({ ...product, selectedColor: { name: product.colorName, hex: product.colorHex } })}
                          />
                        )}
                        <label className="color-name-box">{product.colorName}</label>
                      </div>

                      <div className="attributes">
                        {Object.entries(product.attributes).map(([key, value]) => (
                          <p key={key}><strong>{key}:</strong> {value}</p>
                        ))}
                      </div>

                      <div className="price">
                        <img src={toman} alt="" className="toman" />
                        <p>{product.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>محصولی یافت نشد.</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default ProductSelectorModal;
