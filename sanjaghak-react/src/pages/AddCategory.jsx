
import React, { useState } from "react";

function AddCategory() {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  return (
    <>
      <br />
      <br />
      <h1 className="pageTitle">افزودن دسته</h1>
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