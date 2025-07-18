import React, { useState, useEffect } from "react";

function AdminBrandDetail({ brand, onBack, onUpdateBrand }) {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (brand) {
      setName(brand.name || "");
      setWebsite(brand.website || "");
      setLogoUrl(brand.logoUrl || "");
      setDescription(brand.description || "");
    }
  }, [brand]);

  const handleSave = (e) => {
    e.preventDefault();

    const updatedBrand = {
      ...brand,
      name,
      website,
      logoUrl,
      description,
    };

    if (onUpdateBrand) {
      onUpdateBrand(updatedBrand);
    }
  };

  return (
    <div className="editBrandContainer" style={{ maxWidth: 600, margin: "auto" }}>
      <button
        onClick={onBack}
        className="backButtonadmin"
        style={{ marginBottom: 24 }}
      >
        ← بازگشت
      </button>

<h2 className="pageTitleadmin" style={{ marginBottom: 24, textAlign: "center" }}>
  ویرایش برند
</h2>
      <form onSubmit={handleSave} className="addProductContainer">
        <div className="inputWrapper">
          <input
            type="text"
            required
            className="brandName"
            placeholder=" "
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label className="adminFloatingLabel">نام برند</label>
        </div>

        <div className="inputGroup">
          <div className="inputWrapper">
            <input
              type="text"
              className="webUrl"
              placeholder=" "
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
            <label className="adminFloatingLabel">وبسایت برند</label>
          </div>
          <div className="inputWrapper">
            <input
              type="text"
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

        <button
          className="submitButton"
          type="submit"
          style={{ marginTop: 16 }}
        >
          ذخیره تغییرات
        </button>
      </form>
    </div>
  );
}

export default AdminBrandDetail;