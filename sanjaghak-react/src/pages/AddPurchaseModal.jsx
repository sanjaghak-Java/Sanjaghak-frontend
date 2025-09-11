import React, { useState, useEffect } from 'react';
import '/src/styles/AddPurchaseModal.css';
import toman from "../assets/Toman.png";

function ProductSelectorModal({ isOpen, onClose, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

const fetchProducts = async () => {
  
  setLoading(true);
  setError("");
  try {
    const res = await fetch("http://127.0.0.1:8080/api/Sanjaghak/product/getAllProduct", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
      
    });

    if (!res.ok) throw new Error("خطا در دریافت محصولات");

    const data = await res.json();

const enriched = await Promise.all(
  data.map(async (product) => {
    try {
      const variantRes = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/productVariants/getProductVariantByProductId?productId=${product.productId}`);
      const variants = variantRes.ok ? await variantRes.json() : [];

      const colors = variants.map(v => ({
        name: v.color,          
        hex: v.hexadecimal,     
        variantId: v.variantId,
        costPrice: v.costPrice,
        price: v.price
      }));

      const imageRes = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/productImages/${product.productId}`);
      const images = imageRes.ok ? await imageRes.json() : [];

      const primaryImage = images.find(img => img.required) || images[0] || null;

      return { ...product, colors, primaryImage };
    } catch {
      return { ...product, colors: [], primaryImage: null };
    }
  })
);

    setProducts(enriched);
  } catch (err) {
    setError(err.message || "مشکل در بارگذاری محصولات");
  } finally {
    setLoading(false);
  }
};
  if (!isOpen) return null;

  const categories = ["همه", ...new Set(products.map(p => p.categoryName || "دسته‌بندی ناشناخته"))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.productName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "همه" || product.categoryName === selectedCategory;
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

        {loading && <p>در حال بارگذاری...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="modal-products">
          {!loading && !error && (
            filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div key={product.productId} className="add-product-card">
                  <div className="product-header">
                    <h4>{product.productName}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(product.productId);
                      }}
                      className="toggle-btn"
                    >
                      <Chevron direction={expandedProductId === product.productId ? "up" : "down"} size={20} color="#555" />
                    </button>
                  </div>

                  {expandedProductId === product.productId && (
                    <div style={{ display: "flex", gap: "15px", alignItems: "center", justifyContent: "center" }}>
{product.primaryImage ? (
  <img
    src={`http://127.0.0.1:8080${product.primaryImage.imageUrl}`}
    alt={product.productName}
    className="add-product-image"
  />
) : (
  <div>تصویری موجود نیست</div>
)}

                      <div className="add-card-info">
                        <div className="color-show-box">
                          انتخاب رنگ:
                          {product.colors && product.colors.length > 0 ? (
  product.colors.map((color, index) => (
    <span
      key={index}
      className="product-color-show"
      style={{ backgroundColor: color.hex, cursor: 'pointer', border: '1px solid #ccc', marginRight: 5 }}
      title={color.name}
onClick={() => onSelect({
  productId: product.productId,
  productName: product.productName,
  variantId: color.variantId,
  colorName: color.name,
  colorHex: color.hex,
  costPrice: color.costPrice ?? 0,
  price: color.price ?? 0
})}
    />
  ))
) : (
  <span>بدون رنگ</span>
)}
                        </div>

                        <div className="attributes">
                          {product.attributes && Object.entries(product.attributes).map(([key, value]) => (
                            <p key={key}><strong>{key}:</strong> {value}</p>
                          ))}
                        </div>

                        <div className="price">
                          <img src={toman} alt="" className="toman" />
                          <p>{(product.costPrice ?? product.colors?.[0]?.costPrice ?? 0).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>محصولی یافت نشد.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductSelectorModal;