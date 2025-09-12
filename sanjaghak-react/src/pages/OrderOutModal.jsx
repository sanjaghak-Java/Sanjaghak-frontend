import React, { useEffect, useState } from "react";

function OrderOutModal({ isOpen, onClose, items, sourceWarehouse, destinationWarehouse, token }) {
  const [displayItems, setDisplayItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !items?.length) return;

    const fetchProductNamesAndShelfCodes = async () => {
      const newItems = await Promise.all(
        items.map(async (item) => {
          // Fetch product name
          const variantId = item.variantsId?.variantId;
          let productName = "نامشخص";
          if (variantId) {
            try {
              const res = await fetch(
                `http://127.0.0.1:8080/api/Sanjaghak/productVariants/${variantId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (res.ok) {
                const data = await res.json();
                productName = data.productId?.productName || "نامشخص";
              }
            } catch (err) {
              console.error(err);
            }
          }

          // Fetch source shelf code
          let sourceShelf = "نامشخص";
          const sourceShelfId = item.fromShelvesId?.shelvesId;
          if (sourceShelfId) {
            try {
              const res = await fetch(
                `http://127.0.0.1:8080/api/Sanjaghak/shelves/${sourceShelfId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (res.ok) {
                const shelfData = await res.json();
                sourceShelf = shelfData.shelvesCode || "نامشخص";
              }
            } catch (err) {
              console.error("خطا در دریافت قفسه:", err);
            }
          }

          return {
            ...item,
            productName,
            sourceShelf,
            destinationShelf: item.toShelvesId?.shelvesId || "نامشخص", // keep as-is
          };
        })
      );
      setDisplayItems(newItems);
    };

    fetchProductNamesAndShelfCodes();
  }, [isOpen, items, token]);

  const handleConfirm = async () => {
    if (!items?.length) return;
    setLoading(true);

    try {
      // Call process-order-request for each inventoryMovementId
      await Promise.all(
        items.map((item) =>
          fetch(`http://127.0.0.1:8080/api/Sanjaghak/Orders/${item.inventoryMovementId}/process-order-request`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      alert("سفارشات با موفقیت انتقال یافت!");
      onClose(); // close modal after success
    } catch (err) {
      console.error("خطا در تایید سفارش:", err);
    } finally {
      setLoading(false);
    }
  };

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
            {displayItems.map((item, index) => (
              <tr key={item.inventoryMovementId || index}>
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
            onClick={handleConfirm}
            disabled={loading}
            style={{
              marginTop: 15,
              padding: "8px 12px",
              border: "none",
              borderRadius: 6,
              backgroundColor: "#dc2655",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "در حال انتقال..." : "انتقال به انبار مرکزی"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderOutModal;