import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/styles/AddWarehouse.css";
import AddShelvesModal from "./AddShelvesModal";

function AddWarehouse() {
  const [step, setStep] = useState(1);
  const [warehouseId, setWarehouseId] = useState(null); // store created warehouse ID
  const [name, setName] = useState("");
  const [isCentralWarehouse, setIsCentralWarehouse] = useState(false);
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [modalOpenIndex, setModalOpenIndex] = useState(null);
 const [sections, setSections] = useState([{ id: 1, name: "S1", shelves: [] }]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = "d34f8c7c-ddf6-4ff5-822c-b5b0c5b24145"; // <-- replace dynamically if needed

  const handleNextStep = async (e) => {
    e.preventDefault();

    const warehouseData = {
      name,
      address,
      city,
      state: province,
      country,
      postalCode,
      phone,
      isCentral: isCentralWarehouse,
    };

    try {
      const res = await fetch("http://127.0.0.1:8080/api/Sanjaghak/warehouse/add", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(warehouseData),
      });

      if (!res.ok) throw new Error("خطا در ایجاد انبار");

      const data = await res.json();
      setWarehouseId(data.warehouseId); // backend should return ID
      setStep(2);
    } catch (err) {
      console.error(err);
      alert("مشکلی در ثبت انبار پیش آمد");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!warehouseId) {
      alert("شناسه انبار یافت نشد.");
      return;
    }

    try {
      // 🔹 Save sections
for (const [index, section] of sections.entries()) {
  const sectionName = `B${(index + 1).toString().padStart(2, '0')}`;

const res = await fetch(
  `http://127.0.0.1:8080/api/Sanjaghak/sections/add?warehouseId=${warehouseId}`, // removed trailing slash
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: sectionName }),
  }
);

  if (!res.ok) throw new Error("خطا در افزودن بخش");
  const sectionData = await res.json();

  // 🔹 Save shelves for this section
  for (const shelf of section.shelves) {
    const shelfRes = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/shelves/add?sectionId=${sectionData.sectionsId}&userId=${userId}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ return: shelf.activeForReturns }),
      }
    );

    if (!shelfRes.ok) throw new Error("خطا در افزودن قفسه");
  }
}

      alert("انبار با موفقیت ثبت شد!");
      navigate("/admin/لیست%20انبار%20ها");
    } catch (err) {
      console.error(err);
      alert("مشکلی در ثبت بخش‌ها/قفسه‌ها پیش آمد");
    }
  };
  

  return (
    <div className="add-warehouse-container">
      <h2>افزودن انبار جدید</h2>

      <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="add-warehouse-form">
        {step === 1 && (
          <>
            <label>
              نام انبار:
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isCentralWarehouse}
                onChange={(e) => setIsCentralWarehouse(e.target.checked)}
              />
              تنظیم انبار مرکزی
            </label>

            <label>کشور:</label>
            <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />

            <label>استان:</label>
            <input type="text" value={province} onChange={(e) => setProvince(e.target.value)} required />

            <label>شهر:</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />

            <label>آدرس:</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} required />

            <label>کد پستی:</label>
            <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />

            <label>شماره تماس:</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />

            <button type="submit" className="submit-button1">ادامه</button>
          </>
        )}

        {step === 2 && (
          <>
            <h3>تعریف بخش‌ها و قفسه‌ها:</h3>
            {sections.map((section, index) => (
              <div key={section.id} className="section-row" style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <label style={{ flex: 1 }}>{section.name}:</label>
                <button type="button" onClick={() => setModalOpenIndex(index)}>
                  تعریف قفسه‌ها ({section.shelves.length} قفسه)
                </button>
                <button
                  type="button"
                  className="remove-section-button"
                  onClick={() => setSections(sections.filter((_, i) => i !== index))}
                >
                  ×
                </button>
              </div>
            ))}
<button
  type="button"
  onClick={() => {
    const nextIndex = sections.length + 1;
    const paddedIndex = nextIndex.toString().padStart(2, '0'); // 01, 02, ...
    setSections([
      ...sections,
      { id: nextIndex, name: `S${paddedIndex}`, shelves: [] } // always 3 characters
    ]);
  }}
>
  + افزودن بخش
</button>
            <div className="modal-buttons">
              <button type="button" onClick={() => setStep(1)} className="modal-button gray">بازگشت</button>
              <button type="submit" className="modal-button">ثبت نهایی انبار</button>
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