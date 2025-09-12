import React, { useState, useEffect } from "react";
import inventory from '../assets/inventory.png';
import bin from '../assets/bin.png';
import "/src/styles/WarehousePurchaseModal.css";

function WarehousePurchaseModal({ 
  isOpen, 
  onClose, 
  warehouse, 
  supplier, 
  products
}) {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rows, setRows] = useState([{ quantity: "", section: "", shelf: "" }]);
  const [sections, setSections] = useState([]);
  const [shelvesMap, setShelvesMap] = useState({}); 
  const [canConfirmTransfer, setCanConfirmTransfer] = useState(false);
  const token = localStorage.getItem("token");
const [noStockModalOpen, setNoStockModalOpen] = useState(false);
const [createStockModalOpen, setCreateStockModalOpen] = useState(false);
const [stockLevels, setStockLevels] = useState({ minimumLevel: "", maximumLevel: "" });
const [stockRowToCreate, setStockRowToCreate] = useState(null); 

  useEffect(() => {
    if (!warehouse) return;
    const fetchSections = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/sections/by-warehouse/${warehouse.warehouseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("خطا در دریافت بخش‌ها");
        const data = await res.json();
        setSections(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSections();
  }, [warehouse, token]);

  const fetchShelves = async (sectionId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/shelves/getShelvesBySectionId/${sectionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("خطا در دریافت قفسه‌ها");
      const data = await res.json();
      setShelvesMap(prev => ({ ...prev, [sectionId]: data }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRow = () => {
    setRows([...rows, { quantity: "", section: "", shelf: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;

    if (field === "section") {
      updated[index].shelf = "";
      if (!shelvesMap[value]) {
        fetchShelves(value);
      }
    }

    setRows(updated);
  };
const handleConfirmTransfer = async () => {
  if (!selectedProduct) return;

  const hasCompleteRow = rows.every(r => r.quantity && r.section && r.shelf);
  if (!hasCompleteRow) {
    alert("لطفاً از پر شدن تمام اطلاعات اطمینان حاصل فرمایید!");
    return;
  }

  try {
    for (const row of rows) {
      const shelfId = row.shelf;
      const variantId = selectedProduct.id;
      const referenceId = selectedProduct.purchaseOrderItemId;
      const quantity = Number(row.quantity);

      const res = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/inventoryMovement/purchaseIn?variantId=${variantId}&shelvesId=${shelfId}&referenceId=${referenceId}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity }),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        console.error(errData);

        if (errData.error === "نمی توان یک محصول را به یک قفسه نامربوط وصل کرد!") {
          setStockRowToCreate({ variantId, shelfId, quantity, referenceId });
          setNoStockModalOpen(true);
          return; 
        }

        alert(`خطا در ثبت محصول ${selectedProduct.name} در قفسه ${shelfId}`);
        return;
      }
    }

    alert("انتقال محصولات با موفقیت ثبت شد ✅");
    setShowAssignModal(false);
    setCanConfirmTransfer(false);
    window.location.reload();

  } catch (err) {
    console.error(err);
    alert("خطایی رخ داد، لطفاً دوباره تلاش کنید!");
  }
};

  const handleDeleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="purchase-modal-overlay" onClick={onClose}>
      <div className="purchase-modal-box" onClick={(e) => e.stopPropagation()}>

        {!showAssignModal && (
          <>
            <h2 className="purchase-modal-title">جزئیات محموله جدید</h2>

            <div className="purchase-info-box">
              <p><strong>انبار:</strong> {warehouse.name}</p>
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
    {products
      .filter(p => p.quantity > 0)
      .map((p, index) => (
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

{showAssignModal && selectedProduct && (
  <div className="assign-section">
    <h2 className="purchase-modal-title">
      اختصاص محل برای {selectedProduct.name}
    </h2>
    {rows.map((row, index) => (
      <div className="assign-row" key={index}>
        {/* Quantity */}
        <div className="field floating">
          <input
            type="number"
            value={row.quantity}
            onChange={(e) => handleChange(index, "quantity", e.target.value)}
            placeholder=" "
          />
          <label>تعداد</label>
        </div>

        {/* Section */}
        <div className="field floating">
          <select
            value={row.section}
            onChange={(e) => handleChange(index, "section", e.target.value)}
          >
            <option value="" disabled hidden>انتخاب بخش</option>
            {sections.map(s => (
              <option key={s.sectionsId} value={s.sectionsId}>{s.name}</option>
            ))}
          </select>
          <label>بخش</label>
        </div>

        {/* Shelf */}
        <div className="field floating">
          <select
            value={row.shelf}
            onChange={(e) => handleChange(index, "shelf", e.target.value)}
          >
            <option value="" disabled hidden>انتخاب قفسه</option>
            {row.section && shelvesMap[row.section]?.map(sh => (
              <option key={sh.shelvesId} value={sh.shelvesId}>{sh.shelvesCode}</option>
            ))}
          </select>
          <label>قفسه</label>
        </div>

        {/* Delete row */}
        <div>
          <button className="delete-btn" onClick={() => handleDeleteRow(index)}>
            <img src={bin} alt="حذف" />
          </button>
        </div>
      </div>
    ))}

    <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
      <button className="purchase-new-btn" onClick={handleAddRow}>
        + موقعیت جدید
      </button>
    </div>

    <div className="purchase-btn-box">
      <button className="purchase-btn btn-back" onClick={() => setShowAssignModal(false)}>
        بازگشت
      </button>
      <button className="purchase-btn btn-save" onClick={handleConfirmTransfer}>
        ذخیره
      </button>
    </div>
  </div>
)}

      </div>
      {noStockModalOpen && (
  <div className="purchase-modal-overlay" onClick={() => setNoStockModalOpen(false)}>
    <div className="purchase-modal-box" onClick={(e) => e.stopPropagation()}>
      <h3>موجودی برای این قفسه وجود ندارد</h3>
      <p>آیا می‌خواهید موجودی ایجاد کنید؟</p>
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 20 }}>
        <button onClick={() => {
          setNoStockModalOpen(false);
          setCreateStockModalOpen(true);
        }}>بله</button>
        <button onClick={() => setNoStockModalOpen(false)}>خیر</button>
      </div>
    </div>
  </div>
)}
{createStockModalOpen && stockRowToCreate && (
  <div className="purchase-modal-overlay" onClick={() => setCreateStockModalOpen(false)}>
    <div className="purchase-modal-box" onClick={(e) => e.stopPropagation()}>
      <h3>ایجاد موجودی برای قفسه</h3>

      <div className="field floating">
        <input
          type="number"
          value={stockLevels.minimumLevel}
          onChange={(e) => setStockLevels(prev => ({ ...prev, minimumLevel: e.target.value }))}
          placeholder=" "
        />
        <label>حداقل موجودی</label>
      </div>

      <div className="field floating">
        <input
          type="number"
          value={stockLevels.maximumLevel}
          onChange={(e) => setStockLevels(prev => ({ ...prev, maximumLevel: e.target.value }))}
          placeholder=" "
        />
        <label>حداکثر موجودی</label>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 20 }}>
<button onClick={async () => {
  const { variantId, shelfId } = stockRowToCreate;
  try {
    const res = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/inventoryStock/create?variantsId=${variantId}&shelvesId=${shelfId}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          minimumLevel: Number(stockLevels.minimumLevel),
          maximumLevel: Number(stockLevels.maximumLevel)
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error(err);
      alert("خطا در ایجاد موجودی!");
      return;
    }

    alert("موجودی با موفقیت ایجاد شد ✅");

    setCreateStockModalOpen(false);
    setStockRowToCreate(null);

  } catch (err) {
    console.error(err);
    alert("خطایی رخ داد!");
  }
}}>ایجاد موجودی</button>

        <button onClick={() => setCreateStockModalOpen(false)}>لغو</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default WarehousePurchaseModal;