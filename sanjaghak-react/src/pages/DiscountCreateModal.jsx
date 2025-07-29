import React, { useState } from "react";
import jalaali from "jalaali-js";
import ProductSelectorModal from "./AddPurchaseModal";
import "/src/styles/DiscountCreateModal.css";
import phone from "../assets/images (1).jpg";


function DiscountCreateModal({ onClose, onSubmit }) {
  const [productSearch, setProductSearch] = useState("");
  const [title, setTitle] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isActive, setIsActive] = useState(true);

  const [startDateShamsi, setStartDateShamsi] = useState(() => toJalaliString(new Date()));
  const [endDateShamsi, setEndDateShamsi] = useState(() => toJalaliString(new Date()));

  function toJalaliString(date) {
    const { jy, jm, jd } = jalaali.toJalaali(date);
    return `${jy}/${pad(jm)}/${pad(jd)}`;
  }

  function fromJalaliString(shamsi) {
    const parts = shamsi.split("/");
    if (parts.length !== 3) return null;
    const jy = parseInt(parts[0], 10);
    const jm = parseInt(parts[1], 10);
    const jd = parseInt(parts[2], 10);
    if (isNaN(jy) || isNaN(jm) || isNaN(jd)) return null;
    const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
    return new Date(gy, gm - 1, gd);
  }

  function pad(n) {
    return n < 10 ? "0" + n : n;
  }

  function handleStartDateChange(e) {
    const val = e.target.value;
    setStartDateShamsi(val);
    const d = fromJalaliString(val);
    if (d) setStartDate(d);
  }

  function handleEndDateChange(e) {
    const val = e.target.value;
    setEndDateShamsi(val);
    const d = fromJalaliString(val);
    if (d) setEndDate(d);
  }

  const ToggleSwitch = ({ isOn, onToggle }) => (
    <div
      onClick={onToggle}
      style={{
        cursor: "pointer",
        width: 45,
        height: 22,
        backgroundColor: isOn ? "#DC2655" : "#ccc",
        borderRadius: 26,
        position: "relative",
        transition: "background-color 0.3s",
        display: "inline-block",
        verticalAlign: "middle",
        marginRight: 10,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 2,
          left: isOn ? 24 : 2,
          width: 18,
          height: 18,
          backgroundColor: "white",
          borderRadius: "50%",
          transition: "left 0.3s",
          boxShadow: "0 0 2px rgba(0,0,0,0.3)",
        }}
      ></div>
    </div>
  );

  const handleSubmit = () => {
    if (!discountPercent.trim() || isNaN(discountPercent) ||!productSearch.trim() || !title.trim() ||!startDateShamsi.trim() || !endDateShamsi.trim()) {
      alert("لطفا همه فیلد ها را پر کنید.");
      return;
    }

    onSubmit({
      productName: productSearch,
      title: title,
      amount: parseFloat(discountPercent),
      startDate: startDateShamsi,
      endDate: endDateShamsi,
      active: isActive,
      id: Date.now(),
    });
    onClose();
  };


    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    const products = [
      {
        id: 1,
        name: "محصول X",
        category: "موبایل",
        colors: [
          { name: "قرمز", hex: "#ff0000" },
          { name: "آبی", hex: "#0000ff" },
          { name: "سبز", hex: "#00ff00" }
        ],
        attributes: {},
        price: 20000000,
        image: phone,
      },
    ];

  return (
    <div className="discount-modal-overlay">
      <div className="discount-modal-content">
        <h3>ایجاد تخفیف جدید</h3>

        <div style={{ marginBottom: 10 }}>
          <input
            type="text"
            placeholder="جستجوی کالا..."
            value={productSearch}
            readOnly
            onClick={() => setIsProductModalOpen(true)}
            className="discount-modal-input"
            style={{ cursor: "pointer", backgroundColor: "#f9f9f9" }}
          />
        </div>

        <div className={`floating-input ${title ? "filled" : ""}`}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="discount-modal-input"
          />
          <label>عنوان</label>
        </div>

        <div className={`floating-input ${discountPercent ? "filled" : ""}`}>
          <input
            type="number"
            step="1"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            className="modal-input"
          />
          <label>درصد تخفیف</label>
        </div>

        <div style={{display: "flex", gap: "8px"}}>
          <div className={`floating-input ${startDateShamsi ? "filled" : ""}`} style={{ marginTop: 10 }}>
            <input
              type="text"
              value={startDateShamsi}
              onChange={handleStartDateChange}
              placeholder="yyyy/mm/dd"
              className="modal-input"
            />
            <label>از تاریخ</label>
          </div>

          <div className={`floating-input ${endDateShamsi ? "filled" : ""}`} style={{ marginTop: 10, marginBottom: 15 }}>
            <input
              type="text"
              value={endDateShamsi}
              onChange={handleEndDateChange}
              placeholder="yyyy/mm/dd"
              className="modal-input"
            />
            <label>تا تاریخ</label>
          </div>
        </div>



        <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyItems: "center", gap: "5px" }}>
          <ToggleSwitch isOn={isActive} onToggle={() => setIsActive(!isActive)} />
          <label>{isActive ? "فعال" : "غیرفعال"}</label>
        </div>

        <div className="modal-buttons">
          <button className="cancel-button" onClick={onClose}>
            لغو
          </button>
          <button className="confirm-button" onClick={handleSubmit}>
            ایجاد
          </button>
        </div>
      </div>
<ProductSelectorModal
  isOpen={isProductModalOpen}
  onClose={() => setIsProductModalOpen(false)}
  products={products}
  onSelect={(selectedProduct) => {
    setProductSearch(selectedProduct.name);
    setIsProductModalOpen(false);
  }}
/>

    </div>
  );
}

export default DiscountCreateModal;
