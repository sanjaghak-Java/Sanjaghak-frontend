
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddBrand() {
  const navigate = useNavigate();

  const [brandName, setBrandName] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const brandData = {
      brandName,
      websiteUrl: webUrl,
      brandLogoUrl: logoUrl,
      description,
    };

    try {
      const response = await fetch("http://127.0.0.1:8080/api/Sanjaghak/brand/addBrand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(brandData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "خطا در افزودن برند");
      }

      alert("برند با موفقیت اضافه شد!");
      navigate("/admin/لیست برند ها");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="supplier-container">
      <div className="addCategoryHeaderadmin">

        <h1 className="pageTitleadmin">افزودن برند</h1>
      </div>

      <form className="addProductContainer" onSubmit={handleSubmit}>
        <div className="inputWrapper">
          <input
            type="text"
            required
            className="brandName"
            placeholder=" "
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
          <label className="adminFloatingLabel">نام برند</label>
        </div>

        <div className="inputGroup">
          <div className="inputWrapper">
            <input
              type="text"
              required
              className="webUrl"
              placeholder=" "
              value={webUrl}
              onChange={(e) => setWebUrl(e.target.value)}
            />
            <label className="adminFloatingLabel">وبسایت برند</label>
          </div>
          <div className="inputWrapper">
            <input
              type="text"
              required
              className="logoUrl"
              placeholder=" "
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
            <label className="adminFloatingLabel">URL لوگو</label>
          </div>
        </div>

        <div className="inputWrapper">
          <textarea
            className="productDescription"
            placeholder=" "
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label className="adminFloatingLabel">توضیحات برند</label>
        </div>
        <div className="modal-buttons">
          <button
            className="modal-button gray"
            onClick={() => navigate("/admin/لیست برند ها")}
          >
            ➔ بازگشت
          </button>
          <button className="modal-button" type="submit">افزودن برند</button>
        </div>

      </form>
  </div>
  );
}

export default AddBrand;