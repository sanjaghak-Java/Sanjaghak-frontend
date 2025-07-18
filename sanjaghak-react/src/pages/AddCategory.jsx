
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/styles/addcategory.css";

function AddCategory() {
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
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

      <form className="addProductContainer">
        <div className="inputWrapper">
          <input type="text" required className="categoryName" placeholder=" " />
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
                  objectFit: "cover"
                }}
              />
            )}
          </div>
        </div>

        <div className="inputWrapper">
          <textarea className="productDescription" placeholder=" " />
          <label className="adminFloatingLabel">توضیحات دسته</label>
        </div>

        <button className="submitButton" type="submit">افزودن دسته</button>
      </form>
    </>
  );
}

export default AddCategory;