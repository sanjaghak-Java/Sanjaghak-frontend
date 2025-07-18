import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AttributeField from "./AttributeField";
import "/src/styles/categoryattributes.css";

function EditCategoryAttributes({ 
  initialAttributes, 
  initialCategory = {}, 
  onSave 
}) {
  const navigate = useNavigate();

  const defaultAttributes = [
    { id: 1, name: "رنگ", value: "قرمز" },
    { id: 2, name: "سایز", value: "بزرگ" },
    { id: 3, name: "جنس", value: "فلز" },
  ];

  const [attributes, setAttributes] = useState(initialAttributes ?? defaultAttributes);
  const [categoryName, setCategoryName] = useState(initialCategory.name ?? "");
  const [categoryPicture, setCategoryPicture] = useState(initialCategory.picture ?? null);
  const [categoryDescription, setCategoryDescription] = useState(initialCategory.description ?? "");

  // For preview URL
  const [imagePreview, setImagePreview] = useState(
    initialCategory.picture ? initialCategory.picture : null
  );

  const handleAddAttribute = () => {
    setAttributes([...attributes, { id: Date.now(), name: "", value: "" }]);
  };

  const handleDeleteAttribute = (id) => {
    setAttributes(attributes.filter((attr) => attr.id !== id));
  };

  const handleAttrChange = (id, newFields) => {
    setAttributes(
      attributes.map((attr) =>
        attr.id === id ? { ...attr, ...newFields } : attr
      )
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryPicture(file);
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        name: categoryName,
        picture: categoryPicture, // This will be the File object if a new file was selected
        description: categoryDescription,
        attributes,
      });
    }
  };

  return (
    <div className="editCategoryAttributesContainer" style={{ position: "relative", paddingTop: 60 }}>
      <button
        className="backBtnEditCategory"
        onClick={() => navigate("/admin/لیست دسته ها")}
        style={{ position: "absolute", top: "16px", left: "16px" }}
      >
        ← بازگشت
      </button>

      <h2 className="editCategoryAttributesTitle">ویرایش دسته بندی</h2>

      <div className="categoryInfoContainer" style={{ marginBottom: 24 }}>
        <label style={{ display: "block", marginBottom: 8 }}>نام دسته بندی:</label>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="categoryInput"
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 8,
            border: "1.5px solid #d54343",
            marginBottom: 16,
            fontSize: 16,
            direction: "rtl",
          }}
          placeholder="نام دسته بندی را وارد کنید"
        />

        <label style={{ display: "block", marginBottom: 8 }}>تصویر دسته بندی:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginBottom: 16 }}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Category preview"
            style={{ maxWidth: "100%", maxHeight: 200, marginBottom: 16, borderRadius: 12, objectFit: "contain" }}
          />
        )}

        <label style={{ display: "block", marginBottom: 8 }}>توضیحات دسته بندی:</label>
        <textarea
          value={categoryDescription}
          onChange={(e) => setCategoryDescription(e.target.value)}
          className="categoryInput"
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 8,
            border: "1.5px solid #d54343",
            marginBottom: 16,
            fontSize: 16,
            direction: "rtl",
            minHeight: 80,
            resize: "vertical",
          }}
          placeholder="توضیحات دسته بندی را وارد کنید"
        />
      </div>

      <h3 className="editCategoryAttributesTitle">ویژگی‌های دسته بندی</h3>

      <div className="attributeList">
        {attributes.map((attr) => (
          <AttributeField
            key={attr.id}
            id={attr.id}
            name={attr.name}
            value={attr.value}
            onDelete={handleDeleteAttribute}
            onNameChange={(val) => handleAttrChange(attr.id, { name: val })}
            onValueChange={(val) => handleAttrChange(attr.id, { value: val })}
          />
        ))}
      </div>

      <button
        type="button"
        className="addAttributeBtn"
        onClick={handleAddAttribute}
      >
        + افزودن ویژگی
      </button>

      <div className="stepButtonsEditCategory" style={{ justifyContent: "center", marginTop: 24 }}>
        <button
          type="button"
          className="saveBtnEditCategory"
          onClick={handleSave}
          style={{ width: "180px" }}
        >
          ذخیره
        </button>
      </div>
    </div>
  );
}

export default EditCategoryAttributes;