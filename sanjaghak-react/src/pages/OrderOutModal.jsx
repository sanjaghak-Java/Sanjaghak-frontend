import React from "react";

function OrderOutModal({ isOpen, onClose, onConfirm, items, sourceWarehouse, destinationWarehouse }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 10,
          width: "80%",
          maxWidth: 600,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>جزئیات خروج سفارشات</h3>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p><strong>انبار مبدا:</strong> {sourceWarehouse}</p>
          <p><strong>انبار مقصد:</strong> {destinationWarehouse}</p>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: 8, backgroundColor: "#f0f0f0" }}>ردیف</th>
              <th style={{ border: "1px solid #ddd", padding: 8, backgroundColor: "#f0f0f0" }}>نام محصول</th>
              <th style={{ border: "1px solid #ddd", padding: 8, backgroundColor: "#f0f0f0" }}>تعداد</th>
              <th style={{ border: "1px solid #ddd", padding: 8, backgroundColor: "#f0f0f0" }}>قفسه مبدا</th>
              <th style={{ border: "1px solid #ddd", padding: 8, backgroundColor: "#f0f0f0" }}>قفسه مقصد</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>{index + 1}</td>
                <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>{item.productName}</td>
                <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>{item.quantity}</td>
                <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>{item.sourceShelf}</td>
                <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>{item.destinationShelf}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ width: "100%", direction: "ltr" }}>
          <button
            onClick={onConfirm}
            style={{
              marginTop: 15,
              padding: "8px 12px",
              border: "none",
              borderRadius: 6,
              backgroundColor: "#dc2655",
              color: "white",
              cursor: "pointer",
            }}
          >
            انتقال به انبار مرکزی
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderOutModal;
