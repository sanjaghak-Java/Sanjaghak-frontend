import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "/src/styles/WarehouseProductInformation.css";


function WarehouseProductInformation() {
  const location = useLocation();
  const navigate = useNavigate();

  // دریافت اطلاعات محصول از location.state
  const { product, warehouseName, sectionName } = location.state || {};

  if (!product) {
    return (
      <div style={{ padding: 20, fontFamily: "Vazirmatn, sans-serif", direction: "rtl" }}>
        <p>اطلاعات محصول موجود نیست.</p>
        <button onClick={() => navigate(-1)} style={buttonStyle}>
          بازگشت
        </button>
      </div>
    );
  }

  const buttonStyle = {
    marginTop: 20,
    padding: "8px 16px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#1976d2",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  };

 return (
  <div className="warehouse-product-info-container">
    <h2>{product.productName}</h2>
    <p><strong>انبار:</strong> {warehouseName}</p>
    <p><strong>بخش:</strong> {sectionName}</p>
    <p><strong>رنگ:</strong> {product.color}</p>
    <p><strong>موجودی:</strong> {product.stock}</p>
    <p><strong>رزرو شده:</strong> {product.reserved}</p>
    <p><strong>قیمت:</strong> {product.price.toLocaleString()} تومان</p>

    <button onClick={() => navigate(-1)}>
      بازگشت
    </button>
  </div>
);

}

export default WarehouseProductInformation;
