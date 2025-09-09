import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
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
const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [startDateShamsi, setStartDateShamsi] = useState(() => toJalaliString(new Date()));
  const [endDateShamsi, setEndDateShamsi] = useState(() => toJalaliString(new Date()));
  const token = localStorage.getItem("token");

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

function formatDateForBackend(date) {
  // date is a JS Date object
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T23:59:59`; // fixed time as per backend example
}

const handleSubmit = async () => {
  if (
    !discountPercent.trim() ||
    isNaN(discountPercent) ||
    !productSearch.trim() ||
    !selectedVariantId ||
    !title.trim() ||
    !startDateShamsi.trim() ||
    !endDateShamsi.trim()
  ) {
    alert("لطفا همه فیلد ها را پر کنید.");
    return;
  }

  const startDateGregorian = fromJalaliString(startDateShamsi);
  const endDateGregorian = fromJalaliString(endDateShamsi);

  try {
    const response = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/discount/addDiscount?variantId=${selectedVariantId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({
          discountDescription: title,
          startFrom: formatDateForBackend(startDateGregorian),
          endFrom: formatDateForBackend(endDateGregorian),
          discountPercentage: parseFloat(discountPercent),
        }),
      }
    );

    if (!response.ok) {
      throw new Error("خطا در ایجاد تخفیف");
    }

    const data = await response.json();
    alert("تخفیف با موفقیت ایجاد شد");
    onSubmit(data); // pass back to parent
    onClose();
  } catch (error) {
    console.error("Error creating discount:", error);
    alert("ایجاد تخفیف با مشکل مواجه شد");
  }
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

        <div style={{display: "flex", gap: "8px", marginTop: 10, marginBottom: 15}}>
          <div className={`floating-input ${startDate ? "filled" : ""}`} style={{flex: 1}}>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={toJalaliString(startDate)}
              onChange={(date) => {
                const d = date.toDate(); // JS Date
                setStartDate(d);
                setStartDateShamsi(toJalaliString(d));
              }}
              format="YYYY/MM/DD"
              style={{
                direction: "rtl",
                padding: "25px 10px 10px 8px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                fontSize: "16px",
                width: "100%",
                backgroundColor: "white",
              }}
            />
            <label>از تاریخ</label>
          </div>

          <div className={`floating-input ${endDate ? "filled" : ""}`} style={{flex: 1}}>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={toJalaliString(endDate)}
              onChange={(date) => {
                const d = date.toDate(); // JS Date
                setEndDate(d);
                setEndDateShamsi(toJalaliString(d));
              }}
              format="YYYY/MM/DD"
              style={{
                direction: "rtl",
                padding: "25px 10px 10px 8px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                fontSize: "16px",
                width: "100%",
                backgroundColor: "white",
              }}
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
  onSelect={(selectedVariant) => {
    // selectedVariant must include variantId, name, etc.
    setProductSearch(selectedVariant.name || selectedVariant.productName || ""); // Name of product or variant
    setSelectedVariantId(selectedVariant.variantId);
    setIsProductModalOpen(false);
  }}
/>

    </div>
  );
}

export default DiscountCreateModal;
