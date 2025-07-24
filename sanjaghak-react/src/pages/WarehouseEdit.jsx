import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "/src/styles/EditWarehouse.css";

const sampleWarehouses = [
  {
    id: 1,
    name: "انبار مرکزی",
    country: "ایران",
    province: "تهران",
    city: "تهران",
    address: "خیابان ولیعصر",
  },
  {
    id: 2,
    name: "انبار غرب",
    country: "ایران",
    province: "البرز",
    city: "کرج",
    address: "میدان شهدا",
  },
  {
    id: 3,
    name: "انبار شرق",
    country: "ایران",
    province: "خراسان رضوی",
    city: "مشهد",
    address: "بلوار سجاد",
  },

];

function EditWarehouse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const warehouse = sampleWarehouses.find((w) => w.id === Number(id));

  const [name, setName] = useState(warehouse?.name || "");
  const [address, setAddress] = useState(warehouse?.address || "");
  const [country, setCountry] = useState(warehouse?.country || "");
  const [province, setProvince] = useState(warehouse?.province || "");
  const [city, setCity] = useState(warehouse?.city || "");

  if (!warehouse) return <div className="not-found">انبار مورد نظر پیدا نشد.</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    // ذخیره اطلاعات جدید (مثلاً API call)
    alert("تغییرات ذخیره شد!");
    navigate("/admin");
  };

  return (
    <div className="edit-warehouse-container">
      <h2>ویرایش انبار: {warehouse.name}</h2>
      <form onSubmit={handleSubmit} className="edit-warehouse-form">
        <label>نام انبار:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />

        <label>کشور:</label>
        <input value={country} onChange={(e) => setCountry(e.target.value)} required />

        <label>استان:</label>
        <input value={province} onChange={(e) => setProvince(e.target.value)} required />

        <label>شهر:</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} required />

        <label>آدرس:</label>
        <input value={address} onChange={(e) => setAddress(e.target.value)} required />

        <div className="form-buttons">
          <button type="submit" className="save-button">ذخیره</button>
          <button type="button" onClick={() => navigate(-1)} className="cancel-button">
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditWarehouse;
