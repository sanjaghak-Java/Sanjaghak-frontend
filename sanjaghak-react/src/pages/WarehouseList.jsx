import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const sectionsData = {
  1: [
    { id: 101, name: "راهرو ۱" },
    { id: 102, name: "راهرو ۲" },
  ],
  2: [
    { id: 201, name: "راهرو A" },
    { id: 202, name: "راهرو B" },
  ],
  3: [
    { id: 301, name: "راهرو X" },
  ],
};

const shelvesData = {
  101: [{ id: 1001, productName: "محصول الف" }],
  102: [{ id: 1002, productName: "محصول ب" }],
  201: [{ id: 2001, productName: "محصول ج" }],
  202: [{ id: 2002, productName: "محصول د" }],
  301: [{ id: 3001, productName: "محصول هـ" }],
};

function WarehouseList() {
  const [warehouses, setWarehouses] = useState(initialWarehouses);
  const [modalWarehouse, setModalWarehouse] = useState(null);
  const [expandedSectionId, setExpandedSectionId] = useState(null);
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

  const handleEdit = (id) => {
    navigate(`/admin/ویرایش-انبار/${id}`);
  };

  const handleAdd = () => {
    navigate("/admin/افزودن-انبار");
  };

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

  return (
    <div className="warehouse-list-container">
      <h2>لیست انبارها</h2>
      <div className="warehouse-cards">
        {warehouses.map((warehouse) => (
          <div
            key={warehouse.id}
            className="warehouse-card"
            onClick={() => openModal(warehouse)}
            style={{ cursor: "pointer" }}
          >
            <h3>{warehouse.name}</h3>
            <div className="info-line">
              <strong>کشور:</strong> {warehouse.country}
            </div>
            <div className="info-line">
              <strong>استان:</strong> {warehouse.province}
            </div>
            <div className="info-line">
              <strong>شهر:</strong> {warehouse.city}
            </div>
            <div className="info-line">
              <strong>آدرس:</strong> {warehouse.address}
            </div>
            <div className="info-line">
              <strong>کد پستی:</strong> {warehouse.postalCode}
            </div>
            <div
              className="card-buttons"
              onClick={(e) => e.stopPropagation()} // جلوگیری از باز شدن مودال وقتی روی دکمه‌ها کلیک میشه
            >
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
              animation: "fadeIn 0.3s ease",
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
              boxShadow:
                "0 8px 20px rgba(0,0,0,0.15), 0 2px 10px rgba(0,0,0,0.1)",
              zIndex: 1000,
              fontFamily: "Vazirmatn, sans-serif",
              direction: "rtl",
              userSelect: "none",
            }}
          >
            <h3 style={{ marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "8px" }}>
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
                    <ul
                      style={{
                        paddingRight: "20px",
                        marginTop: "8px",
                        color: "#444",
                      }}
                    >
                      {shelvesData[section.id]?.map((shelf) => (
                        <li
                          key={shelf.id}
                          style={{ listStyleType: "disc", marginBottom: "6px" }}
                        >
                          {shelf.productName}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            ) : (
              <p style={{ color: "#999" }}>این انبار بخش ندارد.</p>
            )}

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
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#d32f2f")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#f44336")}
            >
              بستن
            </button>
          </div>
        </>
      )}

      {/* انیمیشن ساده fadeIn */}
      <style>{`
        @keyframes fadeIn {
          from {opacity: 0;}
          to {opacity: 1;}
        }
      `}</style>
    </div>
  );
}

export default WarehouseList;
