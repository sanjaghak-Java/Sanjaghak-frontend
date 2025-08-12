import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/styles/AddWarehouse.css";
import AddShelvesModal from "./AddShelvesModal";

function AddWarehouse() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [isCentralWarehouse, setIsCentralWarehouse] = useState(false); // اضافه شد
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");

  const [modalOpenIndex, setModalOpenIndex] = useState(null);
  const [sections, setSections] = useState([
    { id: 1, name: "بخش ۱", shelves: [] },
  ]);

  const navigate = useNavigate();

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleAddSection = () => {
    const newId = sections.length + 1;
    setSections([
      ...sections,
      { id: newId, name: `بخش ${newId}`, shelves: [] },
    ]);
  };

  const handleRemoveSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const warehouseData = {
      name,
      isCentralWarehouse, // اضافه شده
      country,
      province,
      city,
      address,
      postalCode,
      phone,
      sections,
    };

    console.log("ثبت نهایی انبار:", warehouseData);
    navigate("/admin/لیست%20انبار%20ها");
  };

  return (
    <div className="add-warehouse-container">
      <h2>افزودن انبار جدید</h2>

      <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="add-warehouse-form">
        {step === 1 && (
          <>
            <label>
              نام انبار:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isCentralWarehouse}
                onChange={(e) => setIsCentralWarehouse(e.target.checked)}
              />
              تنظیم انبار مرکزی
            </label>

            <label>
              کشور:
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </label>

            <label>
              استان:
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                required
              />
            </label>

            <label>
              شهر:
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </label>

            <label>
              آدرس:
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </label>

            <label>
              کد پستی:
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </label>

            <label>
              شماره تماس:
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </label>

            <button type="submit" className="submit-button1">
              ادامه
            </button>
          </>
        )}

{step === 2 && (
  <>
    <h3>تعریف بخش‌ها و قفسه‌ها:</h3>

    {sections.map((section, index) => (
      <div key={section.id} className="section-row" style={{display: "flex", gap: 10, alignItems:"center"}}>
        <label style={{ flex: 1 }}>{section.name}:</label>
        <button
          type="button"
          onClick={() => setModalOpenIndex(index)}
        >
          تعریف قفسه‌ها ({section.shelves.length} قفسه)
        </button>

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

    <button type="button" onClick={handleAddSection} className="add-section-button">
      + افزودن بخش
    </button>
    <div className="modal-buttons">
      <button type="button" onClick={() => setStep(1)} className="modal-button gray">
        بازگشت
      </button>
      <button type="submit" className="modal-button">
        ثبت نهایی انبار
      </button>
    </div>

  </>
)}

      </form>

      {modalOpenIndex !== null && (
        <AddShelvesModal
          visible={true}
          onClose={() => setModalOpenIndex(null)}
          shelves={sections[modalOpenIndex].shelves}
          setShelves={(newShelves) => {
            const updatedSections = [...sections];
            updatedSections[modalOpenIndex].shelves = newShelves;
            setSections(updatedSections);
          }}
          isCentralWarehouse={isCentralWarehouse}
        />
      )}
    </div>
  );
}

export default AddWarehouse;
