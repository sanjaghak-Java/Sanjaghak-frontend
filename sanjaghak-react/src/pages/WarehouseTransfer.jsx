import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import '/src/styles/WarehouseTransfer.css';

function WarehouseTransfer() {
  const location = useLocation();
  const incomingDestinationWarehouse = location.state?.sourceWarehouseName || "";

  const [showProductModal, setShowProductModal] = useState(false);
  const [showProductModalFor, setShowProductModalFor] = useState(null);
  const [step, setStep] = useState(1);

  const [selectedSourceProduct, setSelectedSourceProduct] = useState(null);
  const [selectedDestinationProduct, setSelectedDestinationProduct] = useState(null);
  const [quantity, setQuantity] = useState("");

  const [sourceWarehouse, setSourceWarehouse] = useState("");

  const destinationWarehouse = incomingDestinationWarehouse;

  const [registeredItems, setRegisteredItems] = useState([]);

  const productList = [
    { id: 1, name: "گوشی موبایل", variant: "قرمز", section: "بخش 1", shelf: "قفسه 2", stock: 120 },
    { id: 2, name: "لپ‌تاپ", variant: "آبی", section: "بخش A", shelf: "قفسه B", stock: 45 },
    { id: 3, name: "هدفون", variant: "مشکی", section: "بخش C", shelf: "قفسه D", stock: 75 },
    { id: 4, name: "تبلت", variant: "سفید", section: "بخش E", shelf: "قفسه F", stock: 30 },
  ];

  const warehouses = [
    { id: 1, name: "انبار مرکزی" },
    { id: 2, name: "انبار فرعی" },
    { id: 3, name: "انبار شماره 3" },
  ];


  function handleSelectProduct(product) {
    if (showProductModalFor === "source") {
      setSelectedSourceProduct(product);
    } else if (showProductModalFor === "destination") {
      setSelectedDestinationProduct(product);
    }
    setShowProductModal(false);
  }

  function handleContinueStep() {
    if (!sourceWarehouse || !destinationWarehouse || !selectedSourceProduct) {
      alert("لطفاً همه فیلدهای مرحله اول را پر کنید.");
      return;
    }
    setStep(2);
  }

  function handleAddItem() {
    if (!selectedDestinationProduct) {
      alert("لطفاً محصول انبار مقصد را انتخاب کنید.");
      return;
    }

    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      alert("تعداد معتبر وارد کنید.");
      return;
    }
    if (qty > selectedSourceProduct.stock) {
      alert(`تعداد وارد شده نامعتبر است.`);
      return;
    }

    setRegisteredItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        fromWarehouse: sourceWarehouse,
        fromSection: selectedSourceProduct.section,
        fromShelf: selectedSourceProduct.shelf,
        toWarehouse: destinationWarehouse,
        toSection: selectedDestinationProduct.section,
        toShelf: selectedDestinationProduct.shelf,
        productName: selectedSourceProduct.name,
        productVariant: selectedSourceProduct.variant,
        quantity: qty,
      },
    ]);

    setSelectedDestinationProduct(null);
    setQuantity("");
    setStep(1);
  }

  function handleFinalSubmit() {
    if (registeredItems.length === 0) {
      alert("هیچ موردی ثبت نشده است.");
      return;
    }
    alert("درخواست با موفقیت ثبت شد.");
  }

  return (
    <div className="Warehouse-transfer-main-containor">
      <div className="Warehouse-select">

        {step === 1 && (
          <>
            <div className="Warehouse-name-containor">
              <select
                value={sourceWarehouse}
                onChange={e => setSourceWarehouse(e.target.value)}
              >
                <option value="" disabled hidden>انتخاب انبار مبدا</option>
                {warehouses.map(w => (
                  <option key={w.id} value={w.name}>{w.name}</option>
                ))}
              </select>
              <label>از انبار</label>
            </div>

            <div className="Warehouse-name-containor">
              <input
                type="text"
                placeholder=" "
                value={destinationWarehouse}
                readOnly
              />
              <label>به انبار</label>
            </div>

            <div className="Warehouse-name-containor">
              <input
                type="text"
                placeholder=" "
                readOnly
                value={selectedSourceProduct ? `${selectedSourceProduct.name} - ${selectedSourceProduct.variant}` : ""}
                onClick={() => {
                  setShowProductModalFor("source");
                  setShowProductModal(true);
                }}
              />
              <label>انتخاب محصول انبار مقصد</label>
            </div>

            <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: "12px", marginTop: 20 }}>
              <button
                className="add-submit-order"
                type="button"
                onClick={handleContinueStep}
              >
                ادامه
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="Warehouse-name-containor">
              <input
                type="text"
                placeholder=" "
                readOnly
                value={selectedDestinationProduct ? `${selectedDestinationProduct.name} - ${selectedDestinationProduct.variant}` : ""}
                onClick={() => {
                  setShowProductModalFor("destination");
                  setShowProductModal(true);
                }}
              />
              <label>انتخاب محصول انبار مبدا</label>
            </div>

            <div className="Warehouse-name-containor">
              <input
                type="number"
                min="1"
                step="1"
                placeholder=" "
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
              />
              <label>تعداد</label>
            </div>

            <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: "12px", marginTop: 20 }}>
              <button
                className="add-submit-order"
                type="button"
                onClick={handleAddItem}
              >
                ثبت
              </button>
              <button
                className="add-submit-order"
                type="button"
                style={{ backgroundColor: "#888" }}
                onClick={() => setStep(1)}
              >
                بازگشت
              </button>
            </div>
          </>
        )}
      </div>

      {registeredItems.length > 0 && (
        <div className="order-summary-section">
          <table className="warehouse-table" style={{ direction: "rtl" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ccc" }}>
                <th>نام محصول</th>
                <th>انبار مبدا - بخش - قفسه</th>
                <th>انبار مقصد - بخش - قفسه</th>
                <th>تعداد</th>
              </tr>
            </thead>
            <tbody>
              {registeredItems.map(item => (
                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td>{item.productName} - {item.productVariant}</td>
                  <td>{item.fromWarehouse} - {item.fromSection} - {item.fromShelf}</td>
                  <td>{item.toWarehouse} - {item.toSection} - {item.toShelf}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ direction: "ltr" }}>
            <button
              onClick={handleFinalSubmit}
              className="add-submit-order"
            >
              ثبت درخواست
            </button>
          </div>
        </div>
      )}

      {showProductModal && (
        <WarehouseProductModal
          products={productList}
          onClose={() => setShowProductModal(false)}
          onSelectProduct={handleSelectProduct}
        />
      )}
    </div>
  );
}

export default WarehouseTransfer;
