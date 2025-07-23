
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
    <>
      <div className="addCategoryHeaderadmin">
        <button className="backButtonadmin" onClick={() => navigate("/admin/لیست دسته ها")}>
          ← بازگشت
        </button>
        <h1 className="pageTitle">افزودن دسته</h1>
      </div>

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
          <label className="adminFloatingLabel">نام دسته</label>
        </div>

        <div className="inputGroup">
          <div className="inputWrapper">
            <input
              type="file"
              required
              className="imageInput"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  marginTop: "10px",
                  maxWidth: "100%",
                  maxHeight: "200px",
                  borderRadius: "8px",
                  objectFit: "contain",
                  backgroundColor: "#f0f0f0",
                }}
              />
            )}
          </div>
        </div>

        <div className="inputWrapper">
          <textarea
            className="productDescription"
            placeholder=" "
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label className="adminFloatingLabel">توضیحات دسته</label>
        </div>

        <button className="submitButton" type="submit">افزودن دسته</button>
      </form>
    </>
  );
}

export default AddCategory;