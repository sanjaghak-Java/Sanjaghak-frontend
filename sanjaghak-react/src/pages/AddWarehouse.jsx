// src/pages/AddWarehouse.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/styles/AddWarehouse.css";

function AddWarehouse() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");  // کد پستی جدید
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Warehouse data:", { name, country, province, city, address, postalCode });

    navigate("/admin/لیست-انبارها");
  };

  return (
    <div className="add-warehouse-container">
      <h2>افزودن انبار جدید</h2>
      <form onSubmit={handleSubmit} className="add-warehouse-form">
        <label>
          نام انبار:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="نام انبار را وارد کنید"
          />
        </label>

        <label>
          کشور:
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            placeholder="کشور را وارد کنید"
          />
        </label>

        <label>
          استان:
          <input
            type="text"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            required
            placeholder="استان را وارد کنید"
          />
        </label>

        <label>
          شهر:
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            placeholder="شهر را وارد کنید"
          />
        </label>

        <label>
          آدرس:
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="آدرس انبار را وارد کنید"
            required
          />
        </label>

        <label>
          کد پستی:
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="کد پستی را وارد کنید"
            required
          />
        </label>

        <button type="submit">ثبت انبار</button>
      </form>
    </div>
  );
}

export default AddWarehouse;
