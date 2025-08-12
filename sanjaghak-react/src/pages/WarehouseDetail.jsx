// WarehouseDetail.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WarehouseProductModal from "./WarehouseProductModal"; // مسیر را در پروژه‌ات تنظیم کن
import "/src/styles/WarehouseDetail.css";

const initialWarehouses = [
  { id: 1, name: "انبار مرکزی" },
  { id: 2, name: "انبار غرب" },
  { id: 3, name: "انبار جنوب" },
];

const initialSectionsData = {
  1: [
    { id: 101, name: "بخش ۱" },
    { id: 102, name: "بخش ۲" },
  ],
  2: [
    { id: 201, name: "بخش A" },
    { id: 202, name: "بخش B" },
  ],
  3: [{ id: 301, name: "بخش X" }],
};

const initialShelvesData = {
  101: [
    { id: 1001, name: "قفسه ۱", productName: "محصول الف", color: "قرمز", stock: 150, reserved: 30, price: 125000 },
    { id: 1002, name: "قفسه ۲", productName: "محصول ب", color: "آبی", stock: 200, reserved: 50, price: 98000 },
  ],
  102: [
    { id: 1003, name: "قفسه ۳", productName: "محصول ج", color: "سبز", stock: 75, reserved: 10, price: 115000 },
  ],
  201: [
    { id: 2001, name: "قفسه A", productName: "محصول د", color: "زرد", stock: 60, reserved: 5, price: 142000 },
  ],
  202: [
    { id: 2002, name: "قفسه B", productName: "محصول هـ", color: "مشکی", stock: 33, reserved: 3, price: 89000 },
    { id: 2003, name: "قفسه C", productName: "محصول و", color: "نقره‌ای", stock: 12, reserved: 0, price: 199000 },
  ],
  301: [
    { id: 3001, name: "قفسه X", productName: "محصول ز", color: "طلایی", stock: 9, reserved: 1, price: 245000 },
  ],
};

export default function WarehouseDetail() {
  const { id } = useParams();
  const warehouseId = parseInt(id);
  const navigate = useNavigate();

  const warehouse = initialWarehouses.find((w) => w.id === warehouseId);

  const [sectionsData, setSectionsData] = useState(initialSectionsData);
  const [shelvesData, setShelvesData] = useState(initialShelvesData);

  const [currentView, setCurrentView] = useState("sections"); // فقط sections و shelves داریم
  const [selectedSection, setSelectedSection] = useState(null);

  const [selectedShelf, setSelectedShelf] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // مدیریت فرم افزودن بخش
  const [showAddSectionForm, setShowAddSectionForm] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  // مدیریت فرم افزودن قفسه
  const [showAddShelfForm, setShowAddShelfForm] = useState(false);
  const [newShelfName, setNewShelfName] = useState("");

  if (!warehouse) {
    return (
      <div className="warehouse-detail-container" style={{ textAlign: "center" }}>
        <p>انبار یافت نشد.</p>
        <button onClick={() => navigate(-1)} className="warehouse-detail-back-button">
          بازگشت
        </button>
      </div>
    );
  }

  const handleSectionClick = (section) => {
    setSelectedSection(section);
    setCurrentView("shelves");
  };

  const handleShelfClick = (shelf) => {
    setSelectedShelf(shelf);
    setShowProductModal(true);
  };

  // افزودن بخش جدید
  const handleAddSection = () => {
    setShowAddSectionForm(true);
  };

  const handleSectionFormSubmit = (e) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;

    const newId = Math.max(...(sectionsData[warehouseId]?.map(s => s.id) || [0])) + 1;
    const newSection = { id: newId, name: newSectionName.trim() };

    setSectionsData((prev) => {
      const prevSections = prev[warehouseId] || [];
      return {
        ...prev,
        [warehouseId]: [...prevSections, newSection],
      };
    });

    setNewSectionName("");
    setShowAddSectionForm(false);
  };

  const handleCancelSectionForm = () => {
    setNewSectionName("");
    setShowAddSectionForm(false);
  };

  // افزودن قفسه جدید
  const handleAddShelf = () => {
    if (!selectedSection) {
      alert("ابتدا یک بخش را انتخاب کنید.");
      return;
    }
    setShowAddShelfForm(true);
  };

  const handleShelfFormSubmit = (e) => {
    e.preventDefault();
    if (!newShelfName.trim()) return;

    const shelvesInSection = shelvesData[selectedSection.id] || [];
    const newId = Math.max(...shelvesInSection.map(sh => sh.id), 0) + 1;
    const newShelf = {
      id: newId,
      name: newShelfName.trim(),
      productName: "بدون محصول",
      color: "نامشخص",
      stock: 0,
      reserved: 0,
      price: 0,
      isActive: newShelfIsActive,              
      activeForReturns: newShelfActiveForReturns, 
      managerId: newShelfManagerId.trim(),       
    };

    setShelvesData((prev) => {
      const prevShelves = prev[selectedSection.id] || [];
      return {
        ...prev,
        [selectedSection.id]: [...prevShelves, newShelf],
      };
    });

    setNewShelfName("");
    setNewShelfIsActive(true);
    setNewShelfActiveForReturns(false);
    setNewShelfManagerId("");

    setShowAddShelfForm(false);
  };

  const handleCancelShelfForm = () => {
    setNewShelfName("");
    setShowAddShelfForm(false);
  };

