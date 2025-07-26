import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/styles/AddWarehouse.css";

function AddWarehouse() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [sections, setSections] = useState([
    { id: 1, name: "بخش ۱", shelfCount: 1 },
  ]);

  const navigate = useNavigate();

  const handleAddSection = () => {
    const newId = sections.length + 1;
    setSections([
      ...sections,
      { id: newId, name: `بخش ${newId}`, shelfCount: 1 },
    ]);
  };

  const handleShelfCountChange = (index, value) => {
    const updatedSections = [...sections];
    updatedSections[index].shelfCount = parseInt(value);
    setSections(updatedSections);
  };

  const handleRemoveSection = (index) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const warehouseData = {
      name,
      country,
      province,
      city,
      address,
      postalCode,
      sections,
    };

    console.log("Warehouse with sections:", warehouseData);

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

        <hr style={{ margin: "20px 0" }} />
        <h3>بخش ها و تعداد قفسه‌ها:</h3>

        {sections.map((section, index) => (
          <div key={section.id} className="section-row">
            <label style={{ flex: 1 }}>{section.name}:</label>
            <select
              value={section.shelfCount}
              onChange={(e) => handleShelfCountChange(index, e.target.value)}
              style={{ flex: 2 }}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} قفسه
                </option>
              ))}
            </select>
            <button
              type="button"
              className="remove-section-button"
              onClick={() => handleRemoveSection(index)}
              title="حذف بخش"
            >
              ×
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddSection}
          className="add-section-button"
        >
          + افزودن بخش
        </button>

        <button type="submit" className="submit-button1">
          ثبت انبار
        </button>
      </form>
    </div>
  );
}

export default AddWarehouse;
