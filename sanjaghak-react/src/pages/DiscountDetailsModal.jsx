import React, { useState, useEffect } from "react";
import "/src/styles/DiscountDetailsModal.css";

function ToggleSwitch({ isOn, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        cursor: "pointer",
        width: 40,
        height: 20,
        backgroundColor: isOn ? "#DC2655" : "#ccc",
        borderRadius: 20,
        position: "relative",
        transition: "background-color 0.3s",
      }}
      aria-label={isOn ? "فعال" : "غیرفعال"}
      role="switch"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 2,
          left: isOn ? 22 : 2,
          width: 16,
          height: 16,
          backgroundColor: "white",
          borderRadius: "50%",
          transition: "left 0.3s",
        }}
      />
    </div>
  );
}

function DiscountDetailsModal({ discount, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (discount) {
      setTitle(discount.title);
      setAmount(discount.amount);
      setStartDate(discount.startDate);
      setEndDate(discount.endDate);
      setIsActive(discount.active);
    }
  }, [discount]);

  const handleSave = () => {
    onSave({
      ...discount,
      title,
      amount,
      startDate,
      endDate,
      active: isActive,
    });
    onClose();
  };

  return (
    <div className="details-modal-overlay">
      <div className="details-modal">
        <div className="discount-titlediv">
        <h3>جزئیات تخفیف {discount?.productName}</h3>
        </div>


        <div className="floating-label">
          <input
            className="modal-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label className={title ? "filled" : ""}>عنوان تخفیف</label>
        </div>

        <div className="floating-label">
          <input
            type="number"
            className="modal-input"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min={0}
            max={100}
            required
          />
          <label className={amount ? "filled" : ""}>درصد تخفیف</label>
        </div>

        <div className="modal-date-row">
          <div className="floating-label">
            <input
              type="text"
              className="modal-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder=""
              required
            />
            <label className={startDate ? "filled" : ""}>تاریخ شروع</label>
          </div>
          <span style={{ margin: "0 8px" }}>تا</span>
          <div className="floating-label">
            <input
              type="text"
              className="modal-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder=""
              required
            />
            <label className={endDate ? "filled" : ""}>تاریخ پایان</label>
          </div>
        </div>


        <div
          style={{
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <ToggleSwitch isOn={isActive} onToggle={() => setIsActive(!isActive)} />
          <label>{isActive ? "فعال" : "غیرفعال"}</label>
        </div>

        <div className="modal-buttons">
          <button className="modal-button gray" onClick={onClose}>
            لغو
          </button>
          <button className="modal-button" onClick={handleSave}>
            ذخیره
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiscountDetailsModal;
