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
    sections: [
      { id: 1, shelfCount: 3 },
      { id: 2, shelfCount: 2 },
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
    sections: [],
  },
  {
    id: 3,
    name: "انبار شرق",
    country: "ایران",
    province: "خراسان رضوی",
    city: "مشهد",
    address: "بلوار سجاد",
    postalCode: "33333",
    sections: [{ id: 1, shelfCount: 5 }],
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
  const [postalCode, setPostalCode] = useState(warehouse?.postalCode || "");

  const [sections, setSections] = useState(warehouse?.sections || []);

  if (!warehouse) return <div className="not-found">انبار مورد نظر پیدا نشد.</div>;

  const handleAddSection = () => {
    const newSection = { id: Date.now(), shelfCount: 1 };
    setSections([...sections, newSection]);
  };

  const handleShelfChange = (index, delta) => {
    setSections((prevSections) => {
      const updated = [...prevSections];
      const newCount = updated[index].shelfCount + delta;
      updated[index].shelfCount = Math.max(1, newCount); // حداقل 1
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
      sections,
    };

    console.log("Updated warehouse:", updatedWarehouse);
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

        <label>کد پستی:</label>
        <input
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
          placeholder="کد پستی را وارد کنید"
        />

        <div className="section-list">
          <h3>بخش‌ها و قفسه‌ها</h3>
          {sections.map((section, index) => (
            <div key={section.id} className="section-card">
              <span className="section-title">بخش {index + 1}</span>
              <div className="shelf-control">
                <button type="button" onClick={() => handleShelfChange(index, -1)}>-</button>
                <span>{section.shelfCount} قفسه</span>
                <button type="button" onClick={() => handleShelfChange(index, 1)}>+</button>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSection(index)}
                className="remove-section-button"
              >
                حذف بخش
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddSection} className="add-section-button">
            + افزودن بخش جدید
          </button>
        </div>

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
