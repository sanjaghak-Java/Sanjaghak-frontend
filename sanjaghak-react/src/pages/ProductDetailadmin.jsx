
import React, { useEffect, useState } from "react";
import AttributeField from "./AttributeField";
import "/src/styles/adminproductdetail.css";

const categoryOptions = [
  { id: "1", name: "دسته ۱" },
  { id: "2", name: "دسته ۲" },
  { id: "3", name: "دسته ۳" },
  { id: "4", name: "دسته ۴" },
  { id: "5", name: "دسته ۵" },
];

const brandOptions = [
  { id: "brand1", name: "برند ۱" },
  { id: "brand2", name: "برند ۲" },
  { id: "brand3", name: "برند ۳" },
  { id: "brand4", name: "برند ۴" },
  { id: "brand5", name: "برند ۵" },
];

const defaultAttributesByCategory = {
  1: [{ name: "رنگ", value: "" }, { name: "سایز", value: "" }],
  2: [{ name: "ظرفیت", value: "" }],
  3: [{ name: "قدرت", value: "" }],
  4: [{ name: "جنس", value: "" }],
  5: [{ name: "گارانتی", value: "" }],
};

function AdminProductDetail({ product, onBack, onUpdateProduct, onDeleteProduct }) {
  const [editedProduct, setEditedProduct] = useState(product);
  const [defaultAttributes, setDefaultAttributes] = useState([]);
  const [customAttributes, setCustomAttributes] = useState(product.customAttributes || []);

  // Load default attributes when category changes
  useEffect(() => {
    const defaults = defaultAttributesByCategory[editedProduct.category] || [];
    setDefaultAttributes(defaults.map(attr => ({ ...attr })));
  }, [editedProduct.category]);

  const handleInputChange = (field, value) => {
    setEditedProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleDefaultAttrChange = (index, value) => {
    const updated = [...defaultAttributes];
    updated[index].value = value;
    setDefaultAttributes(updated);
  };

  const handleCustomAttrChange = (id, newFields) => {
    const updated = customAttributes.map(attr =>
      attr.id === id ? { ...attr, ...newFields } : attr
    );
    setCustomAttributes(updated);
  };

  const handleAddAttribute = () => {
    const newAttr = { id: Date.now(), name: "", value: "" };
    setCustomAttributes(prev => [...prev, newAttr]);
  };

  const handleDeleteAttribute = (id) => {
    setCustomAttributes(prev => prev.filter(attr => attr.id !== id));
  };

  const handleSave = () => {
    if (onUpdateProduct) {
      onUpdateProduct({
        ...editedProduct,
        defaultAttributes,
        customAttributes,
      });
    }
    onBack();
  };

  const handleDelete = () => {
    if (onDeleteProduct) onDeleteProduct(editedProduct.id);
    onBack();
  };

  return (
    <div className="adminProductDetailContainer" style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <button className="adminBackButton" onClick={onBack} style={{ marginBottom: 20 }}>
        بازگشت به لیست
      </button>

      <h1 className="adminProductDetail__name">ویرایش محصول</h1>

      <img
        src={editedProduct.image}
        alt={editedProduct.name}
        className="adminProductDetail__image"
      />

      <div className="adminProductDetail__fields">
        <label className="adminProductDetail__info">نام محصول:</label>
        <input
          type="text"
          value={editedProduct.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="adminProductDetail__input"
        />

        <label className="adminProductDetail__info">قیمت (تومان):</label>
        <input
          type="number"
          value={editedProduct.price}
          onChange={(e) => handleInputChange("price", parseInt(e.target.value))}
          className="adminProductDetail__input"
        />

        <label className="adminProductDetail__info">دسته:</label>
        <select
          value={editedProduct.category}
          onChange={(e) => handleInputChange("category", e.target.value)}
          className="adminProductDetail__input"
        >
          {categoryOptions.map(option => (
            <option key={option.id} value={option.id}>{option.name}</option>
          ))}
        </select>

        <label className="adminProductDetail__info">برند:</label>
        <select
          value={editedProduct.brand}
          onChange={(e) => handleInputChange("brand", e.target.value)}
          className="adminProductDetail__input"
        >
          {brandOptions.map(option => (
            <option key={option.id} value={option.id}>{option.name}</option>
          ))}
        </select>

        <label className="adminProductDetail__info">توضیحات:</label>
        <textarea
          value={editedProduct.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="adminProductDetail__textarea"
          rows={4}
        />
      </div>

      <div className="attributeList">
        <h2 className="attributesTitle">ویژگی‌ها</h2>

        {defaultAttributes.map((attr, index) => (
          <AttributeField
            key={`default-${index}`}
            id={`default-${index}`}
            name={attr.name}
            value={attr.value}
            readOnly={true}
            isDefault={true}
            onValueChange={(val) => handleDefaultAttrChange(index, val)}
          />
        ))}

        {customAttributes.map((attr) => (
          <AttributeField
            key={attr.id}
            id={attr.id}
            name={attr.name}
            value={attr.value}
            onDelete={handleDeleteAttribute}
            onNameChange={(val) => handleCustomAttrChange(attr.id, { name: val })}
            onValueChange={(val) => handleCustomAttrChange(attr.id, { value: val })}
          />
        ))}

        <button
          type="button"
          className="addAttributeBtn"
          onClick={handleAddAttribute}
          style={{ marginTop: 16 }}
        >
          + افزودن ویژگی
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button
          onClick={handleDelete}
          className="adminDeleteButton"
          style={{
            padding: "12px 24px",
            backgroundColor: "#b00020",
            color: "white",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          حذف محصول
        </button>

        <button
          onClick={handleSave}
          className="adminSaveButton"
          style={{
            padding: "12px 24px",
            backgroundColor: "#d54343",
            color: "white",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          ذخیره تغییرات
        </button>
      </div>
    </div>
  );
}

export default AdminProductDetail;