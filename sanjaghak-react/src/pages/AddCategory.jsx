
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/styles/addcategory.css";

function AddCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("لطفا تصویر انتخاب کنید");
      return;
    }

    try {
      // Step 1: Create Category
      const categoryRes = await fetch("http://127.0.0.1:8080/api/Sanjaghak/categories/addCategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryName: name,
          categoryDescription: description,
        }),
      });

      if (!categoryRes.ok) {
        const data = await categoryRes.json();
        throw new Error(data.error || "خطا در ایجاد دسته");
      }

      const createdCategory = await categoryRes.json();

      // Step 2: Upload Image
      const formData = new FormData();
      formData.append("file", imageFile);
      // categoryId from backend is 'categoryId'
      formData.append("categoryId", createdCategory.categoryId);

      const imageRes = await fetch("http://127.0.0.1:8080/api/Sanjaghak/categoryImages/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!imageRes.ok) {
        const data = await imageRes.json();
        throw new Error(data.error || "خطا در آپلود تصویر");
      }

      alert("دسته با موفقیت افزوده شد");
      navigate("/admin/لیست دسته ها");
    } catch (err) {
      alert(err.message);
    }
  };

return (
    <div className="supplier-container">
      <h2 className="pageTitle">افزودن دسته‌بندی جدید</h2>

      <form className="addProductContainer" onSubmit={handleSubmit}>
        <div className="inputWrapper">
          <input
            type="text"
            required
            className="categoryName"
            placeholder=" "
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label className="adminFloatingLabel">نام دسته‌بندی</label>
        </div>

        <div className="inputWrapper">
          <textarea
            className="productDescription"
            placeholder=" "
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label className="adminFloatingLabel">توضیحات دسته‌بندی</label>
        </div>

        <div className="inputGroup" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
          <div className="categoryinputWrapper">
            <label className="adminFloatingLabel" style={{top: "-12px", color: "#c4204b"}}>انتخاب عکس</label>
            <input
              type="file"
              required
              // className="imageInput"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: "180px",
                  maxHeight: "180px",
                  borderRadius: "8px",
                  objectFit: "contain",
                  backgroundColor: "#f0f0f0",
                }}
              />
            )}
          </div>
        </div>
        <div className="modal-buttons">
          <button className="modal-button gray" onClick={() => navigate("/admin/لیست دسته ها")}>
            ➔ بازگشت
          </button>
          <button className="modal-button" type="submit">+ افزودن دسته‌بندی</button>
        </div>

      </form>
    </div>
  );
}

export default AddCategory;