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
    postalCode: "11111",
    phone: "021-12345678",
    sections: [
      { id: 1, shelves: [1, 2, 3] },
      { id: 2, shelves: [1, 2] },
    ],
  },
  {
    id: 2,
    name: "انبار غرب",
    country: "ایران",
    province: "البرز",
    city: "کرج",
    address: "میدان شهدا",
    postalCode: "22222",
    phone: "026-98765432",
    sections: [],
  },
];

function EditWarehouse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const warehouse = sampleWarehouses.find((w) => w.id === Number(id));

  if (!warehouse) return <div className="not-found">انبار مورد نظر پیدا نشد.</div>;

  const [name, setName] = useState(warehouse.name);
  const [address, setAddress] = useState(warehouse.address);
  const [country, setCountry] = useState(warehouse.country);
  const [province, setProvince] = useState(warehouse.province);
  const [city, setCity] = useState(warehouse.city);
  const [postalCode, setPostalCode] = useState(warehouse.postalCode);
  const [phone, setPhone] = useState(warehouse.phone);

  const [sections, setSections] = useState(
    warehouse.sections.map((s) => ({
      ...s,
      shelves: s.shelves || Array(s.shelfCount || 1).fill(1).map((_, i) => i + 1),
    })) || []
  );

  const handleAddSection = () => {
    const newSection = {
      id: Date.now(),
      shelves: [1],
    };
    setSections([...sections, newSection]);
  };

  const handleAddShelf = (sectionIndex) => {
    setSections((prev) => {
      const updated = [...prev];
      updated[sectionIndex].shelves.push(updated[sectionIndex].shelves.length + 1);
      return updated;
    });
  };

  const handleRemoveShelf = (sectionIndex, shelfIndex) => {
    setSections((prev) => {
      const updated = [...prev];
      updated[sectionIndex].shelves.splice(shelfIndex, 1);
      return updated;
    });
  };

  const handleRemoveSection = (index) => {
    const updated = [...sections];
    updated.splice(index, 1);
    setSections(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedWarehouse = {
      id: warehouse.id,
      name,
      address,
      country,
      province,
      city,
      postalCode,
      phone,
      sections,
    };

    console.log("Updated warehouse:", updatedWarehouse);
    alert("تغییرات ذخیره شد!");
    navigate("/admin/لیست%20انبار%20ها");
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

        <label>کد پستی:</label>
        <input
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
        />

        <label>شماره تماس:</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} required />

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
