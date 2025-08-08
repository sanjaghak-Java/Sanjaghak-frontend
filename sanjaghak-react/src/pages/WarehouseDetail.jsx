import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "/src/styles/WarehouseDetail.css";

const initialWarehouses = [
  {
    id: 1,
    name: "انبار مرکزی",
  },
  {
    id: 2,
    name: "انبار غرب",
  },
  {
    id: 3,
    name: "انبار جنوب",
  },
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
    {
      id: 1001,
      name: "قفسه ۱",
      productName: "محصول الف",
      color: "قرمز",
      stock: 150,
      reserved: 30,
      price: 125000,
    },
    {
      id: 1002,
      name: "قفسه ۲",
      productName: "محصول ب",
      color: "آبی",
      stock: 200,
      reserved: 50,
      price: 98000,
    },
  ],
  102: [
    {
      id: 1003,
      name: "قفسه ۳",
      productName: "محصول ج",
      color: "سبز",
      stock: 75,
      reserved: 10,
      price: 115000,
    },
  ],
  201: [
    {
      id: 2001,
      name: "قفسه A",
      productName: "محصول د",
      color: "زرد",
      stock: 60,
      reserved: 5,
      price: 142000,
    },
  ],
  202: [
    {
      id: 2002,
      name: "قفسه B",
      productName: "محصول هـ",
      color: "مشکی",
      stock: 33,
      reserved: 3,
      price: 89000,
    },
    {
      id: 2003,
      name: "قفسه C",
      productName: "محصول و",
      color: "نقره‌ای",
      stock: 12,
      reserved: 0,
      price: 199000,
    },
  ],
  301: [
    {
      id: 3001,
      name: "قفسه X",
      productName: "محصول ز",
      color: "طلایی",
      stock: 9,
      reserved: 1,
      price: 245000,
    },
  ],
};

function WarehouseDetail() {
  const { id } = useParams();
  const warehouseId = parseInt(id);
  const navigate = useNavigate();

  const warehouse = initialWarehouses.find((w) => w.id === warehouseId);
  const [sectionsData, setSectionsData] = useState(initialSectionsData);
  const [shelvesData, setShelvesData] = useState(initialShelvesData);
  const [expandedSectionId, setExpandedSectionId] = useState(null);

  if (!warehouse) {
    return (
      <div className="warehouse-detail-container" style={{ textAlign: "center" }}>
        <p>انبار یافت نشد.</p>
        <button
          onClick={() => navigate(-1)}
          className="warehouse-detail-back-button"
        >
          بازگشت
        </button>
      </div>
    );
  }

  const toggleSection = (sectionId) => {
    setExpandedSectionId((prev) => (prev === sectionId ? null : sectionId));
  };

  const handleAddSection = () => {
    const currentSections = sectionsData[warehouseId] || [];
    const newId = currentSections.length
      ? Math.max(...currentSections.map((s) => s.id)) + 1
      : warehouseId * 100 + 1;
    const newSectionName = prompt("نام بخش جدید را وارد کنید:");
    if (!newSectionName) return;
    const newSection = { id: newId, name: newSectionName };

    setSectionsData((prev) => ({
      ...prev,
      [warehouseId]: [...currentSections, newSection],
    }));
  };

  const handleAddShelf = (sectionId) => {
    const currentShelves = shelvesData[sectionId] || [];
    const newId = currentShelves.length
      ? Math.max(...currentShelves.map((sh) => sh.id)) + 1
      : sectionId * 10 + 1;
    const newShelfName = prompt("نام قفسه جدید را وارد کنید:");
    if (!newShelfName) return;
    const newShelf = {
      id: newId,
      name: newShelfName,
      productName: "محصول جدید",
      color: "نامشخص",
      stock: 0,
      reserved: 0,
      price: 0,
    };

    setShelvesData((prev) => ({
      ...prev,
      [sectionId]: [...currentShelves, newShelf],
    }));
  };

  const handleShelfClick = (shelf, section) => {
    navigate(`/admin/اطلاعات-محصول/${shelf.id}`, {
      state: {
        product: shelf,
        warehouseName: warehouse.name,
        sectionName: section.name,
      },
    });
  };

  return (
    <div className="warehouse-detail-container">
      <button
        onClick={() => navigate(-1)}
        className="warehouse-detail-back-button"
      >
        بازگشت
      </button>

      <h3 className="warehouse-detail-title">{warehouse.name} - بخش‌ها</h3>

      {sectionsData[warehouseId]?.length ? (
        sectionsData[warehouseId].map((section) => (
          <div key={section.id} className="section-container">
            <div
              className="section-header"
              onClick={() => toggleSection(section.id)}
            >
              {section.name}
              <span className="expand-icon">
                {expandedSectionId === section.id ? "▲" : "▼"}
              </span>
            </div>

            {expandedSectionId === section.id && (
              <div className="shelves-container">
                {shelvesData[section.id]?.length ? (
                  shelvesData[section.id].map((shelf) => (
                    <div
                      key={shelf.id}
                      className="shelf-item"
                      onClick={() => handleShelfClick(shelf, section)}
                    >
                      <strong>{shelf.name}:</strong> {shelf.productName}
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#999" }}>قفسه‌ای یافت نشد.</p>
                )}
                <button
                  onClick={() => handleAddShelf(section.id)}
                  className="add-shelf-button"
                >
                  + افزودن قفسه
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p style={{ color: "#999" }}>این انبار بخش ندارد.</p>
      )}

      <button onClick={handleAddSection} className="add-section-button">
        + افزودن بخش
      </button>
    </div>
  );
}

export default WarehouseDetail;
