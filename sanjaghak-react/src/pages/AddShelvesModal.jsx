import React, { useState } from "react";
import '/src/styles/AddShelvesModal.css';

function AddShelvesModal({ visible, onClose, shelves, setShelves, isCentralWarehouse }) {
  const [localShelves, setLocalShelves] = useState(shelves || []);

  const ToggleSwitch = ({ isOn, onToggle }) => (
    <div
      onClick={onToggle}
      className="shelves-toggle-switch"
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

  const handleAddShelf = () => {
    const newId = localShelves.length ? localShelves[localShelves.length - 1].id + 1 : 1;
    setLocalShelves([
      ...localShelves,
      { id: newId, name: `قفسه ${newId}`, active: true, activeForReturns: false, managerId: "" },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...localShelves];
    updated[index][field] = value;
    setLocalShelves(updated);
  };

  const handleRemoveShelf = (index) => {
    setLocalShelves(localShelves.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setShelves(localShelves);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="shelves-modal-overlay">
      <div className="shelves-modal-content">
        <h3>قفسه‌ها</h3>
        <br />
        {localShelves.map((shelf, index) => (
          <div
            key={shelf.id}
            className="shelves-shelf-row"
          >
            <div style={{ minWidth: 80 }}>{shelf.name}</div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>فعال</span>
              <ToggleSwitch
                isOn={shelf.active}
                onToggle={() => handleChange(index, "active", !shelf.active)}
              />
            </div>

            {isCentralWarehouse && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span>مخصوص مرجوعی‌ها</span>
                <ToggleSwitch
                  isOn={shelf.activeForReturns}
                  onToggle={() =>
                    handleChange(index, "activeForReturns", !shelf.activeForReturns)
                  }
                />
              </div>
            )}



            <button
              onClick={() => handleRemoveShelf(index)}
              className="shelves-button shelves-button-remove"
            >
              × حذف
            </button>
          </div>
        ))}

        <button onClick={handleAddShelf} className="shelves-button">
          + افزودن قفسه
        </button>

        <div className="modal-buttons">
          <button onClick={handleSave} className="modal-button">
            ذخیره
          </button>
          <button onClick={onClose} className="modal-button gray">
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddShelvesModal;
