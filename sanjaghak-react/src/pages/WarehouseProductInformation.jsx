import React from "react";

function WarehouseProductInformation({ product, onClose }) {
  if (!product) return null;

  const { stock = 0, minStock = 0, maxStock = 0 } = product;

  let warning = "";
  if (stock <= minStock + 2) {
    warning = `⚠️ موجودی به حداقل (${minStock}) نزدیک است.`;
  } else if (stock >= maxStock - 2) {
    warning = `⚠️ موجودی به حداکثر (${maxStock}) نزدیک است.`;
  }

  return (
    <>
      <div
        className="modal-overlay"
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 1001,
          animation: "fadeIn 0.3s ease",
        }}
      ></div>

      <div
        className="modal-content"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          padding: "25px 30px",
          borderRadius: "14px",
          width: "400px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15), 0 2px 10px rgba(0,0,0,0.1)",
          zIndex: 1002,
          fontFamily: "Vazirmatn, sans-serif",
          direction: "rtl",
          textAlign: "right",
        }}
      >
        <h3
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "8px",
          }}
        >
          اطلاعات محصول
        </h3>

        <p><strong>نام محصول:</strong> {product.productName}</p>
        <p><strong>رنگ:</strong> {product.color || "نامشخص"}</p>
        <p><strong>موقعیت:</strong> {product.location}</p>
        <p><strong>موجودی فعلی:</strong> {stock} عدد</p>
        <p><strong>موجودی رزرو شده:</strong> {product.reserved ?? "۰"} عدد</p>
        <p><strong>حداقل موجودی:</strong> {minStock} عدد</p>
        <p><strong>حداکثر موجودی:</strong> {maxStock} عدد</p>

        {warning && (
          <div style={{ color: "red", fontWeight: "bold", marginTop: "15px" }}>
            {warning}
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: "25px",
            padding: "10px 16px",
            cursor: "pointer",
            borderRadius: "8px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            fontWeight: "600",
            width: "100%",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1565c0")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#1976d2")}
        >
          بستن
        </button>
      </div>
    </>
  );
}

export default WarehouseProductInformation;
