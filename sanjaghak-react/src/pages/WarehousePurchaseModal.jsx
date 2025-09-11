import React, { useState } from "react";
import inventory from '../assets/inventory.png';
import bin from '../assets/bin.png';
import "/src/styles/WarehousePurchaseModal.css";

function WarehousePurchaseModal({ 
  isOpen, 
  onClose, 
  warehouse, 
  supplier, 
  products,
  sections = ["بخش 1", "بخش 2", "بخش 3"],
  shelves = ["قفسه A", "قفسه B", "قفسه C"]
}) {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rows, setRows] = useState([{ quantity: "", section: "", shelf: "" }]);

  if (!isOpen) return null;

  const handleAddRow = () => {
    setRows([...rows, { quantity: "", section: "", shelf: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const [canConfirmTransfer, setCanConfirmTransfer] = useState(false);



  return (
    <div className="purchase-modal-overlay"   onClick={onClose}>
      <div className="purchase-modal-box"     onClick={(e) => e.stopPropagation()}>
        {/* مودال اصلی */}
        {!showAssignModal && (
          <>
            <h2 className="purchase-modal-title">جزئیات محموله جدید</h2>

            <div className="purchase-info-box">
              <p><strong>انبار:</strong> {warehouse}</p>
              <p><strong>تأمین‌کننده:</strong> {supplier}</p>
            </div>

            <table className="purchase-product-table">
              <thead>
                <tr>
                  <th>ردیف</th>
                  <th>نام محصول</th>
                  <th>تعداد</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, index) => (
                  <tr key={p.id}>
                    <td>{index + 1}</td>
                    <td>{p.name}</td>
                    <td>{p.quantity}</td>
                    <td>
                      <button
                        className="purchase-btn btn-choose"
                        onClick={() => {
                          setSelectedProduct(p);
                          setShowAssignModal(true);
                          setRows([{ quantity: "", section: "", shelf: "" }]);
                        }}
                      >
                        <img src={inventory} alt="" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="purchase-btn-box">
                <button
                    className="purchase-btn btn-confirm"
                    disabled={!canConfirmTransfer}
                    onClick={() => {
                        alert("انتقال تایید شد ✅");
                        setShowAssignModal(false);
                    }}
                    >
                    تایید انتقال
                </button>
            </div>

          </>
        )}

        {/* مودال اختصاص محل */}
        {showAssignModal && selectedProduct && (
          <>
            <h2 className="purchase-modal-title">
              اختصاص محل برای {selectedProduct.name}
            </h2>

            <div>
              {rows.map((row, index) => (
                <div className="assign-row" key={index}>
                  <div className="field floating">
                    <input
                      type="number"
                      value={row.quantity}
                      onChange={(e) => handleChange(index, "quantity", e.target.value)}
                      placeholder=" "
                    />
                    <label>تعداد</label>
                  </div>

                  <div className="field floating">
                    <select
                      className="purchase-selector"
                      value={row.section}
                      onChange={(e) => handleChange(index, "section", e.target.value)}
                    >
                      <option value="" disabled hidden>انتخاب بخش</option>
                      {sections.map((s, i) => (
                        <option key={i} value={s}>{s}</option>
                      ))}
                    </select>
                    <label>بخش</label>
                  </div>

                  <div className="field floating">
                    <select
                      className="purchase-selector"
                      value={row.shelf}
                      onChange={(e) => handleChange(index, "shelf", e.target.value)}
                    >
                      <option value="" disabled hidden>انتخاب قفسه</option>
                      {shelves.map((sh, i) => (
                        <option key={i} value={sh}>{sh}</option>
                      ))}
                    </select>
                    <label>قفسه</label>
                  </div>

                    <div>
                        <button
                            className="delete-btn"
                            onClick={() => handleDeleteRow(index)}
                        >
                            <img src={bin} alt="حذف" />
                        </button>
                    </div>
                </div>
              ))}
            </div>

            <div style={{display: "flex", justifyContent: "center", marginBottom: "12px"}}>
              <button className="purchase-new-btn" onClick={handleAddRow}>
                + موقعیت جدید
              </button>
            </div>

            <div className="purchase-btn-box">
              <button
                className="purchase-btn btn-back"
                onClick={() => setShowAssignModal(false)}
              >
                بازگشت
              </button>

              <button
                className="purchase-btn btn-save"
                onClick={() => {
                    console.log("اختصاص محل:", rows);

                    const hasCompleteRow = rows.some(
                    (r) => r.quantity && r.section && r.shelf
                    );

                    if (!hasCompleteRow) {
                    alert("لطفاً از پر شدن تمام اطلاعات اطمینان حاصل فرمایید!");
                    return;
                    }

                    setCanConfirmTransfer(true);
                    alert("اختصاص محل ذخیره شد ✅");
                    setShowAssignModal(false);
                }}
                >
                ذخیره
              </button>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WarehousePurchaseModal;
