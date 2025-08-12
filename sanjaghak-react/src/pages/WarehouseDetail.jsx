import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  const [sectionsData] = useState(initialSectionsData);
  const [shelvesData] = useState(initialShelvesData);

  const [currentView, setCurrentView] = useState("sections"); // sections | shelves | products
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedShelf, setSelectedShelf] = useState(null);
  const [productStock, setProductStock] = useState(null);

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
    setProductStock(shelf.stock);
    setCurrentView("products");
  };

  const increaseStock = () => {
    setProductStock((prev) => prev + 1);
  };

  const decreaseStock = () => {
    setProductStock((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const renderSections = () => (
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
  );

  const renderShelves = () => (
    <div className="cards-grid">
      {shelvesData[selectedSection.id]?.length ? (
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
  );

  const renderProducts = () => (
    <div className="cards-grid">
      <div className="card product-card">
        <h4>{selectedShelf.productName}</h4>
        <p>
          <span className="label">رنگ:</span>{" "}
          <span className={`color-value color-${selectedShelf.color.toLowerCase()}`}>
            {selectedShelf.color}
          </span>
        </p>
        <p >
          <button onClick={increaseStock} className="stock-btn plus-btn">+</button>
          <span className="label">موجودی:</span> {productStock}{" "}
          <button onClick={decreaseStock} className="stock-btn minus-btn">-</button>
        </p>
        <p>
          <span className="label">رزرو شده:</span> {selectedShelf.reserved}
        </p>
        <p>
          <span className="label">قیمت:</span> {selectedShelf.price.toLocaleString()} تومان
        </p>
      </div>
    </div>
  );

  const handleBack = () => {
    if (currentView === "sections") {
      navigate(-1);
    } else if (currentView === "shelves") {
      setCurrentView("sections");
      setSelectedSection(null);
    } else if (currentView === "products") {
      setCurrentView("shelves");
      setSelectedShelf(null);
      setProductStock(null);
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
      {currentView === "products" && renderProducts()}
    </div>
  );
}