const [newShelfIsActive, setNewShelfIsActive] = useState(true);
const [newShelfActiveForReturns, setNewShelfActiveForReturns] = useState(false);
const [newShelfManagerId, setNewShelfManagerId] = useState("");


  const renderSections = () => (
    <>
      <button className="add-button" onClick={handleAddSection}>افزودن بخش</button>

      {showAddSectionForm && (
        <form onSubmit={handleSectionFormSubmit} className="add-form">
          <input
            type="text"
            placeholder="نام بخش جدید"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            autoFocus
          />
          <div className="modal-buttons">
            <button type="submit">ثبت</button>
            <button type="button" onClick={handleCancelSectionForm}>لغو</button>
          </div>

        </form>
      )}

      <div className="cards-grid">
        {sectionsData[warehouseId]?.length ? (
          sectionsData[warehouseId].map((section) => (
            <div key={section.id} className="card" onClick={() => handleSectionClick(section)}>
              <h4>{section.name}</h4>
            </div>
          ))
        ) : (
          <p>هیچ بخشی یافت نشد.</p>
        )}
      </div>
    </>
  );

  const renderShelves = () => (
    <>
      <button className="add-button" onClick={handleAddShelf}>افزودن قفسه</button>

      {showAddShelfForm && (
        <form onSubmit={handleShelfFormSubmit} className="add-form">
          <label>
            آیدی مسئول قفسه:
            <input
              type="text"
              value={newShelfManagerId}
              onChange={(e) => setNewShelfManagerId(e.target.value)}
              placeholder="آیدی مسئول"
            />
          </label>
<label className="shelvesSwitch">
  <input
    type="checkbox"
    checked={newShelfIsActive}
    onChange={(e) => setNewShelfIsActive(e.target.checked)}
  />
  <span className="shelvesSlider shelvesRound"></span>
  <span className="shelvesSwitchLabel">فعال</span>
</label>

{warehouse.name === "انبار مرکزی" && (
  <label className="shelvesSwitch">
    <input
      type="checkbox"
      checked={newShelfActiveForReturns}
      onChange={(e) => setNewShelfActiveForReturns(e.target.checked)}
    />
    <span className="shelvesSlider shelvesRound"></span>
    <span className="shelvesSwitchLabel">مخصوص مرجوعی‌ها</span>
  </label>
)}

          <div className="modal-buttons">

            <button type="submit">ثبت</button>
            <button type="button" onClick={handleCancelShelfForm}>لغو</button>
          </div>
        </form>
      )}


      <div className="cards-grid">
        {shelvesData[selectedSection?.id]?.length ? (
          shelvesData[selectedSection.id].map((shelf) => (
            <div key={shelf.id} className="card" onClick={() => handleShelfClick(shelf)}>
              <h4>{shelf.name}</h4>
              <p>{shelf.productName}</p>
            </div>
          ))
        ) : (
          <p>هیچ قفسه‌ای یافت نشد.</p>
        )}
      </div>
    </>
  );

  const handleBack = () => {
    if (currentView === "sections") {
      navigate(-1);
    } else if (currentView === "shelves") {
      setCurrentView("sections");
      setSelectedSection(null);
    }
  };

  return (
    <div className="warehouse-detail-container">
      <div className="header">
        <button onClick={handleBack} className="warehouse-detail-back-button">
          بازگشت
        </button>
        <h3>{warehouse.name}</h3>
      </div>

      {currentView === "sections" && renderSections()}
      {currentView === "shelves" && renderShelves()}

      {showProductModal && selectedShelf && (
        <WarehouseProductModal 
          shelf={selectedShelf} 
          onClose={() => setShowProductModal(false)} 
        />
      )}
    </div>
  );
}
