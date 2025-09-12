import React, { useState, useEffect } from 'react';import "/src/styles/WarehouseViewModal.css";
import download from '../assets/download.png';

function WarehouseViewModal({ transferItems,id, onClose, onConfirmTransfer }) {
    const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const handleConfirmTransfer = async () => {
    if (!transferItems.length) return;
    const inventoryMovementId = id 
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/inventoryMovement/shippingTransfer/${inventoryMovementId}`,
        {
          method: "POST", 
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}) 
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "خطا در تایید انتقال");
      }

      onConfirmTransfer(); 
       window.location.reload();

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="view-modal-overlay" onClick={onClose}></div>

      <div className="view-modal-content" onClick={e => e.stopPropagation()}>
        <div className="view-table-container">
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <h3 className="view-modal-title">جزئیات انتقال محصولات</h3>
            <button className="downloadbutton" title="دانلود">
              <img src={download} alt="دانلود" />
            </button>
          </div>
          <br />
          {error && <div style={{color: "red", marginBottom: 10}}>{error}</div>}
          <table className="view-table">
            <thead>
              <tr>
                <th>محصول</th>
                <th>از انبار - بخش - قفسه</th>
                <th>به انبار - بخش - قفسه</th>
                <th>تعداد</th>
              </tr>
            </thead>
            <tbody>
              {transferItems.length ? (
                transferItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.productName}</td>
                    <td>{`${item.fromWarehouse} - ${item.fromSection} - ${item.fromShelf}`}</td>
                    <td>{`${item.toWarehouse} - ${item.toSection} - ${item.toShelf}`}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="view-table-empty">
                    موردی برای انتقال وجود ندارد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="view-button-container">
          <button
            className="view-confirm-button"
            onClick={handleConfirmTransfer}
            disabled={loading}
          >
            {loading ? "در حال ارسال..." : "تایید انتقال"}
          </button>
        </div>
      </div>
    </>
  );
}


export default WarehouseViewModal;
