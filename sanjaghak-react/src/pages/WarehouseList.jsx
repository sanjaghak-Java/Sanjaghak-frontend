import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/styles/WarehouseList.css";
// import "/AddWarehouse.jsx"

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
  // ادامه موارد انبارها
];

function WarehouseList() {
  const [warehouses, setWarehouses] = useState(initialWarehouses);
  const navigate = useNavigate();

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("آیا از حذف این انبار مطمئن هستید؟");
    if (confirmDelete) {
      const updatedList = warehouses.filter((w) => w.id !== id);
      setWarehouses(updatedList);
    }
  };

  const handleEdit = (id) => {
    navigate(`/warehouses/edit/${id}`);
  };

const handleAdd = () => {
  navigate("/admin/افزودن-انبار");
};


  return (
    <div className="warehouse-list-container">
      <h2>لیست انبارها</h2>
      <div className="warehouse-cards">
        {warehouses.map((warehouse) => (
          <div key={warehouse.id} className="warehouse-card">
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
            <div className="card-buttons">
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

      <div className="add-warehouse-button-container">
        <button onClick={handleAdd} className="add-warehouse-button">
          + افزودن انبار
        </button>
      </div>
    </div>
  );
}

export default WarehouseList;
