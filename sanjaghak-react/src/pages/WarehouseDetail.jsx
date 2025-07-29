import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "/src/styles/WarehouseDetail.css";

const sampleWarehouses = [
  { id: 1, name: "انبار مرکزی", phone: "021-111111", address: "تهران، خیابان ولیعصر" },
  { id: 2, name: "انبار غرب", phone: "021-222222", address: "کرج، میدان شهدا" },
  { id: 3, name: "انبار شرق", phone: "021-333333", address: "مشهد، بلوار سجاد" },
  { id: 4, name: "انبار شمال", phone: "021-444444", address: "رشت، خیابان امام" },
  { id: 5, name: "انبار جنوب", phone: "021-555555", address: "اهواز، کیانپارس" },
  { id: 6, name: "انبار ذخیره", phone: "021-666666", address: "اصفهان، چهارباغ" },
];

function WarehouseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const warehouse = sampleWarehouses.find((w) => w.id === Number(id));

  const [sections, setSections] = useState([]);

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      name: `بخش ${sections.length + 1}`,
      shelves: [],
    };
    setSections([...sections, newSection]);
  };

  const addShelf = (sectionId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          shelves: [...section.shelves, `قفسه ${section.shelves.length + 1}`]
        };
      }
      return section;
    }));
  };

  if (!warehouse) return <div className="not-found">انبار مورد نظر پیدا نشد.</div>;

  return (
    <div className="warehouse-detail-container">
      <h2>جزئیات انبار: {warehouse.name}</h2>
      <p><strong>آدرس:</strong> {warehouse.address}</p>
      <p><strong>شماره تماس:</strong> {warehouse.phone}</p>

      <div className="sections-container">
        {sections.map((section) => (
          <div key={section.id} className="section-card">
            <div className="section-title">{section.name}</div>
            <div className="shelves-container">
              {section.shelves.map((shelf, index) => (
                <div key={index} className="shelf-card">{shelf}</div>
              ))}
              <button
                className="add-shelf-button"
                onClick={() => addShelf(section.id)}
              >
                افزودن قفسه
              </button>
            </div>
          </div>
        ))}

        <button className="add-section-button" onClick={addSection}>
          افزودن بخش
        </button>
      </div>

      <button onClick={() => navigate(-1)} className="back-button">
        بازگشت
      </button>
    </div>
  );
}

export default WarehouseDetail;
