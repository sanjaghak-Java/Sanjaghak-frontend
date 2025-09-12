import React, { useState } from "react";
import "/src/styles/RequestDetailsModal.css";

function RequestDetailsModal({ isOpen, onClose, request }) {
  const [updatingItemIds, setUpdatingItemIds] = useState([]); // track loading state

  if (!isOpen || !request) return null;

  const {
    id,
    type,
    returnId,
    date,
    requester,
    status,
    address,
    items = [],
    totals = {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      finalPrice: 0
    },
    returnReason,
    description
  } = request;

  const shouldShowActions =
    (type === "مرجوعی" || type === "لغو خرید") &&
    status === "در حال بررسی";

  const shouldShowReturnDescription = type === "مرجوعی";

const handleReturnAction = async (itemId, restock) => {
  console.log(returnId);

  try {
    setUpdatingItemIds(prev => [...prev, itemId]);
    const token = localStorage.getItem("token");

    // Step 1: check/reject return item
    const res1 = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/returnItem/checkReturnItem/${itemId}?isRestock=${restock}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (!res1.ok) throw new Error("Failed to update return item");
    // Step 2: finalize the return using returnId
    if (request.returnId) {
      const res2 = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/return/checked/${request.returnId}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }
      );
      if (!res2.ok) throw new Error("Failed to finalize return");
    }

    // update UI
    request.items = request.items.map(item =>
      item.id === itemId ? { ...item, restock, status: restock ? "قبول شده" : "رد شده" } : item
    );

  } catch (error) {
    console.error("Error updating return item:", error);
    alert("خطا در ثبت تغییر وضعیت");
  } finally {
    setUpdatingItemIds(prev => prev.filter(id => id !== itemId));
    window.location.reload();
  }
};

  return (
    <div className="req-modal-overlay" onClick={onClose}>
      <div className="req-modal-content" onClick={(e) => e.stopPropagation()}>
        <h4>جزئیات درخواست</h4>
        <br />
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p>شماره سفارش: <span>{id}</span></p>
          <p>نوع درخواست: <span>{type}</span></p>
          <p>تاریخ ثبت: <span>{date}</span></p>
          <p>درخواست‌کننده: <span>{requester}</span></p>
          <p>آدرس: <span>{address}</span></p>
        </div>
        <br />
        <hr />
        <table className="req-order-items-table">
          <thead>
            <tr>
              <th>ردیف</th>
              <th>نام محصول</th>
              <th>قیمت واحد</th>
              <th>تعداد</th>
              <th>قیمت کل</th>
              {shouldShowActions && <th>عملیات</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <React.Fragment key={item.id}>
                <tr>
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.unitPrice}</td>
                  <td>{item.quantity}</td>
                  <td>{item.totalPrice}</td>
                  {shouldShowActions && (
                    <td>
                      <div style={{ display: "flex", gap: "4px", width: "100%", alignItems: "center", justifyContent: "center"}}>
                        <button
                          id="confirm-butt"
                          style={{ fontSize: "12px" }}
                          disabled={updatingItemIds.includes(item.id)}
                          onClick={() => handleReturnAction(item.id, true)}
                        >
                          ✔
                        </button>
                        <button
                          id="reject-butt"
                          style={{ fontSize: "12px" }}
                          disabled={updatingItemIds.includes(item.id)}
                          onClick={() => handleReturnAction(item.id, false)}
                        >
                          ✖
                        </button>
                      </div>
                    </td>
                  )}
                </tr>

                {shouldShowReturnDescription && (
                  <tr>
                    <td colSpan={shouldShowActions ? 6 : 5}>
                      <div style={{ padding: "5px", textAlign: "right"}}>
                        <strong>علت مرجوعی:</strong> {returnReason || "—"}<br />
                        <strong>توضیحات:</strong> {description || "—"}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <table className="req-order-items-table" style={{ borderCollapse: "separate" }}>
          <thead>
            <tr>
              <th>جمع کل</th>
              <th>ارزش افزوده</th>
              <th>هزینه ارسال</th>
              <th>قیمت نهایی</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{totals.subtotal}</td>
              <td>{totals.tax}</td>
              <td>{totals.shipping}</td>
              <td style={{ backgroundColor: "#f5f5f5" }}>{totals.finalPrice}</td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default RequestDetailsModal;