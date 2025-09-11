import React, { useState, useEffect } from "react";
import bin from '../assets/bin.png'

function AdminBrandDetail({ brand, onBack, onUpdateBrand }) {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (brand) {
      setName(brand.brandName || "");
      setWebsite(brand.websiteUrl || "");
      setLogoUrl(brand.logoUrl || "");
      setDescription(brand.brandDescription || "");
      setActive(brand.active !== false);
    }
  }, [brand]);

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedBrand = {
      brandName: name,
      websiteUrl: website,
      logoUrl: logoUrl,
      brandDescription: description,
      active,
    };

    try {
      const res = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/brand/${brand.brandId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBrand),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "خطا در بروزرسانی برند");
      }

      alert("تغییرات برند با موفقیت ذخیره شد");
      const data = await res.json();
      if (onUpdateBrand) onUpdateBrand(data);
      onBack();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("آیا از حذف برند مطمئن هستید؟")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/brand/${brand.brandId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "خطا در حذف برند");
      }
      alert("برند با موفقیت حذف شد");
      onBack();
    } catch (err) {
      alert(err.message);
    }
  };

const handleToggleActive = () => {
  setActive((prev) => !prev);
};
  return (
  <div className="supplier-container">
    <h2 className="adminProductDetail__name" style={{ marginBottom: 24, textAlign: "center" }}>
      ویرایش برند
    </h2>
    <div className="adminProductDetailContainer" style={{padding: "0"}}>
      <div style={{display: "flex", direction: "ltr", padding: "20px"}}>
        <button
          className="DeleteButtonadmin"
          onClick={(e) => {
            e.preventDefault();
            handleDelete();
          }}
          type="button"
          title="حذف برند"
        >
          <img src={bin} alt="" style={{width: "24px"}}/>
        </button>
      </div>
      <form onSubmit={handleSave} style={{padding: "0px 35px 35px 35px"}}>
        <div className="adminProductDetail__fields">
          <div>
            <label className="adminProductDetail__info">نام برند</label>
            <input
              type="text"
              required
              className="adminProductDetail__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="adminProductDetail__info">وبسایت برند</label>
            <input
              type="text"
              className="adminProductDetail__input"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div>
            <label className="adminProductDetail__info">URL لوگو</label>
            <input
              type="text"
              className="adminProductDetail__input"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="adminProductDetail__info">توضیحات برند</label>
            <textarea
              className="adminProductDetail__textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {/* <button
            className="adminSaveButton"
            onClick={(e) => {
              e.preventDefault();
              handleToggleActive();
            }}
            type="button"
            style={{
              backgroundColor: active ? "#b00020" : "#28a745",
              flexBasis: "40%",
              color: "white",
            }}
          >
            {active ? "غیرفعال کردن برند" : "فعال کردن برند"}
          </button> */}
          <div  style={{display: "flex", gap: "8px", fontFamily: "Traffic", alignItems: "center", justifyContent: "center"}}>
            <label className="switch">
              <input
                type="checkbox"
                checked={!active}
                onChange={handleToggleActive}
              />
              <span className="slider round"></span>
            </label>
            {active ? "غیر فعال کردن برند" : "فعال کردن برند"}
          </div>

        </div>
        <div className="modal-buttons">
          <button onClick={onBack} className="modal-button gray">
            ➔ بازگشت
          </button>
          <button
            className="modal-button"
            type="submit"
            // style={{ marginTop: 24, width: "100%" }}
          >
            ذخیره تغییرات
          </button>
        </div>

      </form>
    </div>
  </div>

  );
}

export default AdminBrandDetail;