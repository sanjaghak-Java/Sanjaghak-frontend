import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WarehouseProductInformation from "../pages/WarehouseProductInformation";
import "/src/styles/WarehouseList.css";

const initialWarehouses = [
  {
    id: 1,
    name: "انبار مرکزی",
    country: "ایران",
    province: "تهران",
    city: "تهران",
    address: "خیابان انقلاب، پلاک ۱۲۳",
    postalCode: "12345",
  },
  {
    id: 2,
    name: "انبار غرب",
    country: "ایران",
    province: "البرز",
    city: "کرج",
    address: "میدان آزادگان، نبش خیابان سوم",
    postalCode: "23456",
  },
  {
    id: 3,
    name: "انبار جنوب",
    country: "ایران",
    province: "خوزستان",
    city: "اهواز",
    address: "خیابان کیانپارس، پلاک ۵۰",
    postalCode: "34567",
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

function WarehouseList() {
  const [warehouses, setWarehouses] = useState(initialWarehouses);
  const [modalWarehouse, setModalWarehouse] = useState(null);
  const [expandedSectionId, setExpandedSectionId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sectionsData, setSectionsData] = useState(initialSectionsData);
  const [shelvesData, setShelvesData] = useState(initialShelvesData);
  const navigate = useNavigate();

  const handleDelete = (id) => {
    if (window.confirm("آیا از حذف این انبار مطمئن هستید؟")) {
      setWarehouses((prev) => prev.filter((w) => w.id !== id));
      if (modalWarehouse?.id === id) {
        setModalWarehouse(null);
        setExpandedSectionId(null);
      }
    }
  };

  const handleEdit = (id) => navigate(`/admin/ویرایش-انبار/${id}`);
  const handleAdd = () => navigate("/admin/افزودن-انبار");

  const openModal = (warehouse) => {
    setModalWarehouse(warehouse);
    setExpandedSectionId(null);
  };
  const closeModal = () => {
    setModalWarehouse(null);
    setExpandedSectionId(null);
  };
  const toggleSection = (id) => {
    setExpandedSectionId((prev) => (prev === id ? null : id));
  };

  const handleAddSection = () => {
    if (!modalWarehouse) return;
    const currentSections = sectionsData[modalWarehouse.id] || [];
    const newId = currentSections.length
      ? Math.max(...currentSections.map((s) => s.id)) + 1
      : modalWarehouse.id * 100 + 1;
    const newSectionName = prompt("نام بخش جدید را وارد کنید:");
    if (!newSectionName) return;
    const newSection = { id: newId, name: newSectionName };

    setSectionsData((prev) => ({
      ...prev,
      [modalWarehouse.id]: [...currentSections, newSection],
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

  return (
    <div className="warehouse-list-container">
      <h2 className="warehousetitle">لیست انبارها</h2>
      <div className="warehouse-cards">
        <div className="warehouse-titles"> 
          <h5>نام انبار</h5>
          <h5>آدرس</h5>
          <h5>کد پستی</h5>
          <h5>عملیات</h5>
        </div>
        {warehouses.map((warehouse) => (
          <div
            key={warehouse.id}
            className="warehouse-card"
            onClick={() => openModal(warehouse)}
            style={{ cursor: "pointer" }}
          >
            <h3>{warehouse.name}</h3>
            <div className="info-line">
              <span>{warehouse.country} - {warehouse.province} - {warehouse.city} - {warehouse.address} </span>
            </div>
            <div className="info-line">
              {warehouse.postalCode}
            </div>
            <div className="card-buttons" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => handleEdit(warehouse.id)}
                className="edit-button"
              >
                ویرایش
              </button>
              <button
                onClick={() => handleDelete(warehouse.id)}
                className="delete-button"
              >
                حذف
              </button>
              <button
                onClick={() => {
                  navigate("/admin/انتقال-بین-انبار", {
                    state: { sourceWarehouseName: warehouse.name },
                  });
                }}
              >
                ⇅
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="add-warehouse-button-container" style={{ marginTop: 20 }}>
        <button onClick={handleAdd} className="add-warehouse-button">
          + افزودن انبار
        </button>
      </div>

      {modalWarehouse && (
        <>
          <div
            className="modal-overlay"
            onClick={closeModal}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.45)",
              zIndex: 999,
            }}
          ></div>

          <div
            className="modal-content"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#fff",
              padding: "25px 30px",
              borderRadius: "14px",
              width: "420px",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 8px 20px rgba(0,0,0,0.15), 0 2px 10px rgba(0,0,0,0.1)",
              zIndex: 1000,
              fontFamily: "Vazirmatn, sans-serif",
              direction: "rtl",
              userSelect: "none",
            }}
          >
            <h3
              style={{
                marginBottom: "20px",
                borderBottom: "1px solid #ddd",
                paddingBottom: "8px",
              }}
            >
              {modalWarehouse.name} - بخش‌ها
            </h3>

            {sectionsData[modalWarehouse.id]?.length ? (
              sectionsData[modalWarehouse.id].map((section) => (
                <div key={section.id} style={{ marginBottom: "14px" }}>
                  <div
                    style={{
                      cursor: "pointer",
                      color: "#1976d2",
                      fontWeight: "700",
                      fontSize: "16px",
                    }}
                    onClick={() => toggleSection(section.id)}
                  >
                    {section.name}
                  </div>

                  {expandedSectionId === section.id && (
                    <div style={{ paddingRight: "20px", marginTop: "8px" }}>
                      {shelvesData[section.id]?.length ? (
                        shelvesData[section.id].map((shelf) => (
                          <div
                            key={shelf.id}
                            style={{
                              padding: "6px 0",
                              borderBottom: "1px dashed #ccc",
                              marginBottom: "4px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              setSelectedProduct({
                                productName: shelf.productName,
                                color: shelf.color,
                                location: `${modalWarehouse.name} - ${section.name} - ${shelf.name}`,
                                stock: shelf.stock,
                                reserved: shelf.reserved,
                                price: shelf.price,
                              })
                            }
                          >
                            <strong>{shelf.name}:</strong> {shelf.productName}
                          </div>
                        ))
                      ) : (
                        <p style={{ color: "#999" }}>قفسه‌ای یافت نشد.</p>
                      )}

                      <button
                        onClick={() => handleAddShelf(section.id)}
                        style={{
                          marginTop: 10,
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "1.5px solid #1976d2",
                          backgroundColor: "white",
                          color: "#1976d2",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
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

            <button
              onClick={handleAddSection}
              style={{
                marginTop: "20px",
                padding: "8px 14px",
                borderRadius: "6px",
                border: "1.5px solid #1976d2",
                backgroundColor: "white",
                color: "#1976d2",
                cursor: "pointer",
                fontWeight: "700",
                width: "100%",
              }}
            >
              + افزودن بخش
            </button>

            <button
              onClick={closeModal}
              style={{
                marginTop: "25px",
                padding: "10px 16px",
                cursor: "pointer",
                borderRadius: "8px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                fontWeight: "600",
                width: "100%",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#d32f2f")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#f44336")}
            >
              بستن
            </button>
          </div>
        </>
      )}

      {selectedProduct && (
        <WarehouseProductInformation
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default WarehouseList;
