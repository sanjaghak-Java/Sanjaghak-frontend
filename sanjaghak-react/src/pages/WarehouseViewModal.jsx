import React from "react";
import "/src/styles/WarehouseViewModal.css";
import download from '../assets/download.png';

function WarehouseViewModal({ transferItems, onClose, onConfirmTransfer }) {
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
            onClick={onConfirmTransfer}
          >
            تایید انتقال
          </button>
        </div>
      </div>
    </>
  );
}

export default WarehouseViewModal;
